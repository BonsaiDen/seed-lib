(function(exports) {

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

            Player: {
                Update: 10,
                Left: 11
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
                NotReady: 27 // TODO update session code for this
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
                NotReady: 38
            },

            // TODO fix IDs
            Player: {
                Joined: 40,
                Left: 41,
                Ready: 42,
                NotReady: 43
            },

            Error: {
                Exists: 200,
                NotFound: 201,
                Invalid: 202,
                NotOwner: 203,
                Running: 204,
                Ready: 205,
                NotReady: 206
            }

        },

        Login: {
            Request: 60,
            Response: 61,

            Error: {
                RequestFormat: 300,
                ClientVersion: 301,
                InvalidGame: 302,
                InvalidUsername: 303,
                InvalidAuth: 304,
                Token: 305
            }

        },

        Server: {
            Shutdown: 1000
        }

    };

    exports.Network = Network;

})(typeof exports !== 'undefined' ? exports : this);

