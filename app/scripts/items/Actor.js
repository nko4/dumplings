define([], function () {
    'use strict';

    var Actor = function () {

    };
    Actor.prototype = {
        create: function () {
            log('actor create');
        }
    };
    return Actor;
});