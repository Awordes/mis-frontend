module.exports = {
    devServer: {
        proxy: {
            "/api": {
                "target": 'http://192.168.0.150:5010/',
                "pathRewrite": { '^/api': '' },
            }
        }
    }
}