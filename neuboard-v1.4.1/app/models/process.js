var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');
var Section      = require('./section.js');

// Process schema 
var ProcessSchema   = new Schema({
	userid: { type: String, required: true },
    category: { type: String, required: true },
    processes: [{
        name: { type: String, required: true },
        description: String,
        source: String,
        owner: String,
        effectivedate: { type:Date, default:Date.now},
        enddate: { type:Date, default:Date.now},
        type: {type: Number},
        status: String,
        completionrate: {type: Number},
        subscriberid: String,
        sections: [Section.schema]
    }]
});

ProcessSchema.index( {name: 1, subscriberid: 1}, { unique: true } );

module.exports = mongoose.model('Process', ProcessSchema);

