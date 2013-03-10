(function(window) {

    // Require emulation for the browser --------------------------------------
    var exports = {},
        modules = {};

    function require(name) {

        name = name.split('/').slice(-1)[0];

        if (!exports.hasOwnProperty(name)) {
            if (!window.hasOwnProperty(name)) {
                throw new Error('Module "' + name + '" not found.');

            } else {
                return window[name];
            }

        } else if (!modules.hasOwnProperty(name)) {
            modules[name] = {};
            modules[name][name] = exports[name];
        }

        return modules[name];

    }

    window.exports = exports;
    window.require = require;

})(window);

