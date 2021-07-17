const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
    // Indication des points d'entrée de notre application
    entry: {
        app: "./src/index.js",
    },
    // Indication de la sortie de notre application
    output: {
        filename: '[name].[contenthash:8].js',
        // dossier dans lequel doivent être exportés les fichiers de production
        path: path.resolve(__dirname, 'dist'),
        // Nettoie le dossier ./dist à chaque build
        clean: true,
        // On indique à webpack l'endroit où exporter les assets
        assetModuleFilename: 'assets/[contenthash][ext][query]',
    },
    module: {
        rules: [],
    },
    plugins: [
        //Paramétrage du plugin html-webpack-plugin permettant l'export d'un fichier HTML au build
        new HtmlWebpackPlugin({
            title: 'Starter webpack',
            filename: 'index.html',
            minify: false,
            template: './src/components/templates/index.html',
        }),
    ],
    optimization: {
        // Cette propriété permet d'éviter aux modules n'évolulant pas (vendors) d'avoir un [contenthash] qui varie à cause de l'id
        // 'natural' = par défault = ordre de résolution des modules au build (ce qui peut varier) / 'deterministic' = hash basé sur le nom des modules
        moduleIds: 'deterministic',
        // wepack fournit une fonctionnalité permettant de séparer les données runtimes du code, 
        // runtimeChunk: 'single' indique à webpack que l'on souhaite regrouper ces données dans un seul et unique fichier
        runtimeChunk: 'single',
        // SplitChunksPlugin permet de fragmenter notre code de manière efficace, ici le paramétrage 'cacheGroups' permet de cibler
        // tous les bouts de codes appartenants aux modules nodes et de les exporter dans un fichier séparé (afin d'optimiser le temps de chargement)
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        // on demande a webpack de déterminer les exports non utilisé pour chaque module
        usedExports: true,
    },
    resolve: {
        // Si aucun symlink n'est déclaré toujours déclaré la propriété à false, cela améliore la rapidité de build
        symlinks: false,
    },
    performance: {
        // Les warnings exclus les fichiers .[map|jpg|png]
        assetFilter: function (assetFilename) {
            return !/\.(map|jpg|png)$/.test(assetFilename);
        },
    }
};

// Loader pour les ressources de type Images
config.module.rules.push({
    test: /\.(png|jpg|jpeg|svg|gif)$/i,
    type: 'asset/resource',
    // On paramètre l'output des assets
    generator: {
        filename: 'assets/images/[contenthash][ext][query]',
    },
});

// Loader pour les ressources de type Fonts
config.module.rules.push({
    test: /\.(ttf|woff|woff2|otf|eot)$/i,
    type: 'asset/resource',
    // On paramètre l'output des assets
    generator: {
        filename: 'assets/fonts/[name][ext][query]',
    },
});

// Loader Babel pour la transpilation du code JS
// Exclusions des fichiers nodes et bower
config.module.rules.push({
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    },
});

// Imports-loader permet d'éviter les conflits autours de this (JavaScript vs CommonJS) ; à utiliser uniquement en CommonJS
// config.module.rules.push({
//     test: require.resolve('./src/index.js'),
//     use: 'imports-loader?wrapper=window',
// });

module.exports = config;