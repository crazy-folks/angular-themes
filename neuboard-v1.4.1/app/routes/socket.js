var Msg = require('../models/notification.js');
var User = require('../models/user.js');
var ChatUser = require('../models/chatUser.js');

module.exports = function (io, server) {
  var clients = [];

  // Interval function to poll all sockets every 10 minutes for connectivity and remove as necessary:
  setInterval(function () {
      console.error("Checking " + clients.length + " socket(s) for connectivity...");
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].socket == null) {
          console.warn("NULL socket found: " + clients[i].userid);
          clients.splice(i, 1);
        }
        if (!clients[i].socket.connected) {
          console.warn("Disconnected socket found: " + clients[i].userid);
          clients.splice(i, 1);
        }
      }
    }, 600000);

  io.on('connection', function (socket) {
    console.info('New client connected (id=' + socket.id + ').');
    clients.push({ socket: socket, userid: '' });
    console.info('Number of connected clients: ' + clients.length);

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function () {
      var index = clients.indexOf(socket);
      if (index != -1) {
        clients.splice(index, 1);
        console.info('Client gone (id=' + socket.id + ').');
      }
    });

    
    
    socket.on('msg:update', function (data) {
      console.log('UPDATE MSG: ' + JSON.stringify(data));
      for (var i = 0; i < data.all.length; i++) {
        var notified = false;
        for (var j = 0; j < clients.length; j++) {
          if (data.all[i] == clients[j].userid) {
            notified = true;
            clients[j].socket.emit('msg:new', data);
            data.all.splice(i, 1);
            if (i > 0) i--;
          }
        }

        if (!notified) {
          User.findOne()
          .where('_id').equals(data[i])
          .exec(function (err, user) {
            if (err) return console.log(err);
            else if (user) {
              var newMsg = new Msg();
              newMsg.userid = user._id;
              newMsg.name = user.name;
              newMsg.msg = "New chat message!";
              newMsg.time = Date.now();
              newMsg.unread = true;
              newMsg.save(function (err) {
                if (err) console.log('Error saving notification message: '
                  + JSON.stringify(err) + '\n\nMSG: ' + JSON.stringify(newMsg) + '\n\nDATA[i]: ' + data[i]);
              });
            }
          });
          
        }
      }
    });

    
    socket.on('msg:user', function (data) {
      console.log('Socket linked to user id: ' + data);
      var exists = false;
      clients.forEach(function (client, idx) {
        if (client.socket == socket) {
          exists = true;
          client.userid = data;
          ChatUser.findOne()
          .where('userid').equals(client.userid)
            // send 3 most recent incoming chat messages:
          .populate({ path: 'msgs', match: { 'to_id': { $in: [client.userid] } }, options: { sort: '-time', limit: 3 } })
          .exec(function (err, data) {
            
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              // success
              if (data && data.msgs) {
                client.socket.emit('notify:update', data.msgs);
              }
              
            }
          });
          return;
        } else if (client.userid == data) {
          clients.splice(idx, 1);
        }
      })
      if (!exists) clients.push({ socket: socket, userid: data });

    })
  });
  
}