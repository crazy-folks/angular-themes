// add agreement model  @TODO
var AgreementCategory = require('../models/agreementCategory.js')
var Descriptor = require('../models/descriptor.js')
var nodemailer = require("nodemailer/lib/nodemailer");
var postmark = require("postmark");
var client = new postmark.Client("3b11baa2-7180-4d7b-9265-155caf144b36");
var crypto = require('crypto'), algorithm = 'aes-256-gcm';
var Buffer = require('buffer').Buffer;
var lenderCode = require('../models/lenderCode.js');
var NotifyMessage = require('../models/NotifyMessage.js');

module.exports = function (api) {

  api.route('/agreementCreate')
    // create an agreement (accessed at POST http://localhost:8080/agreements)
    .post(function (req, res) {
      // create a new instance of the Agreement model
    //console.log(req.body);
    var agreement = new AgreementCategory();   
    if(req.body.name)agreement.name = req.body.name; // this is not the name of agreement .It's either category name or sub name
    if(req.body.description)agreement.description = req.body.description; // same here
    if(req.body._id) agreement.vaultcategoryid = req.body._id;
    if(req.body.id) agreement.vaultsubcategoryid = req.body.id;
    if(req.body.timeshare)agreement.enddatetime = req.body.timeshare;
    if(req.body.sharesubscribers)agreement.sharesubscribers = req.body.sharesubscribers;
    agreement.readonlyaccess = req.body.readonlyaccess;
    agreement.getupdates = req.body.getupdates;
    if(req.body.subscriberid)agreement.subscriberid = req.body.subscriberid;
    if(req.body.shareName)agreement.shareName = req.body.shareName;
    if(req.body.email)agreement.email = req.body.email;
    agreement.myName = req.body.myName;
    if(req.body.filename) { // this is the share file
     agreement.name = req.body.filename;
     if(req.body._id) agreement.fileid = req.body._id;
    };
      agreement.save(function (err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ type: 'info', message: "You've share the data before" });
          else
            return res.json({type: 'danger', message: err});
        }
        addToNotification(req.body.myName, req.body.email.toLowerCase());
        res.json({ type: 'success', message: "Successfully create the agreement" });
      });
    });
  
  api.route('/Argeements/:info')
  // get Argeements of this user based on the participants email
  // need to have an API for email modifying
  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({ "fileid" : { "$exists" : false }, 'email':req.params.info})
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        res.json(agreements);
      }); 
    
  })

   .delete(function(req,res){
    AgreementCategory.remove({
        _id: req.params.info
      }, function (err, data) {
        if (err) {res.send({type:"info", message: err});}
        else
        res.json({type: "success",message: 'Successfully deleted the argeement file'});
      });
  });

  // agreement for sharing process
  api.route('/agreementService/:catName/:catID/:user_id/:user_name')
  .post(function (req, res) {
   // console.log("check body ");
   // console.log(req.body.length)
    var errorMessage = "";
    var targetDate = new Date();
    var emailToAdd = ""
    targetDate.setDate(targetDate.getDate() + 180); // add 180 days approxiamately 6 month
    for(var i = 0; i <  req.body.length; i++) {
       emailToAdd = req.body[i].email.toLowerCase()
       var agreement = new AgreementCategory();   
       if(req.params.catName)agreement.name = req.params.catName;
       if(req.params.user_id)agreement.subscriberid = req.params.user_id;

       //console.log(req.body[i].sharesubscribers);
       if(req.body[i].sharesubscribers) {
         agreement.sharesubscribers = req.body[i].sharesubscribers;
       } else {
          agreement.sharesubscribers = randomString(12); //auto generate randon string number for temp id
       }
       if(req.params.catID) agreement.processcatid = req.params.catID;
       if(req.params.user_name)agreement.myName = req.params.user_name;
       if(req.body[i].email) agreement.email = req.body[i].email.toLowerCase();
       if(req.body[i].shareName) agreement.shareName = req.body[i].shareName;
       agreement.enddatetime = targetDate;

      agreement.save(function (err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000) {
            errorMessage = "You've share the data before";
            return console.log({ type: 'info', message: "You've share the data before" });
          }       
          else {
            errorMessage = err;
            return console.log({type: 'danger', message: err})
          }      
        }
        // return data for other api call
      });
    }

    if(errorMessage == "") {
        // Have an agreement then add to notify
        addToNotification(req.params.user_name, emailToAdd);   
        res.json({ type: 'success', message: "Successfully create the agreement" });
        
      } else {
         res.json({ type: 'danger', message: errorMessage });
      }
  });


  api.route('/loadMyArgeements/:user_id')
  // get Argeements of this user based on the subscriberid
  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({ "fileid" : { "$exists" : true }, 'subscriberid':req.params.user_id})
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        //console.log(agreements);
        res.json(agreements);
      }); 
    
  });

  api.route('/loadMySharedData/:user_id')
  // get Argeements of this user based on the subscriberid
  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({ "fileid" : { "$exists" : false },'subscriberid':req.params.user_id})
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        //console.log(agreements);
        res.json(agreements);
      }); 
    
  });

  api.route('/loadMyAllShared/:info')
  // get Argeements of this user based on the subscriberid
  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({'email':req.params.info.toLowerCase()})
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        //console.log(agreements);
        res.json(agreements);
      }); 
    
  });

  api.route('/loadMyAllSharedProcess/:info')
  // get Argeements of this user based on the subscriberid
  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({'email':req.params.info.toLowerCase(), "processcatid" : {"$exists" : true} })
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        //console.log(agreements);
        res.json(agreements);
      }); 
    
  });


  api.route('/loadCategoryDescriptor/:id/:catID')
  // get Argeements of this user based on the subscriberid
  .get(function (req, res) {
   //console.log(req.params.user_email);
   Descriptor.find({'subscriberid':req.params.id, 'categoryid': req.params.catID})
    .exec(function(err, agreements) {
        if (err) res.send(err);
        // return all argeement
        //console.log(agreements);
        res.json(agreements);
      }); 
    
  });

  api.route('/userRequestValue/:email')
  
  .post(function (req, res) {
    var values = req.body.value.split('/');
    var content = values[0], tag = values[1], password = values[2], iv = values[3];
    var actualValue = decrypt(content,tag, password,iv)
    var subjectSend = "Your request for password value form Kazume";
    var contentSend = 'The password is ' + actualValue;
    client.sendEmail({
      "From": "info@kazume.com",
      "To": req.params.email,
      "Subject": subjectSend, 
      "TextBody": contentSend
    }, function(error, success) {
    if(error) {
       res.json({type:"info", message: error.message});
       return;
    }
    console.info("Sent to postmark for delivery");
    res.json({type:"success", message:"You will get an email with your password inside"});
    });

  });

  
  api.route('/sendingMail')
  .post(function(req,res){

  var subjectSend = 'Kazume Data Share';
  var contentSend = 'You have shared data. Please click on the following link. http://localhost:8080/vault'
  if(req.body.subject) {subjectSend = req.body.subject;};
  if(req.body.content) {contentSend = req.body.content;};
  if(req.body.code) {contentSend = contentSend + '\nYour code for registration is: ' + req.body.code + '\nPlease sign up at www.kazume.com' };
  //console.log(contentSend);

  client.sendEmail({
    "From": "info@kazume.com",
    "To": req.body.email,
    "Subject": subjectSend, 
    "TextBody": contentSend
  }, function(error, success) {
    if(error) {
        res.json({type:"info", message: error.message});
        console.error("Unable to send via postmark: " + error.message);
       return;
    }
    res.json({type:"success", message:"Email is/are sending out to participants"})
    console.info("Sent to postmark for delivery");
  });

});

  api.route('/modIdAgreement')
  // update status of argeements
  .post(function(req,res){
   // console.log("in the function to modify id");
    if(req.body.userRoles[0] == 'Borrower') {
      AgreementCategory.update(
        {"email":req.body.email.toLowerCase(), "processcatid" : {"$exists" : true}},
        {$set : {"sharesubscribers": req.body._id}},
        { multi: true }
      ).exec(function(err, data) {
        if (err) { res.json({type:"info", message:err})}
        else {
          res.json({type:"success", message:"Add id to agreement"});
        }       
      });
    } else {
      res.json({type:"info", message:"No need to modify for this user"});
    }
    
  });

  api.route('/getUserIdOfAgreement/:email')
  // uget the id of sender of process agreement
  .get(function(req,res){
    AgreementCategory.findOne({"email":req.params.email.toLowerCase(), "processcatid" : {"$exists" : true}})
    .select('subscriberid')
    .exec(function (err, data) {
      if (err) res.send(err);
      res.send(data);
    })
  });


  api.route('/sharedFiles/:user_id')
  // update status of argeements
  .post(function(req,res){
    var counter = 0;
    var updateTime = 0;
    if(req.body.length) {
      for (var j = 0; j < req.body.length; j++){
        if(req.body[j].confirmStatus == "To Be Agreed"){
          updateTime++;
        }
      }
      for(var i = 0; i < req.body.length;i++) {
          if(req.body[i].confirmStatus == "To Be Agreed"){
           counter++;
           updateStatus(res,req.body[i]._id, counter, updateTime);
         }
      }    
    } else {
      updateStatus(res,req.body._id, 1, 1);
    }   
  })

  .get(function (req, res) {
   //console.log(req.params.user_email);
   AgreementCategory.find({'sharesubscribers':req.params.user_id, "fileid":{$ne:null} })
    .exec(function(err, files) {
        if (err) res.send(err);
        // return all argeement
        //console.log(files);
        res.json(files);
      }); 
    
  });

  api.route('/allSharedFiles/:user_id')
  // get Argeements of this user 
  .get(function (req, res) {
   //console.log(req.params.user_email);
  // console.log(req.params.user_id);
   AgreementCategory.find({ "$or": [{
        "subscriberid": req.params.user_id
    }, {
        "sharesubscribers": req.params.user_id
    }]
  })
    .exec(function(err, files) {
        if (err) res.send(err);
        // return all argeement
        res.json(files);
      }); 
    
  });

  api.route('/extendtime/:agreement_id/:state')
  // extend time for an Agreement
  .post(function (req, res) {

    if(req.params.state == 1 ) {
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7); // add 7 days
      AgreementCategory.findOne(
      {_id: req.params.agreement_id}
      )
      .update(
      {_id: req.params.agreement_id},
      {$set:{"startdatetime": new Date(), "actiondatetime":new Date(), "enddatetime": targetDate}}
      )
    .exec(function(err, data) {
      if (err) { res.json({type:"info", message:err})}
      else {
        res.json({type:"success", message:"The expired time has been extended, please check back later"});
      }       
    });
   } else if (req.params.state == 2) { // update action time when user open the file
      AgreementCategory.findOne(
      {_id: req.params.agreement_id}
      )
      .update(
      {_id: req.params.agreement_id},
      {$set:{"actiondatetime":new Date()}}
      )
    .exec(function(err, data) {
      if (err) { res.json({type:"info", message:err})}
      else {
        res.json({type:"success", message:"Your action to view file has been recorded"});
      }       
    });
   }
    
   
  });

