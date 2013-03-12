(function(exports) {

    // Network Codes ----------------------------------------------------------
    var Network = {

        Client: {
            Ping: 1,
            Pong: 2,
            Sync: 3
        },

        Game: {

            Tick: {
                Limit: 4,
                Confirm: 5
            },

            Action: {
                Client: 6,
                Server: 7
            },

            Start: 8,

            Player: {
                Update: 10,
                Left: 11
            }

        },

        // TODO re-organize these
        Session: {

            Token: 20,
            Create: 21,
            Join: 22,
            Start: 23,
            Leave: 24,
            Close: 25,

            Update: 27,

            Player: {
                Left: 28,
                Joined: 29
            },

            List: 31,

            // Move under "Action"
            Joined: 32,
            Started: 33,
            Left: 35,
            Closed: 36,
            Ready: 37,
            NotReady: 38
        },

        Login: {
            Client: 200,
            Server: 201
        },

        Err: 100,

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

    Object.defineProperty(Network, 'Event', {
        get: function() {
            throw new Error();
        }
    });

    exports.Network = Network;

})(typeof exports !== 'undefined' ? exports : this);

