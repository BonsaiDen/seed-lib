(function(exports) {

    // Dependencies -----------------------------------------------------------
    var Class = require('./Class').Class,
        is = require('./is').is;


    // Implementation ---------------------------------------------------------
    var Base = Class(function(id) {

        if (id !== undefined) {
            is.assert(is.Integer(id));
            this._id = id;

        } else {
            this._id = ++exports.Base.id;
        }

        this.log('Created');

    }, {

        $id: 0,

        destroy: function() {

            this.log('Destroyed');

            for(var i in this) {
                if (this.hasOwnProperty(i)) {

                    this[i] = null;

                    if (Object.defineProperty) {

                        Object.defineProperty(this, i, {

                            get: (function(i) {
                                return function() {
                                    throw new TypeError('GET of property "' + i + '" of destroyed instance.');
                                };
                            })(i),

                            set: (function(i) {
                                return function() {
                                    throw new TypeError('SET of property "' + i + '" of destroyed instance.');
                                };
                            })(i)

                        });

                    }

                } else if (is.Function(this[i])) {
                    this[i] = (function(i) {
                        return function() {
                            throw new TypeError('Call to method "' + i + '" of destroyed instance.');
                        };
                    })(i);
                }
            }

        },


        // Setter / Getter ----------------------------------------------------
        getId: function() {
            return this._id;
        },


        // Helpers ------------------------------------------------------------
        log: function() {
            is.log(this, arguments);
        },

        ok: function() {
            is.ok(this, arguments);
        },

        info: function() {
            is.info(this, arguments);
        },

        warning: function() {
            is.warning(this, arguments);
        },

        error: function() {
            is.error(this, arguments);
        },

        toString: function() {
            return 'Base';
        }

    });

    exports.Base = Base;

})(typeof exports !== 'undefined' ? exports : this);

