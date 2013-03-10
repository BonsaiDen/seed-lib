(function(exports) {

    var Promise = function() {

        var args = Array.prototype.slice.call(arguments),
            argsCount = args.length,
            argsDone = 0,
            isParallel = false,
            promiseData = [],
            promiseState = -1,
            runTimeout,
            callbacks = [[], []];

        function done(mode) {

            if (promiseState === -1) {

                promiseState = mode;

                var list = callbacks[promiseState].slice();
                callbacks[promiseState].length = 0;
                for(var i = 0; i < list.length; i++) {
                    list[i][0].apply(list[i][1] || null, promiseData);
                }

            }

        }

        function register(mode, callback, scope) {
            promiseState === mode ? callback.apply(scope || null, promiseData)
                                  : callbacks[mode].push([callback, scope]);
        }

        var handle = {

            run: function() {

                runTimeout = setTimeout(function() {

                    var cb;
                    while((cb = args.shift())) {

                        cb.call(handle);

                        if (!isParallel) {
                            break;
                        }

                    }

                }, 0);

                return handle;
            },

            parallel: function() {
                isParallel = true;
                return handle;
            },

            wait: function() {
                clearTimeout(runTimeout);
                return handle;
            },

            success: function(callback, scope) {
                register(0, callback, scope);
                return handle;
            },

            error: function(callback, scope) {
                register(1, callback, scope);
                return handle;
            },

            resolve: function(result) {

                promiseData.push(result);

                argsDone++;
                if (argsDone < argsCount) {
                    handle.run();

                } else  {
                    done(0);
                }

                return handle;

            },

            reject: function(reason) {
                promiseData.push(reason);
                done(1);
                return handle;
            }

        };

        return handle.run();

    };

    exports.Promise = Promise;

})(typeof exports !== 'undefined' ? exports : this);

