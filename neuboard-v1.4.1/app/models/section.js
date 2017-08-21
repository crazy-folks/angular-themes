var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// Section schema 
var SectionSchema   = new Schema({
	name: { type: String, required: true },
    description: String,
    type: {type: Number},
    duration: {type: Number},
    owner: String,
    effectivedate: {type:Date, default:Date.now},
    enddate: {type:Date, default:Date.now},
    actiondate: {type:Date, default:Date.now},
    escalationID: String,
    approvalFlag: String,
    status: String,
    subscriberid: String,
    items: [{label: String, value: String, valuetype: String }],
    participants: [{participantname: String, ParUserid: String}]

});

module.exports = mongoose.model('Section', SectionSchema);