define([
    'underscore',
    'jquery',
    'cookie',
    'sha1',
    'phaser',
    'items/Player',
    'items/Wall',
    'items/Bomb',
    'items/Brick',
    'items/Mixture'
], function (_, $, cookie, sha1, Phaser, Player, Wall, Bomb, Brick, Mixture) {
    'use strict';

    var App = function (callback) {
        this._callback = callback;

        this.cursors = null;
        this.bricks = null; // collection of bricks
        this.walls = null; // collection of walls
        this.bombs = null; // collection of bombs
        this.players = null; // collection of players
        this.mixtures = null; // collection of mixtures

        this.list = {};
        this.map = [];

        this.initialize();
    };

    App.SPACE = 0;
    App.WALL = 1;
    App.BRICK = 2;
    App.MIXTURE = 3;

    App.MIXTURE_TIME_TO_LIVE = 10 * 1000; // 10s

    var player;
    var opponent;
    var block = false;
    var emptyHandler = function () {};

    App.prototype = {
        initialize: function () {
            this.game = new Phaser.Game(window.innerWidth, window.innerHeight - $('#chat').height(), Phaser.CANVAS, 'phaser-example', {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            });
        },
        preload: function () {
            this.game.load.spritesheet('bomb', 'assets/bomb.png', 50, 50, 3);
            this.game.load.spritesheet('wall', 'assets/wall.png', 50, 50, 1);
            this.game.load.spritesheet('brick', 'assets/brick.png', 50, 50, 4);
            this.game.load.spritesheet('mixture', 'assets/mixture.png', 50, 50, 3);

            this.game.load.spritesheet('ghost', 'assets/ghost.png', 35, 35, 4);
            this.game.load.spritesheet('opponent', 'assets/fighter-yellow.png', 35, 35, 4);
            this.game.load.spritesheet('player', 'assets/fighter-blue.png', 35, 35, 4);
            this.game.load.spritesheet('special', 'assets/fighter-white.png', 35, 35, 4);
        },
        create: function () {
            this.bricks = this.game.add.group();
            this.walls = this.game.add.group();
            this.bombs = this.game.add.group();
            this.players = this.game.add.group();
            this.mixtures = this.game.add.group();

            this.game.stage.backgroundColor = '#0c0c0c'; // color of world

            this.cursors = this.game.input.keyboard.createCursorKeys(); // handle moving
            this.game.input.keyboard.addKeyCapture(32, this._spaceHandler); // handle plant a bomb
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
        updateMap: function (x, y, type) {
            this._setTile(x, y, type);
        },
        _setTile: function (x, y, type) {
            var tile;
            switch (type) {
                case App.SPACE:
                    if (this.map[x] && this.map[x][y]) {
                        // console.log(this.map[x][y]);
                        this.map[x][y].destroy();
                    }
                    break;

                case App.WALL:
                    tile = new Wall({
                        game: this.game,
                        walls: this.walls,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;

                case App.BRICK:
                    tile = new Brick({
                        game: this.game,
                        bricks: this.bricks,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;

                case App.MIXTURE:
                    tile = new Mixture({
                        game: this.game,
                        mixtures: this.mixtures,
                        x: x * Wall.WIDTH,
                        y: y * Wall.HEIGHT
                    });
                    break;

                default:
                    throw 'unexpected type: ' + type;
            }

            if (!this.map[x]) this.map[x] = [];
            this.map[x][y] = tile;
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

            player._moveLabel(player.tile.x, player.tile.y);

            this.collision();
        },
        collision: function () {
            this.game.physics.collide(player.tile, this.bricks, emptyHandler, null, this);
            this.game.physics.collide(player.tile, this.walls, emptyHandler, null, this);
            this.game.physics.collide(player.tile, this.bombs, emptyHandler, null, this);
            this.game.physics.collide(player.tile, this.mixtures, this._catchMixtureHandler, null, this);

            if (opponent) {
                this.game.physics.collide(opponent.tile, this.bricks, emptyHandler, null, this);
                this.game.physics.collide(opponent.tile, this.walls, emptyHandler, null, this);
                this.game.physics.collide(opponent.tile, this.bombs, emptyHandler, null, this);
                this.game.physics.collide(opponent.tile, this.mixtures, this._catchMixtureHandler, null, this);
            }
        },
        _catchMixtureHandler: function (s, t) {
            var currentPlayer = this.list[s.id];
            t.destroy();

            var x = Math.round(player.tile.x / Wall.WIDTH);
            var y = Math.round(player.tile.y / Wall.HEIGHT);

            broadcasting(x, y, 0);

            server.update(s.id, { power: ++currentPlayer.power });
            setTimeout(function () {
                // power is down after couple of seconds
                server.player(s.id, { power: --currentPlayer.power });
            }, App.MIXTURE_TIME_TO_LIVE);
        },
        _spaceHandler: function () {
            var x = Math.round(player.tile.x / Wall.WIDTH);
            var y = Math.round(player.tile.y / Wall.HEIGHT);

            broadcasting(x, y, 3);

            // plant a bomb
            new Bomb({
                game: this.game,
                bombs: this.bombs,
                power: player.power,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        updatePosition: function () {
            player_move(player.tile.x, player.tile.y);
        },
        addPlayer: function (id) {
            player = new Player({
                game: this.game,
                players: this.players,
                power: 2,
                id: id,
                sprite: 'special'
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
                power: 2,
                id: id,
                sprite: 'opponent'
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
        tryKillOpponent: function (x, y) {
            _.each(this.list, function (opponent) {
                var px = Math.round(opponent.tile.x / Wall.WIDTH);
                var py = Math.round(opponent.tile.y / Wall.HEIGHT);

                if (x === px && y === py) {
                    opponent.destroy();
                }
            });
        },
        tryKillPlayer: function (x, y) {
            var px = Math.round(player.tile.x / Wall.WIDTH);
            var py = Math.round(player.tile.y / Wall.HEIGHT);

            if (px === x && py === y) {
                player.destroy();
                killPlayer(player.id);
                alert('You are dead.');
                window.location.reload(); // after death reload game
            }
        },
        getPlayerById: function (id) {
            var player = this.list[id];
            if (!player) throw 'player "' + id + '" doesn\'t exists';
            return player;
        },
        _getUserName: function () {
            var name = cookie.get('uuid');
            if (!name) {
                // first visit
                name = prompt('Pick your name:');
                if (!name) {
                    // blank user name
                    alert('Name is mandatory, please tell us, what is your name?');
                    name = app._getUserName();
                }
                cookie.set('uuid', sha1(navigator.userAgent + (new Date()).toString() + _.random(0, Number.MAX_VALUE - 1)));
            } else {
                // next visit, because uuid exists
            }
            return name;
        },
        getPlayer: function () {
            if (!player) throw 'player doesn\'t exists';
            return player;
        }
    };

    return App;
});