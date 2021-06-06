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


const ipfs = IpfsClient.create({
    "url": "http://localhost:5001/api/v0",
})

async function main() {
    let key = "0x3fd669bca5f84a48f7cfe2bd85756a0adeec2ebdfb4e6143cf532d9447cc6666"
    let wallet = new ethers.Wallet(key)
    let identity = await Identities.createIdentity({
        type: 'ethereum',
        wallet: wallet
    })
    console.log(identity.toJSON())
    const orbitdb = await OrbitDB.createInstance(ipfs, {
        identity: identity
    })
    const userdb = await orbitdb.keyvalue(wallet.address, {
        accessController: {
            write: [
                orbitdb.identity.id
            ],
            replicate: true
        }
    })
    await userdb.load()

    console.log(userdb.address)

    // Set User
    await userdb.set('name', 'User')
    await userdb.set('desc', 'I am a test user in a developing network')
    await userdb.set('headimg', 'QmRFUqE3aRGFYHYanXzCwSAHc5u783yNNmmLnHFPK6Hz1J')

    await userdb.close()
    await orbitdb.disconnect()
}

main()