import OrbitDB from 'orbit-db'
import { openIpfs } from './ipfs'
import Path from 'path'

export const openDatabase = async (api, identity, folder) => {
    let ipfs = await openIpfs(api)
    const orbitdb = await OrbitDB.createInstance(ipfs, {
        directory: Path.join(app.getPath('userData'), "NoMoeDB", folder),
        identity: identity
    })
    return orbitdb
}