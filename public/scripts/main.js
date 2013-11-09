require.config({
    paths: {
        "phaser": 'vendor/phaser',
        "underscore": 'vendor/underscore'
    },
    shim: {
        "phaser": {
            exports: "Phaser"
        },
        "underscore": {
            exports: "_"
        }
    }
});

require([
    'underscore',
    'app'
], function (_, App) {
    // creating application
    window.app = new App(function () {
        this.addPlayer('pika!');
    });
});

