define([
    'underscore',
    'phaser',
    'items/Actor'
], function (_, Phaser, Actor) {
    'use strict';

    var App = function (callback) {
        this.callback = callback;
        this.cursors = null;
        this.initialize();
    };

    var player;

    App.prototype = {
        initialize: function () {
            log('initialize game');

            this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this),
                render: this.render.bind(this)
            });
        },
        preload: function () {
            log('preload process');
            this.game.load.image('pikatchu', 'assets/pikatchu.png');
        },
        create: function () {
            log('create process');

            this.game.world.setBounds(0, 0, 2000, 1000); // world size
            this.game.stage.backgroundColor = "#0c0c0c"; // world color
            this._addHeader("Welcome in nko World!"); // any header?

            this._buildOpponents();

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.callback.call(this);
        },
        update: function () {
            player.tile.body.velocity.setTo(0, 0);

            if (this.cursors.up.isDown) {
                player.tile.body.velocity.y = -200;
            } else if (this.cursors.down.isDown) {
                player.tile.body.velocity.y = 200;
            }

            if (this.cursors.left.isDown) {
                player.tile.body.velocity.x = -200;
            } else if (this.cursors.right.isDown) {
                player.tile.body.velocity.x = 200;
            }
        },
        // run per each mouse move on game board
        render: function () {
            this.game.debug.renderCameraInfo(this.game.camera, 32, 32);
            this.game.debug.renderSpriteCoords(player.tile, 32, 200);
        },
        addActor: function (name, sprite) {
            sprite = sprite || 'pikatchu';
            player = new Actor(this.game, name, sprite);
            player.tile.body.collideWorldBounds = true; // disable go out of world
            this.game.camera.follow(player.tile);
        },
        _addHeader: function (text) {
            var style = { font: "70px Arial", fill: "#696969" };
            this.game.add.text(this.game.world.width / 2 - 100, 50, text, style);
        },
        _buildOpponents: function () {
            var self = this;
            _.times(50, function () {
                self.game.add.sprite(self.game.world.randomX, self.game.world.randomY, 'pikatchu');
            });
        }
    };

    return App;
});