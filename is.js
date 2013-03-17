/*global setImmediate*/
(function(exports) {

    // Dependencies -----------------------------------------------------------
    var Class = require('./Class').Class;


    // Definitions ------------------------------------------------------------
    var tokenExp = /^[0-9a-f]{8}\-[0-9a-f]{4}\-4[0-9a-f]{3}\-[8-9a-b][0-9a-f]{3}\-[0-9a-f]{8}/;

    var colors = {
        grey: '',
        none: '',
        lblue: '',
        lgreen: '',
        lred: '',
        lyellow: ''
    };


    // Implementation ---------------------------------------------------------
    var is = exports.is = {

        // Types --------------------------------------------------------------
        Number: function(value) {
            return typeof value === 'number' && !isNaN(value);
        },

        Integer: function(value) {
            return is.Number(value) && (value | 0) === value;
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

        walk: function(object, callback, scope, path, level) {

            level = level || 0;
            path = path ? path + '.' : '';
            for(var key in object) {
                if (object.hasOwnProperty(key)) {

                    var value = object[key];
                    if (is.Object(value)) {
                        is.walk(value, callback, scope, path + key, level + 1);

                    } else {
                        callback.call(scope || null, key, value, object, path + key, level);
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

            if (!is.Integer(delay)) {
                scope = delay;
                delay = 0;
            }

            var invoke = function() {
                callback.call(scope || null);
            };

            // Use the fastest / most reliable way to invoke the async callback
            if (typeof setImmediate !== 'undefined' && delay === 0) {
                setImmediate(invoke);

            } else if (typeof process !== 'undefined' && delay === 0) {
                process.nextTick(invoke);

            } else {
                setTimeout(invoke, delay);
            }

        },


        // Debugging ----------------------------------------------------------
        assert: function(assertion, msg) {

            if (!assertion) {

                msg = msg || '';

                var err = new Error('Assertion failed: ' + msg);
                if (typeof process === 'undefined') {
                    throw err;
                }

                try {
                    throw err;

                } catch(e) {

                    var frames = e.stack.split('\n').slice(),
                        caller = frames[2],
                        location = caller.match(/\((.*?)\:([0-9]+)\:([0-9]+)\)/i);

                    var fs = require('fs');
                    try {

                        var contents = fs.readFileSync(location[1]).toString(),
                            line = contents.split('\n')[location[2] - 1];

                        var origin = line.substring(location[3] - 1).match(/assert\((.*)\)/);

                        err = new Error('Assertion "' + origin[1] + '" failed: ' + msg + '\n'
                                        + frames.slice(2).join('\n')
                                        + '\n\n ---- Handler ---- \n');

                    } catch(e) {
                    }

                    throw err;

                }

            }

        },

        log: function(obj, args) {
            is._log(obj, args);
        },

        ok: function(obj, args) {
            is._log(obj, args, colors.lgreen);
        },

        info: function(obj, args) {
            is._log(obj, args, colors.lblue);
        },

        warning: function(obj, args) {
            is._log(obj, args, colors.lyellow);
        },

        error: function(obj, args) {
            is._log(obj, args, colors.lred);
        },

        _log: function(obj, args, color) {

            var values = [obj];
            values.push.apply(values, args);

            color = color || '';

            var log = [];
            while(values.length) {
                var val = values.shift();
                log.push(is._toLogString(val, values, color));
            }

            console.log.apply(console, log);

        },

        _toLogString: function(val, values, color) {

            if (is.Loggable(val)) {

                var s = val.toString();
                if (s.substring(0, 8) === '[object ') {
                    return val;

                } else if (s.substring(0, 1) === '[') {
                    return colors.grey + s + colors.none;

                } else {
                    return colors.grey + '[' + s + ']' + colors.none;
                }

            } else {

                // handle placeholders
                if (is.String(val)) {
                    val = val.replace(/\%s/g, function(text, match) {
                        return values.shift();
                    });
                }

                return color + val + colors.none;

            }

        }

    };

    // Colored logging --------------------------------------------------------
    if (typeof process !== 'undefined' && is.Object(process)) {
        if (require('tty').isatty(process.stdout.fd)) {
            colors = {
                grey: '\033[90m',
                none: '\033[0m',
                lblue: '\033[94m',
                lgreen: '\033[92m',
                lred: '\033[91m',
                lyellow: '\033[93m'
            };
        }
    }

})(typeof exports !== 'undefined' ? exports : this);

