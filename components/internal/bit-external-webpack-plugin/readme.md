# Webpack bundler

A Webpack plugin that correctly identifies component dependencies.

## How to use?
 Add this to your webpack configuration:
 ```js
const filesWhitelist = [
    '/development/projectOne/src/components/button/button.js'
    //...
];

const configuration = {
    //...
    plugins: [
        //...
        new BitExternalsPlugin({
           originalFiles: filesWhitelist
        })
    ]
 ```

 It will make sure to:
 * Bundle your whitelisted files
 * Exclude any files under /node_modules/, as a dependency.
 * Bundle anything else.