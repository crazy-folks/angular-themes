var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;
var bcrypt 		     = require('bcrypt-nodejs');

// Vault Descriptor schema 
var fileCategorySchema   = new Schema({
	categoryName: { type: String, required: true},
    description: String,
    owner: String ,
    actiondatetime: {type:Date, default:Date.now},
    subscriberid: {type:String, required: true}
});

fileCategorySchema.index({categoryName:1, subscriberid:1}, {unique:true});
module.exports = mongoose.model('fileCategory', fileCategorySchema);