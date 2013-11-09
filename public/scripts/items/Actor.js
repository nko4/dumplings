define([], function () {
    'use strict';

    var Actor = function (game, name, sprite) {
        this.tile = null;
        this.game = game;
        this.name = name;
        this.sprite = sprite;

        this.create();
    };
    Actor.prototype = {
        create: function () {
            log('actor create');
            this.tile = this.game.add.sprite(50, 50, 'pikatchu');
        }
    };
    return Actor;
});