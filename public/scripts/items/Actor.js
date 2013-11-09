define([
    'underscore'
], function (_) {
    'use strict';

    var Actor = function (game, name, sprite) {
        log('* create new actor="' + name + '"' + (sprite ? (' (sprite="' + sprite + '")') : ""));
        this.tile = null;
        this.game = game;
        this.name = name;
        this.sprite = sprite;

        this.create();
        this.randomPosition();
    };
    Actor.WIDTH = 50;
    Actor.HEIGHT = 50;
    Actor.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(Actor.WIDTH, Actor.HEIGHT, 'pikatchu');
        },
        randomPosition: function () {
            this.tile.x = _.random(0, this.game.width - Actor.WIDTH);
            this.tile.y = _.random(0, this.game.height - Actor.HEIGHT);
            // log('- random position: x=' + this.tile.x + ' y=' + this.tile.y);
        }
    };
    return Actor;
});