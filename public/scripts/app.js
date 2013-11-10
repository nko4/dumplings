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
    'items/Mixture',
    'items/Map'
], function (_, $, cookie, sha1, Phaser, Player, Wall, Bomb, Brick, Mixture, Map) {
    'use strict';

    var App = function (callback) {
        this._callback = callback;

        this.bricks = null; // collection of bricks
        this.walls = null; // collection of walls
        this.bombs = null; // collection of bombs
        this.players = null; // collection of players
        this.mixtures = null; // collection of mixtures

        this.list = {};
        this.cursors = null; // up, down, left, right
        this.map = null; // Map

        this.COOKIE = 'dumplings_3';

        this.initialize();
    };

    var player;
    var music;
    var opponent;
    var block = false;
    var emptyHandler = function () {};

    App.prototype = {
        initialize: function () {
            this.game = new Phaser.Game(window.innerWidth, window.innerHeight - $('#footer').height(), Phaser.CANVAS, 'phaser-example', {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            });
        },
        preload: function () {
            this.game.load.spritesheet('bomb', 'assets/pics/1/bomb.png', 50, 50, 3);
            this.game.load.spritesheet('wall', 'assets/pics/2/wall-1.png', 50, 50, 1);
            this.game.load.spritesheet('brick', 'assets/pics/1/brick.png', 50, 50, 4);
            this.game.load.spritesheet('mixture', 'assets/pics/2/mixture.png', 50, 50, 3);

            this.game.load.spritesheet('player', 'assets/pics/1/fighter-1.png', 35, 35, 4);
            this.game.load.spritesheet('opponent', 'assets/pics/1/fighter-2.png', 35, 35, 4);
            this.game.load.spritesheet('special', 'assets/pics/1/fighter-3.png', 35, 35, 4);

            this.game.load.audio('music', ['assets/audio/sound.wav', 'assets/audio/sound.mp3', 'assets/audio/sound.ogg']);
        },
        create: function () {
            this.bricks = this.game.add.group();
            this.walls = this.game.add.group();
            this.bombs = this.game.add.group();
            this.players = this.game.add.group();
            this.mixtures = this.game.add.group();

            music = this.game.add.audio('music');
            music.play(null, null, 1, true);

            this.game.stage.backgroundColor = '#0c0c0c'; // color of world

            this.cursors = this.game.input.keyboard.createCursorKeys(); // handle moving
            var ctrlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            ctrlKey.onDown.add(function () { player.plantBomb(); }, this);

            this._callback.call(this);
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
                    player_move(player.tile.x, player.tile.y);

                    setTimeout(function () {
                        block = false;
                    }, 20);
                }
            }

            player._moveLabel(player.tile.x, player.tile.y);

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
        setMap: function (matrix) {
            var width = _.size(matrix) * Wall.WIDTH;
            var height = _.size(matrix[0]) * Wall.HEIGHT;

            this.game.world.setBounds(0, 0, width, height); // world size

            this.map = new Map(matrix, function () {
                return player;
            });
        },
        updateMap: function (x, y, type) {
            // ignore, when others moving...
            if (this.map) {
                this.map.update(x, y, type);
            }
        },
        _catchMixtureHandler: function (s, t) {
            var currentPlayer = this.list[s.id];
            t.destroy();

            var x = Math.round(player.tile.x / Wall.WIDTH);
            var y = Math.round(player.tile.y / Wall.HEIGHT);

            broadcasting(x, y, Map.SPACE);

            server.update(s.id, { power: ++currentPlayer.power });
            setTimeout(function () {
                // power is down after couple of seconds
                server.update(s.id, { power: --currentPlayer.power });
            }, Mixture.TIME_TO_LIVE);
        },
        addPlayer: function (id, x, y) {
            player = new Player({
                game: this.game,
                players: this.players,
                power: 2,
                id: id,
                sprite: 'player',
                x: x,
                y: y
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

                    var bomb = ++player.bombsMax;
                    if (bomb > Player.MAX_BOMB) bomb = Player.MAX_BOMB;
                    server.update(cookie.get(app.COOKIE), { 'bombsMax': bomb });
                }
            });
        },
        tryKillPlayer: function (x, y) {
            var px = Math.round(player.tile.x / Wall.WIDTH);
            var py = Math.round(player.tile.y / Wall.HEIGHT);

            if (px === x && py === y) {
                player.destroy();
                var bomb = --player.bombsMax;
                if (bomb < Player.MIN_BOMB) bomb = Player.MIN_BOMB;
                server.update(cookie.get(app.COOKIE), { 'bombsMax': bomb });

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
            var session_id = cookie.get(app.COOKIE);
            var name = null;
            if (!session_id) {
                // first visit
                name = prompt('Pick your name:');
                if (!name) {
                    // blank user name
                    alert('Name is mandatory, please tell us, what is your name?');
                    name = app._getUserName();
                }
                cookie.set(app.COOKIE, sha1(navigator.userAgent + (new Date()).toString() + _.random(0, Number.MAX_VALUE - 1)));
            } else {
                // next visit
            }
            return name;
        },
        getPlayer: function () {
            if (!player) throw 'player doesn\'t exists';
            return player;
        },
        buildWall: function (x, y) {
            return new Wall({
                game: this.game,
                walls: this.walls,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        buildBrick: function (x, y) {
            return new Brick({
                game: this.game,
                bricks: this.bricks,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        buildMixture: function (x, y) {
            return new Mixture({
                game: this.game,
                mixtures: this.mixtures,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        buildBomb: function (x, y) {
            return new Bomb({
                game: this.game,
                bombs: this.bombs,
                x: x * Wall.WIDTH,
                y: y * Wall.HEIGHT
            });
        },
        getMusic: function () {
            return music;
        }
    };

    return App;
});