(function(exports) {

    // Dependencies -----------------------------------------------------------
    var is = require('./is').is;


    // Implementation ---------------------------------------------------------
    var Network = {

        // Configuration ------------------------------------------------------
        SyncRange: 100000,


        // Network Codes ------------------------------------------------------
        Error: 0,

        Client: {
            Ping: 1,
            Pong: 2,
            Sync: 3,
            Error: {
                Offline: 100
            }
        },

        Game: {

            Tick: {
                Limit: 4,
                Confirm: 5,

                // handle this when invalid ticks are send to server
                Error: {
                    Invalid: 110
                }
            },

            Action: {
                Client: 6,
                Server: 7,

                // Handle this when sending invalid actions to the server
                Error: {
                    Invalid: 120
                }

            },

            Start: 8,
            Leave: 9,
            Pause: 10,
            Resume: 11,

            Player: {
                Update: 12,
                Left: 13,
                Paused: 14,
                Resumed: 15
            }

        },

        Session: {

            Action: {
                Create: 21,
                Join: 22,
                Start: 23,
                Leave: 24,
                Close: 25,
                Ready: 26, // TODO update session code for this
                NotReady: 27, // TODO update session code for this
                Pause: 28,
                Resume: 29
            },

            Info: {
                List: 31,
                Update: 32 // full update with players etc.
            },

            Response: {
                Joined: 33,
                Started: 34,
                Left: 35,
                Closed: 36,
                Ready: 37,
                NotReady: 38,
                Paused: 39,
                Resumed: 40
            },

            Player: {
                Joined: 50,
                Left: 51,
                Ready: 52,
                NotReady: 53
            },

            Error: {
                Exists: 200,
                NotFound: 201,
                Invalid: 202,
                NotOwner: 203,
                Running: 204,
                Ready: 205,
                NotReady: 206,
                NotRunning: 207,
                Paused: 208,
                NotPaused: 209
            }

        },

        Login: {
            Request: 60,
            Response: 61,

            Error: {
                // TODO cleanup
                RequestFormat: 300,
                ClientVersion: 301,
                InvalidGame: 302,
                InvalidUsername: 303,
                InvalidAuth: 304,
                InvalidToken: 305,
                InvalidData: 306,
                AccountInUse: 307
            }

        },

        Server: {
            Shutdown: 1000
        }

    };


    // Reverse Lookup ---------------------------------------------------------
    var lookup = {};
    is.walk(Network, function(key, value, object, path, level) {
        if (level > 0) {
            lookup[value] = path;
        }
    });

    lookup[0] = 'Error';

    Network.isValidType = function(type) {
        return lookup.hasOwnProperty(type);
    };

    Network.nameFromType = function(type) {
        return lookup[type] || null;
    };

    exports.Network = Network;

})(typeof exports !== 'undefined' ? exports : this);

