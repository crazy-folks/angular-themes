var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// notification schema 
var NotifyMsg   = new Schema({
	msg: { type: String, required: true },
	userid: { type: String, required: true },
	name: { type: String },
	linktype: { type: String },
  link: { type: String },
	time: { type: String },
	unread: { type: Boolean }
});

module.exports = mongoose.model('NotifyMsg', NotifyMsg);
