'use strict';

var express = require('express');
var controller = require('./order.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/my', auth.isAuthenticated() , controller.myOrders);
router.get('/', auth.hasRole('manager'), controller.index);
router.get('/:id', auth.hasRole('manager'), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
