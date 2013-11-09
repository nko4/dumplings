define([], function () {
    'use strict';

    var Bomb = function (settings) {
        log('* new Bomb');
        this.game = settings.game;
        this.bombs = settings.bombs;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Bomb.WIDTH = 50;
    Bomb.HEIGHT = 50;

    Bomb.prototype = {
        create: function () {
            // this.tile = this.game.add.sprite(this.x, this.y, 'bomb');
            this.tile = this.bombs.create(this.x, this.y, 'bomb');
            setTimeout(function () {
                this.destroy();
            }.bind(this), _.random(2000, 10000));
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
    return Bomb;
});