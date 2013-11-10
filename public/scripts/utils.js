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

    // make public
    exports.log = log;
    exports.info = info;
}(this));