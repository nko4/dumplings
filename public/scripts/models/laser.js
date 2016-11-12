define([
    'underscore',
    'models/wall'
], function (_, Wall) {
    'use strict';

    function Laser(settings) {
        this.game = settings.game;
        this.x = settings.x;
        this.y = settings.y;
        this.power = settings.power;
        this.points = [];
        this.callback = settings.callback;

        this.create(4, 0xFFFFFF, function () {
            this.callback(this.points);
        }.bind(this));
        // this.create(2, 0xFFE303);
    }

    Laser.prototype = {
        create: function (size, color, callback) {
            var x = this.x;
            var y = this.y;
            var lines = [];

            if (y % 2 === 1) {
                lines.push(this._lineX(x, y, size, color));
            }
            if (x % 2 === 1) {
                lines.push(this._lineY(x, y, size, color));
            }

            setTimeout(function () {
                _.each(lines, function (line) {
                    line.destroy();
                });

                if (_.isFunction(callback)) {
                    callback();
                }
            }, 200);
        },
        _lineX: function (x, y, size, color) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) - (this.power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);

            // set a fill and line style
            graphics.beginFill(color);
            graphics.lineStyle(size, color, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) - (this.power * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.lineTo((x * Wall.WIDTH) + ((this.power + 1) * Wall.WIDTH), y * Wall.HEIGHT + Wall.HEIGHT / 2);
            graphics.endFill();

            _.times(this.power * 2 + 1, function (n) {
                self.points.push({
                    x: self.x - self.power + n,
                    y: self.y
                });
            });

            return graphics;
        },
        _lineY: function (x, y, size, color) {
            var self = this;
            var graphics = this.game.add.graphics((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (this.power * Wall.HEIGHT));

            // set a fill and line style
            graphics.beginFill(color);
            graphics.lineStyle(size, color, 1);

            // draw a shape
            graphics.moveTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) - (this.power * Wall.WIDTH));
            graphics.lineTo((x * Wall.WIDTH) + Wall.WIDTH / 2, (y * Wall.HEIGHT) + ((this.power + 1) * Wall.WIDTH));
            graphics.endFill();

            _.times(this.power * 2 + 1, function (n) {
                self.points.push({
                    x: self.x,
                    y: self.y - self.power + n
                });
            });

            return graphics;
        }
    };
    return Laser;
});
