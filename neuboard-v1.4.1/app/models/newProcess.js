var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt-nodejs');

// Process schema 
var newProcess   = new Schema({
    userid: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    owner: { type: String, required: true },
    category: { type: String, required: true },
    effectivedate: { type:Date, default:Date.now},
    enddate: { type:Date, default:Date.now},
    status: String,
    sections: {type:Array, default:[]}
});

newProcess.index({category:1, name:1, userid:1}, {unique:true});

module.exports = mongoose.model('newProcess', newProcess);