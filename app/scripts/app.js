define([
    'phaser'
], function (Phaser) {
    'use strict';

    var App = function (callback) {
        this.callback = callback;
        this.initialize();
    };

    App.prototype = {
        initialize: function () {
            log('initialize game');

            this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', {
                preload: this.preload.bind(this),
                create: this.create.bind(this)
            });
        },
        preload: function () {
            log('preload process');
            this.game.load.image('pikatchu', 'assets/pikatchu.png');
        },
        create: function () {
            log('create process');

            this.callback.call(this);
        },
        addActor: function (name) {
            console.log('add actor %s', name);
        }
    };

    return App;
});