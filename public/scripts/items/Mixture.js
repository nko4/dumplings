define([
    'items/Wall'
], function (Wall) {
    'use strict';

    var Mixture = function (settings) {
        this.game = settings.game;
        this.mixtures = settings.mixtures;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Mixture.prototype = {
        create: function () {
            this.tile = this.mixtures.create(this.x, this.y, 'mixture');
            this.tile.body.immovable = true;

            this.tile.animations.add('brew');
            this.tile.animations.play('brew', 5, true);
        },
        destroy: function () {
            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            // this.tile.animations.stop('brew');
            this.tile.animations.destroy();

            this.tile.kill();
            broadcasting(x, y, 0);
        }
    };

    return Mixture;
});