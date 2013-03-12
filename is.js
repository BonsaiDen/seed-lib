(function(exports) {

    // Dependencies -----------------------------------------------------------
    var Class = require('./Class').Class;


    // Implementation ---------------------------------------------------------
    var tokenExp = /^[0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[8-9a-b][0-9a-f]{3}\-[0-9a-f]{8}/;
    function typeString(value) {

        if (typeof value === 'number') {

            if (isNaN(value)) {
                return 'NaN';

            } else {
                return (value | 0) === value ? 'Integer' : 'Number';

            }

        } else if (typeof value === 'string') {
            return 'String';

        } else if (typeof value === 'function') {
            return 'Function';

        } else if (value === null) {
            return 'Null';

        } else if (value === undefined) {
            return 'Undefined';

        } else if (typeof value === 'object') {

            if (value instanceof Array) {
                return 'Array';

            } else {
                return 'Object';
            }

        }

    }


    var is = exports.is = {

        // Types --------------------------------------------------------------
        Number: function(value) {
            return typeof value === 'number' && !isNaN(value);
        },

        Integer: function(value) {
            return is.Number(value) && Math.floor(value) === value && Math.ceil(value) === value;
        },

        String: function(value) {
            return typeof value === 'string';
        },

        Boolean: function(value) {
            return value === true || value === false;
        },

        Date: function(value) {
            return value instanceof Date;
        },

        Array: function(value) {
            return value instanceof Array;
        },

        Object: function(value, format) {
            return value !== null && value instanceof Object
                                 && !(value instanceof Array);
        },

        Function: function(value) {
            return value instanceof Function;
        },

        Loggable: function(value) {
            return is.Object(value) && is.Function(value.toString);
        },

        Token: function(value) {
            return value && !!tokenExp.test(value);
        },

        Class: function(value, clas) {
            return Class.is(value, clas);
        },

        Null: function(value) {
            return value === null;
        },

        NotNull: function(value) {
            return value !== null && value !== undefined;
        },


        // Traversal / Functional ---------------------------------------------
        each: function(list, callback, scope) {

            if (is.Array(list)) {
                list.slice().forEach(function(item, i) {
                    callback.call(scope || null, item, i);
                });

            } else {
                for(var i in list) {
                    if (list.hasOwnProperty(i)) {
                        callback.call(scope || null, i, list[i]);
                    }
                }
            }

        },

        every: function(list, callback, scope) {
            return list.every(function(item, i) {
                return callback.call(scope || null, item, i);
            });
        },

        some: function(list, callback, scope) {
            return list.some(function(item, i) {
                return callback.call(scope || null, item, i);
            });
        },

        filter: function(list, callback, scope) {
            return list.filter(function(item, i) {
                return callback.call(scope || null, item, i);
            });
        },

        map: function(list, callback, scope) {
            if (is.Array(list)) {
                return list.map(function(item, i) {
                    return callback.call(scope || null, item, i);
                });

            } else {
                var values = [];
                for(var i in list) {
                    if (list.hasOwnProperty(i)) {
                        values.push(callback.call(scope || null, i, list[i]));
                    }
                }
                return values;
            }
        },

        walk: function(object, callback, scope, path) {

            path = path ? path + '.' : '';
            for(var key in object) {
                if (object.hasOwnProperty(key)) {

                    var value = object[key];
                    if (is.Object(value)) {
                        is.walk(value, callback, scope, path + key);

                    } else {
                        callback.call(scope || null, key, value, object, path + key);
                    }

                }
            }

        },


        // Others -------------------------------------------------------------
        uniqueToken: function() {
            var tmpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            return tmpl.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);

                return v.toString(16);
            });
        },

        async: function(callback, delay, scope) {

            if (is.Integer(delay)) {
                setTimeout(function() {
                    callback.call(scope || null);

                }, delay);

            } else {
                setTimeout(function() {
                    callback.call(delay || null);

                }, 0);
            }

        },


        // Debugging ----------------------------------------------------------
        assert: function(assertion, msg) {
            if (!assertion) {
                throw new Error('Assertion failed: ' + (msg || ''));
            }
        },

        log: function() {

            var params = Array.prototype.slice.call(arguments);
            params = is.map(params, function(p) {

                if (is.Loggable(p)) {

                    var s = p.toString();
                    if (s.substring(0, 8) === '[object ') {
                        return p;

                    } else if (s.substring(0, 1) === '[') {
                        return s;

                    } else {
                        return '[' + s + ']';
                    }

                } else {
                    return p;
                }

            }, this);

            console.log.apply(console, params);

        }

    };

})(typeof exports !== 'undefined' ? exports : this);

