// Require
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require('./webpack.commonConfig');

let prodConfig = {
    mode: "production",
    // Nous souhaitons activer les sources map en production mais de manière légère pour ne pas allourdir le build
    //devtool: 'source-map',
    performance: {
        // En dév nous souhaitons afficher des errors
        hints: 'error',
    },
    module: {
        rules: [],
    },
    plugins: [],
};

// Loader pour les ressources CSS et SCSS (prod)
prodConfig.plugins.push(new MiniCssExtractPlugin({ filename: "assets/css/[name].[contenthash:8].css" }));
prodConfig.module.rules.push({
    test: /\.css$/i,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
    ],
});
prodConfig.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
            },
        },
    ],
});

module.exports = merge(commonConfig, prodConfig)