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
            try {
                let wallet = await identityUtil.retriveWalletFromJson(walletJson, password)
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
    'queryUserIdentity': async (_) => {
        let wallet = await identityUtil.retriveWalletFromJson()
        wallet.encrypt("rorical").then((data) => {
            console.log(data)
        })
        let identity = await identityUtil.getIdentityFromWallet(wallet)
        console.log(wallet.privateKey)
        win.webContents.send('resultUserIdentity', {
            type: 'success',
            data: {
                id: identity.id,
                publicKey: identity.publicKey,
                signatures: {
                    id: identity.signatures.id,
                    publicKey: identity.signatures.publicKey
                },
            }
        })
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