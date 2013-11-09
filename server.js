// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('WfsRuxlWWBoW0L63');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);




var ejs = require('ejs');
var express = require('express');
var _ = require('underscore');
var app = express();
var config = {};



app.configure(function(){
  //app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  // app.use(require('connect-assets')());
});


var Player, player;

Player = (function() {
  function Player(x, y) {
    this.x = x;
    this.y = y;
  }

  Player.prototype.getPosition = function() {
    return {
      x: this.x,
      y: this.y
    };
  };

  return Player;

})();

player = new Player(1, 2);

player.getPosition();









players = {};

var server = app.listen(port);
var io = require('socket.io').listen(server);

app.get('/', function (reseq, res) {
    res.render('index', { isProduction: isProduction })
});

io.sockets.on('connection', function (socket) {


  socket.on('play',function() {
    players[socket.id] = { x: 0, y: 0 };


    socket.emit('play',socket.id,0,0);

  });

  socket.on('pm',function(x,y) {



    players[socket.id] = { x: x, y: y};




    var _tmp_players = [];

    _.each(players,function(v,k) {
      _tmp_players.push(_.extend({ id: k },v));
    })


    socket.broadcast.emit('pm', _tmp_players);


  }); // player move



  socket.on('disconnect', function() {
    delete players[socket.id];
    socket.broadcast.emit('leave',socket.id)
  });

});


// http.createServer(function (req, res) {
//   // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
//   var voteko = '<iframe src="http://nodeknockout.com/iframe/dumplings" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';

//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('<html><body>' + voteko + '</body></html>\n');
// }).listen(port, function(err) {
//   if (err) { console.error(err); process.exit(-1); }

//   // if run as root, downgrade to the owner of this file
//   if (process.getuid() === 0) {
//     require('fs').stat(__filename, function(err, stats) {
//       if (err) { return console.error(err); }
//       process.setuid(stats.uid);
//     });
//   }

//   console.log('Server running at http://0.0.0.0:' + port + '/');
// });
