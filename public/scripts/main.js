require.config({
    baseUrl: 'scripts',
    paths: {
        "phaser": 'vendor/phaser',
        "underscore": 'vendor/underscore',
        "jquery": 'vendor/jquery.min',
        "cookie": 'vendor/cookie',
        "sha1": 'vendor/sha1'
    },
    shim: {
        "phaser": {
            exports: "Phaser"
        },
        "underscore": {
            exports: "_"
        },
        "jquery": {
            exports: "$"
        },
        "cookie": {
            exports: "cookie"
        },
        "sha1": {
            exports: "sha1"
        }
    }
});

require([
    'underscore',
    'cookie',
    'app'
], function (_, cookie, App) {
    // creating application
    window.app = new App(function () {
        connect_to_server();

        (function install_chat() {
            var $input = $('#input');
            $input.on('keypress', function (e) {
                if (e.keyCode !== 13) return;
                var player = app.getPlayer();
                var msg = $input.val();
                info('<em>' + player.name + '</em>: ' +  msg);
                server.say(cookie.get('session_id'), msg);
                $input.val('');
            });
            $input.focus(); // on start you can write sth
        }());
    });
});