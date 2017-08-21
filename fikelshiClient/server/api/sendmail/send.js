'use strict';

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

export function send(req) {
    var options = {
        auth: {
            api_key: process.env.SENDGRID_APIKEY
        }
    }

    var mailer = nodemailer.createTransport(sgTransport(options));
    mailer.sendMail(req, function(error, info){
        var res = {}
        if(error){
            res = {status: 408, err: error}
        }else{
            res = {status: 200, success: true}
        }
        return res
    })
}
