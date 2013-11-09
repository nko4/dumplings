define([], function () {
    'use strict';

    var Wall = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Wall.WIDTH = 50;
    Wall.MAX_WIDTH = 250;
    Wall.HEIGHT = 50;
    Wall.MAX_HEIGHT = 50;

    Wall.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'wall');
        }
    };
    return Wall;
});