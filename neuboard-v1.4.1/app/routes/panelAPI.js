var PanelSchema = require('../models/panel.js');

module.exports = function (api) {
	api.route('/panel/')
	
	//---------------------------------------------------------------
	//create panel
	.post(function(req, res) {
		var panel = new PanelSchema();

		panel.name = req.body.name;
		panel.filePath = req.body.filePath;
		
		panel.save(function (err) {
			if(err) {//todo check dup entry
				//duplicate entry
				PanelSchema.find({name: req.body.name}, function(err, panel) {
					if (panel[0] != null) {
						return res.json({ success: false, message: 'This panels already exists'});
					}
				});
				if(err.code ==11000) {
					return res.json({ success: false, message: 'This panel already exists'});
				} else {
					return res.send(err);
				}
			}
			
			res.json({ message: 'Panel created' });
		});	
	
	})
	
	//---------------------------------------------------------------
	//get panels
	.get(function (req, res) {
		
		PanelSchema.find({}, function (err, panels) {
		    if (err) res.send(err);

		    // return the panels
		    res.json(panels);
		 });
	});

	//======================================
	api.route('/panel/:name')

	//---------------------------------------------------------------
	//get panel by name
	.get(function (req, res) {
		
		PanelSchema.find({name: req.params.name}, function (err, panel) {
		    if (err) res.send(err);

		    // return that panel
		    res.json(panel);
		 });
	})
	
	//---------------------------------------------------------------
	//update panel
	.put(function (req, res) {

		PanelSchema.find({name: req.params.name}, function (err, foundPanel) {
			// var panel = new PanelSchema();
			var panel = foundPanel[0];

			if(err) { 
				return res.send(err);
			} else {

				if (req.body.filePath) panel.filePath = req.body.filePath;

				panel.save(function (err) {
					if(err) {
						return res.json(err);
					} 

					return res.json({ message: 'Panel updated' });	
					
				})
			}
		
		});
	
	})
	
	//---------------------------------------------------------------
	//delete panel
	.delete(function (req, res) {
		PanelSchema.remove({ name: req.params.name }, function (err, panel) {
			if (err) {
				res.send(err);
			} else {
				res.json({ message: 'Successfully deleted panel' });
			}
		});
		
	});
	
};
	