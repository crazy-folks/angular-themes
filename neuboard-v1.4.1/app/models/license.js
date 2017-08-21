var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Code = require('./code.js');
var User = require('./user.js');

var License = new Schema({
  owner: { type: Schema.ObjectId, ref: 'User' },
  code: { type: Schema.ObjectId, ref: 'Code' },
  role: { type: String, required: true },
  codes: [{
    role: String
  }]
});

module.exports = mongoose.model('License', License);