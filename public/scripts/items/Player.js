define([
    'underscore'
], function (_) {
    'use strict';

    var Player = function (settings) {
        log('* new Player="' + settings.id + '"');
        this.game = settings.game;
        this.x = settings.x || this.random().x;
        this.y = settings.y || this.random().y;
        this.tile = null;
        this.id = settings.id;
        this.sprite = settings.sprite;

        this.create();
    };
    Player.WIDTH = 35;
    Player.HEIGHT = 40;

    Player.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, this.sprite);
        },
        move: function (x, y) {
            this.tile.x = x;
            this.tile.y = y;
        },
        random: function () {
            var x = _.random(Player.WIDTH, this.game.world.width - Player.WIDTH * 2);
            var y = _.random(Player.HEIGHT, this.game.world.height - Player.HEIGHT * 2);
            return {x:x, y:y};
        },
        kill: function () {
            this.tile.destroy();
        }
    };
    return Player;
});