# 🚀 FR - Starter webpack JS

## Sommaire
1. [Requis](#requis)
2. [Installation](#installation)
3. [Scripts npm](#scripts-npm)
4. [Configuration en place](#configuration-en-place)
5. [Dépendances](#dépendances)
6. [En savoir plus](#en-savoir-plus)
7. [Tips divers](#tips-divers)

## Requis
* Node.js v14.17.0 ([**Téléchargement**](https://nodejs.org/en/download/)), npm v6.14.13
* webpack v5.44.0 ([**Documentation**](https://webpack.js.org/))

## Installation
Pour utiliser ce starter webpack, la première étape est de réaliser le clone du répertoire.
```
git clone https://github.com/wJumelle/webpack-starter-nativeJs.git
```

Après vous être positionné à l'intérieur du dossier cloné via votre console, il ne vous reste qu'à installer l'ensemble des dépendances du projet à l'aide de **npm**.
```
npm install
```

Une fois que cela est fait, vous pouvez réutiliser le dossier ***./src/components/starter*** comme point de départ pour votre nouveau projet.

## Scripts npm
A l'initialisation de ce projet, vous aurez 2 scripts npm à votre disposition : 
1. `npm run dev` permettra de lancer le serveur webpack et de profiter du rafraîchissement automatique de votre navigateur (HMR)
2. `npm run build` permettra le lancer la création de votre bundle, celui-ci sera exporter dans un dossier ***./dist***.

> ❗ Concernnant le Hot Module Replacement, celui-ci est fonctionnel pour l'ensemble du CSS / SCSS mais sera partiellement fonctionnel pour du développement JS complexe (avec plusieurs modules).  
> Pour étendre le HMR à l'ensemble des modules JavaScript chargés par votre fichier racine ***./src/index.js*** vous pourrez suivre le [**guide**](https://webpack.js.org/guides/hot-module-replacement/) présent dans la documentation de webpack.

## Configuration en place
Il y a au total 3 fichiers de configuration webpack.  
Un fichier commun ***./webpack.commonConfig.js*** dans lequel est défini les paramétrages en communs entre les deux environnements : **production** et **development**.  
Puis les fichiers ***./webpack.devConfig.js*** et ***./webpack.prodConfig.js*** où vous retrouverez les configurations propres à chacun de ces environnements.

Dans le premier fichier, nous retrouverons donc la déclaration des points d'entrées (*entry points* - **config.entry**) ainsi que les réglages de sortie lors du build du bundle (**config.output**). 
Nous y retrouverons aussi les paramétrages d'optimisation d'usage de webpack (**config.optimization**) et d'amélioration des performances (**config.performance**).  
Enfin, nous y retrouvons le plugin permettant de générer notre fichier HTML défini dans **config.plugins** mais aussi la déclaration de la majorité des loaders pour nos ressources (images, fonts, js - **config.module.rules**).

Dans le fichier de configuration lié à l'environnement de dévelopement, nous allons trouver tout le paramétrage lié à la gestion du package **webpack-dev-server** qui permet l'utilisation nottament du HMR (**config.devServer**). Mais aussi le paramétrage des fichiers sources maps permettant de plus facilement tracker les erreurs (**config.devtool**).
En mode *development* nous n'utilisons pas le plugin **MiniCssExtractPlugin** afin que ce dernier créé un fichier .css, à la place nous souhaitons que le css soit intégré au <head> de notre page. Il nous faut donc spécifier des règles particulière de paramétrage pour les loaders CSS et SCSS (aussi bien dans le fichier de l'environnement de *development* que de *production*).

La dernière différences entre les deux environnements étant la volonté d'afficher dans la console de votre CLI warnings et erreurs lors de l'exécution de la commande `npm run dev` et les uniquement erreurs lors de la commandes `npm run build` (**config.performance.hints**).

## Dépendances
### Dépendances de développement 
* "@babel/core": "^7.14.6",
* "@babel/preset-env": "^7.14.7",
* "babel-loader": "^8.2.2",
* "css-loader": "^5.2.7",
* "html-webpack-plugin": "^5.3.2",
* "mini-css-extract-plugin": "^2.1.0",
* "sass": "^1.35.2",
* "sass-loader": "^12.1.0",
* "style-loader": "^3.1.0",
* "webpack": "^5.44.0",
* "webpack-cli": "^4.7.2",
* "webpack-dev-server": "^3.11.2",
* "webpack-merge": "^5.8.0"

## En savoir plus
### Configuration de la gestion du cache (*caching*)
Le cache est déjà pré-configuré, mais il est possible d'aller encore plus loin. Cela dépend bien souvent du type de projet.

**output.filename** : grâce à la syntaxe de **substitutions** de webpack, on peut ajouter le paramètre \[contenthash\] et y indiquer le nombre de caractères que l'on souhaite obtenir \[contenthash:8\] donnera donc une chaîne de caractère de 8.

**optimization.moduleIds** : grâce à la valeur '*deterministic*' le **hash** des modules "statiques" (vendors) ne varie pass à chaque build et donc ces fichiers peuvent rester en cache côté navigateur.

**optimization.runtimeChunk** : grâce à la valeur '*single*' on informe webpack que l'on souhaite conserver toutes les données de runtime dans un fichier distinct des modules. Ce qui a pour impact de diminuer grandement la taille des fichiers de vos modules JS.

**optimization.splitChunks.cacheGroups** : ce paramétrage permet ici d'aller chercher tous les bouts de code propre aux nodes modules et de les extraire dans un fichier distinct

### Configuration du Tree Shaking
**optimization.usedExports** : indique à webpack de déterminer, pour chaque module, quels exports ne sont pas utilisés (ils sont alors marqué avec un commentaire /* unused harmony export */ dans leur fichier)

**sideEffects: false** dans le fichier *./package.json* : indique à webpack de pouvoir supprimer le code mort non utilisé. Nous définissons à webpack que la suppression d'un bout de notre code n'aura pas d'impact sur le bon fonctionnement de l'app ([**voir la documentation**](https://webpack.js.org/guides/tree-shaking/)). Ici nous choisissons d'ajouter les fichiers *.css et *.scss dans les fichiers à ne pas traiter.

Le tree shaking est uniquement activé en mode "**production**" via **TerserPlugin**, en mode "**development**" tous les codes morts sont laissés dans les fichiers. Ils sont juste commentés comme "unused".

### Mise en place du Shimming (load on demand) : 
Lorsque l'on développe en CommonJS, on peut rencontrer un conflit basique autour de **this**.
Selon le contexte il peut signifier **window** (pour du JavaScript natif) ou **module.exports** (CommongJS), nous devons donc déclarer une nouvelle règle via `import-loader` (npm i imports-loader -D). Cette règle est commentée dans la configuration actuelle, car source d'erreur si nous ne sommes pas dans un projet CommonJS.

Si jamais il est nécessaire d'**utiliser une variable globale** (l'usage des variables globales est fortement déconseillé) celle-ci à besoin d'être exportée. Pour cela il faudra utiliser [**l'export loader**](https://webpack.js.org/guides/shimming/#global-exports).

Il est aussi possible de charger des **polyfills** de manière moins automatisé qu'en utilisant Babel pour directement transpiler notre code. Pour cela, vous pouvez avoir voir la [**documentation**](https://webpack.js.org/guides/shimming/#loading-polyfills) autour du chargement dynamique des polyfills.

## Tips divers

> ### 💡 Ouverture d'un onglet automatisé
> Il est possible d'ouvrir par défaut un nouvel onglet dans votre navigateur lorsque vous utilisez la commande `npm run dev` via l'option `--open`.


> ### 💡 Gestion du Code Splitting
>Il est possible d'améliorer son code en le séparant de manière efficace et optimisée. Pour cela, vous pouvez lire le guide sur le [**Code splitting**](https://webpack.js.org/guides/code-splitting/). Cet élément dépend du projet que l'on souhaite développer, il ne peut donc être intégré au starter.
> Il est conseillé d'utiliser l'import dynamique à l'aide de la synthax `import()` de l'ECMAscript dans vos projets. Cela nécessite, pour les anciens navigateurs, de mettre en place le polyfill autour des **Promises**.

> ### 💡 Optimisation de Babel
> Si Babel ralentit votre projet, il est possible de l'[**optimiser d'avantage**](https://webpack.js.org/loaders/babel-loader/#babel-is-injecting-helpers-into-each-file-and-bloating-my-code).

> ### 💡 Lazy loading
> Il est possible d'améliorer encore d'avantage le temps de chargement d'une app via le [**lazy loading**](https://webpack.js.org/guides/lazy-loading/). Ce paramétrage étant à inclure dans un projet en cours de développement, il ne peut, lui non plus, être inclus dans le starter.

> ### 💡 Guidelines SASS en français
> Voici les guidelines à suivre pour [**SASS**](https://sass-guidelin.es/fr/).