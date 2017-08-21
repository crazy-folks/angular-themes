'use strict';

import {Router} from 'express';
import * as controller from './pay.controller';
import * as auth from '../../auth/auth.service';
import paypal from 'paypal-rest-sdk';
import Order from '../order/order.model';
import jsonpatch from 'fast-json-patch';
import * as sendmail from '../sendmail/send'
import * as config from '../../config/environment/shared'
var shortId = require('shortid');

var router = new Router();

router.post('/stripe', function(req, res) {
    var data = req.body
    var amount = Math.round(data.total*100)
    var stripe = require("stripe")(process.env.STRIPE_APIKEY);

    stripe.charges.create({
    amount: amount,
    currency: "usd",
    source: data.stripeToken, // obtained with Stripe.js
    description: "Charge for mshop.codenx.com"
    }, function(err, charge) {
        var status
        if(err){
            status = 'Payment failed'
            return res.status(400).json({id: err.requestId, message: err.message});
        }
        else{
            status = 'Paid'
            var address = {recipient_name: data.name, line1: data.address, city: data.city, postal_code: data.zip, state: data.state,country: data.country}
            var orderDetails = {
                orderNo: shortId.generate(),
                uid: data.uid,
                email: data.email,
                phone: data.phone,
                address: address,
                status: status,
                items: data.items,
                payment : {id: charge.id, state:charge.status, cart:null},
                amount: {total: amount/100, currency: data.currency_code},
                exchange_rate: data.exchange_rate,
                created: charge.created,
                payment_method: 'Credit Card',
                                
            }
            // Order.create is from order.model not from order.controller
            Order.create(orderDetails, function(err,d){
                var mailParams = orderDetails
                mailParams.id = charge.id
                mailParams.to = data.email
                sendmail.send(config.mailOptions.orderPlaced(mailParams))
                return res.status(201).json({id: charge.id, message: status});
            })
        }
    });
})

