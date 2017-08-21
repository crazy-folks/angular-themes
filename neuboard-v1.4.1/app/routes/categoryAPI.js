
// add vault model
var Category = require('../models/category');
var mongoose = require('mongoose');
var Descriptor = require('../models/descriptor');

module.exports = function (api) {
  // on routes that end in /KazGetCategories
	// ----------------------------------------------------
	api.route('/KazGetCategories')

	// create a vault (accessed at POST http://localhost:8080/api/KazGetCategories)
		.post(function(req, res) {

			var category = new Category();		// create a new instance of the Category model
			category.name = req.body.name;      // set the users 
			category.description = req.body.description;  // set the users 
			//vault.actiondatetime = req.actiondatetime;
			//vault.effectivedatetime =  req.effectivedatetime;
			category.type = req.body.type;
			category.subscriberid = req.body.subscriberid;
			var valueCheck = req.body.name;
			var runner = 0;
			var ableToAdd = false;
			Category.find({"subscriberid":req.body.subscriberid}, function(err, categories) {
				if (err) res.send(err);
				if(categories.length == 0) {
					ableToAdd = true;
				} 
				else{
				categories.every(function(value){
    			if(categories[runner].name.toUpperCase() == valueCheck.toUpperCase()){
    				res.send({type:'info', message: "You already have this name, can't add more.	"});
    				return false;
    			} 
    				runner++;
    			if(runner == (categories.length))	{
    				ableToAdd = true;
    			} 
    				return true;
    			});

				}
				if (ableToAdd) {
					category.save(function(err) {
					if (err) {
					// delete check for same conditions to verify schemas define
					return res.send(err);
					}
					// return a message
					res.json({type:'success', message: 'Category created.'});
			    	});
				}	
			});
		})

	// get all the vault in the database(accessed at GET http://localhost:8080/api/KazGetCategories)
		.get(function(req, res) {

			Category.find()
			.sort('name')
			.exec(function(err, category) {
				if (err) res.send(err);

				// return the vaults
				res.json(category);
			});
		});


	//route that end in /KazGetCategories/:user_id
	//accessed at GET http://localhost:8080/api/KazGetCategories/:userid
	api.route('/KazGetCategories/:user_id')

		// get the vault items according/associate with that user id
		.get(function(req, res) {
			Category.find({"subscriberid":req.params.user_id}, function(err, category) {
				if (err) res.send(err);

				// return that vautl items based user's id
				res.json(category);
			});
		})

		// update the vault with this vault id passed in
		// user_id just naming convention here not actual user id in this case
		.put(function(req, res) {
			Category.findById(req.params.user_id, function(err, category) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				var valueCheck = req.body.name;
				var runner = 0;
				var ableToEdit = false;
				var count = 0;
				Category.find({"subscriberid":req.body.subscriberid}, function(err, categories) {
					if (err) res.send(err);				
					categories.every(function(value){
    				if(categories[runner].name.toUpperCase() == valueCheck.toUpperCase()){
    					count++;
    					return false;
    				} 
    				
    				runner++;
    				if(runner == (categories.length))	{
    					ableToEdit = true;
    				} 
    				return true;
    				});	

    				if(count == 1) {
    					if (req.body.description != category.description) {
							ableToEdit = true;
						} else {
						res.send({type: 'info',message: "Can update the same description.   "});		
						};
    				}

				if (ableToEdit) {
					if (req.body.name) category.name = req.body.name;
					if (req.body.type) category.type = req.body.type;
					category.description = req.body.description;

					category.save(function(err) {
					if (err) {
		      		// duplicate entry
		      		if (err.code == 11000)
		        		return res.json({type:'info', message: 'A category with that name already exists.'});
		      		else
		        		return res.send(err);
		    		}

					// return a message
					res.json({type:'success',message: 'Category updated!'});
					}); 
				}	
				});

				
			});
		})

		// delete the vault with the vault id passed in 
		// vault id now take in as user id paras of the link
		.delete(function(req, res) {
			Category.remove({
				_id: req.params.user_id
			}, function(err, category) {
				if (err) res.send(err);
				else
			    // handle deleting descriptor when user delete a sub category
				Descriptor.remove({
        			"categoryid": req.params.user_id
      				}, function (err, agreement) {
        			if (err) console.log(err);
        			console.log({ message: 'Successfully deleted all descriptor' });
      			});
				res.json({type:'success',message: 'Successfully deleted the category'});
			});
		});


	api.route('/KazGetCategories/one/:categoryId')
	// get a single vault for edit function

	.get(function(req, res) {
		//console.log(req.params.categoryId);
		Category.findById(req.params.categoryId, function(err, category) {
			if (err) res.send(err);
			// return that category for edit
			res.json(category);
		});
	});


	// on routes that end in /KazSubCategory
	// ----------------------------------------------------
	api.route('/KazSubCategory')

	// maybe perform two actions: one update tree view, another update descriptor seperate table
	// data pass in: sub vault name and id to lookup where to add descriptor, 
	// another is data field to store 
	.post(function(req, res) {
		Category.find(
		 {"subCategory.name" : req.body.name, "subCategory.id" : req.body.id}
		)
		.update(
		{"subCategory.id": req.body.id},
		{$set:{'subCategory.$.subCategory.0.label' : req.body.label,'subCategory.$.subCategory.0.value' : req.body.value}}
		//{$push:{"subCategory": {label: req.body.label, value : req.body.value}}}
		)
		.exec(function(err, data) {
			if (err) res.send(err);
		     	// return a message	
		     	res.sendStatus(data);
		});	
	});


	api.route('/KazSubCategory/:Categoryid/:subid/:name')
	// delete a Sub Category to according to vault main id
	// paras need vault main id, name of sub vault, id of sub vault
	//(accessed at get http://localhost:8080/api/KazSubCategory')
	// Ok
			.delete(function(req, res) {
			// find document that contain the field need to delete

			Category.findOne(
			 {_id: req.params.Categoryid}
			  //{$pull:{"subCategory": {name: req.body.name, id : req.body.id}}}
			)
			.update(
			 {_id: req.params.Categoryid},
			 {$pull:{"subCategory": {name: req.params.name , id : req.params.subid}}}
			)
			.exec(function(err, data) {
				if (err) res.send(err);
		     	// return a message
					res.json({type:"success", message: 'Successfully Deleted Sub Category'});
					
			});

			// handle deleting descriptor when user delete a sub category
			Descriptor.remove({
        		"subcategoryid": req.params.subid
      			}, function (err, agreement) {
        		if (err) console.log(err);
        		console.log({ message: 'Successfully deleted all descriptor' });
      		});
		});

	// on routes that end in /KazSubCategory/:Categoryid'
	// ----------------------------------------------------
	api.route('/KazSubCategory/:Categoryid')

	// post new Sub Category to according to vault main id
	// paras need vault main id, new name of sub vault, new id of sub vault
	//(accessed at post http://localhost:8080/api/KazSubCategory/:Categoryid')
	// Ok
		.post(function(req, res) {
			// attention with no toString()
			// delete api not work cuz type objectid and the string id define in the schema
			var subCategoryId = mongoose.Types.ObjectId().toString(); // unique id
            
			Category.findOne({_id : req.params.Categoryid}, function (err, result) {
				var ableToAdd = false;
    			var category = result.toObject();
    			var runner = 0;
    			var valueCheck = req.body.name;	
    			if(category.subCategory.length == 0) {
    				ableToAdd = true;
    			} else {
    				category.subCategory.every(function(value){
    				if(category.subCategory[runner].name.toUpperCase() == valueCheck.toUpperCase()){
    					res.send({type:"info",message: "Can not add same sub Category name"});
    					return false;
    				} 
    				
    				runner++;
    				if(runner == (category.subCategory.length))	{
    					ableToAdd = true;
    				} 
    					return true;
    				});

    			};
    			
    			if(ableToAdd){
    				Category.update(
    					{_id : req.params.Categoryid},
			 			{$push:{"subCategory": {name: req.body.name, id : subCategoryId, description: req.body.description}}}
    				)
    				.exec(function(err, subcategory) {
					if (err) res.send(err);
					// return the vaults
					res.json({type:"success",message: 'Sub Category Created!'});
					});
    			};
			});
		})

		.get(function(req, res) {
			Category.findById(req.params.Categoryid, function(err, category) {
				if (err) res.send(err);

				// return that vautl items based user's id
				res.json(category);
			});
		})

		 // to update a sub vault infomation
        // paras vault id , subvault id, field data
        // update id not include
		.put(function(req, res) {
			Category.findById(req.params.Categoryid, function(err, result) {
				if (err) res.send(err);
				var ableToEdit = false;
    			var category = result.toObject();
    			var runner = 0;
    			var valueCheck = req.body.name;	
    			var descriptionCheck  = req.body.description;
    			var count = 0;
    			category.subCategory.every(function(value){
    				if(category.subCategory[runner].name.toUpperCase() == valueCheck.toUpperCase()){
    					count++;
    					return false;
    				} 
    				
    				runner++;
    				if(runner == (category.subCategory.length))	{
    					ableToEdit = true;
    				} 
    					return true;
    				});  

    				if(count == 1) {
    					category.subCategory.every(function(value){
    						if(category.subCategory[runner].description == descriptionCheck){
    						res.json({type: "info", message: 'Unable to edit same value'});
    						} else {
    						ableToEdit = true;
    						}
    					})
    				}

    			if(ableToEdit){
    				Category.update(
					{"subCategory.id": req.body.id},
					{$set:{'subCategory.$.name' : req.body.name, 'subCategory.$.description' : req.body.description}}
					)
					.exec(function(err, data) {
						if (err) res.send(err);
		     			// return a message	
		     			res.json({type:"success",message: 'Sub Category Updated!'});
					});
    			
    			}; 
				// return that vautl items based user's id
				
			});
		});
	
	// check to commit

};
