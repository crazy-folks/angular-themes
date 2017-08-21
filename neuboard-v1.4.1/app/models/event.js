var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema 
var EventItem = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  attendees: { type: Array, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  readonly: { type: Boolean, value: true },
  allowretain: { type: Boolean, value: true },
  getupdates: { type: Boolean, value: true }
});

module.exports = mongoose.model('EventItem', EventItem);