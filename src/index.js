const IpfsClient = require('ipfs-http-client')
const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')
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

class WrappedETHWallet {
    constructor(remoteWallet) {
        this._remoteWallet = remoteWallet
    }

    getAddress() {
        return 
    }
}

const ipfs = IpfsClient.create({
    "url": "http://localhost:5001/api/v0",
})

async function main() {
    const prefix = "QmNet"
    let key = "0x3fd669bca5f84a48f7cfe2bd85756a0adeec2ebdfb4e6143cf532d9447cc6666" //Warn: this private key is generated for only testing purpose. DO NOT SEND ANY MONEY!
    let wallet = new ethers.Wallet(key)
    //let wallet = ethers.Wallet.createRandom()
    let identity = await Identities.createIdentity({
        type: 'ethereum',
        wallet: wallet
    })
    console.log(identity.toJSON())
    const orbitdb = await OrbitDB.createInstance(ipfs, {
        identity: identity
    })
    const profiledb = await orbitdb.keyvalue(prefix  + "U" +  wallet.address, {
        accessController: {
            write: [
                orbitdb.identity.id
            ],
            replicate: true
        }
    })
    await profiledb.load()

    const illustsdb = await orbitdb.feed(prefix + "U" + wallet.address + ".illusts", {
        accessController: {
            write: [
                orbitdb.identity.id
            ],
            replicate: true
        }
    })
    await illustsdb.load()

    console.log(profiledb.address)
    console.log(illustsdb.address)

    let fakeIdentity = await Identities.createIdentity({
        type: 'ethereum',
        keystore: identity.provider.keystore
    })
    await profiledb.setIdentity(fakeIdentity)
    // Set User
    await profiledb.set('name', 'user', { pin: true })
    await profiledb.set('bio', 'I am a test user', { pin: true })
    await profiledb.set('tags', ["Moe"], { pin: true })
    await profiledb.set('headimg', 'QmRFUqE3aRGFYHYanXzCwSAHc5u783yNNmmLnHFPK6Hz1J', { pin: true })
    await profiledb.set('illusts', illustsdb.address.toString(), { pin: true })

    const singleIllust = await orbitdb.keyvalue(prefix + "I" + "990e289d57421b6675d5e6f7ea978208a118a7695a1de2d240dde2d81a740477", {
        accessController: {
            write: [
                orbitdb.identity.id
            ],
            replicate: true
        }
    })
    await singleIllust.load()
    await singleIllust.set('title', "MyMoe")
    await singleIllust.set('desc', "MyMoe")
    await singleIllust.set('createDate', "2021.6.9")
    await singleIllust.set('user', profiledb.address.toString())
    await singleIllust.set('preview', '/ipns/bafybeiblh76q2pqfdc6y5samzcbfjxroezmqmwxo5btusevybelrcjaauu')
    const singleIllustPages = await orbitdb.feed(prefix + "I" + "990e289d57421b6675d5e6f7ea978208a118a7695a1de2d240dde2d81a740477" + ".pages", {
        accessController: {
            write: [
                orbitdb.identity.id
            ],
            replicate: true
        }
    })
    await singleIllustPages.load()
    await singleIllustPages.add("/ipns/bafybeiblh76q2pqfdc6y5samzcbfjxroezmqmwxo5btusevybelrcjaauu")
    await singleIllust.set('pages', singleIllustPages.address.toString())
    await illustsdb.add(singleIllust.address.toString())

    console.log(singleIllust.address)
    console.log(singleIllustPages.address)
    //await userdb.close()

    //await orbitdb.disconnect()
}

main()