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

                    if (Object.defineProperty) {

                        Object.defineProperty(this, i, {
                            get: (function(i) {
                                return function() {
                                    throw new TypeError('Access to property "' + i + '" of destroyed class instance.');
                                };
                            })(i)
                        });

                    } else {
                        this[i] = null;
                    }

                } else if (is.Function(this[i])) {
                    this[i] = (function(i) {
                        return function() {
                            throw new TypeError('Call to method "' + i + '" of destroyed class instance.');
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
            var params = [this];
            params.push.apply(params, arguments);
            is.log.apply(this, params);
        },

        toString: function() {
            return 'Base';
        }

    });

    exports.Base = Base;

})(typeof exports !== 'undefined' ? exports : this);

