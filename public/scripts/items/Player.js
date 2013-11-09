define([
    'underscore'
], function (_) {
    'use strict';

    var Player = function (settings) {
        log('* create new player="' + settings.id + '"');
        this.tile = null;
        this.id = settings.id;
        this.game = settings.game;
        // this.name = settings.name;
        this.sprite = settings.sprite;

        this.create();
    };
    Player.WIDTH = 50;
    Player.HEIGHT = 50;

    Player.prototype = {
        create: function () {
            this.tile = this.game.add.sprite(200, 200, this.sprite);
        },
        move: function (x, y) {
            this.tile.x = x;
            this.tile.y = y;
        }
    };
    Object.defineProperty(Player.prototype, 'x', {
        get: function () { return this.tile.x; },
        set: function () { throw 'don\'t do this'; }
    });
    Object.defineProperty(Player.prototype, 'y', {
        get: function () { return this.tile.y; },
        set: function () { throw 'don\'t do this'; }
    });
    return Player;
});