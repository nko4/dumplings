// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('WfsRuxlWWBoW0L63');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON;


// mongodb://nko:nko@paulo.mongohq.com:10006/nko


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

var globalDb = null;
globalUri = 'mongodb://nko:nko@paulo.mongohq.com:10006/nko';

MongoClient.connect(globalUri, function(err, db) {
  if(err) throw err;
  db.collection('stats').update({ stats: 'here'}, {$set: {hi: 'there'}}, {w:1}, function(err) {
    if (err) console.warn(err.message);
    else console.log('successfully updated');
  });
});


var Game;

Game = (function() {
  function Game (argument) {

    map = [];

    // 0 - space
    // 1 - wall
    // 2 - brick
    // 3 - power

    MAP_X = 44;
    MAP_Y = 30;

    // MAP_X = 24;
    // MAP_Y = 13;

    this.MAP_X = MAP_X;
    this.MAP_Y = MAP_Y;

    this.brickCount = 0;
    this.wallCount = 0;
    this.powerCount = 0;
    this.maxCount = MAP_X*MAP_Y;


    for (var x = MAP_X; x >= 0; x--) {
      map[x] = [];
      for (var y = MAP_Y; y >= 0; y--) {
        map[x].push(0);
      };
    };

    _.times(MAP_X, function (x) { map[x][0] = 1;      this.wallCount += 1; });
    _.times(MAP_X, function (x) { map[x][MAP_Y] = 1;  this.wallCount += 1; });
    _.times(MAP_Y, function (y) { map[0][y] = 1;      this.wallCount += 1; });
    _.times(MAP_Y, function (y) { map[MAP_X][y] = 1;  this.wallCount += 1; });
    _.times(MAP_X, function (n) {
      if (!n) return;
      if (n % 2) return;
      if (n === MAP_X - 1) return;
      
      _.times(MAP_Y, function (m) {
        if (!m) return;
        if (m % 2) return;
        if (m === MAP_Y - 1) return;

        map[n][m] = 1;
        this.wallCount += 1;
                    
      });
    });

    map[MAP_X][MAP_Y] = 1; //hack :)
    this.wallCount += 1;
    this.maxCount -= this.wallCount;
    
    _.times(parseInt(MAP_X*MAP_Y*0.50),function() {
      var x = Math.floor(Math.random() * MAP_X-1) + 1;
      var y = Math.floor(Math.random() * MAP_Y-1) + 1;
      var elem = map[x][y];

      if (map[x][y] == 0) {
        map[x][y] = 2;
        this.brickCount += 1;
      }
    });

    _.times(parseInt(MAP_X*MAP_Y*0.05),function() {
      var x = Math.floor(Math.random() * MAP_X-1) + 1;
      var y = Math.floor(Math.random() * MAP_Y-1) + 1;
      var elem = map[x][y];

      if (map[x][y] == 0) {
        map[x][y] = 3;
        this.powerCount += 1;
      }
    });

    this.map = map;
    this.players = {};
    this.nextId = 0;

  }

  Game.prototype.randNewBrick = function() {
    if ( this.brickCount < (this.maxCount/2) ) {
      
      var x = Math.floor(Math.random() * this.MAP_X-1) + 1;
      var y = Math.floor(Math.random() * this.MAP_Y-1) + 1;
      var elem = map[x][y];

      if (map[x][y] == 0) {
        map[x][y] = 2;
        this.brickCount += 1;
        return [x,y];
      }

    }

    return false;
  }


  Game.prototype.randNewPower = function() {
    if ( this.powerCount < (this.maxCount/5) ) {
      
      var x = Math.floor(Math.random() * this.MAP_X-1) + 1;
      var y = Math.floor(Math.random() * this.MAP_Y-1) + 1;
      var elem = map[x][y];

      if (map[x][y] == 0) {
        map[x][y] = 3;
        this.powerCount += 1;
        return [x,y];
      }

    }

    return false;
  }


  Game.prototype.set = function(x,y,value) {
    
    if (this.map[x][y] == 2) {
      this.brickCount -= 1;
    }

    if (this.map[x][y] == 3) {
      this.powerCount -= 1;
    }

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

move_block = false;

var server = app.listen(port);
var io = require('socket.io').listen(server);

if (isProduction) {
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging

  // enable all transports (optional if you want flashsocket support, please note that some hosting
  // providers do not allow you to create servers that listen on a port different than 80 or their
  // default port)
  io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
}

app.get('/', function (reseq, res) {
    res.render('index', { isProduction: isProduction })
});

io.sockets.on('connection', function (socket) {

  var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;

  socket.on('play',function() {
    game.players[socket.id] = { x: 0, y: 0 };
    socket.emit('play',socket.id,0,0);
    socket.emit('map',game.map);
    socket.broadcast.emit('join',{ id: socket.id, ip: ip })
  });

  socket.on('mc',function(x,y,type) {
    game.set(x,y,type);
    socket.broadcast.emit('mc',x,y,type)
  });

  socket.on('kill',function(id) {
    delete game.players[id];
    socket.broadcast.emit('killed',{ id: id, by_id: socket.id })
  })

  socket.on('pm',function(x,y) {
    
    game.players[socket.id] = { x: x, y: y};

    if (!move_block) {
      // move_block = true;
      var _tmp_players = [];

      _.each(game.players,function(v,k) {
        _tmp_players.push(_.extend({ id: k },v));
      });

      socket.broadcast.emit('pm',_tmp_players);

      // setTimeout(function() {
      //   move_block = false;
      // },50);

    }
  }); // player move

  socket.on('disconnect', function() {
    delete game.players[socket.id];
    socket.broadcast.emit('leave',{ id: socket.id })
  });

});

setInterval(function() {

  var new_brick = game.randNewBrick();


  if (new_brick) {
    io.sockets.emit('mc',new_brick[0],new_brick[1],2); 
  }

  var new_brick = game.randNewPower();


  if (new_brick) {
    io.sockets.emit('mc',new_brick[0],new_brick[1],3); 
  }


},1000 * 5);





