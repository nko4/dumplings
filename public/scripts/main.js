require.config({
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
    window.app = new App(function () {
        // this.addPlayer('pika!');
        connect_to_server();
    });
});

