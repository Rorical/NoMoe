module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            externals: ['aviondb'],
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