router.get('/prepare', function(req, res) {

    //configure for sandbox environment
    var items = []
    var data = JSON.parse(req.query.data)
    var options = JSON.parse(req.query.options)
    var total = 0
    var subtotal = 0
    var discount = 0
    var shipping = Math.round(options.shipping*options.exchange_rate*100)/100
    if (isNaN(options.exchange_rate) || options.exchange_rate === '') // If exchange rate is not a float value, force this to 1
        options.exchange_rate = 1
    for (var k = 0; k < data.length; k++) {
       var i = data[k]
       var price = Math.round(i.price*options.exchange_rate*100)/100
       subtotal = subtotal + price * i.quantity
       items.push({sku: i.sku, name: i.name, url: i.image, description: i.slug, price: price, quantity: i.quantity, currency: options.currency_code})
    }

    if(options.discount>0){
        discount = -Math.round(options.discount*options.exchange_rate*100)/100
        items.push({sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: discount, quantity: 1, currency: options.currency_code})
    }
    subtotal = subtotal + discount
    total = subtotal + shipping
    paypal.configure({
      'mode': process.env.PAYPAL_MODE, //sandbox or live
      'client_id': process.env.PAYPAL_CLIENT_ID,
      'client_secret': process.env.PAYPAL_CLIENT_SECRET
    });

    var shortId = require('shortid');
    var orderNo = shortId.generate();
    //build PayPal payment request
    var payReq = {
        'intent': 'sale',
        'redirect_urls': {
            'return_url': process.env.DOMAIN+'/api/pay/process',
            'cancel_url': process.env.DOMAIN+'/api/pay/cancel'
        },
        'payer': {
            'payment_method': 'paypal',
            'payer_info': {
                'email': options.email,
                'payer_id': options.uid
            }
        },
        "transactions": [
            {
                "amount": {
                    "total": total,//Math.round(options.total*options.exchange_rate*100)/100,
                    "currency": options.currency_code,
                    "details": {
                        "subtotal": subtotal,//Math.round(options.subtotal*options.exchange_rate*100)/100,
                        "shipping": shipping
                    }
                },
                "invoice_number": orderNo,
                "custom":options.phone,
                "item_list": { 
                    "items":items,
                    "shipping_address":{
                        "recipient_name":options.recipient_name,
                        "line1":options.line1,
                        "city":options.city,
                        "postal_code":options.postal_code,
                        "state": "-",
                        "country_code":options.country_code
                    }
                }
            }
        ]
    };
    paypal.payment.create(payReq, function(error, payment) {
        if (error) {
            console.log('########################## Error', error);
            // string = encodeURIComponent(error.response.details[0].issue);
            var msg = '', id = '', code=''
            if(error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT'){
                msg = 'Not connected to internet'
            }
            else{
                code = '404'
                msg = JSON.stringify(error.response.details)
            }
            res.redirect('/checkout?id='+id+'&msg=' + msg)
        } else {
            // console.log('paymentinfooooooooooooooooooooooooo',JSON.stringify(payment));
            var orderDetails = {uid: payment.payer.payer_info.payer_id,email: options.email,
                phone: payment.transactions[0].custom,
                orderNo: payment.transactions[0].invoice_number,
                address: payment.transactions[0].item_list.shipping_address,
                status: 'Payment Initiated',
                items: payment.transactions[0].item_list.items,
                payment : {id: payment.id, state:payment.state, cart:payment.cart,email:payment.payer.payer_info.email},
                amount: payment.transactions[0].amount,
                exchange_rate: options.exchange_rate,
                created: payment.created_time,
                payment_method: payment.payer.payment_method
            }
            // When order.status is null, the client will replace with the Array[0] of order status at Settings page
            // Order.create is from order.model not from order.controller
            Order.create(orderDetails)
                
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj) {
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })

            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')) {
                res.redirect(links.approval_url.href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });
});
router.get('/process', function(req, res) {
    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };
    var string = ""
    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            // console.log('payment process error', error);
            Order.findOneAndUpdate({'payment.id': paymentId}, {status: 'Payment Error'}, {upsert: false, setDefaultsOnInsert: true, runValidators: true}).exec()
            string = encodeURIComponent('Error occured while receiving payment');
            res.redirect('/checkout?id='+paymentId+'&msg=' + string);
        } else {
            var mailParams = {
                id: payment.id,
                to: payment.payer.payer_info.email,
                orderNo: payment.transactions[0].invoice_number,
                status: payment.state,
                payment_method: payment.payer.payment_method,
                amount : payment.transactions[0].amount,
                address: payment.payer.payer_info.shipping_address
            } 
            // console.log('payment success', payment);
            if (payment.state === 'approved'){ 
                // Save order details so that if no response received, status will Awaiting Payment
                Order.findOneAndUpdate({'payment.id': payment.id}, {status: 'Paid'}, {upsert: false, setDefaultsOnInsert: true, runValidators: true}).exec()
                .then(function(doc){
                    sendmail.send(config.mailOptions.orderPlaced(mailParams))
                    string = encodeURIComponent("Order Placed")
                    res.redirect('/order?id='+paymentId+'&msg=' + string)
                }).then(function(err){
                    if(err){
                        // console.log('Could not find the payment reference',err);
                        sendmail.send(config.mailOptions.orderPlaced(mailParams))
                        string = encodeURIComponent("Payment Received")
                        res.redirect('/order?id='+paymentId+'&msg=' + string)
                    }
                })
            } else {
                Order.findOneAndUpdate({'payment.id': payment.id}, {status: 'Payment Not Approved'}, {upsert: false, setDefaultsOnInsert: true, runValidators: true}).exec()
                string = encodeURIComponent('Payment Not Approved');
                res.redirect('/checkout?id='+paymentId+'&msg=' + string);
            }
        }
})
});
router.get('/cancel', function(req, res) {
    var string = encodeURIComponent('Payment Cancelled');
    res.redirect('/checkout?msg=' + string);
});

module.exports = router;
