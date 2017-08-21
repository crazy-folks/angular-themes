var Code = require('../models/code');


module.exports = function (api) {
  api.get('/codes', function (req, res, next) {
    Code.find({}).exec(function (err, codes) {
      if (err) res.json({success:false, message: 'Error reading add codes: ' + err});
      else res.json(codes);
    });
  });

  api.post('/codes', function (req, res, next) {
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

};