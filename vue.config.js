module.exports = {
    devServer: {
        proxy: {
            "^/misApi": {
                "target": process.env.VUE_APP_API_PROD_URL,
                "pathRewrite": { '^/misApi': '' }
            }
        }
    }
}