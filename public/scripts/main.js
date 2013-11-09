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
    "app"
], function (App) {
    // creating application
    window.app = new App(function () {
        this.addActor('test');
    });
});

