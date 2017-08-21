// Events API and Routing

var EventMgr = require('../models/event');

module.exports = function (api) {
  api.route('/event')

	// create an event (accessed at POST http://localhost:8080/api/event)
	.post(function (req, res) {

	  var myEvent = new EventMgr();		// create a new instance of the event model
	  myEvent.title = req.body.eventTitle;
	  myEvent.date = req.body.eventDate || null;
	  myEvent.attendees = req.body.eventAttendees || [];
	  myEvent.description = req.body.eventDescription || null;
	  myEvent.time = req.body.eventTime || "";
	  myEvent.readonly = req.body.eventReadOnly;
	  myEvent.allowretain = req.body.eventAllowRetain;
	  myEvent.getupdates = req.body.eventGetUpdates;

	  myEvent.save(function (err) {
	    if (err) {
	      console.log(err);
	      return res.send(err);
	    }
	    // return a message
	    res.json({ message: 'Event created!' });
	  });

	})
  
  .get(function (req, res) {

    EventMgr.find({}, function (err, events) {
      if (err) res.send(err);

      // return the events
      res.json(events);
    });
  });
};