define([
    'underscore',
    'phaser',
    'items/Player',
    'items/StaticWall',
    'items/Bomb',
    'items/DynamicWall'
], function (_, Phaser, Player, StaticWall, Bomb, DynamicWall) {
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
            this.game.load.spritesheet('bomb', 'assets/bomb.png', 50, 50, 3);
            this.game.load.spritesheet('static-wall', 'assets/static-wall.png', 50, 50, 1);
            this.game.load.spritesheet('dynamic-wall', 'assets/dynamic-wall.png', 50, 50, 1);
        },
        create: function () {
            log('create process');

            this.game.world.setBounds(0, 0, 1500, 700); // world size
            this.game.stage.backgroundColor = "#0c0c0c"; // world color
            this._addHeader("Welcome in nko World!"); // any header?

            this._buildWalls();
            this._buildBomb();

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
            _.times(width, function (n) { new StaticWall({ game: self.game, x: n * StaticWall.WIDTH, y: 0 })});
            // bottom
            _.times(width, function (n) { new StaticWall({ game: self.game, x: n * StaticWall.WIDTH, y: self.game.world.height - StaticWall.HEIGHT })});

            // left
            _.times(width, function (n) { new StaticWall({ game: self.game, x: 0, y: n * StaticWall.WIDTH })});
            // right
            _.times(width, function (n) { new StaticWall({ game: self.game, x: self.game.world.width - StaticWall.WIDTH, y: n * StaticWall.WIDTH })});

            new DynamicWall({
                game: this.game,
                x: DynamicWall.WIDTH * 3,
                y: DynamicWall.HEIGHT * 3
            })
        },
        _buildBomb: function () {
            var bomb = new Bomb({
                game: this.game,
                x: Bomb.WIDTH,
                y: Bomb.HEIGHT
            });
        },
        addPlayer: function (id, isMaster) {
            player = new Player({
                game: this.game,
                id: id,
                name: 'test',
                sprite: (isMaster ? 'pikatchu' : 'mewtwo')
            });
            player.tile.body.collideWorldBounds = true; // disable go out of world
            if (isMaster) this.game.camera.follow(player.tile); // main player
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