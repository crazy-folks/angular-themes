var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Lender Check Code schema 
// check if user already send code to a particular borrower

var LenderCodeCheckSchema   = new Schema({
	lenderid: {type: String, required: true},
    partemail: {type: String, required: true},
    actiondatetime: { type:Date, default:Date.now},  
});

LenderCodeCheckSchema.index({lenderid:1, partemail:1}, {unique:true});
module.exports = mongoose.model('LenderCode', LenderCodeCheckSchema);