var Msg = require('../models/chatmsg.js');
var User = require('../models/chatUser.js');

module.exports = function (api) {
  
  api.route('/chat/:user_id')

	// get the user with that id
	.get(function (req, res) {
	  var ret = [];
    User.findOne()
    .where('userid').equals(req.params.user_id)
    .populate('msgs')
    .exec(function (err, user) {
	    if (err) return res.send(err);

	    // return that user if it exists
	    if (user && user.msgs) {
	      res.json(user.msgs);
	    } else {
	      res.json([]);
	    }
	  });
	  	// Returns any message to or from user_id:
	  	//.or([{ 'guid': req.params.user_id }, { 'to_id': { $in: [req.params.user_id] } }])
		//.select('msgs')
		

	})

  api.route('/chat')

	// post chat message (accessed at POST http://localhost:8080/api/chat)
	.post(function (req, res) {

	  // Create new message object from schema
	  var newMsg = new Msg();
	  newMsg.name = req.body.name;
	  newMsg.msg = req.body.msg;
	  newMsg.to_id = req.body.to_id;
	  newMsg.guid = req.body.guid;
	  newMsg.time = req.body.time;
	  newMsg.unread = req.body.unread;

	  var recipients = newMsg.to_id.slice();
	  recipients.push(newMsg.guid);
	  newMsg.save(function (err, newMsg) {
	    recipients.forEach(function (id, idx) {

	      User.findOne({ userid: id }).exec(function (err, user) {
	        if (err) { return console.log(err); }
	        // Mark senders copy as read
	        if (id === newMsg.guid) newMsg.unread = false;

	        if (user === null) {
	          // New ChatUser:
	          user = new User();
	          user.userid = id;
	        }
	        // Found user:

	        user.msgs.push(newMsg._id);
	        user.save(function (err) {
	          if (err) {
	            return console.log(JSON.stringify(err));
	          }

	          if (idx == (recipients.length - 1)) {
	            // Send response
	            res.json({ message: 'Message sent' });
	          }
	        });
	      });

	    });
	  });
	  
	  
	});
}