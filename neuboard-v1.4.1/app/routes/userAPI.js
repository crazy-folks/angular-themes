var User = require('../models/user');


module.exports = function (api) {
  // on routes that end in /users
  // ----------------------------------------------------
  api.route('/users')

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function (req, res) {

      User.find({}, function (err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
      });
    });

  // on routes that end in /users/:user_id
  // ----------------------------------------------------
  api.route('/users/:user_id')

    // get the user with that id
    .get(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);

        // return that user
        else res.json(user);
      });
    })

    // update the user with this id
    .put(function (req, res) {
      User.findById(req.params.user_id, function (err, user) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        user.name = req.body.name;
        user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        user.email = req.body.email;
        user.userRoles = req.body.userRoles;
        user.avatar = req.body.avatar;

        // save the user
        user.save(function (err) {
          if (err) {
            if (err.code == 11000) {
              if (err.toString().indexOf('email') >= 0) {
                res.json({type: 'danger', message: 'This email address is already in use.'});
              } else {
                res.json({type: 'danger', message: 'This username is already in use.'});
              }
            } else {
              res.json({type: 'danger', message: 'Error saving user information: ' + err});
            }

          } else {
            // return a message
            res.json({type: 'success', message: 'Successfully updated user information.'});
          }

        });

      });
    })

    // delete the user with this id
    .delete(function (req, res) {
      User.remove({
        _id: req.params.user_id
      }, function (err, user) {
        if (err) res.send(err);

        res.json({message: 'Successfully deleted'});
      });
    });


  // api endpoint to get user information
  api.get('/me', function (req, res) {
    // res.json(user);
    res.send(req.decoded);
  });

  api.get('/participantAsMe/:user_id', function (req, res) {
    console.log(req.params.user_id);
    User.findOne({'_id': req.params.user_id}, function (err, user) {
      if (err) res.send(err);
      else
      // return the user
        res.json(user);
    });
  });

  api.get('/my_id', function (req, res) {
    User.find({'username': req.decoded.username}, function (err, user) {
      if (err) res.send(err);

      // return the user
      res.json(user);
    });
  })
};