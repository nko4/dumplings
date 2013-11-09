define([
    'underscore'
], function (_) {
    'use strict';

    var Player = function (settings) {
        // log('* create new player="' + settings.id + '"');
        this.game = settings.game;
        this.x = settings.x || this.game.world.randomX;
        this.y = settings.y || this.game.world.randomY;
        this.tile = null;
        this.id = settings.id;
        this.sprite = settings.sprite;

        this.create();
    };
    Player.WIDTH = 50;
    Player.HEIGHT = 50;

    Player.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, this.sprite);
        },
        move: function (x, y) {
            this.tile.x = x;
            this.tile.y = y;
        }
    };
    return Player;
});