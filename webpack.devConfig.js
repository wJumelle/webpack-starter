// Require
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.commonConfig');

let devConfig = {
    mode: "development",
    // Production d'une source map : Possible choice when publishing a single file
    devtool: 'inline-source-map',
    // Paramétrage du serveur webpack
    devServer: {
        // Indication du dossier dans lequel le serveur doit aller piocher les fichiers à afficher
        contentBase: './dist',
        // Mise en place du Hot Module Reload
        hot: true,
    },
    output: {
        // En dév nous souhaitons que webpack n'affiche pas le [contenthash]
        filename: '[name].js',
    },
    module: {
        rules: [],
    },
    plugins: [],
    performance: {
        // En dév nous souhaitons afficher des warnings
        hints: 'warning',
    }
};

// Loader pour les ressources CSS et SCSS (dev)
devConfig.module.rules.push({
    test: /\.css$/i,
    use: [
        'style-loader',
        'css-loader',
    ],
});
devConfig.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
        'style-loader',
        'css-loader',
        {
            loader: 'sass-loader',
            options: {
                //Prefer dart-sass
                implementation: require('sass')
            }
        }
    ],
});

module.exports = merge(commonConfig, devConfig);