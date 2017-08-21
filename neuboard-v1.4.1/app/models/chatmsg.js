var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var ChatMsg   = new Schema({
	name: { type: String, required: true },
	msg: { type: String, required: true },
	to_id: { type: Array, required: true },
	guid: { type: String, required: true },
	time: { type: String, required: true },
	unread: { type: Boolean }
});

module.exports = mongoose.model('ChatMsg', ChatMsg);
