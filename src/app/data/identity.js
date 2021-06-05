import Identities from 'orbit-db-identity-provider'
import Path from 'path'
import { app } from 'electron'
import Crypto from 'crypto'
global.crypto = {
    getRandomValues: (array) => {
        let length = array.length
        let random = Crypto.randomBytes(length)
        random.forEach((value, index) => {
            array[index] = value
        })
    }
}
const { ethers } = require("ethers")

const generateWalletRandomly = async () => {
    let wallet = ethers.Wallet.createRandom()
    return wallet
}

const retriveWalletFromPrivKey = async (key) => {
    let wallet = new ethers.Wallet(key)
    return wallet
}

const retriveWalletFromMnemo = async (memo) => {
    let wallet = ethers.Wallet.fromMnemonic(memo)
    return wallet
}

const retriveWalletFromJson = async (json, password) => {
    let wallet = await ethers.Wallet.fromEncryptedJsonSync(json, password)
    return wallet
}

const getIdentityFromWallet = async (wallet) => {
    let identity = await Identities.createIdentity({
        type: 'ethereum',
        identityKeysPath: Path.join(app.getPath('userData'), "NoMoeDB", "UserIdentities"),
        wallet: wallet
    })
    return identity
}



export {
    retriveWalletFromPrivKey,
    retriveWalletFromMnemo,
    getIdentityFromWallet,
    retriveWalletFromJson,
    generateWalletRandomly
}