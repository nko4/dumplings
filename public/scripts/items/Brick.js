define([
    'underscore',
    'items/Wall'
], function (_, Wall) {
    'use strict';

    var Brick = function (settings) {
        // log('* new Brick');
        this.game = settings.game;
        this.bricks = settings.bricks;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;
        this.isDestroyed = false;

        this.create();
    };
    Brick.WIDTH = 50;
    Brick.HEIGHT = 50;

    Brick.prototype = {
        create: function () {
            // this.tile = this.game.add.sprite(this.x, this.y, 'brick');
            this.tile = this.bricks.create(this.x, this.y, 'brick');

            this.tile.body.immovable = true;
        },
        destroy: function () {
            this.isDestroyed = true;

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 5, true);
            setTimeout(function () {
                this.tile.animations.stop('destroy');
                this.tile.animations.destroy();
                setTimeout(function () {
                    this.tile.kill();
                    broadcasting(x, y, 0);
                }.bind(this), 400);
            }.bind(this), 500);
        }
    };
    return Brick;
});