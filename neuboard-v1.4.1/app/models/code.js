var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema
var Code = new Schema({
  code: { type: String, required: true },
  role: [
    { type: String, required: true }
  ]
});

module.exports = mongoose.model('Code', Code);
