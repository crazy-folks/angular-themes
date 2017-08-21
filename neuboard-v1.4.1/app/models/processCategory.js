var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt-nodejs');
var Section      = require('./section.js');

// Process schema 
var processCategory   = new Schema({
    userid: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    source: String,
    owner: String,
    effectivedate: { type:Date, default:Date.now},
    enddate: { type:Date, default:Date.now},
    type: {type: Number},
    status: String,
    completionrate: {type: Number},
    sections: [Section.schema]
});

processCategory.index({userid:1, name:1, category:1 }, {unique:true});

module.exports = mongoose.model('Processes', processCategory);
