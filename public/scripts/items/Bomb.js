define([
    'underscore',
    'items/Wall',
    'items/Laser',
    'items/Map'
], function (_, Wall, Laser, Map) {
    'use strict';

    var Bomb = function (settings) {
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
            this.tile = this.game.add.sprite(this.x, this.y, 'bomb');
            this.tile.body.immovable = true;
            this.bombs.add(this.tile);

            setTimeout(function () {
                // auto destruction
                this.destroy();
            }.bind(this), 2000);
        },
        destroy: function () {
            if (!this.tile.alive) return;

            this.isDestroyed = true;

            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 5, true);

            setTimeout(function () {
                this.tile.animations.stop('destroy');
                this.tile.animations.destroy();

                setTimeout(this._showLaser.bind(this), 400);
            }.bind(this), 500);
        },
        _showLaser: function () {
            this.tile.destroy();

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            new Laser({
                game: this.game,
                x: x,
                y: y,
                power: app.getPlayer().power,
                callback: this._doOnPoint
            });

            broadcasting(x, y, Map.SPACE);
        },
        _doOnPoint: function (points) {
            _.each(points, function (point) {
                app.updateMap(point.x, point.y, 0);
                app.tryKillOpponent(point.x, point.y);
                app.tryKillPlayer(point.x, point.y);
            });

            app.getPlayer().bombsNum--;
        }
    };
    return Bomb;
});