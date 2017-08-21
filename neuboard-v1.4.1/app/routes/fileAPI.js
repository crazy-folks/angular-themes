var mongoose = require('mongoose');
var User = require('../models/user');
var File = require('../models/files.js');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var fileCategory = require('../models/fileCategory.js')

var DEFAULT_AVATAR = 'unknown-profile.jpg';

module.exports = function (api) {

  api.route('/files')
   .post(function (req, res) {
     if (req.busboy) {
       var newFile = new File();
       var buf = [], len = 0;
       var meta = {};
       var md5 = crypto.createHash('md5');

       req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
         //console.log('[FIELD] KEY:' + key + ' VALUE:' + value);
         if (key == 'owner') {newFile.owner = value;}
         if (key == 'categoryId') {console.log(value); newFile.vaultcategoryid = value;}
         else meta[key] = value;
       });

       req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
         //console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
         newFile.filename = filename;


         file.on('data', function (data) {
           //console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
           buf.push(data);
           len = len + data.length;
         });
         file.on('end', function () {
           newFile.file.data = Buffer.concat(buf, len);
           md5.update(newFile.file.data);
           newFile.file.contentType = mimetype;
           newFile.length = len;
           //console.log('File [' + fieldname + '] Finished');
           meta['md5'] = md5.digest('hex');
           newFile.metadata = meta;
           File.findOne()
            .where('owner').equals(newFile.owner)
            .where('filename').equals(newFile.filename)
            .exec(function (err, foundfile) {
              if (foundfile == null) {
                newFile.save(function (err, data) {
                  if (err) console.log(err);
                  res.status(200).send('File successfully saved!').end();
                });
              } else {
                delete newFile;
                res.status(409).send('Error uploading file: File already exists!').end();
              }
            });

         });

       });
       req.pipe(req.busboy);
     }
   });

  api.route('/files/all/:userid')
  .get(function (req, res) {
    File.find()
    .where('owner').equals(req.params.userid)
    .select('filename length')
    .exec(function (err, data) {
      if (err) res.send(err);
      res.send(data);
    })
  });

  api.route('/files/images/:userid')
  .get(function (req, res) {
    console.log(req.params.userid);
    File.find()
    .where('owner').equals(req.params.userid)
    .where('file.contentType').regex(/image/)
    .select('filename length')
    .exec(function (err, data) {
      if (err) res.send(err);
      console.log(data);
      res.send(data);
    });
  });

  api.route('/files/:owner/:filename')
 .get(function (req, res) {
  //ok console.log("filename " + req.params.filename);
   var stream;
   if (req.params.filename == 'null') {
     sendDefault(res);
   } else {
     stream = File.findOne()
    .where('owner').equals(req.params.owner)
    .where('filename').equals(req.params.filename)
    .stream();
    sendStream(stream, res);
   }
   
 })
  .delete(function (req, res) {
    if (req.params.owner && req.params.filename) {
      File.findOneAndRemove()
      .where('owner').equals(req.params.owner)
      .where('filename').equals(req.params.filename)
      .exec(function (err, doc, result) {
        if (err) res.json({ type: 'danger', msg: 'Error removing file: ' + err });
        else if (doc) res.json({ type: 'success', msg: 'Successfully deleted file: ' + doc.filename });
      })
    }
  });

api.route('/fileDownload/:fileid')
 .get(function (req, res) {   
    var stream = File.findOne({_id: req.params.fileid})
    .stream();
    sendStream(stream, res);
});

  api.route('/fCategory/:user_id/:user_name')
  .post(function (req, res) {
      var fCat = new fileCategory();
      fCat.categoryName = req.body.categoryName;
      fCat.description = req.body.description;
      fCat.owner = req.params.user_name;
      fCat.subscriberid = req.params.user_id;
      fCat.save(function (err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ type: "info", message: 'The name already exists'});
          else
            return res.send(err);
        }

        // return a message
        res.json({ type: "success" ,message: 'Category created!' });
      });
 })

  .get(function (req, res) {
    //"owner":req.params.user_name
    fileCategory.find({"subscriberid":req.params.user_id}, function (err, categories) {
        if (err) res.send(err);
        // return the users
        res.json(categories);
      });
  });

api.route('/files/:owner/:filename/:catid')

 .delete(function (req, res) {
  console.log(req.params.owner + " " +  req.params.filename + " " + req.params.catid); 
    File.remove({
        'owner' : req.params.owner,
      'filename' : req.params.filename,
      'vaultcategoryid' : req.params.catid
      }, function(err, des) {
        if (err) res.send(err);
        res.json({type:"success", message: 'Successfully delete files'});
      });

  });

