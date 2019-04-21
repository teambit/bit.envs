import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import getFilesList from './getFilesList';
import webpack from 'webpack';

// Import so it will be added as a dependency on Bit.
import vueLoader from 'vue-loader';
import vueTemplateCompiler from 'vue-template-compiler';
import vueStyleLoader from 'vue-style-loader';
import cssLoader from 'css-loader';
import sassLoader from 'sass-loader';
import nodeSass from 'node-sass';

const modulesPath = path.normalize(`${__dirname}${path.sep}..${path.sep}node_modules`);

const getConfig = (files, distPath) => {
    return {
      entry: getFilesList(files),
      context: `${__dirname}${path.sep}..$`,
      resolve: {
        modules: [modulesPath, "node_modules"]
      },
      resolveLoader: {
        modules: [modulesPath, "node_modules"]
      },
      // Don't bundle node modules
      externals: [nodeExternals()],
      output: {
        path: path.resolve(distPath),
        filename: '[name].js',
        libraryTarget: 'umd'
      },
      plugins: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'vue-loader',
            include: __dirname,
            exclude: /node_modules/
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.s[a|c]ss$/,
            loader: ["vue-style-loader", "css-loader", "sass-loader"]
          }
        ]
      }
    }
  };

  export default getConfig;