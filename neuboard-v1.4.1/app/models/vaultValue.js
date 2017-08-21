var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// Vault Descriptor schema 
var VaultValueSchema   = new Schema({
	value: { type: String, required: true},
    type: {type: String, required: true},
    actiondatetime: {type:Date, default:Date.now},
    effectivedatetime: {type:Date, default:Date.now},
    status: String,
    subscriberid: String,
    descriptorid: String
});

module.exports = mongoose.model('VaultValue', VaultValueSchema);