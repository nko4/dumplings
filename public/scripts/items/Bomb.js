define([
    'items/Wall'
], function (Wall) {
    'use strict';

    var Bomb = function (settings) {
        // log('* new Bomb');
        this.game = settings.game;
        this.bombs = settings.bombs;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;
        this.isDestroyed = false;

        this.create();
    };
    Bomb.WIDTH = 50;
    Bomb.HEIGHT = 50;

    Bomb.prototype = {
        create: function () {
            // this.tile = this.game.add.sprite(this.x, this.y, 'bomb');
            this.tile = this.bombs.create(this.x, this.y, 'bomb');
            // this.tile.body.immovable = true; // disable, more fun!

            setTimeout(function () {
                // auto destruction
                this.destroy();
            }.bind(this), 2000);
        },
        destroy: function () {
            this.isDestroyed = true;

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 5, true);
            setTimeout(function () {
                this.tile.animations.stop('destroy');
                setTimeout(function () {
                    this.tile.kill();
                    broadcasting(x, y, 0);
                }.bind(this), 400);
            }.bind(this), 500);
        }
    };
    return Bomb;
});