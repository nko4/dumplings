define([], function () {
    'use strict';

    var Bomb = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Bomb.WIDTH = 50;
    Bomb.MAX_WIDTH = 150;
    Bomb.HEIGHT = 50;
    Bomb.MAX_HEIGHT = 50;

    Bomb.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'bomb');
            this.tile.animations.add('explode');
            this.tile.animations.play('explode', 2, true);
        }
    };
    return Bomb;
});