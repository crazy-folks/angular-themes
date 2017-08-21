var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;
var bcrypt 		     = require('bcrypt-nodejs');
var VaultValueSchema = require('./vaultValue.js');

// Vault Descriptor schema 
var DescriptorSchema   = new Schema({
	name: { type: String, required: true},
    description: String,
    desctype: {type: Number},
    actiondatetime: {type:Date, default:Date.now},
    descstatus: String,
    subscriberid: String,
    categoryid: String,
    //subcategoryid: String,
    vaultvalues: [VaultValueSchema.schema]
   
});

DescriptorSchema.index({name:1, subscriberid:1, vaultvalues:1}, {unique:true});
module.exports = mongoose.model('Descriptor', DescriptorSchema);