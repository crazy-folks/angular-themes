var License = require('../models/license.js');

module.exports = function (api) {

  api.route('/admin/license')

    .get(function (req, res, next) {
      License.find({}).exec(function (err, lic) {
        if (err) return res.json({success: false, message: err});
        else return res.json({success: true, license: lic})
      })
    })

    .post(function (req, res, next) {
      var newLicense = new License();
      newLicense.role = req.body.role;
      newLicense.owner = req.body.owner || null;
      newLicense.code = req.body.code || null;

      newLicense.save(function (err) {
        if (err) return res.json({success: false, message: err});
        else return res.json({success: true, message: 'New license created!'});
      })
    });
};
