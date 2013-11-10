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
        $box.prepend($('<p>').html(' > <mark>' + msg + '</mark>').addClass("info"));
    }

    function warn(msg) {
        if (!$box) $box = $('#messages');
        $box.prepend($('<p>').html(' > <mark>' + msg + '</mark>').addClass("warn"));
    }

    function strip(html) {
        return document.createTextNode(html).innerText;
    }

    function updateRanking(rank) {
        // doesn't update view when ranking is empty
        if (!rank.length) return;
        var $column, $ranking = $('#ranking');
        $ranking.empty();
        _.each(rank, function (r, n) {
            if (n % 5 === 0) {
                $column = $('<ul>');
            }
            $column.append('<li>' + (n + 1) + ". <strong>" + r.name + "</strong>: <em>" + r.points + "</em></li>");
            $ranking.append($column);
        });
    }

    // make public
    exports.log = log;
    exports.info = info;
    exports.warn = warn;
    exports.strip = strip;
    exports.updateRanking = updateRanking;
}(this));