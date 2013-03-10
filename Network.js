(function(exports) {

    // Network Codes ----------------------------------------------------------
    exports.Network = {

        Event: {

            Player: {
                Info: 40,
                Left: 41
            },

            Session: {
                Token: 20,
                Create: 21,
                Join: 22,
                Start: 23,
                Leave: 24,
                Close: 25,

                Update: 27,
                PlayerLeft: 28,
                PlayerJoined: 29,

                Info: 30,
                List: 31,

                Joined: 32,
                Started: 33,
                Left: 35,
                Closed: 36,
                Ready: 37,
                NotReady: 38
            },

            Ping: 1,
            Pong: 2,

            Tick: {
                Confirm: 3,
                Limit: 4
            },

            Action: {
                Client: 5,
                Server: 6
            },

            Login: {
                Client: 200,
                Server: 201
            },

            Error: 100,

            Version: 50

        },

        Error: {

            Offline: 10,

            Session: {
                Exists: 20,
                NotFound: 21,
                Invalid: 22,
                NotOwner: 23,
                Running: 24,
                Ready: 25,
                NotReady: 26
            },

            Login: {
                Format: 30,
                Version: 31,
                Username: 32,
                Game: 33,
                Persona: 34,
                Token: 35
            }
        }

    };


})(typeof exports !== 'undefined' ? exports : this);

