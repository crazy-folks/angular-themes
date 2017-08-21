'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var ProductSchema = new mongoose.Schema({
  sku:            String,
  name:           String,
  nameLower:      String,
  slug:           String,
  category:       { type: ObjectId, ref: 'Category' },
  status:         String,
  brand:          { type: ObjectId, ref: 'Brand' },
  description:    String,
  variants:       [{ image : String, price : Number, mrp : Number, weight : String, size : String }],
  features:       Array,
  keyFeatures:    Array,
  active:         { type: Boolean, default: true },
  uid:            String,
  created_at    : { type: Date },
  updated_at    : { type: Date, default: Date.now },
  updated:        {type: Date, default: Date.now}
}, { versionKey: false });


export default mongoose.model('Product', ProductSchema);
