define([
    'underscore',
    'items/Wall'
], function (_, Wall) {
    'use strict';

    var Player = function (settings) {
        // log('* new Player="' + settings.id + '"');

        this.game = settings.game;
        this.players = settings.players;
        var random = this.random();
        this.x = settings.x || random.x;
        this.y = settings.y || random.y;
        this.tile = null;
        this.id = settings.id;
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
        },
        move: function (x, y) {
            this.tile.body.velocity.y = this.tile.x - x;
            this.tile.body.velocity.x = this.tile.y - y;

            this.tile.x = x;
            this.tile.y = y;

            this.tile.body.velocity.y = this.tile.body.velocity.x = 0;
        },
        random: function () {
            var x = _.random(0, this.game.world.width / Wall.WIDTH - 2);
            var y = _.random(0, this.game.world.height / Wall.HEIGHT - 2);
            return {x: x * Wall.WIDTH, y: y * Wall.HEIGHT};
        },
        destroy: function () {
            this.tile.kill();
        }
    };
    return Player;
});