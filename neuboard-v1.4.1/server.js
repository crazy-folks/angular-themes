// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path       = require('path');
var busboy     = require('connect-busboy');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database, { keepAlive: 1 });

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

app.get('/newUser', function (req, res, next) {
	res.status(200).sendFile(path.join(__dirname + '/public/external/newUser.html'));
});

app.get('/dashboard', function (req, res, next) {
	res.status(200).sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// ROUTES FOR OUR API =================
// ====================================

//var code = require('./app/models/code.js');
//var newCode = new code();
//newCode.code = "XYZ123";
//newCode.role = ["dev"];
//newCode.save(function(err) {});

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express, mongoose);

app.use('/api', apiRoutes);


// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
// app.get('*', function(req, res) {
app.get('/', function(req, res) {
	res.status(200).sendFile(path.join(__dirname + '/public/external/index.html'));
});

app.get('*', function(req, res) {
	// res.sendFile(path.join(__dirname + '/dashboard.html'));
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
	
});


var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sockets = require('./app/routes/socket.js')(io, server);


// Test

// START THE SERVER
// ====================================
server.listen(config.port);
console.log('The server is at port ' + config.port);
