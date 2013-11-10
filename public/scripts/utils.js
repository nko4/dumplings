(function (exports) {
    'use strict';

    var $box;

    // define colorful logger
    function log(string, type) {
        var args = [
            '%c %c %c ' + string + ' %c %c ',
            'background: ' + (type ? '#FFB819' : '#343434'),
            'background: ' + (type ? '#E85D0C' : '#4e4e4e'),
            'color: ' + (type ? '#fff' : '#eee') + '; background: ' + (type ? '#E83C10' : '#696969'),
            'background: ' + (type ? '#E85D0C' : '#4e4e4e'),
            'background: ' + (type ? '#FFB819' : '#343434')
        ];
        return console.log.apply(console, args);
    }

    function info(msg) {
        if (!$box) $box = $('#messages');
        $box.prepend($('<p>').html(' > <mark>' + msg + '</mark>'));
    }

    function strip(html) {
        return document.createTextNode(html).innerText;
    }

    function updateRanking(rank) {
        var $ranking = $('#ranking');
        $ranking.empty();

        var $column = $('<ul>');
        _.each(rank, function (r, n) {
            $column.append('<li>' + (n + 1) + ". " + r.name + ": <em>" + r.points + "</em></li>");
            if (n % 5 === 0) {
                $column = $('<ul>');
            }
            $ranking.append($column);
        });
    }

    // make public
    exports.log = log;
    exports.info = info;
    exports.strip = strip;
    exports.updateRanking = updateRanking;
}(this));