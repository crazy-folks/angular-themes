var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ChatMsg = require('./chatmsg.js');

var ChatUser = new Schema({
  userid: { type: String, required: true },
  msgs: [{ type: Schema.ObjectId, ref: 'ChatMsg' }]
});

module.exports = mongoose.model('ChatUser', ChatUser);