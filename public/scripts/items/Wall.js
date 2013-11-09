define([], function () {
    'use strict';

    var Wall = function (settings) {
        // log('* new Wall');
        this.game = settings.game;
        this.walls = settings.walls;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    };
    Wall.WIDTH = 50;
    Wall.HEIGHT = 50;

    Wall.prototype = {
        create: function () {
            // this.tile = this.game.add.sprite(this.x, this.y, 'wall');
            this.tile = this.walls.create(this.x, this.y, 'wall');
            this.tile.body.immovable = true;
        },
        destroy: function () {
            // throw 'destroy Wall: you can\'t do this';
        }
    };
    return Wall;
});