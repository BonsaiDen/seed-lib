(function(exports) {

    // Dependencies -----------------------------------------------------------
    var Class = require('./Class').Class;


    // Implementation ---------------------------------------------------------
    var tokenExp = /^[0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[8-9a-b][0-9a-f]{3}\-[0-9a-f]{8}/;
    function typeCheck(func, type, args) {

        args = args || typeCheck.caller['arguments'];
        if (args.length === func.length) {
            return func.apply(null, args);

        } else {
            func.type = type;
            return func;
        }

    }

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
            return typeCheck(function(value) {
                return typeof value === 'number' && !isNaN(value);

            }, 'Number');
        },

        Integer: function(value) {
            return typeCheck(function(value) {
                return is.Number(value) && (value | 0) === value;

            }, 'Integer');
        },

        String: function(value) {
            return typeCheck(function(value) {
                return typeof value === 'string';

            }, 'String');
        },

        Boolean: function(value) {
            return typeCheck(function(value) {
                return value === true || value === false;

            }, 'Boolean');
        },

        Date: function(value) {
            return typeCheck(function(value) {
                return value instanceof Date;

            }, 'Date');
        },

        Array: function(value, format) {

            if (arguments.length < 2) {
                return typeCheck(function(value) {
                    return value instanceof Array;

                }, 'Array');

            } else {

                var subTypes = format instanceof Array ? format : [format];
                return typeCheck(function(value) {

                    if (!(value instanceof Array)) {
                        return false;

                    } else {
                        var ok = true;
                        for(var i = 0, l = value.length; i < l; i++) {
                            if (typeof format === 'function') {
                                ok &= format(value[i]);

                            } else {
                                ok &= format[i](value[i]);
                            }
                        }
                        return ok;
                    }


                }, 'Array[' + subTypes.map(function(f) {
                    return f.type;

                }).join(', ') + ']');

            }

        },

        Object: function(value, format) {

            if (arguments.length < 2) {
                return typeCheck(function(value) {
                    return value !== null && value instanceof Object
                                          && !(value instanceof Array);

                }, 'Object');

            } else {

                var subKeys = is.map(format, function(key, value) {
                    return key + ': ' + value.type;

                }).join(', ');

                return typeCheck(function(value) {
                    if (value !== null && value instanceof Object
                                       && !(value instanceof Array)) {

                        var ok = true;
                        for(var i in value) {
                            if (value.hasOwnProperty(i)) {
                                ok &= format[i](value[i]);
                            }
                        }
                        return ok;

                    } else {
                        return false;
                    }

                }, 'Object{' + subKeys + '}');

            }

        },

        Function: function(value) {
            return typeCheck(function(value) {
                return value instanceof Function;

            }, 'Function');
        },

        Loggable: function(value) {
            return typeCheck(function(value) {
                return is.Object(value) && is.Function(value.toString);

            }, 'Loggable');
        },

        Token: function(value) {
            return typeCheck(function(value) {
                return value && !!tokenExp.test(value);

            }, 'Token');
        },

        Class: function(value, clas) {

            if (arguments.length === 1) {
                return typeCheck(function(value) {
                    return Class.is(value);

                }, 'Class');

            } else {
                return typeCheck(function(value) {
                    return Class.is(value, clas || Class);

                }, 'Class');
            }

        },

        Null: function(value) {
            return typeCheck(function(value) {
                return value === null;

            }, 'Null');
        },

        NotNull: function(value) {
            return typeCheck(function(value) {
                return value !== null && value !== undefined;

            }, 'NotNull');
        },

        Signature: function _() {

            var args = _.caller['arguments'];
            for(var i = 0, l = arguments.length; i < l; i++) {

                var exp = arguments[i],
                    arg = args[i];

                if (!exp(arg)) {
                    is.assert(false, 'Argument #' + i + ' must be ' + exp.type + ' but is ' + typeString(arg));
                }

            }

            if (args.length > arguments.length) {
                is.assert(false, 'Too many arguments passed');
            }

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

