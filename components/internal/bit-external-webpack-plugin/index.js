import ExternalModule from 'webpack/lib/ExternalModule';
 
function BitExternals(opts) {
    this.opts = opts || {};
}

BitExternals.prototype.apply = function (compiler) {
    const opts = this.opts;
    const whitelist = new Set(opts.originalFiles || []);
    const verbose = opts.verbose || false;

    compiler.hooks.normalModuleFactory.tap('bitExternals', normalModuleFactory => {
        normalModuleFactory.hooks.factory.tap('bitExternals', function (factory) {

            return newFactory;

            function newFactory(data, callback) {
                factory(data, (err, module) => interception(err, module, callback));
            };
        })
    });

    const handlers = [
        {
            predicate: (module) => whitelist.has(module.resource),
            transform: function (module) {
                verbose && console.log('bundling:', module.resource);
                return module;
            }
        }, {
            predicate: (module) => module.resource.includes(__dirname),
            transform: function (module) {
                verbose && console.log('bundling compiler dependency:', module.resource);
                return module;
            }
        }, {
            predicate: (module) => module.resource.includes("/node_modules/"),
            transform: function (module) {
                verbose && console.log("external dependency: ", module.rawRequest);
                return new ExternalModule(
                    module.rawRequest,
                    opts.type || compiler.options.output.libraryTarget
                )
            }
        }, {
            //default
            predicate: (module) => true,
            transform: function (module) {
                verbose && console.log('bundling (default):', module.rawRequest)
                return module;
            }
        }
    ];

    function interception(err, module, callback) {
        if (err) {
            callback(err);
            return;
        }

        if (!module) {
            callback(null, module);
            return;
        }

        const handler = handlers.find(x => x.predicate(module));
        const transformedModule = handler.transform(module);

        callback(null, transformedModule);
    }
};

export default BitExternals;