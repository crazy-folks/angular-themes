var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var processFormSchema = new Schema({
    User_id : {type: String, required: true},
    Process_id : {type: String,required: true },
    LogTime : {type:Date, default:Date.now },
    category: {type: String, required: true},
    feeds : [Schema.Types.Mixed]
}, {strict: false});

module.exports = mongoose.model('processData', processFormSchema);