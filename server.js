// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('WfsRuxlWWBoW0L63');

'use strict';

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

var mongojs = require('mongojs');
var db = mongojs("mongodb://nko:nko@paulo.mongohq.com:10006/nko",["statistics","players"]);

var ejs = require('ejs');
var express = require('express');
var _ = require('underscore');
var app = express();
var config = {};


function incStats(name) {
  var _inc = {}; _inc[name] = 1;
  db.statistics.update({_id:"main"},{ $inc: _inc },{upsert:true})
}


incStats('server_starts');

app.configure(function (){
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

var globalUri = 'mongodb://nko:nko@paulo.mongohq.com:10006/nko';



var Game = (function () {

  Game.SPACE = 0;
  Game.WALL = 1;
  Game.BRICK = 2;
  Game.MIXTURE = 3;

  Game.REVIVAL_BRICK = 5000; // 5s
  Game.REVIVAL_MIXTURE = 10000; // 10s

  function Game (max_x, max_y) {
    var self = this;

    this.map = [];

    var MAP_X = this.MAP_X = max_x;
    var MAP_Y = this.MAP_Y = max_y;

    this.brickCount = 0;
    this.wallCount = 0;
    this.powerCount = 0;
    this.maxCount = MAP_X * MAP_Y;
    this.players = {};
    this.uuids_params = {};
    this.uuids = {};

    for (var x = MAP_X; x >= 0; x--) {
      this.map[x] = [];
      for (var y = MAP_Y; y >= 0; y--) {
        this.map[x].push(0);
      }
    }

    _.times(MAP_X, function (x) { self.map[x][0]      = Game.WALL;  self.wallCount += 1; });
    _.times(MAP_X, function (x) { self.map[x][MAP_Y]  = Game.WALL;  self.wallCount += 1; });
    _.times(MAP_Y, function (y) { self.map[0][y]      = Game.WALL;  self.wallCount += 1; });
    _.times(MAP_Y, function (y) { self.map[MAP_X][y]  = Game.WALL;  self.wallCount += 1; });
    _.times(MAP_X, function (n) {
      if (!n) return;
      if (n % 2) return;
      if (n === MAP_X - 1) return;
      
      _.times(MAP_Y, function (m) {
        if (!m) return;
        if (m % 2) return;
        if (m === MAP_Y - 1) return;

        self.map[n][m] = Game.WALL;
        self.wallCount += 1;
      });
    });

    this.map[MAP_X][MAP_Y] = 1; // hack :) - brawo Kamil!

    this.wallCount += 1;
    this.maxCount -= this.wallCount;
    
    _.times(parseInt(MAP_X * MAP_Y * 0.20), function () {

      var x = Math.floor(Math.random() * MAP_X-1) + 1;
      var y = Math.floor(Math.random() * MAP_Y-1) + 1;

      if (self.map[x][y] == 0) {
        self.map[x][y] = Game.BRICK;
        self.brickCount += 1;
      }
    });
  }

  Game.prototype.randNewBrick = function () {
    if ( this.brickCount < (this.maxCount/2) ) {
      var x = Math.floor(Math.random() * this.MAP_X-1) + 1;
      var y = Math.floor(Math.random() * this.MAP_Y-1) + 1;

      if (this.map[x][y] == 0) {
        this.map[x][y] = Game.BRICK;
        this.brickCount += 1;
        return [x, y];
      }
    }
    return false;
  };


  Game.prototype.getPlayer = function (uuid,cb) {

    db.players.findOne({
      uuid:uuid
    }, function (err, doc) {
      cb(doc)
    });

  }

  Game.prototype.randNewMixture = function () {
    if ( this.powerCount < (this.maxCount/5) ) {
      var x = Math.floor(Math.random() * this.MAP_X-1) + 1;
      var y = Math.floor(Math.random() * this.MAP_Y-1) + 1;

      if (this.map[x][y] == 0) {
        this.map[x][y] = Game.MIXTURE;
        this.powerCount += 1;
        return [x, y];
      }
    }
    return false;
  };

  Game.prototype.set = function (x,y,value) {
    if (this.map[x][y] == Game.BRICK) {
      this.brickCount -= 1;
    }

    if (this.map[x][y] == Game.MIXTURE) {
      this.powerCount -= 1;
    }

    this.map[x][y] = value;
  };

  Game.prototype.setId = function ( uuid, socket_id ) {
    this.uuids[uuid] = socket_id;
  };

  Game.prototype.getSocketIdBy = function ( socket_id ) {
    return _.invert(this.uuids)[socket_id];
  };

  Game.prototype.getEmptyTile = function () {
    var emptyTiles = [];
    _.each(this.map, function (column, x) {
      _.each(column, function (tile, y) {
        if (!tile) {
          emptyTiles.push({ x: x, y: y });
        }
      });
    });
    return emptyTiles[_.random(0, emptyTiles.length - 1)];
  };

  return Game;
})();

var game = new Game(44, 30);

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


function updatePlayer(uuid, settings) {

  console.log("update player "+uuid)

  db.players.update(
    { uuid: uuid }, // first
    { $set: settings } ,
    { upsert: true }
  );
}


io.sockets.on('connection', function (socket) {
  var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;

  socket.on('update', function (uuid,settings) {
    updatePlayer(uuid,settings)
  });

  socket.on('say', function (uuid,message) {
    game.getPlayer(uuid, function (player) {
        socket.broadcast.emit('log', '<em>' + player.name + '</em>: ' +  message);
    });
  });

  socket.on('play', function (uuid, settings) {

    if (_.isEmpty(settings)) {

      game.getPlayer(uuid, function (player) {
        socket.broadcast.emit('join',{ id: socket.id, ip: ip, name: player.name });

        socket.emit('info','Welcome <em>' + player.name + '</em>');
        socket.broadcast.emit('info','Player <em>' + player.name + '</em> joined from <img src="http://www.geojoe.co.uk/api/flag/?ip=' + ip + '" alt="-" />')
      });

    } else {
        socket.broadcast.emit('join',{ id: socket.id, ip: ip, name: settings.name });

        socket.emit('info','Welcome <em>' + settings.name + '</em>');
        socket.broadcast.emit('info','Player <em>' + settings.name + '</em> joined from <img src="http://www.geojoe.co.uk/api/flag/?ip=' + ip + '" alt="-" />')


        updatePlayer(uuid, _.extend(
          {
            ip: ip,
            joined: new Date()
          
          },settings)
        );
    }

    socket.emit('map',game.map);

    game.players[socket.id] = { x: 0, y: 0 };
    

    var emptyTile = game.getEmptyTile();
    socket.emit('play', socket.id, emptyTile.x, emptyTile.y);
    

    incStats('players_joins');

    game.setId(uuid,socket.id);
    
  });

  socket.on('mc', function (x,y,type) {
    game.set(x,y,type);
    socket.broadcast.emit('mc',x,y,type);
    if (type == Game.BRICK) {
      incStats('bombs');
    }
  });

  socket.on('kill', function (id) {
    delete game.players[id];
    socket.broadcast.emit('killed',{ id: id, by_id: socket.id });
    incStats('players_kills')
  });

  socket.on('pm', function (x, y) {
    game.players[socket.id] = { x: x, y: y };
    var temp_players = [];

    _.each(game.players, function (v, k) {
      temp_players.push(_.extend({ id: k }, v));
    });

    socket.broadcast.emit('pm', temp_players);
  }); // player move

  socket.on('disconnect', function () {
    delete game.players[socket.id];

    game.getPlayer(game.getSocketIdBy(socket.id), function (player) {
      socket.broadcast.emit('leave',{ id: socket.id });
      if (player && player.name) {
        socket.broadcast.emit('info','<em>'+player.name+'</em> leave');
      }
    });   

  });


});

setInterval(function () {
  var new_brick = game.randNewBrick();

  if (new_brick) {
    io.sockets.emit('mc', new_brick[0], new_brick[1], Game.BRICK);
    incStats('bricks');
  }
}, Game.REVIVAL_BRICK);

setInterval(function () {
  var new_mixture = game.randNewMixture();

  // build ne brick
  if (new_mixture) {
    io.sockets.emit('mc', new_mixture[0], new_mixture[1], Game.MIXTURE);
    incStats('powerups');
  }
}, Game.REVIVAL_MIXTURE);

