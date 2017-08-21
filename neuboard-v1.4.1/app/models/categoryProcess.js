var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt-nodejs');
var primaryPart = require('./primaryPart.js');

// Process schema 
var categoryProcess   = new Schema({
    userid: { type: String, required: true },
   	category: { type: Array, default:[] },
   	priParts: {type: Array, default:[]},
   	owner: { type: String, required: true },
});


module.exports = mongoose.model('categoryProcess', categoryProcess);