var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var RoleSchema = new Schema({
  id: { type: String, index: { unique: true } },
  name: { type: String, require: true },
  description: { type: String, require: true },
  effectiveDate: { type: Date, require: true },
  endDate: { type: Date, require: true },
  modules: [{
    name: {type: String, require: true},
    access: {type: Array, default: []}
  }],
  dashboardSections: { type: Array, default:[] },
  processID: { type: String, require: true }
  
});

module.exports = mongoose.model('Role', RoleSchema);