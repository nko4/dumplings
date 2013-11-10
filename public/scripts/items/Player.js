define([
    'underscore',
    'items/Wall',
    'items/Map'
], function (_, Wall, Map) {
    'use strict';

    var label;

    var Player = function (settings) {
        this.game = settings.game;
        this.players = settings.players;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;
        this.id = settings.id;
        this.name = settings.name;
        this.sprite = settings.sprite;
        this.power = settings.power;
        this.bombsNum = 0; // current planting bombs
        this.bombsMax = Player.MIN_BOMB; // max number of bombs what user can plant

        this.create();
    };
    Player.WIDTH = 30;
    Player.HEIGHT = 45;

    Player.MIN_BOMB = 2;
    Player.MAX_BOMB = 50;

    Player.prototype = {
        create: function () {
            var x = this.x * Wall.WIDTH + (Wall.WIDTH - Player.WIDTH) / 2;
            var y = this.y * Wall.HEIGHT + (Wall.HEIGHT - Player.HEIGHT) / 2;
            this.tile = this.game.add.sprite(x, y, this.sprite);
            this.players.add(this.tile);

            this.tile.animations.add('walk');
            this.tile.animations.play('walk', 10, true, true);

            // set id to {Phaser.Sprite}
            this.tile.id = this.id;
        },
        move: function (x, y) {
            this.tile.body.velocity.y = this.tile.x - x;
            this.tile.body.velocity.x = this.tile.y - y;

            this.tile.x = x;
            this.tile.y = y;

            this.tile.body.velocity.y = this.tile.body.velocity.x = 0;
            this._moveLabel(x, y);
        },
        random: function () {
            var x = _.random(0, this.game.world.width / Wall.WIDTH - 2);
            var y = _.random(0, this.game.world.height / Wall.HEIGHT - 2);
            return { x: x * Wall.WIDTH, y: y * Wall.HEIGHT };
        },
        plantBomb: function () {
            if (this.bombsNum === this.bombsMax) return;

            this.bombsNum++;

            var x = Math.round(this.tile.x / Wall.WIDTH);
            var y = Math.round(this.tile.y / Wall.HEIGHT);

            broadcasting(x, y, Map.BOMB);

            // plant a bomb
            app.buildBomb(x, y, function () {
                return this;
            });
        },
        destroy: function () {
            if (!this.tile.alive) return;

            this.tile.animations.stop('walk');
            this.tile.animations.destroy();

            this.tile.destroy();
            killPlayer(this.id);
        },
        setName: function (name) {
            this.name = name;
            var style = { font: "12px Verdana", fill: "#fff" };
            label = this.game.add.text(0, 0, name, style);
            label.visible = false;
            setTimeout(function () {
                label.visible = true;
            }, 100);
        },
        _moveLabel: function (x, y) {
            if (!label) return;
            label.x = x - label.width / 2 + Player.WIDTH / 2;
            label.y = y - 20;
        }
    };
    return Player;
});