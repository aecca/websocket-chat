var express = require('express');
var path = require('path');
var config = require('./config');

var logger = require('morgan');
var bodyParser = require('body-parser');

var errorHandler = require('errorhandler');
var http = require('http');
var io = require('./socket');


var routes = require('./routes/routes');
var app = express();
var server = http.createServer(app);

// Set port
app.set('port', config.port );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);


// error handling middleware should be loaded after the loading the routes
if ('development' == config.env ) {
  app.use(errorHandler());
}

// Socket IO Attach to server
io.attach(server);



// Server Listener
server.listen(config.port);
server.on('listening', function(){
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});
