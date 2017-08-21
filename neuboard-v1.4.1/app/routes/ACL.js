var Role = require('../models/userRole.js');
var User = require('../models/user.js');

module.exports = function (api, acl) {

  var ACL_Roles = [];

  Role.find({}).exec(function(err, roles) {
    if (!err) {
      roles.forEach(function (role) {
        var newRole = {
          roles: [String(role.name).toLowerCase()],
          allows: []
        };
        role.modules.forEach(function (mod) {
          var newRes = {
            resources: String(mod.name).toLowerCase(),
            permissions: []
          };
          mod.access.forEach(function (acc) {
            newRes.permissions.push(String(acc).toLowerCase());
          });
          newRole.allows.push(newRes);
        });
        newRole.allows.push({
          resources: 'allow',
          permissions: ['get', 'post', 'put', 'delete']
        });
        //newRole.allows.push({
        //  resources: 'deny',
        //  permissions: ['']
        //});
        ACL_Roles.push(newRole);
      });
      acl.allow(ACL_Roles);
      console.log("Added roles to ACL...");

    } else {
      console.error("Error loading Role data from DB: " + err);
    }
  });

  User.find({}).exec(function (err, users) {
    if (!err) {
      users.forEach(function (user) {
        if (user && user.userRoles) {
          acl.addUserRoles(String(user.username).toLowerCase(), String(user.userRoles[0]).toLowerCase());
        }
      });
      console.log("Added users to ACL...");
    } else {
      console.error("Error loading User data for ACL access...");
    }
  });

};