// on routes that end in /process
// ----------------------------------------------------
var Processes = require('../models/processCategory');
var Section = require('../models/section');

module.exports = function (api) {

  api.route('/process')

  // create a process (accessed at POST http://localhost:8080/api/process)
  // ok work
    .post(function (req, res) {

    
    var newProcess = new Processes();   // create a new instance of the Process model

    newProcess.userid = req.body.subscriberid;
    newProcess.category = req.body.category;
    newProcess.name = req.body.processName;
    newProcess.description = req.body.processDescription;
    newProcess.source = req.body.source;
    newProcess.owner = req.body.owner;

    //will be add later when in html have the Date type for enddate
    //newProcess.enddate = req.body.enddate; 
    newProcess.type = req.body.processType;
    newProcess.status = req.body.status;
    newProcess.completionrate = req.body.completionrate;
    // newProcess.push(newSection);

    newProcess.save(function (err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.send({success: false, message: "Can not add a same Process"});
          else
            return res.send(err);
        }

        // return a message
        res.json({ message: 'Process created!' });
      });

    })

  // get all the processes (accessed at GET http://localhost:8080/api/process)
    .get(function (req, res) {

      Processes.find()
      .sort('type')
      .exec(function (err, process) {
        if (err) res.send(err);

        // return the processes
        res.json(process);
      });
    });

  api.route('/process/user/:user_id')
  //get all process of this user id
  //not include section array
  .get(function(req,res){
    Processes.find({'userid':req.params.user_id}, {'sections': 0},function (err, process) {
    if (err) res.send(err);
      // return that process
      res.json(process);
      });
  });

  api.route('/processId/:user_id')
  //return only processes' id associate to the userid
  .get(function(req,res){
     Processes.find({'userid':req.params.user_id}, {$all: 1},function (err, process) {
    if (err) res.send(err);
      // return that process
      res.json(process);
      });
  });

  //api to get a process based on object id then add new section in the process
  api.route('/process/sections/:process_id') 

  // api to add new section
  // need compound indexes for section to be unique 
  // add to check function
  // ok work
  .post(function(req,res){
    Processes.findById(req.params.process_id, function (err, aProcess) {
      if (err) res.send(err);
        var ableToAdd = false;
        var otherProcess = aProcess.toObject();
        if (otherProcess.sections.length == 0) {
            ableToAdd = true;
           // console.log("section length 0");
        } else {
        //console.log("secction length not 0");
        var runner = 0;
        var valueCheck = req.body.sectionName;
        var idCheck = req.body.subscriberid;
        otherProcess.sections.every(function(value){
            // check for name and subsciberid compound indexes
            if(otherProcess.sections[runner].name.toUpperCase() == valueCheck.toUpperCase()){
              res.send({success: false, message: "Can not add same section"});
              return false;
            } 
            
            runner++;
            if(runner == (otherProcess.sections.length)) {
              ableToAdd = true;
            } 
            return true;
          });
        }

        if(ableToAdd) {
        // need function to check for section already in there
        var newSection = new Section();
        newSection.name = req.body.sectionName,
        newSection.description = req.body.sectionDescription,
        newSection.type = req.body.sectionType;
        newSection.duration = req.body.sectionDuration;
        newSection.owner = req.body.sectionOwner;
        newSection.escalationID = req.body.escalationID;
        newSection.approvalFlag = req.body.approvalFlag;
        newSection.status = req.body.sectionStatus;
        newSection.subscriberid = req.body.subscriberid;
       //newProcess.enddate = req.body.enddate;

       /* var item = {};
        item.label = req.body.label;
        item.value = req.body.value;
        item.valuetype = req.body.valuetype;
        newSection.items.push(item);

        var participant = {};
        participant.participantname = req.body.participantname;
        participant.ParUserid = req.body.ParUserid;
        newSection.participants.push(participant); */
        Processes.update(
                  {_id : req.params.process_id},
                  {$push:{"sections": newSection}}
                )
                .exec(function(err, des) {
                if (err) res.send(err);
                res.send({success: true, message: "Successfully Add Section"});
              });  
     };
    });
  })
  
  // delete a section of a process 
  // requied process_id, section_id, section_name
  // ok work
  .delete(function(req, res) {
      // find document that based on process id contain the field need to delete
      // console.log(req.body.sectionId + "  " + req.body.sectionName);
      Processes.findOne(
       {_id: req.params.process_id}
        //{$pull:{"subCategory": {name: req.body.name, id : req.body.id}}}
      )
      .update(
       {_id: req.params.process_id},
       // the _id = req.body.sectionId is the section object Id 
       {$pull:{"sections": {'sections.$._id' : req.body.sectionId, name: req.body.sectionName}}}
      )
      .exec(function(err, data) {
        if (err) res.send(err);
          // return a message
          res.json({ message: 'Successfully Deleted Section' });
          
      });
})

  //api to edit section in a process
  //required process id, section id, and the userid
  //req.body has name, type, description, duration, status, userid, sectionId
  //status: Ok now
  .put(function(req,res){
   Processes.findById(req.params.process_id, function(err, result) {
        if (err) res.send(err);
        var ableToEdit = false;
        var aProcess = result.toObject();
          var runner = 0;
          var valueCheck = req.body.sectionName; 
          aProcess.sections.every(function(value){
            if(aProcess.sections[runner].name.toUpperCase() == valueCheck.toUpperCase()){
              res.send({success: false, message: "You already have this section name, can't update"});
              return false;
            } 
            
            runner++;
            if(runner == (aProcess.sections.length)) {
              ableToEdit = true;
            } 
              return true;
            });       
          if(ableToEdit){
            Processes.update(
          {"sections._id": req.body.sectionId, userid: req.body.userid},
          {'$set':{'sections.$.name' : req.body.sectionName, 'sections.$.type' : req.body.type, 'sections.$.description' : req.body.description,
                 'sections.$.duration' : req.body.duration, 'sections.$.status' : req.body.status}}
          )
          .exec(function(err, data) {
            if (err) res.send(err);
              // return a message 
              res.json({ message: 'Section Updated!' });
          });
          
          };
       
      });
  });


