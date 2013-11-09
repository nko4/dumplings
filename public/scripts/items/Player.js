define([
    'underscore',
    'items/Wall'
], function (_, Wall) {
    'use strict';

    var label;

    var Player = function (settings) {
        // log('* new Player="' + settings.id + '"');

        this.game = settings.game;
        this.players = settings.players;
        var random = this.random();
        this.x = settings.x || random.x;
        this.y = settings.y || random.y;
        this.tile = null;
        this.id = settings.id;
        this.name = settings.name;
        this.sprite = settings.sprite;
        this.power = settings.power;

        this.create();
    };
    Player.WIDTH = 30;
    Player.HEIGHT = 45;

    Player.prototype = {
        create: function () {
            // this.tile = this.game.add.sprite(this.x, this.y, this.sprite);
            this.tile = this.players.create(this.x, this.y, this.sprite);
            this.tile.animations.add('scary');
            this.tile.animations.play('scary', 10, true, true);
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
            return {x: x * Wall.WIDTH, y: y * Wall.HEIGHT};
        },
        destroy: function () {
            this.tile.kill();
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
            label.x = x - label.width / 2 + Player.WIDTH / 2;
            label.y = y - 20;
        }
    };
    return Player;
});