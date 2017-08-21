var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// notification schema 
var NotificationMessage   = new Schema({
	msg: { type: String, required: true },
	unread: { type: Boolean },
	email: {type:String }  
});

module.exports = mongoose.model('NotifyMessage', NotificationMessage);