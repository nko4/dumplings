define([], function () {
    'use strict';

    var DynamicWall = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    DynamicWall.WIDTH = 50;
    DynamicWall.MAX_WIDTH = 250;
    DynamicWall.HEIGHT = 50;
    DynamicWall.MAX_HEIGHT = 50;

    DynamicWall.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'dynamic-wall');
            this.tile.animations.add('walk');
            this.tile.animations.play('walk', 4, true);
        }
    };
    return DynamicWall;
});