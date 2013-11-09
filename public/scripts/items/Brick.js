define([], function () {
    'use strict';

    var Brick = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Brick.WIDTH = 50;
    Brick.MAX_WIDTH = 250;
    Brick.HEIGHT = 50;
    Brick.MAX_HEIGHT = 50;

    Brick.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'dynamic-wall');
            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 2, true);
        }
    };
    return Brick;
});