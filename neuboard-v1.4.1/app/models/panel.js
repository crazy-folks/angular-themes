var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var PanelSchema = new Schema({
  name: { type: String, require: true },
  filePath: { type: String, require: true },  
});

module.exports = mongoose.model('Panels', PanelSchema);