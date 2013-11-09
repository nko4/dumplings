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

// self-invoke function expr - start loading...
(function (exports) {
    // define colorful logger
    function log(string, type) {
        var args = [
            '%c %c %c ' + string + ' %c %c ',
            'background: ' + (type ? '#FFB819' : '#343434'),
            'background: ' + (type ? '#E85D0C' : '#4e4e4e'),
            'color: ' + (type ? '#fff' : '#eee') + '; background: ' + (type ? '#E83C10' : '#696969'),
            'background: ' + (type ? '#E85D0C' : '#4e4e4e'),
            'background: ' + (type ? '#FFB819' : '#343434')
        ];
        return console.log.apply(console, args);
    }

    // make public
    exports.log = log;
}(this));

require([
    "app"
], function (App) {
    log('Start "Share" application', true);
    // creating application
    window.app = new App(function () {

    });
});

