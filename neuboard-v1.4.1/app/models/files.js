var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
  filename: { type: String },
  owner: { type: String },
  length: { type: Number },
  uploaddate: { type: Date, default: Date.now },
  metadata: {},
  file: { data: Buffer, contentType: String },
  vaultcategoryid: String,
  shareid: String
});

module.exports = mongoose.model('Files', FileSchema);