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


var Game;

Game = (function() {
  function Game (argument) {

    map = [];

    // 0 - space
    // 1 - wall
    // 2 - brick
    // 3 - bomb

    MAP_X = 34;
    MAP_Y = 20;

    for (var x = MAP_X; x >= 0; x--) {
      map[x] = [];
      for (var y = MAP_Y; y >= 0; y--) {
        map[x].push(0);
      };
    };

    _.times(MAP_X, function (x) { map[x][0] = 1;  });
    _.times(MAP_X, function (x) { map[x][MAP_Y] = 1; });
    _.times(MAP_Y, function (y) { map[0][y] = 1; });
    _.times(MAP_Y, function (y) { map[MAP_X][y] = 1; });
    _.times(MAP_X, function (n) {
      if (!n) return;
      if (n % 2) return;
      if (n === MAP_X - 1) return;
      
      _.times(MAP_Y, function (m) {
        if (!m) return;
        if (m % 2) return;
        if (m === MAP_Y - 1) return;

        map[n][m] = 1;
                    
      });
    });

    map[MAP_X][MAP_Y] = 1; //hack :)

    _.times(parseInt(MAP_X*MAP_Y*0.20),function() {
      var x = Math.floor(Math.random() * MAP_X-1) + 1;
      var y = Math.floor(Math.random() * MAP_Y-1) + 1;
      var elem = map[x][y];

      if (map[x][y] == 0) {
        map[x][y] = 2;
      }
    });


    this.map = map;


  }

  Game.prototype.set = function(x,y,value) {
    this.map[x][y] = value;
  };

  return Game;
  // Game.prototype.

})();

var game = new Game(1);


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



ids = 0;

player = new Player(1, 2);

player.getPosition();

function nextId() {
  ids+=1;
  return ids;
}







players = {};
move_block = false;

var server = app.listen(port);
var io = require('socket.io').listen(server);

app.get('/', function (reseq, res) {
    res.render('index', { isProduction: isProduction })
});

io.sockets.on('connection', function (socket) {

  var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;

  socket.on('play',function() {
    players[socket.id] = { x: 0, y: 0 };
    socket.emit('play',socket.id,0,0);
    socket.emit('map',game.map);
    socket.broadcast.emit('join',{ id: socket.id, ip: ip })
  });

  socket.on('mc',function(x,y,type) {
    game.set(x,y,type);
    socket.broadcast.emit('mc',x,y,type)
  });

  socket.on('pm',function(x,y) {
    
    players[socket.id] = { x: x, y: y};

    if (!move_block) {
      // move_block = true;
      var _tmp_players = [];

      _.each(players,function(v,k) {
        _tmp_players.push(_.extend({ id: k },v));
      });

      socket.broadcast.emit('pm',_tmp_players);

      // setTimeout(function() {
      //   move_block = false;
      // },50);

    }
  }); // player move

  socket.on('disconnect', function() {
    delete players[socket.id];
    socket.broadcast.emit('leave',{ id: socket.id })
  });

});