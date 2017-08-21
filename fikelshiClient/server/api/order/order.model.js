'use strict';

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  uid: String,
  email: String,
  phone: String,
  orderNo: String,
  address: Object,
  payment: Object,
  amount: Object,
  exchange_rate: Number,
  items: [{ name: String, sku: String, description: String, price: String, quantity: String, url: String }],
  status: {type: String, default: 'Order Placed'},
  active: { type: Boolean, default: true },
  payment_method: String,
  created_at    : { type: Date },
  updated_at    : { type: Date }
});

OrderSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

export default mongoose.model('Order', OrderSchema);
