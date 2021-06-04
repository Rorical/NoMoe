const path = require('path')

module.exports = {
    productionSourceMap: false,
    configureWebpack: () => ({
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    }),
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: false,
            preload: "src/preload.js",
            externals: ['orbit-db', 'orbit-db-identity-provider'],
            experimentalNativeDepCheck: true,
            builderOptions: {
                "appId": "net.no.moe",
                "productName": "NoMoe",
                "win": {
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                                "ia32"
                            ]
                        }
                    ]
                }
            }
        }
    }
}