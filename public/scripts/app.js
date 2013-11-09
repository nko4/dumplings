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
        this._callback = callback;

        this.cursors = null;
        this.bricks = null; // collection of bricks
        this.walls = null; // collection of walls
        this.bombs = null; // collection of bombs
        this.players = null; // collection of players

        this.list = {};
        this.map = [];

        this.initialize();
    };

    var player;
    var opponent;
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
            // log('* preload process');
            this.game.load.image('pikatchu', 'assets/pikatchu.png');
            this.game.load.image('mewtwo', 'assets/mewtwo.png');
            this.game.load.image('fighter', 'assets/fighter.png');
            this.game.load.spritesheet('bomb', 'assets/bomb.png', 50, 50, 3);
            this.game.load.spritesheet('wall', 'assets/wall.png', 50, 50, 1);
            this.game.load.spritesheet('brick', 'assets/brick.png', 50, 50, 4);
        },
        create: function () {
            // log('* create process');
            this.bricks = this.game.add.group();
            this.walls = this.game.add.group();
            this.bombs = this.game.add.group();
            this.players = this.game.add.group();

            this.game.stage.backgroundColor = "#0c0c0c"; // world color
            this._addHeader("Welcome in \"NKO\" World!"); // any header?

            // this._generateOpponents();

            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture(32, this._spaceHandler);

            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this._spaceHandler, this);

            this._callback.call(this);
        },
        setMap: function (map) {
            var self = this;

            this.game.world.setBounds(0, 0, _.size(map) * Wall.WIDTH, _.size(map[0]) * Wall.HEIGHT); // world size

            _.each(map, function (row, x) {
                _.each(row, function (type, y) {
                    if (!self.map[x]) self.map[x] = [];
                    self.map[x][y] = type;
                    self._setTile.call(self, x, y, type);
                });
            });
        },
        _setTile: function (x, y, type) {
            var tile;
            switch (type) {
                // space
                case 0:
                    if (this.map[x] && this.map[x][y]) {
                        this.map[x][y].destroy();
                    }
                    break;
                // wall
                case 1:
                    tile = new Wall({
                        game: this.game,
                        walls: this.walls,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;
                // brick
                case 2:
                    tile = new Brick({
                        game: this.game,
                        bricks: this.bricks,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;
                // bomb
                case 3:
                    tile = new Bomb({
                        game: this.game,
                        bombs: this.bombs,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;
                default:
                    throw 'unexpected ' + type;
            }
            if (!this.map[x]) this.map[x] = [];
            this.map[x][y] = tile;
        },
        updateMap: function (x, y, type) {
            this._setTile(x, y, type);
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
                    }, 20);
                }
            }
            this.game.physics.collide(player.tile, this.bricks, this._collisionBrickHandler, null, this);
            this.game.physics.collide(player.tile, this.walls, this._collisionWallHandler, null, this);
            this.game.physics.collide(player.tile, this.bombs, this._collisionWallHandler, null, this);

            if (opponent) {
                this.game.physics.collide(opponent.tile, this.bricks, this._collisionBrickHandler, null, this);
                this.game.physics.collide(opponent.tile, this.walls, this._collisionWallHandler, null, this);
                this.game.physics.collide(opponent.tile, this.bombs, this._collisionWallHandler, null, this);
            }

            this.game.physics.collide(this.bricks, this.bombs, this._collisionWallHandler, null, this);
            this.game.physics.collide(this.walls, this.bombs, this._collisionWallHandler, null, this);
        },
        _collisionBrickHandler: function (s, t) {
            var x = t.x / Wall.WIDTH;
            var y = t.y / Wall.WIDTH;
            var item = this.map[x][y];
            if (item && !item.isDestroyed) item.destroy();
        },
        _collisionWallHandler: function (s, t) {
            // do nothing
        },
        _spaceHandler: function () {
            var x = Math.round(player.tile.x / Wall.WIDTH);
            var y = Math.round(player.tile.y / Wall.HEIGHT);

            broadcasting(x, y, 3);

            new Bomb({
                game: this.game,
                bombs: this.bombs,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        updatePosition: function () {
            player_move(player.tile.x, player.tile.y);
        },
        // run per each mouse move on game board
        render: function () {
            // this.game.debug.renderCameraInfo(this.game.camera, 60, 75);
            // if (player) this.game.debug.renderSpriteCoords(player.tile, 60, 180);
        },
        addPlayer: function (id) {
            player = new Player({
                game: this.game,
                players: this.players,
                id: id,
                sprite: 'fighter'
            });
            player.tile.body.collideWorldBounds = true; // disable go out of world
            this.game.camera.follow(player.tile); // main player (camera is following)
            this.list[id] = player;
            return player;
        },
        addOpponent: function (id) {
            opponent = new Player({
                game: this.game,
                players: this.players,
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
            opponent.destroy();
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