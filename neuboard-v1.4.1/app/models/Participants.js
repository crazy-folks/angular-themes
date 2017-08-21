var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Process schema 
var ParticipantStructSchema = new Schema({
  userid: { type: String, required: true },
  categories: [{
    name: { type: String, required: true },
    participants: [{
      displayname: { type: String, required: true },
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
      fax: String,
      country: String,
      email: String,
      status: String,
      datestarted: { type: Date, default: Date.now },
      lasdtdateused: { type: Date },
      subscriberid: String, // id of the user that is logged in
      categoryid: String,
      notes: [{
        note: {type: String, required: true},
        time: {type: String, required: true}
      }]
    }]
  }]
});


module.exports = mongoose.model('Participants', ParticipantStructSchema);