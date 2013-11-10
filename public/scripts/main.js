require.config({
    baseUrl: 'scripts',
    paths: {
        "phaser": 'vendor/phaser',
        "underscore": 'vendor/underscore',
        "jquery": 'vendor/jquery.min',
        "cookie": 'vendor/cookie'
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
        }
    }
});

require([
    'underscore',
    'cookie',
    'app'
], function (_, cookie, App) {
    // creating application
    window.app = new App(connect_to_server);

    (function install_chat() {
        var $input = $('#input');
        $input.on('keypress', function (e) {
            if (e.keyCode !== 13) return;
            info( '<em>' + cookie.get('username') + '</em>: ' + $input.val() );
            $input.val('');
        });
    }());
});