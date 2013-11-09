define([
    'underscore',
    'jquery',
    'phaser',
    'items/Player',
    'items/Wall',
    'items/Bomb',
    'items/Brick'
], function (_, $, Phaser, Player, Wall, Bomb, Brick) {
    'use strict';

    var App = function (callback) {
        this.callback = callback;
        this.cursors = null;
        this.bricks = null; // collection of bricks
        this.walls = null; // collection of walls
        this.bombs = null; // collection of bombs
        this.list = {};

        this.initialize();
    };

    var player;
    var block = false;

    App.prototype = {
        initialize: function () {
            log('* initialize game', 1);

            this.game = new Phaser.Game(window.innerWidth, window.innerHeight - $('#communication').height(), Phaser.CANVAS, 'phaser-example', {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this),
                render: this.render.bind(this)
            });
        },
        preload: function () {
            log('* preload process');
            this.game.load.image('pikatchu', 'assets/pikatchu.png');
            this.game.load.image('mewtwo', 'assets/mewtwo.png');
            this.game.load.spritesheet('bomb', 'assets/bomb.png', 50, 50, 3);
            this.game.load.spritesheet('wall', 'assets/wall.png', 50, 50, 1);
            this.game.load.spritesheet('brick', 'assets/brick.png', 50, 50, 4);
        },
        create: function () {
            log('* create process');

            this.bricks = this.game.add.group();
            this.walls = this.game.add.group();
            this.bombs = this.game.add.group();

            this.game.world.setBounds(0, 0, 1850, 1150); // world size
            this.game.stage.backgroundColor = "#0c0c0c"; // world color
            this._addHeader("Welcome in \"nko\" World!"); // any header?

            var width = this.game.world.width / Wall.WIDTH;
            var height = this.game.world.height / Wall.HEIGHT;

            this._buildBomb(width, height);
            this._buildBricks(width, height);
            this._buildBorderWalls(width, height);
            this._buildInsideWalls(width, height);
            // this._generateOpponents();

            this.cursors = this.game.input.keyboard.createCursorKeys();

            console.groupEnd();

            this.callback.call(this);
        },
        update: function () {
            if (!player) return; // unless one player should be create

            player.tile.body.velocity.setTo(0, 0);

            var max_top = Player.HEIGHT;
            var max_bottom = this.game.world.height - Player.HEIGHT * 2;
            var max_left = Player.WIDTH;
            var max_right = this.game.world.width - Player.WIDTH * 2;

            if (this.cursors.up.isDown) {
                if (player.tile.y < max_top) { return; }
                player.tile.body.velocity.y = -200;
            } else if (this.cursors.down.isDown) {
                if (player.tile.y > max_bottom) { return; }
                player.tile.body.velocity.y = 200;
            }

            if (this.cursors.left.isDown) {
                if (player.tile.x < max_left) { return; }
                player.tile.body.velocity.x = -200;
            } else if (this.cursors.right.isDown) {
                if (player.tile.x > max_right) { return; }
                player.tile.body.velocity.x = 200;
            }

            if (this.cursors.up.isDown ||
                this.cursors.down.isDown ||
                this.cursors.left.isDown ||
                this.cursors.right.isDown
            ) {
                if (!block) {
                    block = true;
                    this.updatePosition();

                    setTimeout(function () {
                        block = false;
                    }, 100);
                }
            }
            this.game.physics.collide(player.tile, this.bricks, this._collisionBrickHandler, null, this);
            this.game.physics.collide(player.tile, this.walls, this._collisionWallHandler, null, this);
            this.game.physics.collide(player.tile, this.bombs, this._collisionWallHandler, null, this);
        },
        _collisionBrickHandler: function (s, t) {
            t.kill();
        },
        _collisionWallHandler: function (s, t) {
            // do nothing
        },
        updatePosition: function () {
            player_move(player.tile.x, player.tile.y);
        },
        // run per each mouse move on game board
        render: function () {
            // this.game.debug.renderCameraInfo(this.game.camera, 60, 75);
            // if (player) this.game.debug.renderSpriteCoords(player.tile, 60, 180);
        },
        _buildBorderWalls: function (width, height) {
            var self = this;
            // top
            _.times(width, function (n) {
                new Wall({
                    game: self.game,
                    walls: self.walls,
                    x: n * Wall.WIDTH,
                    y: 0
                });
            });
            // bottom
            _.times(width, function (n) {
                new Wall({
                    game: self.game,
                    walls: self.walls,
                    x: n * Wall.WIDTH,
                    y: self.game.world.height - Wall.HEIGHT
                });
            });

            // left
            _.times(height, function (n) {
                new Wall({
                    game: self.game,
                    walls: self.walls,
                    x: 0,
                    y: n * Wall.WIDTH
                });
            });
            // right
            _.times(height, function (n) {
                new Wall({
                    game: self.game,
                    walls: self.walls,
                    x: self.game.world.width - Wall.WIDTH,
                    y: n * Wall.WIDTH
                });
            });
        },
        _buildInsideWalls: function (width, height) {
            var self = this;

            _.times(width, function (n) {
                if (!n) return;
                if (n % 2) return;
                if (n === width - 1) return;

                _.times(height, function (m) {
                    if (!m) return;
                    if (m % 2) return;
                    if (m === height - 1) return;

                    new Wall({
                        game: self.game,
                        walls: self.walls,
                        x: n * Brick.WIDTH,
                        y: m * Brick.HEIGHT
                    });
                });
            });
        },
        _buildBricks: function (width, height) {
            var self = this;

            _.times(300, function () {
                new Brick({
                    game: self.game,
                    bricks: self.bricks,
                    x: Bomb.WIDTH * _.random(0, width),
                    y: Bomb.HEIGHT * _.random(0, height)
                });
            });
        },
        _buildBomb: function (width, height) {
            var self = this;

            _.times(10, function () {
                new Bomb({
                    game: self.game,
                    bombs: self.bombs,
                    x: Bomb.WIDTH * _.random(0, width),
                    y: Bomb.HEIGHT * _.random(0, height)
                });
            });
        },
        addPlayer: function (id) {
            player = new Player({
                game: this.game,
                id: id,
                sprite: 'pikatchu'
            });
            player.tile.body.collideWorldBounds = true; // disable go out of world
            this.game.camera.follow(player.tile); // main player (camera is following)
            this.list[id] = player;
            return player;
        },
        addOpponent: function (id) {
            var opponent = new Player({
                game: this.game,
                id: id,
                sprite: 'mewtwo'
            });
            opponent.tile.body.collideWorldBounds = true; // disable go out of world
            this.list[id] = opponent;
            return opponent;
        },
        terminateOpponent: function (id) {
            var opponent = this.getPlayerById(id);
            if (!opponent) throw 'opponent "' + id + '" doesn\'t exists';
            opponent.kill();
        },
        getPlayerById: function (id) {
            var player = this.list[id];
            if (!player) throw 'player "' + id + '" doesn\'t exists';
            return player;
        },
        _addHeader: function (text) {
            var style = { font: "50px Arial", fill: "#696969" };
            this.game.add.text(this.game.world.width / 2 - 300, 50, text, style);
        },
        _generateOpponents: function () {
            var self = this;
            _.times(50, function (n) {
                self.addOpponent('opponent_' + n);
            });
        }
    };

    return App;
});