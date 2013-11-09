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
            setTimeout(function () {
                this.destroy();
            }.bind(this), _.random(200, 1000));
        },
        destroy: function () {
            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 2, true);
            setTimeout(function () {
                this.tile.animations.stop('destroy');
                this.tile.animations.destroy();
                setTimeout(function () {
                    this.tile.destroy();
                }.bind(this), 400);
            }.bind(this), _.random(500, 2000));
        }
    };
    return Brick;
});