api.route('/process/:section_id/:sectionName')
  // api to return a section of a process
  // this will also servered as api for return participants or items of a sections since a section include thosse
  // need params as section id and section name
  // Ok
  .get(function(req,res){
    Processes.find({"sections.name": req.params.sectionName}, {_id: req.params.section_id, 'sections.$': 1})
    .exec(function(err, data) {
      if (err) res.send(err);  
        res.json(data);
    });     
  });


// api for participant of a section in a process
api.route('/process/participant/:process_id/:section_id')

//api to post a new participant to a section
//of section where want to add a new participant 
//work ok
.post(function(req,res){
Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  }
}, {
  $push: {
    'sections.$.participants': {
     "ParUserid": req.body.partId,
      "participantname": req.body.name
      }
  }
}, function(err, data) {
  res.json(data)
});
})


//api to delete a participant of a section
// paras req.body.data process_id and section_id
//ok work
.delete(function(req,res){
 Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  }
}, {
  $pull: {
    'sections.$.participants': {
     "ParUserid": req.body.partId,
      "participantname": req.body.name
      }
  }
}, function(err, data) {
  res.json(data)
});
})

//api to edit a participant in a section (based section index) in a process
// paras need process_id , section_id, to look for object related to those id
// new name and new id of participant -- edit api is harder 
// work ok but required the index where the participant name needed mofidy in the participants array
// need to verify all participant in a section of a process before edit
.put(function(req,res){

 var Set = {};
 Set['sections.$.participants.' + req.body.index + '.participantname'] = req.body.name;
 Set['sections.$.participants.' + req.body.index + '.ParUserid'] = req.body.partId;
 Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  },
}, {
  $set: Set
}, function(err, data) {
  res.json(data)
});

});


// api for items of a section in a process
api.route('/process/items/:process_id/:section_id')

//api to post a new item to a section
//of section where want to add a new item
//work ok
.post(function(req,res){
Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  }
}, {
  $push: {
    'sections.$.items': {
     "label": req.body.label,
      "value": req.body.value,
      "valuetype": req.body.valuetype
      }
  }
}, function(err, data) {
  res.json(data)
});
})


