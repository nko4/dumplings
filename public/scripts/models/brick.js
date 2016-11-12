define([
    'underscore',
    'models/wall',
    'models/map'
], function (_, Wall, Map) {
    'use strict';

    function Brick(settings) {
        this.game = settings.game;
        this.bricks = settings.bricks;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;
        this.isDestroyed = false;

        this.create();
    }

    Brick.WIDTH = 50;
    Brick.HEIGHT = 50;

    Brick.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'brick');
            this.tile.body.immovable = true;
            this.bricks.add(this.tile);
        },
        destroy: function () {
            if (!this.tile.alive) return;

            this.isDestroyed = true;

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 10, true);

            setTimeout(function () {
                this.tile.animations.stop('destroy');
                this.tile.animations.destroy();

                setTimeout(function () {
                    this.tile.destroy();
                    broadcasting(x, y, Map.SPACE);
                }.bind(this), 100);
            }.bind(this), 200);
        }
    };
    return Brick;
});
