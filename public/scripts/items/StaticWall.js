define([], function () {
    'use strict';

    var StaticWall = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    StaticWall.WIDTH = 50;
    StaticWall.MAX_WIDTH = 250;
    StaticWall.HEIGHT = 50;
    StaticWall.MAX_HEIGHT = 50;

    StaticWall.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'static-wall');
        }
    };
    return StaticWall;
});