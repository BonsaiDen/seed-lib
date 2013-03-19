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
            Session: 70,
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
            Won: 12,
            Lost: 13,

            Player: {
                Update: 14,
                Left: 15,
                Paused: 16,
                Resumed: 17
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
                Update: 32,
                Players: 33,
                Ready: 34,
                NotReady: 35
            },

            Response: {
                Joined: 40,
                Started: 41,
                Left: 42,
                Closed: 43,
                Ready: 44,
                NotReady: 45,
                Paused: 46,
                Resumed: 47
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
                NotPaused: 209,
                NotEnoughPlayers: 10
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