api.route('/categoryFunction/:fileCat_id')
// get all file releate to this file category id
.get(function(req,res){
  console.log(req.params.fileCat_id);
  File.find()
    .where('vaultcategoryid').equals(req.params.fileCat_id)
    .select('filename')
    .exec(function (err, files) {
      if (err) res.send(err)
      else{
        //console.log(files);
        res.json(files);
      }   
    })
})
  
.put(function(req,res){
    fileCategory.findOne(
    {_id: req.params.fileCat_id}
  )
  .update(
    {_id: req.params.fileCat_id},
    {$set:{"categoryName": req.body.categoryName, "description":req.body.description}}
  )
  .exec(function(err, data) {
    if (err) { res.json({type:"info", message:err})}
    else  
      res.json({type:"success", message:"File category updated"});
  });   
})

// delete a file category
.delete(function(req,res){
  // delete the file in corresponding category
  File.remove({
    "vaultcategoryid": req.params.fileCat_id
    }, function (err, user) {
    if (err) console.log(err);
    else
      console.log("Success file deleted");
  });

  // remove the category in different table
  fileCategory.remove({
    _id: req.params.fileCat_id
    }, function (err, user) {
    if (err) res.send(err);
    else
      res.json({type:"success", message: 'Successfully deleted the category and its files'});
  });
});

 api.route('/files/share')
 .post(function(req,res){
    File.findById({_id:req.body._id}, function (err, result) {
      if (err) res.send(err);
      var fileShare = result.toObject();
     // console.log(fileShare);
      if(fileShare.sharesubscribers.length < 1) { // no shareid, just add
        File.update(
          {_id: req.body._id},
          {$push:{"sharesubscribers": req.body.sharesubscribers}}
        )
          .exec(function(err, des) {
          if (err) res.send(err);
            res.send({type: 'success', message: "Successfully share the file"});
          });
      } else { // already has the share id in there , need to check in case adding more
        var runner = 0;
        var ableToAdd = false;
        fileShare.sharesubscribers.every(function(id){
          if(id == req.body.sharesubscribers) { // already share with this id
            res.send({type: 'info', message: "You already shared the file with this user"});
              return false;
          } runner++;
            if(runner == (fileShare.sharesubscribers.length)) {
              ableToAdd = true;
            } 
            return true;
        })
        if(ableToAdd) {
          File.update(
          {_id: req.body._id},
          {$push:{"sharesubscribers": req.body.sharesubscribers}}
        )
          .exec(function(err, des) {
          if (err) res.send(err);
            res.send({type: 'success', message: "Successfully share the file"});
          }); 
        } // end of if able to add
      } // end of else 

    });
 });

  api.route('/avatar/:userid')
  .get(function (req, res) {

    // Find User:
    User.findOne()
    .where('_id').equals(req.params.userid)
    .exec(function (err, user) {
      // Find user's avatar if specified
      if (user) {
        File.findOne()
        .where('owner').equals(user._id)
        .where('filename').equals(user.avatar)
        .exec(function (err, file) {
          // If avatar file exists, stream it out
          if (file && file.filename && file.file.data) {
            sendStream(File.findOne()
        .where('owner').equals(user._id)
        .where('filename').equals(user.avatar).stream(), res);
          } else { // else stream out the default picture
            sendDefault(res);
          }
        });
      } else {
        sendDefault(res);
      }
    });
  });

  // stream default from file system file (~30% faster than from DB - observed time)
  var sendDefault = function (res) {
    var filepath = path.join(__dirname, '../../public/assets/img', DEFAULT_AVATAR);
    var stream = fs.createReadStream(filepath);

    stream.on('data', function (file) {
      var outBuffer = new Buffer(file);
      res.write(outBuffer);
      res.end();
    })
  };

  // Sends a file stream output from mongodb to the client
  var sendStream = function (stream, res) {
    var md5 = crypto.createHash('md5');

    stream.on('data', function (file) {
      // Process and send file
      if (file != null && file.file != null && file.metadata.md5 != null) {
        res.writeHead(200, {
          'Content-Length': file.length,
          'Content-Type': file.file.contentType,
          'Transfer-Encoding': 'chunked',
          'Trailer': 'Content-MD5'
        });
        var outBuffer = new Buffer(file.file.data);
        md5.update(outBuffer);
        var digest = md5.digest('hex');
        res.write(outBuffer);
        res.addTrailers({ 'Content-MD5': digest });
      } else {
        res.writeHead(404);
        res.write('Couldn\'t find file!');
      }
    })
    .on('error', function (err) {
      // Stream error occured
      res.writeHead(404);
      res.write(err);
      res.end();
    })
    .on('close', function () {
      // File completed or an error has occured. Terminate stream.
      res.end();
    });

  }

};

