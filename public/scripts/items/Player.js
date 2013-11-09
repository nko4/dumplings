define([
    'underscore',
    'items/Wall'
], function (_, Wall) {
    'use strict';

    var Player = function (settings) {
        // log('* new Player="' + settings.id + '"');
        this.game = settings.game;
        this.x = settings.x || this.random().x;
        this.y = settings.y || this.random().y;
        this.tile = null;
        this.id = settings.id;
        this.sprite = settings.sprite;

        this.create();
    };
    Player.WIDTH = 30;
    Player.HEIGHT = 45;

    Player.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, this.sprite);
        },
        move: function (x, y) {
            this.tile.x = x;
            this.tile.y = y;
        },
        random: function () {
            var x = _.random(0, this.game.world.width / Wall.WIDTH - 2);
            var y = _.random(0, this.game.world.height / Wall.HEIGHT - 2);
            return {x: x * Wall.WIDTH, y: y * Wall.HEIGHT};
        },
        kill: function () {
            this.tile.destroy();
        }
    };
    return Player;
});