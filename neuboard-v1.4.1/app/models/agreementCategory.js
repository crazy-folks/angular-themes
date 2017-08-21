var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AgreementCategorySchema = new Schema({
    name: String, // the name of category of filename
    description: String,
    category: String,
    vaultcategoryid: String,
    readonlyaccess: String,
    getupdates: String,
    startdatetime: { type:Date, default:Date.now },
    enddatetime: { type:Date},
    shareName: { type: String }, //subscribers to share agreement with
    myName: String,
    email: String,
    actiondatetime: { type:Date, default:Date.now },
    subscriberid: String, //unique index, id of user that is logged in
    sharesubscribers: String,
    fileid: String,
    processcatid: {type:String},
    confirmStatus: {type:String, default:"To Be Agreed"}
});

AgreementCategorySchema.index({fileid:1, sharesubscribers:1}, {unique:true});
AgreementCategorySchema.index({name:1, sharesubscribers:1}, {unique:true});
AgreementCategorySchema.index({processcatid:1, email:1, subscriberid:1}, {unique:true});

module.exports = mongoose.model('AgreementCategory', AgreementCategorySchema);