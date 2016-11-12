define([
    'models/wall',
    'models/map'
], function (Wall, Map) {
    'use strict';

    function Mixture(settings) {
        this.game = settings.game;
        this.mixtures = settings.mixtures;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    }

    Mixture.TIME_TO_LIVE = 20 * 1000; // 20s

    Mixture.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'mixture');
            this.tile.body.immovable = true;
            this.mixtures.add(this.tile);

            this.tile.animations.add('brew');
            this.tile.animations.play('brew', 5, true);
        },
        destroy: function () {
            if (!this.tile.alive) return;

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            this.tile.animations.stop('brew');
            this.tile.animations.destroy();

            setTimeout(function () {
                this.tile.destroy();
                broadcasting(x, y, Map.SPACE);
            }.bind(this), 100);
        }
    };
    return Mixture;
});