//api to delete an item of a section
// paras req.body.data process_id and section_id
//ok work
.delete(function(req,res){
 Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  }
}, {
  $pull: {
     'sections.$.items': {
     "label": req.body.label,
      "value": req.body.value,
      "valuetype": req.body.valuetype
      }
  }
}, function(err, data) {
  res.json(data)
});
})

//api to edit a item in a section (based section index) in a process
// paras need process_id , section_id, to look for object related to those id
// new label, value, and new valuetype of items -- edit api is harder 
// work ok but required the index where the items needed mofidy in the items array
// need to verify all items in a section of a process before edit
.put(function(req,res){

 var Set = {};
 Set['sections.$.items.' + req.body.index + '.label'] = req.body.label;
 Set['sections.$.items.' + req.body.index + '.value'] = req.body.value;
 Set['sections.$.items.' + req.body.index + '.valuetype'] = req.body.valuetype;
 Processes.findById(req.params.process_id) 
 .update({
  _id: req.params.process_id,
  sections: {
    $elemMatch: {
      _id: req.params.section_id,
    }
  },
}, {
  $set: Set
}, function(err, data) {
  res.json(data)
});

});



// route that end in /process/allSection/:process_id
api.route('/process/prep/allSection/:process_id')
  
  //delete all sections of a process 
  //required process_id 
  //ok work
 .delete(function(req, res) {
      // find document that based on process id contain the field need to delete
      Processes.findOne(
       {_id: req.params.process_id}
        //{$pull:{"subCategory": {name: req.body.name, id : req.body.id}}}
      )
      .update(
       {_id: req.params.process_id},
       // the _id = req.body.sectionId is the section object Id 
       {$pull:{"sections": {}}}
      )
      .exec(function(err, data) {
        if (err) res.send(err);
          // return a message
          res.json({ message: 'Successfully Deleted All Section' });
          
      });
  })

   // api to return all sections of a process
   // paras need is the process_id 
   // ok work
  .get(function(req,res){
    Processes.findById({_id:req.params.process_id}) 
    .select('sections')
    .exec(function(err, data) {
      if (err) res.send(err);  
        res.json(data);
    });     
  });


  // api to return a list of all participants in all sections of a process based its id
  // This will be used to check when adding a new participant
  // if new participant with name or id not include, then will add
  // Ok work
  api.route('/process/all/partList/:process_id')
  .get(function(req,res){
    Processes.findOne({_id:req.params.process_id}) 
    .select('sections.participants')
    .exec(function(err, data) {
      if (err) res.send(err);  
        res.json(data);
    });     
  });


// api to return a list of all items in all sections of a process based its id
// This will be used to check when adding a new items
// if new items not a duplication, then will add
// Ok work
api.route('/process/all/itemList/:process_id')
.get(function(req,res){
    Processes.findOne({_id:req.params.process_id}) 
    .select('sections.items')
    .exec(function(err, data) {
      if (err) res.send(err);  
        res.json(data);
    });     
});

  //  on routes that end in /process/:process_id
  api.route('/process/:process_id')

    // get the process with that id
    // work ok
    .get(function (req, res) {
      Processes.findById(req.params.process_id, function (err, process) {
        if (err) res.send(err);

        // return that process
        res.json(process);
      });
    })

  // update the process with this id
  // work ok 
    .put(function (req, res) {
      Processes.findById(req.params.process_id, function (err, process) {
        if (err) res.send(err);

        // set the new process information if it exists in the request
        if (req.body.name) process.name = req.body.name;
        if (req.body.description) process.description = req.body.description;
        if (req.body.type) process.type = req.body.type;
        if (req.body.status) process.status = req.body.status;

        // save the process
        process.save(function (err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'Process updated!' });
        });

      });
    })


    // delete the process with this process-id
    // work ok
    .delete(function (req, res) {
      Processes.remove({
        _id: req.params.process_id
      }, function (err, process) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted' });
      });
    });
};