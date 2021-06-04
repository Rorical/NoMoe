import IpfsClient from 'ipfs-http-client'

export const openIpfs = async (api) => {
    let ipfs = IpfsClient.create({
        "url": api
    })
    try {
        await ipfs.config.getAll()
    } catch {
        throw new Error("error.ipfs_connect_failed")
    }
    return ipfs
}
