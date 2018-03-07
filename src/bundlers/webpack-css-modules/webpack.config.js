const babelPresetLatest = require('babel-preset-latest');
const babelPresetReact = require('babel-preset-react');

//indirect 
require('babel-loader');
require('babel-core');
require('style-loader');
require('css-loader');
require('sass-loader');
require('node-sass');

const nodeExternals = require('webpack-node-externals');
const PACKAGE_TYPE = 'umd';

const configure = () => {
    return {
        output: {
            filename: '[name].js',
            libraryTarget: PACKAGE_TYPE,
        },
        module: {
            rules: [{
                test: /.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [babelPresetLatest, babelPresetReact]
                }
            }, {
                test: /\.(scss|css)$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        import: true,
                        modules: true,
                    }
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }, {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        import: true,
                        modules: true,
                    } 
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                loader: 'json-loader'
            }]
        },
        externals: [ nodeExternals({
            importType: PACKAGE_TYPE
        }) ]
    };
};

export default configure;