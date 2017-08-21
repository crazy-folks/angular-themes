var newProcess = require('../models/newProcess.js')
var categoryProcess = require('../models/categoryProcess.js')
var primaryPart = require('../models/primaryPart.js')
var processData = require('../models/processData.js')
var fs = require('fs')
var File = require('../models/files.js');
var crypto = require('crypto');
var fileCategory = require('../models/fileCategory.js');
var AgreementCategory = require('../models/agreementCategory.js');
var Code = require('../models/code');
var Category = require('../models/category');
var Descriptor = require('../models/descriptor');
var VaultValue = require('../models/vaultValue');

module.exports = function (api) {

    api.route('/processCreate/:user_id/:user_name')
        // create an process
        .post(function (req, res) {

            categoryProcess.findOne({"userid":req.params.user_id}, function(err, result) {
                if (err) res.send(err);
                //console.log("name of process" + req.body.category.name);
                if(result == null) {
                    var Category = new categoryProcess();
                    Category.userid = req.params.user_id;
                    Category.owner = req.params.user_name;
                    Category.category.push(req.body.category.name);
                    Category.save(function (err) {
                        if (err) {
                            console.log(err)
                            return res.json({type:"info", message:err});
                        } else {
                            console.log({type:"success", message: "Process category add"})
                        }
                    });
                } else {
                    var temp = result.category.map(function(value){
                        return value.toUpperCase();
                    })
                    if(req.body.category.name) {
                        var pos = temp.indexOf(req.body.category.name.toUpperCase());
                        if (pos == -1) {
                        var temp = req.body.category.name;
                        // var string = temp.charAt(0).toUpperCase() + temp.substring(1).toLowerCase();
                        result.category.push(temp);
                        result.save(function (err) {
                            if (err) {
                                return res.json({type:"info", message:err});
                            } else {
                                console.log({type:"success", message: "Add another one"})
                            }
                        });
                    } else {
                        console.log("Checking if function work");
                    }
                    }
                    
                }
            });
            
            newProcess.findOne({"_id":req.body._id}, function(err, result) {
                if(result == null) {
                    var process = new newProcess();
                    process.userid = req.params.user_id;
                    process.owner = req.params.user_name;
                    process.name = req.body.processName;
                    process.description = req.body.processDescription;
                    process.sections = req.body.sections;
                    process.category = req.body.category.name;
                    process.save(function (err) {
                        if (err) {
                            console.log(err);
                            return res.send({type:"info", message:"Can't create process with duplicate name"});
                        } else {
                            res.send({type:"success", message: "New process created"})
                        }
                    });
                } else {  // override the data
                    console.log("override the data")
                    newProcess.update(
                    {_id: req.body._id},
                    {name : req.body.name, description: req.body.description, sections:req.body.sections}
                )
                .exec(function(err, data) {
                    if (err) res.send(err);
                    res.json({type:"success",message: 'Successfully update process' });
                });
                }
            });

            

        })

        // get all processes of this user based user id and category
        .get(function(req,res){

            newProcess.find()
                .where('userid').equals(req.params.user_id)
                .where('category').equals(req.params.user_name)
                .select('name')
                .exec(function (err, processes) {
                    if (err) res.send(err)
                    else{
                        res.json(processes);
                    }
                })
        });


    api.route('/getAProcess/:process_id')

        .get(function(req,res){
            newProcess.findOne()
                .where('_id').equals(req.params.process_id)
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        res.json(process);
                    }
                })
        });


    api.route('/modifyProcess/:info_id')

        .get(function(req,res){
            // console.log(req.params.user_id);
            newProcess.find({'sections.participants.sharesubscribers':req.params.info_id})
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        //console.log(process);
                        res.json(process);
                    }
                })
        })

        .delete(function(req,res){
            newProcess.remove({
                _id: req.params.info_id
            }, function (err, data) {
                if (err) res.send(err)
                else
                    res.json({type:"success", message: 'Successfully deleted the process' });
            });
        });

    api.route('/partProcess/:user_id/:processName')

        .post(function(req,res){
            categoryProcess.findOne({"userid":req.params.user_id}, function(err, pCategory) {
               // console.log(pCategory);
               // console.log(req.body);
                if (pCategory.priParts.length == 0) {
                    for (var i = 0; i < req.body.length; i++){
                        var pPart =  {};
                        pPart['cusid'] = req.body[i].sharesubscribers;
                        pPart['cusName'] = req.body[i].shareName;
                        pPart['processName'] = req.params.processName;
                        pPart['completion']  = "0",
                        pPart['updatedAt'] = Date.now();
                        pPart['email'] = req.body[i].email.toLowerCase();
                        pCategory.priParts.push(pPart);
                    }
                } else {
                    for(var i = 0; i < req.body.length; i++) {
                        var pPart =  {};
                        pPart['cusid'] = req.body[i].sharesubscribers;
                        pPart['cusName'] = req.body[i].shareName;
                        pPart['processName'] = req.params.processName;
                        pPart['completion']  = "0",
                        pPart['updatedAt'] = new Date();
                        pPart['email'] = req.body[i].email.toLowerCase();
                        var index = myIndexOf(pPart,pCategory);
                        console.log("index " + index);
                        if(index == -1) {
                            pCategory.priParts.push(pPart);
                        }
                    }

                }

                pCategory.save(function (err) {
                    if (err) {
                        return res.json({type:"info", message:err});
                    } else {
                        return res.json({type:"success", message:"Your request are complete"});
                    }
                });
            });
        });

    api.route('/processCategory/:info_id')
        // get process category of this user based in
        .get(function(req,res){
            categoryProcess.findOne({"userid":req.params.info_id})
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        res.json(process);
                    }
                })
        });


    api.route('/partCategory/:info_id')

        // get process category of this user based id
        .get(function(req,res){
            categoryProcess.aggregate([
                    {'$unwind': '$priParts'},
                    {'$match': {"priParts.cusid": req.params.info_id}},
                    {'$group':
                    {
                        '_id': '$_id',
                        'userid': { '$first': '$userid' },
                        'owner':{'$first': '$owner'},
                        'priParts':
                        {'$push': '$priParts'}
                    }
                    }
                ])
                /* categoryProcess.find(
                 {priParts: {$elemMatch: {cusid: req.params.info_id}}}
                 )*/
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        console.log(process);
                        res.json(process);
                    }
                })
        });


    // get participants in process Category based owner id and category name
    api.route('/processParticipant/users/:userid/:catName')

        .get(function(req,res){
            categoryProcess.aggregate([
                    {'$unwind': '$priParts'},
                    {'$match': {"priParts.processName": req.params.catName, "userid":req.params.userid}},
                    {'$group':
                    {
                        '_id': '$_id',
                        'userid': { '$first': '$userid' },
                        'priParts':
                        {'$push': '$priParts'}
                    }
                    }
                ])
                /* categoryProcess.find(
                 {priParts: {$elemMatch: {cusid: req.params.info_id}}}
                 )*/
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        console.log(process);
                        res.json(process);
                    }
                })
        });


    api.route('/saveProcess/:info_id/:processid/:category/:process/:owner/:state/:name/:processname')

        .post(function(req,res){
            var temp = req.params.info_id , temp1 = req.params.processid , temp2 = req.params.category, temp3 = req.params.process, temp4 = req.params.owner, temp5 = req.params.state, temp6 = req.params.name;
            //console.log("test1 " + temp + " " + temp1 + " " + temp2 + " " + temp3);

            // function to save process data to vautl
            saveProcessDataToVault(temp,req.params.processname, req.body);

            processData.findOne({"User_id": req.params.info_id, "Process_id":req.params.processid}, function(err, result) {
                if (err) res.send(err);
                // no data with this process of this user id
                if(result == null) {
                    // create one and just save the process
                    var processSave = new processData();
                    processSave.User_id = req.params.info_id;
                    processSave.Process_id = req.params.processid;
                    processSave.category = req.params.category;
                    processSave.feeds = req.body;
                    processSave.save(function (err) {
                        if (err) {
                            //console.log(err);
                            return res.send({type:"info", message:"There is an error in saving the data"});
                        } else {
                            addProStat(temp,temp1,temp2,temp3, temp4);
                            if((temp3 == "Insurance Application" && temp5 == "main")|| (temp3 == "3. Loan Estimate" && temp5 == "main")) {
                                fillInsuranceForm(req.body, temp, temp4, temp6, temp3)
                            }
                            res.send({type:"success", message: "Process data save"})
                        }
                    });
                } else { // Already have data
                    result.feeds = req.body;  // just overide the data
                    result.save(function (err) {
                        if (err) {
                            return res.json({type:"info", message:err});
                        } else {
                            addProStat(temp,temp1,temp2,temp3,temp4);
                            if((temp3 == "Insurance Application" && temp5 == "main")|| (temp3 == "3. Loan Estimate" && temp5 == "main")) {
                                fillInsuranceForm(req.body, temp, temp4, temp6, temp3)
                            }
                            res.send({type:"success", message: "Process data save"})
                        }
                    });
                } // end of else
            })

        });

    api.route('/getCategoryFileID/:info_id')
    .get(function(req,res){
        fileCategory.findOne({"subscriberid": req.params.info_id, "categoryName":"Filled Forms"})
                .select('_id')
                .exec(function (err, id) {
                    if (err) res.send(err)
                    else{
                        res.json(id);
                    }
                })
    });

    api.route('/bgetFilledFiles/:processid/:lenderid/:bid')
    .get(function(req,res){
        //console.log(req.params.processid + " " + req.params.lenderid + " " + req.params.bid);
        File.find({"vaultcategoryid": req.params.processid, "owner": req.params.lenderid, "shareid": req.params.bid})
                .select('filename')
                .exec(function (err, id) {
                    if (err) res.send(err)
                    else{
                        console.log(id);
                        res.json(id);

                    }
                })
    });

    api.route('/getSaveProcess/:info_id/:processid')

        .get(function(req,res){
            processData.findOne({"User_id": req.params.info_id, "Process_id":req.params.processid})
                .exec(function (err, process) {
                    if (err) res.send(err)
                    else{
                        res.json(process);
                    }
                })
        });


    api.route('/addUserIdToProcess')
        .post(function(req,res){
         //console.log("in the add user id to process");
         //console.log(req.body);
         var email = req.body.email.toLowerCase();

        AgreementCategory.find({"email":email, "processcatid" : {"$exists" : true}})
        .exec(function(err,agreements){
            var counter = 0;
           for (var i = 0 ; i < agreements.length; i++) {
                counter++;
               categoryProcess.findOne(agreements[i].processcatid)
               .update({
                "_id": agreements[i].processcatid,
                priParts: {
                    $elemMatch: {
                        "cusid": null,
                        "email": email,
                    }
                }
            }, {
                $set: {
                    "priParts.$.cusid": req.body._id
                }
            }, function(err, data) {
                if(err) {
                    console.log(err)
                } else {
                    console.log("update ok")
                }
            });
           }
           if(counter == agreements.length) {
              res.json({type:"info", message: "Update ok"})
           }
        })
    });
    
    api.route('/addUserIdToPart')
        .post(function(req,res){
            
    });

    api.post('/tempcodes', function (req, res, next) {
    if (req.body.role) {
      var code = new Code();
      code.role = req.body.role;
      // ---- GEN CODE -----
      function rng() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      var guid = (rng() + rng() + "-" + rng() + "-4" + rng().substr(0,3) + "-" + rng() + "-" + rng() + rng() + rng()).toLowerCase();
      console.log("New code generated: " + guid);
      code.code = guid;
      // ---- GEN CODE -----

      code.save(function (err) {
        if (err) {
          res.json({success: false, message: "Error adding new code: " + err});
        } else {
          res.json({success: true, message: "Successfully added new code.", code: code.code, role: code.role});
        }
      });
    }

  });

    function saveProcessDataToVault(userid,categoryName, processData) {
 
        Category.findOne({"subscriberid":userid, "name": categoryName}, function(err,result){
            if(err) console.log(err);
            if(!result) { // no category found 
                var category = new Category();      // create a new instance of the Category model
                category.name = categoryName; 
                category.subscriberid = userid;
                category.save(function(err) {
                    if (err) { console.log(err); } 
                    else { console.log('Category created.');}
                });
                 // find again to add descriptor and value
                    Category.findOne({"subscriberid":userid, "name": categoryName}, function(err,other){
                    if(err) console.log(err); 
                    // can't have no result since we create with above code 
                    if(other != null) { // then create the descriptor table associate
                        console.log(other._id)
                        for (var key in processData) {
                            if (processData.hasOwnProperty(key)) {
                            var obj = processData[key];
                            for(var key in obj) {
                                if( obj.hasOwnProperty(key)) {
                                
                                if(key != 'undefined') {
                                    console.log(key + " " + obj[key]);
                                    // create new vault value and descriptor 
                                    var vaultValue = new VaultValue();      // create a new instance of the Vault Value model  
                                    var descriptor = new Descriptor();      // create a new instance of the Descriptor model

                                    vaultValue.value = obj[key];
                                    vaultValue.subscriberid = userid;  // set the vaultvalue subscriberid (comes from the request)
                                    vaultValue.type = "text"; 
                                    descriptor.name = key;  
                                    descriptor.categoryid = other._id;  
                                    descriptor.subscriberid = userid;  
                                    descriptor.vaultvalues.push(vaultValue);
                                    descriptor.save(function (err) {
                                    if (err) { 
                                        console.log("Data validation fail");
                                    } else {
                                        console.log("Descriptor create");
                                    } 
                                    });  
                                }  
                                }
                            }
                            }
                        }
                    }
                });
        


            } else { // have a category meant also have the descriptor in category
                console.log("Do nothing for now");
            }
        })
            
        
       
    }
            

    function  fillInsuranceForm (dataPDF, userid, lenderid, name, processName) {     
       // console.log(dataPDF);
        var pdflabel = [];
        var pdfFiller   = require('pdffiller');

        if(processName == 'Insurance Application') {
            var sourcePDF = "public/forms/source/ZurichILI.pdf";
            var destinationPDF =  "public/forms/dest/FilledZurichILI" + userid + ".pdf";
            pdflabel = ["9 Address Street City State Zip Code Country","14 Annual Income", "undefined_3", "3 Birth Date MMDDYYYY", "4 Birth Place CountryState", "18 Country of Citizenship", "21 Country of Permanent Residence", 
            "11 Driver s License Number and Expiration Date", "10 Driver s License State of Issue", "8 Email Address", "13 Employer Name and Address", "20 Expiration Date", "2 Gender", "Green Card",
            "6 Home Phone Number", "19b If Visa provide type", "1 Name First Middle Initial Last" ,"15 Net Worth approximate", "12 Occupation", "undefined",   
             "5 Social Security Number", "7 Work Phone Number", "22 Years in the US"];
        } else if (processName == '3. Loan Estimate') {
            var sourcePDF = "public/forms/source/201311Loan-estimate_blank.pdf";
            var destinationPDF =  "public/forms/dest/FillLoanEstimate" + userid + ".pdf";
            pdflabel = ["Applicants" ,"Balloon Payment", "Date Issued", "Estimated Escrow", "Estimated Taxes Insurance Assessments", "Estimated Total Monthly Payment", "Interest Rate",  "Loan Amount",  "Loan ID #", "Loan Term", "Conventional", "Monthly Principal  Interest",
            "Mortgage Insurance",  "Prepayment Penalty",  "Principal  Interest", "Product", "Property", "Purpose", "YES until", "Sale Price"    
            ];
        } 
       
        var orderPDF = {};
        var tempArr = {};
        for (var key in dataPDF) {
            if (dataPDF.hasOwnProperty(key)) {
                var obj = dataPDF[key];

                for (var anotherKeys in obj) {
                    if (obj.hasOwnProperty(anotherKeys)) {
                        if(anotherKeys != 'undefined') {
                            tempArr[anotherKeys] = obj[anotherKeys];
                        }
                        
                    }
                }
    
            }
        }

       // tempArr.sort();
       // console.log(tempArr);
        var keys = Object.keys(tempArr),
        i, len = keys.length;

        keys.sort();

        for (i = 0; i < len; i++) {
            if(keys[i] != 'undefined') {
                orderPDF[keys[i]] =  tempArr[keys[i]];
            }
        }
        //console.log(orderPDF);
        
 
        if(processName == 'Insurance Application') {
            var data = convertData(orderPDF, pdflabel );
           
        } else if (processName == '3. Loan Estimate'){
            var data = LoanEstData(orderPDF, pdflabel );
           
        }
       // console.log(data);
        pdfFiller.fillForm(sourcePDF, destinationPDF, data, function(err) {
            if (err) throw err;
            console.log("In callback (we're done).");
            fileFolder(userid, lenderid, 1, name, processName);
            setTimeout(function() {
                fileFolder(userid, lenderid, 2, name, processName);
            }, 4000)
        });
    }

    function LoanEstData(orderPDF, pdflabel ){
       // console.log(orderPDF);
       // console.log(pdflabel);
         var runner = 0;
        var data = {} ;
        for (var key in orderPDF){
            if(orderPDF.hasOwnProperty(key)) {
                if(orderPDF[key] == "Conventional" || orderPDF[key] == "FHA" || orderPDF[key] == "VA") {
                    pdflabel[runner] = orderPDF[key];
                    orderPDF[key] = "On";
                } else if (orderPDF[key] == 'YesUntil') {
                    orderPDF[key] = 'On';
                } else if (orderPDF[key] == 'No') {
                     orderPDF[key] = 'Off';
                }
                data[pdflabel[runner]] = orderPDF[key];
                runner++;
            }
        }
        return data;
    }

    function convertData(orderPDF, pdflabel) {
        var runner = 0;
        var data = {} ;
        //console.log(orderPDF);
        for (var key in orderPDF) {
            if (orderPDF.hasOwnProperty(key)) {
                //data[pdflabel[runner]] = orderPDF[key];

                if(orderPDF[key] == "Yes") {
                    data[pdflabel[runner]] = "On";
                } else if (orderPDF[key] == "No") {

                    if(pdflabel[runner] == "undefined_3") {
                        pdflabel[runner] = "undefined_4";
                    } else if (pdflabel[runner] == "undefined") {
                        pdflabel[runner] = "undefined_2";
                    }
                    data[pdflabel[runner]] = "On";
                }
                else if (orderPDF[key] == "GreenCard") {
                    data[pdflabel[runner]] = "On";
                } else if (orderPDF[key] == "Visa"){
                    pdflabel[runner] = "Visa";
                    data[pdflabel[runner]] = "On";
                }
                else {
                    data[pdflabel[runner]] = orderPDF[key];
                }
                runner++;
            }
           
    }
        return data;
    }


    function saveFillForms(id1, id2, id3, categoryid,state, name, processName) {
        if(processName == 'Insurance Application') {
            var string = "FilledZurichILI_" + name.toUpperCase() + ".pdf";
        } else if (processName == '3. Loan Estimate') {
            var string = "FilledLoanEst_" + name.toUpperCase() + ".pdf";
        }

        console.log("id1 " + id1 +  " id2 " + id2 + " categoryid " + categoryid + " state " + state);
       
        File.findOne({"owner":id1, "filename":string, "vaultcategoryid":categoryid}, function (err, result) {
            if (err) console.log(err);
            if(result == null) { // don't have save file
                console.log("no file before");
                newFileAdd(id1,id2, id3, categoryid,state, name, processName);
            } else {
                console.log("Have a file before");
                updateExstingOne(id1,id2, id3, categoryid, result, state, processName);
            }

        });
    }

    function updateExstingOne(id1,id2, id3,categoryid, result,state, processName){
        if(processName == 'Insurance Application') {
            var path = "public/forms/dest/FilledZurichILI" + id2 + ".pdf";
        } else if (processName == '3. Loan Estimate') {
            var path = "public/forms/dest/FillLoanEstimate" + id2 + ".pdf"
        }

        fs.readFile(path, function (err, data) {
            if(err) console.log(err);
            var buf = [], len = 0;
            var meta = {};
            var md5 = crypto.createHash('md5');
            buf.push(data);
            len = len + data.length;
            result.length = len;
            result.file.data = Buffer.concat(buf, len);
            md5.update(result.file.data);
            meta['md5'] = md5.digest('hex');
            result.metadata = meta;
            result.save(function (err, data) {
                if (err) console.log(err);
                else {
                    console.log("Save to mongodb");
                    console.log("state " + state);
                    if(state == 2) {
                        unlinkFilledFile(path);
                    }
                }
            });
        });
    }

    function newFileAdd(id1,id2, id3, categoryid,state, name, processName) {
        if(processName == 'Insurance Application') {
            var path = "public/forms/dest/FilledZurichILI" + id2 + ".pdf";
        } else if (processName == '3. Loan Estimate') {
            var path = "public/forms/dest/FillLoanEstimate" + id2 + ".pdf"
        }
        fs.readFile(path, function (err, data) {
            if(err) console.log(err);
            var newFile = new File();
            var buf = [], len = 0;
            var meta = {};
            var md5 = crypto.createHash('md5');
            if(state == 1) {
                newFile.owner = id2;
                newFile.shareid = id3;
            } else if (state == 2) {
                newFile.owner = id1;
                newFile.shareid = id2;
            }
            newFile.vaultcategoryid = categoryid;
            if(processName == 'Insurance Application') {
                newFile.filename = "FilledZurichILI_" + name.toUpperCase() + ".pdf";
            } else if( processName == '3. Loan Estimate' ) {
                newFile.filename = "FilledLoanEst_" + name.toUpperCase() + ".pdf";
            }
           
            newFile.file.contentType = "application/pdf";
            buf.push(data);
            len = len + data.length;
            newFile.length = len;
            newFile.file.data = Buffer.concat(buf, len);
            md5.update(newFile.file.data);
            meta['md5'] = md5.digest('hex');
            newFile.metadata = meta;
            newFile.save(function (err, data) {
                if (err) console.log(err);
                else {
                    console.log("Save to mongodb");
                    console.log("state " + state);
                    if(state == 2) {
                        unlinkFilledFile(path);
                    }
                }
            });
        });
    }

    function unlinkFilledFile(path) { 
        fs.unlink(path, function (err) {
            if (err) throw err;
            else console.log('successfully deleted filled File');
        });
        
    }

    function fileFolder(userid, lenderid, state, name, processName) {
        if(state == 1) {
            exeFunc(userid, userid, lenderid, state, name, processName);
        }
        else if (state == 2){
            exeFunc(lenderid,userid, userid, state, name, processName);
        }
    }

    function exeFunc (id1, id2, id3, state, name, processName) {
        fileCategory.findOne({"subscriberid":id1, "categoryName": "Filled Forms"}, function (err, result) {
            if (err) console.log(err);
            //if don't have the file cateogry create the category id
            //console.log("result " + result);
            if(result == null) {
                console.log("no category before " + result);
                var fCat = new fileCategory();
                fCat.categoryName = "Filled Forms";
                fCat.description = "Folder contains filled Forms";
                //fCat.owner = req.params.user_name;
                fCat.subscriberid = id1;
                fCat.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        fileCategory.findOne({"subscriberid":id1, "categoryName": "Filled Forms"}, function (err, result) {
                            console.log("result in else ");
                            saveFillForms(id1, id2, id3, result._id, state, name, processName)
                        });
                    }

                });
            } else { //
                console.log("have a category ");
                saveFillForms(id1, id2, id3, result._id, state, name, processName)
            }
        });
    }


    function addProStat (userid, processid, category, process, owner) {
        categoryProcess.findOne({"userid": owner})
            .update({
                "userid": owner,
                priParts: {
                    $elemMatch: {
                        "cusid": userid,
                        "processName":category,
                    }
                }
            }, {
                $addToSet: {
                    'priParts.$.borrowerInfo': {
                        "processid": processid,
                        "currentProcess": process
                    }
                },
                "$set": {
                    "priParts.$.completion": "10",
                    "priParts.$.updatedAt": new Date()
                }
            }, function(err, data) {
                console.log(err);
            });

    }

    function myIndexOf(o, arr) {
            for (var i = 0; i < arr.priParts.length; i++) {
                //console.log(o.cusid +  " " + o.processName + " " + o.cusName);
                if (arr.priParts[i].cusid == o.cusid && arr.priParts[i].processName == o.processName && arr.priParts[i].cusName == o.cusName) {
                    return i;
                }
            }
        return -1;
    }
};