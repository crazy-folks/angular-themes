// add agreement model  @TODO
var Agreement = require('../models/agreement.js')

module.exports = function (api) {

  api.route('/agreements')
    // create an agreement (accessed at POST http://localhost:8080/agreements)
    .post(function (req, res) {
      // create a new instance of the Agreement model
      var agreement = new Agreement();   

      // set the new agreement information if it exists in the request (same as declaring again)
      // some fields not in the controller EX: password, type, vaultvalueid, vaultcategory id, or sharesubscribers
      agreement.name = req.body.name;
      agreement.description = req.body.description;
     // agreement.password = req.body.password;
     // agreement.scope = req.body.scope;
      agreement.category = req.body.category;
     // agreement.type = req.body.type;
      agreement.processid = req.body.processid;
     // agreement.vaultvalueid = req.body.vaultvalueid;
     // agreement.vaultcategoryid = req.body.vaultcategoryid;
      //agreement.vaultsubcategory = req.body.vaultsubcategory;
      agreement.readonlyaccess = req.body.readonlyaccess;
      agreement.getupdates = req.body.getupdates;
      agreement.startdatetime = req.body.startdatetime; 
      agreement.enddatetime = req.body.enddatetime;
      agreement.sharesubscribers = req.body.sharesubscribers;
      agreement.actiondatetime = req.body.actiondatetime;
      agreement.subscriberid = req.body.subscriberid;

      agreement.save(function (err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ success: false, message: 'A agreement with that name already exists. ' });
          else
            return res.send(err);
        }
        // return a message format type and message for ngToast
        res.json({ type: 'success', message: 'Agreement created!' });  
      });

    })

    // get all the agreements (accessed at GET http://localhost:8080/api/agreements)
    .get(function (req, res) {
      Agreement.find({}, function (err, agreements) {
        if (err){
          res.send(err)
        } else {
          res.json(agreements);
        }
      });
  });


  api.route('/agreements/user/:user_id')
  // get argeements belong to this user based on the id
  .get(function (req, res) {
      Agreement.find({subscriberid:req.params.user_id}, function (err, agreements) {
        if (err) {
          res.send(err);
        } else {
          // return that agreement
          res.json(agreements);
        }
      });
  });

  // on routes that end in /agreements/:agreement_id
  // ----------------------------------------------------
  api.route('/agreements/:agreement_id')
    // get the agreement with that id
    .get(function (req, res) {
      Agreement.findById(req.params.agreement_id, function (err, agreement) {
        if (err) {
          res.send(err);
        } else {
          // return that agreement
          console.log(agreement);
          res.json(agreement);
        }
      });
    })

    // update the agreement with this id
    .put(function (req, res) {
      Agreement.findById(req.params.agreement_id, function (err, agreement) {
        if (err) res.send(err);        
        // set the new agreement information if it exists in the request (same as declaring again)
        agreement.name = req.body.displayname;
        agreement.description = req.body.description;
        agreement.password = req.body.password;
        agreement.scope = req.body.scope;
        agreement.category = req.body.category;
        agreement.type = req.body.type;
        agreement.processid = req.body.processid;
        agreement.vaultvalueid = req.body.vaultvalueid;
        agreement.vaultcategoryid = req.body.vaultcategoryid;
        agreement.vaultsubcategory = req.body.vaultsubcategory;
        agreement.readonlyaccess = req.body.readonlyaccess;
        agreement.getupdates = req.body.getupdates;
        agreement.startdatetime = req.body.startdatetime; 
        agreement.enddatetime = req.body.enddatetime;
        agreement.sharesubscribers = req.body.sharesubscribers;
        agreement.actiondatetime = req.body.actiondatetime;
        agreement.subscriberid = req.body.subscriberid;

        // save the agreement
        agreement.save(function (err) {
          if (err) {
            res.json({ type: 'danger', message: 'Error saving agreement information: ' + err });            
          } else {
            // return a message
            res.json({ type: 'success', message: 'Successfully updated agreement information.' });
          }
        });
      });
    })

    // delete the agreement with this id
    .delete(function (req, res) {
      Agreement.remove({
        _id: req.params.agreement_id
      }, function (err, agreement) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted' });
      });
  });
};
