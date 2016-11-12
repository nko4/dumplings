define([], function () {
    'use strict';

    function Wall(settings) {
        this.game = settings.game;
        this.walls = settings.walls;
        this.x = settings.x;
        this.y = settings.y;
        this.tile = null;

        this.create();
    }

    Wall.WIDTH = 50;
    Wall.HEIGHT = 50;

    Wall.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(this.x, this.y, 'wall');
            this.tile.body.immovable = true;
            this.walls.add(this.tile);
        },
        destroy: function () {
            // throw 'destroy Wall: you can\'t do this';
        }
    };
    return Wall;
});
