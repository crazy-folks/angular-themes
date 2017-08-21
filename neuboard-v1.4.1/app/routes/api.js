var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var acl				 = require('acl');	// Access Control List

module.exports = function(app, express, mongoose) {

  var apiRouter = express.Router();
	var ACL = new acl(new acl.memoryBackend());//new acl.mongodbBackend(mongoose.connection.db, 'acl_', true));

	var ACL_API = require('./ACL.js')(apiRouter, ACL);
  var adminAPI = require('./adminAPI.js')(apiRouter);
	var authAPI = require('./authAPI.js')(apiRouter, ACL);
  var codeAPI = require('./codeAPI.js')(apiRouter);
	var processAPI = require('./processAPI.js')(apiRouter);
  var eventAPI = require('./eventAPI.js')(apiRouter);
  var userAPI = require('./userAPI.js')(apiRouter);
  var categoryAPI = require('./categoryAPI.js')(apiRouter);
  var chatAPI = require('./chatAPI.js')(apiRouter);
  var participantAPI = require('./participantapi.js')(apiRouter);
  var vaultAPI = require('./vaultAPI.js')(apiRouter);
  var roleAPI = require('./roleAPI.js')(apiRouter);
  var panelAPI = require('./panelAPI.js')(apiRouter);
  var fileAPI = require('./fileAPI.js')(apiRouter);
  var agreementAPI = require('./agreementAPI.js')(apiRouter);
  var agreementCategoryAPI = require('./agreementCategoryAPI.js')(apiRouter);
  var newProcessAPI = require('./newProcessAPI.js')(apiRouter);
  var newFormFillAPI = require('./newFormFillAPI.js')(apiRouter);
	// route to generate sample user
	//apiRouter.post('/sample', function(req, res) {
  //
	//	// look for the user named chris
	//	User.findOne({ 'username': 'chris' }, function(err, user) {
  //
	//		// if there is no chris user, create one
	//		if (!user) {
	//			var sampleUser = new User();
  //
	//			sampleUser.name = 'Chris';
	//			sampleUser.username = 'chris';
	//			sampleUser.password = 'supersecret';
  //
	//			sampleUser.save();
	//		} else {
	//			console.log(user);
  //
	//			// if there is a chris, update his password
	//			user.password = 'supersecret';
	//			user.save();
	//		}
  //
	//	});
  //
	//});
	//
	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	//apiRouter.get('/', function(req, res) {
	//	res.json({ message: 'Hooray! Welcome to our api!' });
	//});

	return apiRouter;
};

