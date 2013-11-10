define([
    'underscore',
    'items/Wall'
], function (_, Wall) {
    'use strict';

    var Laser = function (settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.power = settings.power;
        this.points = [];
        this.callback = settings.callback;

        this.create();
    };
    Laser.prototype = {
        create: function () {
            var self = this;
            var x = this.x;
            var y = this.y;
            var lines = [];

            if (y % 2 === 1) {
                lines.push(this._lineX(x, y, this.power));
            }
            if (x % 2 === 1) {
                lines.push(this._lineY(x, y, this.power));
            }

            setTimeout(function () {
                _.each(lines, function (line) {
                    line.destroy();
                });

                self.callback(self.points);
            }, 200);
        },
        _lineX: function (x, y, power) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);

            // set a fill and line style
            graphics.beginFill(0xFF0000);
            graphics.lineStyle(10, 0xFF0000, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.lineTo((x * Wall.WIDTH) + ((power + 1) * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.endFill();

            _.times(power * 2 + 1, function (n) {
                self.points.push({
                    x: x - power + n,
                    y: y
                });
            });
            return graphics;
        },
        _lineY: function (x, y, power) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.HEIGHT));

            // set a fill and line style
            graphics.beginFill(0xFF0000);
            graphics.lineStyle(10, 0xFF0000, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.WIDTH));
            graphics.lineTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) + ((power + 1) * Wall.WIDTH));
            graphics.endFill();

            _.times(power * 2 + 1, function (n) {
                self.points.push({
                    x: x,
                    y: y - power + n
                });
            });
            return graphics;
        }
    };
    return Laser;
});