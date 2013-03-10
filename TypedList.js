(function(exports) {

    // Dependencies -----------------------------------------------------------
    var Class = require('./Class').Class,
        is = require('./is').is;


    // Implementation ---------------------------------------------------------
    var TypedList = Class(function(type, items) {

        this._type = type;
        this._values = [];
        this._keys = {};
        this.length = 0;

        if (is.Array(items)) {
            is.map(items, this.add, this);
        }

    }, {

        add: function(item) {

            is.assert(Class.is(item, this._type));

            var id = this._getItemId(item);
            if (!this.has(id)) {
                this._keys['.' + id] = item;
                this._values.push(item);
                this.length++;
                return item;

            } else {
                return false;
            }

        },

        remove: function(item) {

            is.assert(Class.is(item, this._type));

            var id = this._getItemId(item);
            if (this.has(id)) {
                delete this._keys['.' + id];
                this._values.splice(this._values.indexOf(item), 1);
                this.length--;
                return item;

            } else {
                return false;
            }

        },

        get: function(id) {
            is.assert(is.Integer(id));
            return this._keys['.' + id];
        },

        has: function(key) {
            return this._keys.hasOwnProperty('.' + key);
        },

        contains: function(item) {
            is.assert(Class.is(item, this._type));
            return this.has(this._getItemId(item));
        },

        items: function() {
            return this._values.slice();
        },

        clear: function() {
            this._values.length = 0;
            this._keys = {};
        },

        at: function(offset) {

            if (offset < 0) {
                offset += this._values.length;
            }

            return this._values[offset] || null;

        },

        first: function() {
            return this.at(0);
        },

        last: function() {
            return this.at(-1);
        },

        reverse: function() {
            this._values.reverse();
        },

        each: function(callback, scope) {
            is.each(this._values, callback, scope);
        },

        every: function(callback, scope) {
            return is.every(this._values, callback, scope);
        },

        some: function(callback, scope) {
            return is.some(this._values, callback, scope);
        },

        filter: function(callback, scope) {
            return new TypedList(this._type, is.filter(this._values, callback, scope));
        },

        map: function(callback, scope) {
            return is.map(this._values, callback, scope);
        },

        single: function(callback, scope) {
            var values = is.filter(this._values, callback, scope);
            is.assert(values.length === 1);
            return values[0];
        },

        _getItemId: function(item) {

            if (typeof item.getId === 'function') {
                return item.getId();

            } else {
                is.assert(is.Integer(item.id));
                return item.id;
            }

        }

    });

    exports.TypedList = TypedList;

})(typeof exports !== 'undefined' ? exports : this);

