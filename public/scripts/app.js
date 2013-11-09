define([
    'underscore',
    'phaser',
    'items/Player',
    'items/StaticWall'
], function (_, Phaser, Player, StaticWall) {
    'use strict';

    var App = function (callback) {
        this.callback = callback;
        this.cursors = null;
        this.list = {};
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
            this.game.load.image('wall', 'assets/pikatchu.png');
        },
        create: function () {
            log('create process');

            this.game.world.setBounds(0, 0, 2000, 1000); // world size
            this.game.stage.backgroundColor = "#0c0c0c"; // world color
            this._addHeader("Welcome in nko World!"); // any header?

            this._buildWalls();

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
        _buildWalls: function () {
            var self = this;
            var width = self.game.world.width / StaticWall.WIDTH;
            var height = self.game.world.height / StaticWall.HEIGHT;

            // top
            _.times(width, function (n) { self.game.add.sprite(n * StaticWall.WIDTH, 0, 'wall')});
            // bottom
            _.times(width, function (n) { self.game.add.sprite(n * StaticWall.WIDTH, self.game.world.height - StaticWall.HEIGHT, 'wall')});

            // left
            _.times(height, function (n) { self.game.add.sprite(0, n * StaticWall.WIDTH, 'wall')});
            // right
            _.times(height, function (n) { self.game.add.sprite(self.game.world.width - StaticWall.WIDTH, n * StaticWall.WIDTH, 'wall')});
        },
        addPlayer: function (id) {
            player = new Player({
                game: this.game,
                id: id,
                name: 'test',
                sprite: 'pikatchu'
            });
            player.tile.body.collideWorldBounds = true; // disable go out of world
            this.game.camera.follow(player.tile);
            this.list[id] = player;
        },
        getPlayerById: function (id) {
            var player = this.list[id];
            if (!player) {
                throw 'nie ma takiego playera';
            }
            return player;
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