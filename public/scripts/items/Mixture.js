define([], function () {
    'use strict';

    var Mixture = function (settings) {
        this.game = settings.game;
        this.mixtures = settings.mixtures;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;
    };
    Mixture.prototype = {
        create: function () {
            this.tile = this.mixtures.create(this.x, this.y, 'mixture');
            this.tile.animations.add('brew');
            this.tile.animations.play('brew', 10, true);
        }
    };

    return Mixture;
});