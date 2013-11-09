define([], function () {
    'use strict';

    var StaticWall = function (game) {
        this.tile = null;
        this.game = game;
    };
    StaticWall.WIDTH = 50;
    StaticWall.HEIGHT = 50;

    StaticWall.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(StaticWall.WIDTH, StaticWall.HEIGHT, 'wall');
        }
    };
    return StaticWall;
});