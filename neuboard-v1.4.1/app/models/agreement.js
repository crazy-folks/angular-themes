var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AgreementSchema = new Schema({
    name: {type: String, required:true},
    description: String,
    scope: String,
    category: String,
    type: String,
    processid: String,
    vaultvalueid: String,
    vaultcategoryid: String,
    vaultsubcategoryid: String,
    readonlyaccess: String,
    getupdates: String,
    startdatetime: { type:Date, default:Date.now },
    enddatetime: { type:Date},
    sharesubscribers: { type: String }, //subscribers to share agreement with
    actiondatetime: { type:Date, default:Date.now },
    subscriberid: {type: String, required:true}, //unique index, id of user that is logged in
});

module.exports = mongoose.model('Agreement', AgreementSchema);