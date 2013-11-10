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
                info( '<em>' + player.name + '</em>: ' + $input.val() );
                $input.val('');
            });
            $input.focus(); // on start you can write sth
        }());

        var name = app._getUserName();
        var player = app.getPlayer();
        player.setName(name);
        player.id = cookie.get('uuid');
        server.update(player.id, {name: name});
    });
});