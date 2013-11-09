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
            this.game.load.image('mewtwo', 'assets/mewtwo.png');
            this.game.load.image('wall', 'assets/pikatchu.png');
            // this.game.load.spritesheet('wall', 'assets/bomb.png', 50, 50, 4);
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
            if (!player) return; // unless one player should be create

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

            // run backend API when button pressed
            if (this.cursors.up.isDown ||
                this.cursors.down.isDown ||
                this.cursors.left.isDown ||
                this.cursors.right.isDown) {
                player_move(player.tile.x, player.tile.y);
            }
        },
        // run per each mouse move on game board
        render: function () {
            this.game.debug.renderCameraInfo(this.game.camera, 60, 75);
            if (player) this.game.debug.renderSpriteCoords(player.tile, 60, 180);
        },
        _buildWalls: function () {
            var self = this;
            var width = self.game.world.width / StaticWall.WIDTH;
            var height = self.game.world.height / StaticWall.HEIGHT;

            // top
            // _.times(width, function (n) { self.game.add.sprite(n * StaticWall.WIDTH, 0, 'wall')});
            // bottom
            // _.times(width, function (n) { self.game.add.sprite(n * StaticWall.WIDTH, self.game.world.height - StaticWall.HEIGHT, 'wall')});

            // left
            // _.times(height, function (n) { self.game.add.sprite(0, n * StaticWall.WIDTH, 'wall')});
            // right
            // _.times(height, function (n) { self.game.add.sprite(self.game.world.width - StaticWall.WIDTH, n * StaticWall.WIDTH, 'wall')});
        },
        addPlayer: function (id, isMaster) {
            player = new Player({
                game: this.game,
                id: id,
                name: 'test',
                sprite: (isMaster ? 'pikatchu' : 'mewtwo')
            });
            player.tile.body.collideWorldBounds = true; // disable go out of world
            if (isMaster) this.game.camera.follow(player.tile); // main player (camera is
            this.list[id] = player;
            return player;
        },
        getPlayerById: function (id) {
            var player = this.list[id];
            if (!player) throw 'player doesn\'t exists';
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