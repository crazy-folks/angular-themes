var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt-nodejs');

// primary participant schema 
var primaryPart   = new Schema({
    cusid: { type: String, required: true},
   	processName: { type: String, required: true },
   	cusName: { type: String, required: true}
});

module.exports = mongoose.model('primaryPart', primaryPart);