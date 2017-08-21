'use strict';

exports = module.exports = { // Can not put all settings here as this needs a restart to be applied (****verify****)
  // List of user roles
  userRoles: ['guest', 'user', 'manager', 'admin'],
  reviewSettings: {
    enabled: true, // Enables review for products
    moderate: false // If enabled, the review will be visible to public after admin approval
  },
  wishlist: true,
  mailOptions : {
    forgotPassword: function(body){
      return {
        from: 'passwordreset@codenx.com',
        to: body.to,
        subject: 'Material Shop Password Reset Request',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + body.host + '/reset/' + body.token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
    },
    resetPassword: function(body){
      return {
        from: 'passwordreset@codenx.com',
        to: body.to,
        subject: 'Material Shop Password Changed',
        text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + body.to + ' has just been changed.\n'
        }
    },
    orderPlaced: function(body){
      return {
        from: 'CodeNx <admin@codenx.com>',
        to: body.to,
        subject: 'Order Placed Successfully',
        text: "Order No: "+body.orderNo
            +"\n Status: "+body.status
            +"\n\n Payment Method: "+body.payment_method 
            +"\n\n Payment ID: "+body.id 
            +"\n Amount: "+body.amount.total + " " + body.amount.currency
            +"\n\n Address: \n Name: "+body.address.recipient_name 
            +"\n Line: "+body.address.line1
            +"\n City: "+body.address.city
            +"\n State: "+body.address.state
            +"\n Zip: "+body.address.postal_code
        }
    },
    orderUpdated: function(body){
      return {
        from: 'CodeNx <admin@codenx.com>',
        to: body.to,
        subject: 'Your Order Status Updated',
        text: "Order No: "+body.orderNo
            +"\n Status: "+body.status
            +"\n\n Payment Method: "+body.payment_method 
            +"\n\n Payment ID: "+body.id 
            +"\n Amount: "+body.amount.total + " " + body.amount.currency
            +"\n\n Address: \n Name: "+body.address.recipient_name 
            +"\n Line: "+body.address.line1
            +"\n City: "+body.address.city
            +"\n State: "+body.address.state
            +"\n Zip: "+body.address.postal_code
        }
    }
  }
};
