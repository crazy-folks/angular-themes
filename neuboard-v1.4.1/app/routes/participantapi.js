// add participant model
var ParticipantStruct = require('../models/Participants.js');
var User = require('../models/user');

module.exports = function (api) {

  //	on routes that end in /participant/:participant_id

  api.route('/participant/:participant_id')

		// get the user with that id
		.get(function (req, res) {
		  var result = [];
		  ParticipantStruct.findOne()
        .where('userid').equals(req.params.participant_id)
		    .exec(function (err, participant) {
		      if (err) {
		        res.send(err);
		        return;
		      } else if (participant == null) { // New user, create defaults, save and return
		        participant = new ParticipantStruct();
		        participant.userid = req.params.participant_id;
		        participant.categories = [
            { name: "Family", participants: [] },
            { name: "Friends", participants: [] },
            { name: "Work", participants: [] }];
		        participant.save(function (err, data) {
		          if (err) {
		            console.log('Error creating new user participant structure: ' + err);
		            console.log('Participant struct: ' + JSON.stringify(participant));
		            res.send(err);
		          } else {
		            res.send(participant.categories);
		          }
		        });
		      } else {
		        res.send(participant.categories);
		      }

		    });
		})

	//	update the participant with this id
		.put(function (req, res) {
		  ParticipantStruct.findOne()
      .where('userid').equals(req.params.participant_id)
      .exec(function (err, participant) {
        if (err) console.log(err);

        if (participant != null) {
          participant.categories = req.body;
          // save the participant
          participant.save(function (err) {
            if (err) console.log(err);

            // return a message
            res.json({ message: 'Participant updated!' });
          });
        }
      });
		})


		// delete the participant with this id
		.delete(function (req, res) {
		  Participant.remove({ _id: req.params.participant_id }, function (err) {
		    if (!err) {
		      console.log('Successful deletion.');
		      res.json({ message: 'Deleted Category' });
		    }
		    else {
		      console.log('Error in deletion: ' + JSON.stringify(err));
		      res.json({ message: 'Error deleting Category' });
		    }
		  });
		});


  api.route('/participant/users/:user_id')

  .get(function (req, res) {
    ParticipantStruct.findOne()
      .where('userid').equals(req.params.user_id)
      .select('categories.participants.email')
      .exec(function (err, user) {
        if (err) res.send(err);
        var emails = [];

        if (user && user.categories && user.categories != null) {
          user.categories.forEach(function (cat) {
            cat.participants.forEach(function (item) {
              if (item.email) emails.push(item.email);
            });
          });
        }
        User.find().where('email').in(emails)
		      .exec(function (err, users) {

		        if (err) res.send(err);
		        else res.send(users);
		      });
      });

  });

  api.route('/participant/usercheck/:email')
  .get(function (req, res) {
    User.findOne()
    .where('email').equals(req.params.email)
    .select('_id')
    .exec(function (err, id) {
      if (err) res.send(err);
      res.send(id);
    })
  });

  api.route('/participant/emailcheck/:email')
  .get(function (req, res) {
    User.findOne()
    .where('email').equals(req.params.email)
    .select('_id name avatar email')
    .exec(function (err, id) {
      if (err) res.send(err);
      res.send(id);
    })
  });

  // Nguyen's function to return all participant of the this userid
  api.route('/participants/:user_id')
  .get(function (req, res) {
    ParticipantStruct.find({'userid': req.params.user_id})
    .select('categories')
    .exec(function (err, part) {
      if (err) res.send(err);
      res.send(part);
    })
  });

  api.route('/addNewPartProcess/:user_id/:email/:name/:id')
  .get(function (req, res) {
    //console.log(req.params.user_id);
    ParticipantStruct.findOne({'userid': req.params.user_id}, function (err, result){
       if (err) { console.log(err) };
       if(result) {
        //console.log(result);
         // TODO: Fix error here: Probably shouldn't used hardcoded array element 3...
          if (result.categories[2] && result.categories[2].participants.length == 0 && result.categories[2].name == 'Work') {
              var msg = "Adding your lender " + req.params.name + " to work category in participant. Check back shortly to see";
              var newPart = {
                "displayname": req.params.name,
                "email": req.params.email,
                "subscriberid": req.params.id,
                "address": "",
                "city": "",
                "state": "",
                "zip": "",
                "country": "",
                "phone": "",
                "fax": "",
                "notes": []
              }

              // console.log(newPart);
              // add to work category
              ParticipantStruct.update(
                  {'userid' : req.params.user_id},
                  {$push: {
                  'categories.2.participants': newPart
                  }}
                )
                .exec(function(err, des) {
                if (err) res.send({type:"info", message: "Fail to add a new participant"});
                res.send({type:"success", message: msg });
              });
          } else {
            res.json({type:"info", message: "No need to add participant"});
          }
       }
    })
    
  });
  // end Nguyen's function

};