define([
    'items/Wall'
], function (Wall) {
    'use strict';

    var Bomb = function (settings) {
        this.game = settings.game;
        this.bombs = settings.bombs;
        this.power = settings.power || 1;
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
            this.bombs.add(this.tile);
            // this.tile = this.bombs.create(this.x, this.y, 'bomb');
            this.tile.body.immovable = true;

            setTimeout(function () {
                // auto destruction
                this.destroy();
            }.bind(this), 2000);
        },
        destroy: function () {
            if (!this.tile.alive) return;

            this.isDestroyed = true;

            var x = Math.round(this.x / Wall.WIDTH);
            var y = Math.round(this.y / Wall.HEIGHT);

            this.tile.animations.add('destroy');
            this.tile.animations.play('destroy', 5, true);

            setTimeout(function () {
                this.tile.animations.stop('destroy');
                this.tile.animations.destroy();

                setTimeout(function () {
                    this.tile.destroy();
                    if (y % 2 === 1) this._lineX.call(this, x, y, this.power);
                    if (x % 2 === 1) this._lineY.call(this, x, y, this.power);
                    broadcasting(x, y, 0);
                }.bind(this), 400);
            }.bind(this), 500);
        },
        _lineX: function (x, y, power) {
            var graphics = this.game.add.graphics((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);

            // set a fill and line style
            graphics.beginFill(0xFF0000);
            graphics.lineStyle(10, 0xFF0000, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.lineTo((x * Wall.WIDTH) + ((power + 1) * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.endFill();

            setTimeout(function () {
                graphics.destroy();

                _.times(power * 2 + 1, function (n) {
                    app.updateMap(x - power + n, y, 0);
                    app.tryKillOpponent(x - power + n, y);
                    app.tryKillPlayer(x - power + n, y);
                });
            }, 200);
        },
        _lineY: function (x, y, power) {
            var graphics = this.game.add.graphics((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.HEIGHT));

            // set a fill and line style
            graphics.beginFill(0xFF0000);
            graphics.lineStyle(10, 0xFF0000, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.WIDTH));
            graphics.lineTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) + ((power + 1) * Wall.WIDTH));
            graphics.endFill();

            setTimeout(function () {
                graphics.destroy();

                _.times(power * 2 + 1, function (n) {
                    app.updateMap(x, y - power + n, 0);
                    app.tryKillOpponent(x, y - power + n);
                    app.tryKillPlayer(x, y - power + n);
                });
            }, 200);
        }
    };
    return Bomb;
});