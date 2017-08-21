/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Order from './order.model';
import * as config from '../../config/environment/shared'
import * as email from '../sendmail/send'

function orderPlaced(res, statusCode) {
  res.req.body.to = res.req.body.email;
  res.req.body.id = 'Cash';
  email.send(config.mailOptions.orderPlaced(res.req.body))

  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function orderUpdated(res, statusCode) {
  email.send(config.mailOptions.orderUpdated(res.req.body))

  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Get all orders by a user
export function myOrders(req, res) {
  Order.find({email : req.user.email},function (err, orders) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(orders);
  });
}

// Gets a list of Orders
export function index(req, res) {
  return Order.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {
  req.body.uid = req.user.email; // id change on every user creation hence email is used
  var shortId = require('shortid');
  req.body.orderNo = shortId.generate();

  // When order.status is null, the client will replace with the Array[0] of order status at Settings page
  return Order.create(req.body)
    .then(orderPlaced(res, 201))
    .catch(handleError(res));
}

// Updates an existing Order in the DB
export function update(req, res) {
  if(req.body._id) { delete req.body._id; }
  if(req.body.__v) { delete req.body.__v; }
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(orderUpdated(res))
    .catch(handleError(res));
}

// Deletes a Order from the DB
export function destroy(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
