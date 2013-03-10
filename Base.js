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
                // TODO overwrite all methods with a throw new Error('Destroyed') one
                if (this.hasOwnProperty(i)) {
                    this[i] = null;
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

