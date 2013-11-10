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

        this.create(4, 0xFF0000, function () {
            this.callback(this.points);
        }.bind(this));
        this.create(2, 0xFFE303);

        var self = this;
        _.times(this.power * 2 + 1, function (n) {
            self.points.push({
                x: self.x - self.power + n,
                y: self.y
            });
        });
    };

    Laser.prototype = {
        create: function (size, color, callback) {
            var x = this.x;
            var y = this.y;
            var lines = [];

            if (y % 2 === 1) {
                lines.push(this._lineX(x, y, this.power, size, color));
            }
            if (x % 2 === 1) {
                lines.push(this._lineY(x, y, this.power, size, color));
            }

            setTimeout(function () {
                _.each(lines, function (line) {
                    line.destroy();
                });

                if (typeof callback === "function") {
                    callback();
                }
            }, 200);
        },
        _lineX: function (x, y, power, size, color) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);

            // set a fill and line style
            graphics.beginFill(color);
            graphics.lineStyle(size, color, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) - (power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.lineTo((x * Wall.WIDTH) + ((power + 1) * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.endFill();

            return graphics;
        },
        _lineY: function (x, y, power, size, color) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.HEIGHT));

            // set a fill and line style
            graphics.beginFill(color);
            graphics.lineStyle(size, color, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (power * Wall.WIDTH));
            graphics.lineTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) + ((power + 1) * Wall.WIDTH));
            graphics.endFill();

            return graphics;
        }
    };
    return Laser;
});