api.route('/getLenderCodeCheck/:lenderid/:partemail')
  // get Argeements of this user 
  .get(function (req, res) {
   lenderCode.findOne({"lenderid":req.params.lenderid, "partemail":req.params.partemail
  })
   .exec(function(err, value) {
        if (err) {
           res.send(err) 
        } else {
           if(value == null){ // not in the record so create one
              var newLenderCode = new lenderCode();
              newLenderCode.lenderid = req.params.lenderid;
              newLenderCode.partemail = req.params.partemail;
              newLenderCode.save(function (err) {
              if (err) {
                // duplicate entry
                if (err.code == 11000) { 
                  return res.json({"sent": "Error saving" });
                } else {
                  return res.json({"sent": "Error saving" })
                }      
              } else { // able to save record of lender and new participant then generate new code
                 res.json({"sent": false});
              }
              });
            
           } else {  // able to find something meant share code with this email before
              res.json({"sent":true});  // no need to generate new code
           }
        }    
      }); 
    
});


api.route('/Notification/:info')

.get(function(req,res){
    NotifyMessage.find({'email':req.params.info.toLowerCase()})
    .exec(function(err, notifications) {
        if (err) res.send(err);
        res.json(notifications);
      }); 
    
}) 

.delete(function(req,res){
     NotifyMessage.remove({
        _id: req.params.info
      }, function (err, data) {
        if (err) {res.send({type:"info", message: err});}
        else
        res.json({type: "success",message: 'Successfully remove notification'});
      });
});



var updateStatus = function(res,id,counter,length) {
  AgreementCategory.findOne(
    {_id: id}
  )
  .update(
    {_id: id},
    {$set:{"confirmStatus": "Acknowledged"}}
  )
  .exec(function(err, data) {
    if (err) { res.json({type:"info", message:err})}       
  });
  if(counter == length){
    res.json({type:"success", message:"Status Update"});
  } 
}

function decrypt(content, tag, password, iv) {
  const buf3 = new Buffer(tag);
  var decipher = crypto.createDecipheriv(algorithm, password, iv);
  decipher.setAuthTag(buf3);
  var dec = decipher.update(content, 'hex', 'utf8');
  //dec += decipher.final('utf8');
  return dec;
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

function addToNotification (name, email) {
  var notify = new NotifyMessage();
  notify.msg = "You have a new notification from " + name +  ". Please accept the agreement and go to Processes";
  notify.email = email;
  notify.unread = true;
  notify.save(function(err){
    if(err) console.log(err);
    console.log("add notification");
  });
}

};