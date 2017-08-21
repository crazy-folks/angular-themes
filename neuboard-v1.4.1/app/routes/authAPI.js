var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var path = require('path');
var code = require('../models/code');

// super secret for creating tokens
var superSecret = config.secret;


module.exports = function (api, acl) {

  // passport strategy definition (authentication logic)
  passport.use(new Strategy({session: true},
    function (username, password, done) {
      User.findOne({'username': username}).select('_id name username password').exec(function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'Incorrect username.'});
        }
        if (!user.comparePassword(password)) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      });
    }
  ));

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  api.post('/authenticate', function (req, res, next) {
    passport.authenticate('local',
      function (err, user, info) {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.status(401).json({success: false, message: info.message});
        }

        //user has authenticated correctly thus we create a JWT token
        var token = jwt.sign({
          name: user.name,
          username: user.username,
          id: user._id
        }, superSecret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).json({success: true, token: token});
      })(req, res, next);
  });


  // route middleware to verify a token
  api.use(function (req, res, next) {
    // do logging
    //console.log('Somebody just came to our app!');

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, superSecret, function (err, decoded) {

        if (err) {
          res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;

          // -------- ACL ---------

          // parse URL to determine module
          var url = req.path;
          var resource = url.split('/').slice(1);

          var module;
          switch (resource[0]) {
            case ('panel' || 'event'):
              module = 'dashboard';
              break;
            case ('admin'):
              module = 'admin';
              break;
            case ('users'):
              console.log(req.decoded);
              if (resource[1] && req.decoded.id == resource[1]) module = 'allow'; // this user's profile
              else module = ((resource[1] == null) || (resource[1] == '')) ? 'users' : 'allow';
              break;
            case ('codes'):
              module = 'users';
              break;
            case ('vault'):
              module = 'vault';
              break;
            case ('participant'):
              module = 'participants';
              break;
            case ('processes'):
              module = 'processes';
              break;
            case ('files'):
              module = 'vault';
              break;
            case ('agreements'):
              module = 'agreements';
              break;
            case ('app' || 'assets' || 'forms' || 'Library'):
              module = 'allow';
              break;//'deny'; break;
            case ('roles'):
              module = ((resource[1] == null) || (resource[1] == '')) ? 'roles' : 'allow';
              break;
            case ('KazGetCategories'):
              module = 'vault';
              break;
            default:
              module = 'allow';
          }

          acl.isAllowed(String(decoded.username).toLowerCase(), module, String(req.method).toLowerCase(), function (err, result) {
            //if (!result) console.log("\nMODULE:[" + module + "] RESULT:[" + result + "] Username:["
            //  + String(decoded.username).toLowerCase() + "] URL:[" + url + "] Method:[" + String(req.method).toLowerCase() + "]\n");

            if ((err || !result) && module != 'misc') {
              res.redirect(401, '/401'); // next(new Error("You do not have permission to perform this action."));  // stop access to route
            } else {
              next();
            }
          });
          // -------- ACL ---------


        }
      });

    } else {
      if (req.path == '/newUser' && req.method == 'POST') {
        next();
      } else {
        res.redirect(403, '/403');
      }
      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      //res.status(403).send({
      //  success: false,
      //  message: 'No token provided.'
      //});


    }
  });

  //
  // ============== NEW USER POST ===============
  //
  api.post('/newUser', function (req, res) {
    var newuser = new User();        // create a new instance of the User model
    newuser.name = req.body.name;  // set the users name (comes from the request)
    newuser.username = req.body.username;  // set the users username (comes from the request)
    newuser.password = req.body.password;  // set the users password (comes from the request)
    newuser.email = req.body.email;        // set the users email (required)

    code.findOne({ 'code': req.body.code }).select('code role').exec(function (err, data) {
      if (err) {
        return res.json({success: false, message: 'That Add Code could not be found: ' + err});
      } else {
        if (data) {
          newuser.userRoles = [];
          if (data.role) {
            data.role.forEach(function (item) {
              newuser.userRoles.push(item);
            });
            if (newuser.userRoles.length > 0) {
              newuser.save(function (err){
                if (err) {
                  // duplicate entry
                  return err.code == 11000 ? res.json({
                    success: false,
                    message: 'A user with that username already exists. '
                  }) : res.json({success: false, message: err});
                }
                data.remove();  // REMOVE CODE UPON SUCCESSFUL USER CREATION


                // ADD USER TO ACL:
                acl.addUserRoles(String(newuser.username).toLowerCase(), String(newuser.userRoles[0]).toLowerCase());
                res.status(200).json({success: true, message: 'New user created!'});
              });
            }
          }
        } else {
          if (req.decoded.username) {
            User.findOne({username: req.decoded.username}).exec(function (err, user) {
              if (err) return res.json({success: false, message: 'Error processing request: ' + err});
              else {
                if (user.userRoles.indexOf("admin") >= 0 || user.userRoles.indexOf("dev") >= 0) {
                  newuser.userRoles = [];
                  if (req.body.userRoles) {
                    newuser.userRoles.push(req.body.userRoles);
                    if (newuser.userRoles.length > 0) {
                      newuser.save(function (err){
                        if (err) {
                          // duplicate entry
                          return err.code == 11000 ? res.json({
                            success: false,
                            message: 'A user with that username already exists. '
                          }) : res.json({success: false, message: err});
                        }
                        // ADD USER TO ACL:
                        acl.addUserRoles(String(newuser.username).toLowerCase(), String(newuser.userRoles[0]).toLowerCase());
                        res.status(200).json({success: true, message: 'New user created!'});
                      });
                    }
                  }
                }
              }
            })
          } else return res.json({success: false, message: 'That Add Code could not be found.'});
        }
      }

    });
  });


  api.get('/logout', function (req, res, next) {
    req.logout();
    res.end();
  });

};