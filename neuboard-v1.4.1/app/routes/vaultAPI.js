var Descriptor = require('../models/descriptor');

var VaultValue = require('../models/vaultValue');
var crypto = require('crypto'),
    algorithm = 'aes-256-gcm';
  

module.exports = function (api) {

  // on routes that end in vaultitem
  // ----------------------------------------------------
api.route('/vaultitem')

		// create a vault item (accessed at POST http://localhost:8080/vaultitem)
		.post(function (req, res) {

		 Descriptor.find({subscriberid: req.body.subscriberid, name: req.body.label, categoryid: req.body.categoryid}, function (err, results) {
    		if (err) {console.log(err) }
    			//console.log(results);
    		if (results.length == 0) {
    			// no record found, add new descriptor and vault value
    			//console.log(req.body);
       			var vaultValue = new VaultValue();		// create a new instance of the Vault Value model  
		  		var descriptor = new Descriptor();		// create a new instance of the Descriptor model

		  		if (req.body.type == 'password'){
		  			var temp = encrypt(req.body.value);
		  			vaultValue.value = temp.content + "/" + temp.tag + "/" + temp.password + "/" + temp.iv;
		  		} else {
		  			vaultValue.value = req.body.value;  // set the vault value (comes from the request)
		  		}

		  		//vaultValue.status = req.body.status;  // set the vault value (comes from the request)
          		vaultValue.subscriberid = req.body.subscriberid;  // set the vaultvalue subscriberid (comes from the request)
          		vaultValue.type = req.body.type;   // set value type comes from request
		  		//vaultValue.descriptorid = descriptor.id;  // set the vaultvalue subscriberid (comes from the request)
		 		descriptor.name = req.body.label;  // set the descriptor label (comes from the request)
		  		//descriptor.description = req.body.description;  // set the descriptor description (comes from the request)
		  		//descriptor.descstatus = req.body.descstatus;  // set the descriptor description (comes from the request)
		  		descriptor.categoryid = req.body.categoryid;  // set the descriptor categoryid (comes from the request)
		  		//descriptor.subcategoryid = req.body.subcategoryid;  // set the descriptor subcategoryid (comes from the request)
		  		descriptor.subscriberid = req.body.subscriberid;  // set the descriptor subscriberid (comes from the request)
		  		descriptor.vaultvalues.push(vaultValue);

  		  		descriptor.save(function (err) {
		    		if (err) { 
		        		return res.send({type:"info", message: "Data validation fail"});
		    		} else {
		    			res.send({type:"success", message: "Descriptor create"})
		    		} 
		 		});  
    		} else {
    			// find records do what now conditions to prevent add same value with this descriptor
    			var ableToAdd = false;
    			var result = results[0].toObject(); 
    			var runner = 0;
    			console.log("type " + req.body.type);
    			if (req.body.type == 'password'){
		  			var temp = encrypt(req.body.value);
		  			var valueCheck  = temp.content + "/" + temp.tag + "/" + temp.password + "/" +  temp.iv;
		  		} else {
		  			var valueCheck = req.body.value;   // set the vault value (comes from the request)
		  		}
    			var id = req.body.subscriberid;
    			var nameOther = req.body.label;
    			//console.log(valueCheck);
    			result.vaultvalues.every(function(value){
    				if(result.vaultvalues[runner].value.toUpperCase() == valueCheck.toUpperCase()){
    					res.send({type:"info", message: "Can not add same value"});
    					return false;
    				} 
    				
    				runner++;
    				if(runner == (result.vaultvalues.length))	{
    					ableToAdd = true;
    				} 
    				return true;
    			});
    			
          		// add only check through out all the value in vaultvalues array
          		if(ableToAdd){
          			// out the loop and not having same vault value then allow to add
    				var newVaultValue = new VaultValue();
    				//console.log("check " + valueCheck);
    				newVaultValue.value = valueCheck;  // set the vault value (comes from the request)
		  			//vaultValue.status = req.body.status;  // set the vault value (comes from the request)
          			newVaultValue.subscriberid = id;  // set the vaultvalue subscriberid (comes from the request)
          			// push new vault value to array value not able yet
          			Descriptor.update(
          				{subscriberid : id, name : nameOther},
          				{$push:{"vaultvalues": newVaultValue}}
          			)
          			.exec(function(err, des) {
					if (err) res.send({type:"info", message: "Data validation fail"});
						res.send({type:"success", message: "Successfully add vault value"});
					});
          		}
    		}

		});
});



	api.route('/vaultitem/:user_id')
	 	// get all the descriptor and value belongs to this userid
	 	// (accessed at GET http://localhost:8080/api/vaultitem/:user_id)
		.get(function (req, res) {

		  Descriptor.find(
		  {subscriberid: req.params.user_id}
		  )
		  	.sort('name')	
		  	.exec(function (err,descriptor) {
		    if (err) res.send(err);
		    res.send(descriptor);
		  });
        })

        //delete the vault/descriptor value document based on its objectid
        //currently use this to delete descriptor
        .delete(function(req,res){
        	Descriptor.remove({
				_id: req.params.user_id
			}, function(err, des) {
				if (err) res.send(err);
				res.json({type:"success", message: 'Successfully deleted descriptor' });
			});
        })

		// modify the vaule that belong to this user id, sub category, and label
		// find one document with the userid, subcategoryis, and label
		// then use forEach loop to find index of where want to update
		// update the value to its new value 
		// not OK yet
        .put(function(req,res) {
            Descriptor.findOne(
        	{_id: req.params.user_id, categoryid: req.body.categoryid} , function(err, des) {
        		if (err) res.send(err);
        		var Set = {}; 

        		if (req.body.vaultvalues[req.body.vaultvalues.length -1].type == 'password'){
		  			var temp = encrypt(req.body.vaultvalues[req.body.vaultvalues.length -1].value);
		  			var value = temp.content + "/" + temp.tag + "/" + temp.password + "/" + temp.iv;
		  		} else {
		  			var value = req.body.vaultvalues[req.body.vaultvalues.length -1].value;  // set the vault value (comes from the request)
		  		}

        		Set['vaultvalues.' + (des.vaultvalues.length - 1) + '.value'] = value;
        		Set['vaultvalues.' + (des.vaultvalues.length - 1) + '.type'] = req.body.vaultvalues[req.body.vaultvalues.length -1].type;
 				Descriptor.update(
				{_id: req.params.user_id, categoryid: req.body.categoryid},
				// research on how to set this
				{$set:Set, name : req.body.name}
				)
				.exec(function(err, data) {
					if (err) res.send(err);
		     		res.json({type:"success",message: 'Successfully update descriptor' });
				});
        	});
        	
        });
		


    api.route('/vaultitem/:user_id/:label')
	 	// get all the descriptor and value belongs to this userid with this particular label
	 	// (accessed at GET http://localhost:8080/api/vaultitem/:user_id/label)
		.get(function (req, res) {

		  Descriptor.find(
		  {subscriberid: req.params.user_id, name: req.params.label}
		  )
		  	.sort('name')	
		  	.exec(function (err,descriptor) {
		    if (err) res.send(err);
		    res.send(descriptor);
		      })
		  });

		
 		

	api.route('/vaultitem/:user_id/one/:categoryid')
	 	// get all the descriptor and value belongs to this userid with this particular subcategory
	 	// (accessed at GET http://localhost:8080/api/vaultitem/category/:user_id)

		.get(function (req, res) {		 
		  Descriptor.find(
		  {"subscriberid": req.params.user_id, "categoryid":req.params.categoryid}
		  )
		  	.exec(function (err,descriptor) {
		    if (err) res.send(err);
		    res.send(descriptor);
		  });
        });

	api.route('/vaultitem/:user_id/:subcategoryid/:label')
	 	// get all the descriptor and value belongs to this userid with this particular category and this name
	 	// (accessed at GET http://localhost:8080/api/vaultitem/category/:user_id)
	 	
		.get(function (req, res) {
			//console.log(req.params.user_id);
		    //console.log(req.body);
		  Descriptor.find(
		  {subscriberid: req.params.user_id, subcategoryid: req.params.subcategoryid, name : req.params.label}
		  )
		  	.sort('name')	
		  	.exec(function (err,descriptor) {
		    if (err) res.send(err);		  	
		    res.send(descriptor);
		  });
        })	

		/* // delete all vault value (empty the array) that belongs to this userid, subcategoryid, and this label/name
		// find the one document based on the criteria
		// the delete the array of vaultvalue
		.delete(function(req,res){
			// find the one document
			Descriptor.find(
        	{subscriberid: req.params.user_id, subcategoryid: req.body.id, name : req.body.label}
        	)
        	.exec(function(err, des) {
				if (err) res.send(err);
				//now delete the array of vaultvalues
				Descriptor.update(
				{subscriberid: req.params.user_id, subcategoryid: req.body.id, name : req.body.label},
				// empty the vaultvalues array
				 {$set:{"vaultvalues": []}}
				)
				.exec(function(err, data) {
					if (err) res.send(err);
		     		res.sendStatus(data);
				});	
			});
		}); */

		// delete a vault value belongs to this userid, subcategoryid, and label
		// find the document based on criteria
		// then delete the one based on vaultvalue and its userid.
		.delete(function(req,res){
			Descriptor.findById(
        	{_id: req.params.user_id, name : req.params.label}
        	)
        	.exec(function(err, des) {
				if (err) res.send(err);
				//now delete the value
				Descriptor.update(
				{_id: req.params.user_id, name : req.params.label},
				// delete the values
				 {$pull:{"vaultvalues": {value: req.body.value}}}
				)
				.exec(function(err, data) {
					if (err) res.send(err);
		     		res.sendStatus(data);
				});	
			}); 
		});

		function encrypt(text) {
			var password = randomString(32);
			var iv = randomString(12);
  			var cipher = crypto.createCipheriv(algorithm, password, iv)
  			var encrypted = cipher.update(text, 'utf8', 'hex')
  			encrypted += cipher.final('hex');
  			var tag = cipher.getAuthTag();
  			//console.log("encrypted + " + encrypted);
  			return {
    		content: encrypted,
    			tag: tag,
    			password:password,
    			iv:iv
  			};
		}

		function randomString(length) {
    		return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
		}
// don't delete after this
};
		 
