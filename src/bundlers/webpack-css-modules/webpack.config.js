const path = require('path');
const babelPresetEs2015 = require('babel-preset-es2015');
const babelPresetReact = require('babel-preset-react');
const stage0 = require('babel-preset-stage-0');

//indirect 
require('babel-loader');
require('babel-core');
require('style-loader');
require('css-loader');
require('sass-loader');
require('node-sass');
require('json-loader');
require('url-loader');

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
                    presets:[babelPresetReact, babelPresetEs2015, stage0 ]
                }
            }, {
                test: /\.css$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        import: true,
                        modules: true,
                    }
                }]
            }, {
                test: /\.scss$/,
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
            },
            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
    
            // "url" loader works just like "file" loader but it also embeds
            // assets smaller than specified size as data URLs to avoid requests.
            {
                test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }]
        },

        externals: [ nodeExternals({
            importType: PACKAGE_TYPE
        }) ]
    };
}

export default configure;