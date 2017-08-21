var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// Vault schema 

var CategorySchema   = new Schema({
	name: { type: String, required: true},
    description: String,
    actiondatetime: { type:Date, default:Date.now},
    effectivedatetime: { type:Date, default:Date.now},
    subscriberid: {type: String, required:true},

    //type: {type: Number, min: 1, max:2}, 
    //CategoryActivity: String,
    //subCategory: { type : Array , "default" : []}, 
    //status: {type: String, "default" : "main" },
    
});

CategorySchema.index({name:1, subscriberid:1}, {unique:true});



module.exports = mongoose.model('Category', CategorySchema);