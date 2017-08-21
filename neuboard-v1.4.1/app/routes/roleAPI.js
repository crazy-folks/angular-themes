var RoleSchema = require('../models/userRole.js');

module.exports = function (api) {
	api.route('/roles/')
	
	//---------------------------------------------------------------
	//create role
	.post(function(req, res) {
		var role = new RoleSchema();
		
		role.name = req.body.name;
		role.description = req.body.description;
		role.effectiveDate = req.body.effectiveDate;
		role.endDate = req.body.endDate;
		role.modules = req.body.modules;
		role.dashboardSections = req.body.dashboardSections;
		
		role.save(function (err) {
			if(err) {//todo check dup entry
				//duplicate entry
				RoleSchema.find({name: req.body.name}, function(err, role) {
					if (role[0] != null) {
						return res.json({ success: false, message: 'This roles already exists'});
					}
				});
				if(err.code ==11000) {
					return res.json({ success: false, message: 'This role already exists'});
				} else {
					return res.send(err);
				}
			}
			
			res.json({ message: 'Role created' });
		});	
	
	})
	
	//---------------------------------------------------------------
	//get roles
	.get(function (req, res) {
		
		RoleSchema.find({}, function (err, roles) {
		    if (err) res.send(err);

		    // return the roles
		    res.json(roles);
		 });
	});

	//======================================
	api.route('/roles/:name')

	//---------------------------------------------------------------
	//get role by name
	.get(function (req, res) {
		
		RoleSchema.find({name: req.params.name}, function (err, role) {
		    if (err) res.send(err);

		    // return that role
		    res.json(role);
		 });
	})
	
	//---------------------------------------------------------------
	//update role
	.put(function (req, res) {

		RoleSchema.find({name: req.params.name}, function (err, foundRole) {
			// var role = new RoleSchema();
			var role = foundRole[0];

			if(err) { 
				return res.send(err);
			} else {

				if (req.body.description) role.description = req.body.description;
				if (req.body.effectiveDate) role.effectiveDate = req.body.effectiveDate;
				if (req.body.endDate) role.endDate = req.body.endDate;
				if (req.body.modules) role.modules = req.body.modules;
				if (req.body.dashboardSections) role.dashboardSections = req.body.dashboardSections;

				
				// updatedRole = role;
				
				role.save(function (err) {
					if(err) {
						return res.json(err);
					} 

					return res.json({ message: 'Role updated' });	
					
				})
			}
		
		});
	
	})
	
	//---------------------------------------------------------------
	//delete role
	.delete(function (req, res) {
		RoleSchema.remove({ name: req.params.name }, function (err, role) {
			if (err) {
				res.send(err);
			} else {
				res.json({ message: 'Successfully deleted role' });
			}
		});
		
	});
	
};
	