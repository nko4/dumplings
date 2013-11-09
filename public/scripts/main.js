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
    'app'
], function (_, App) {
    // creating application
    window.app = new App(connect_to_server);
});