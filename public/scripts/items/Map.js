define([
    'items/Wall'
], function (Wall) {
    'use strict';

    var Map = function (matrix) {
        this.matrix = matrix;
        this.map = [];

        this.create();
    };

    Map.SPACE = 0;
    Map.WALL = 1;
    Map.BRICK = 2;
    Map.MIXTURE = 3;

    Map.prototype = {
        create: function () {
            var self = this;
            _.each(this.matrix, function (row, x) {
                _.each(row, function (type, y) {
                    if (!self.map[x]) self.map[x] = [];
                    self.map[x][y] = type;
                    self.update.call(self, x, y, type);
                });
            });
        },
        update: function (x, y, type) {
            var tile;
            switch (type) {
                case Map.SPACE:
                    if (this.map[x] && this.map[x][y]) {
                        this.map[x][y].destroy();
                    }
                    break;

                case Map.WALL:
                    tile = app.buildWall(x, y);
                    break;

                case Map.BRICK:
                    tile = app.buildBrick(x, y);
                    break;

                case Map.MIXTURE:
                    tile = app.buildMixture(x, y);
                    break;

                default:
                    throw 'unexpected type: ' + type;
            }

            if (!this.map[x]) this.map[x] = [];
            this.map[x][y] = tile;
        },
    };
    return Map;
});