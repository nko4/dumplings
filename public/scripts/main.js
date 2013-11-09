require.config({
    baseUrl: 'scripts',
    paths: {
        "phaser": 'vendor/phaser',
        "underscore": 'vendor/underscore',
        "jquery": 'vendor/jquery.min'
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