import { dialog, ipcMain, Menu, app } from 'electron'
import { openDatabase } from '@/utils/db'
import { factory } from 'electron-json-config'
import * as identityUtil from '@/app/data/identity'

let win
const config = factory()
let globalStates = {
    user: {
        identity: null,
        database: null
    },
    illusts: {
        database: null
    },
    metadatas: {
        database: null
    }
}

const getDB = async (dbname, identity) => {
    let api = config.get('ipfs.api', null)
    if(!api){
        api = 'http://localhost:5001/api/v0'
        config.put('ipfs.api', api)
    }
    let db = await openDatabase(api, identity, dbname)
    return db
}

const events = {
    'isInitialized': async (_) => {
        let isInit = config.get('app.init', false)
        win.webContents.send('resultIsInitialized', isInit)
    },
    'initializeIdentity': async (_, password) => {
        let walletJson = config.get('user.identity.walletJson', null)
        if(walletJson){
            let wallet
            try {
                wallet = await identityUtil.retriveWalletFromJson(walletJson, password)
            } catch {
                win.webContents.send('resultInitialize', {
                    type: 'error',
                    error: 'user.identity.wallet.password.incorrect'
                })
                return
            }
            let identity = await identityUtil.getIdentityFromWallet(wallet)
            globalStates.user.identity = identity

            try{
                let dbUser = await getDB("User", identity)
                globalStates.user.database = dbUser

                let dbIllust = await getDB("Illusts", identity)
                globalStates.illusts.database = dbIllust

                let dbMeta = await getDB("MetaDatas", identity)
                globalStates.metadatas.database = dbMeta
            } catch {
                win.webContents.send('resultInitialize', {
                    type: 'error',
                    error: 'db.open.error'
                })
                return
            }
        }else{
            win.webContents.send('resultInitialize', {
                type: 'error',
                error: 'user.identity.wallet.notfound'
            })
        }
    },
    'createUserIdentityByRandom': async (_) => {
        let wallet = await identityUtil.generateWalletRandomly()
        win.webContents.send('resultCreateUserIdentityByRandom', {
            type: 'success',
            data: {
                mnemonic: wallet.mnemonic,
                privKey: wallet.privateKey
            }
        })
    },
    'saveUserIdentity': async (_, data) => {
        try{
            if(data["type"] == "privateKey"){
                let wallet = await identityUtil.retriveWalletFromPrivKey(data["data"]["privateKey"])
                let json = wallet.encrypt(data["data"]["password"])
                config.set("user.identity.walletJson", json)
            }else if(data["type"] == "mnemonic"){
                let wallet = await identityUtil.retriveWalletFromMnemo(data["data"]["mnemonic"])
                let json = wallet.encrypt(data["data"]["password"])
                config.set("user.identity.walletJson", json)
            }
            win.webContents.send('resultSaveUserIdentity', {
                type: 'success'
            })
        }catch(e){
            let err = e.message
            if(err.includes("invalid mnemonic")){
                err = "app.welcome.error.invalid.mnemonic"
            }else if(err.includes("invalid hexlify value")){
                err = "app.welcome.error.invalid.privKey"
            }
            win.webContents.send('resultSaveUserIdentity', {
                type: 'error',
                error: err
            })
            return 
        }
    },
    'getPrivKeyFromJson': async (_, data) => {
        let walletJson = data["data"]["json"]
        let password = data["data"]["password"]
        try{
            let wallet = await identityUtil.retriveWalletFromJson(walletJson, password)
            win.webContents.send('resultGetPrivKeyFromJson', {
                type: 'success',
                data: {
                    privKey: wallet.privateKey
                }
            })
        } catch(e) {
            let err = e.message
            if(err.includes("invalid JSON wallet")){
                err = "app.welcome.error.invalid.json"
            }else if(err.includes("invalid arrayify value")){
                err = "app.welcome.error.invalid.json"
            }else if(err.includes("invalid password")){
                err = "app.welcome.error.invalid.password"
            }
            win.webContents.send('resultGetPrivKeyFromJson', {
                type: 'error',
                error: err
            })
            return
        }
    },
    'setIPFSUrl': async (_, data) => {
        config.set("ipfs.api", data)
    },
    'setInitialzed': async (_, data) => {
        config.set("app.init", data)
    }
}

export const registerEvents = (mainWindow) => {
    win = mainWindow
    const eventNames = Object.keys(events)
    eventNames.forEach((name) => {
        const handler = events[name]
        if (typeof handler === 'function') {
            ipcMain.on(name, events[name])
        } else if (typeof handler === 'object') {
            if (handler.once) {
                ipcMain.once(name, handler.target)
            } else {
                ipcMain.on(name, handler.target)
            }
        }
    })
}