'use strict';

import mongoose from 'mongoose';

var MediaSchema = new mongoose.Schema({
  originalFilename: String,
  path: String,
  size: String,
  type: String,
  name: String,
  active: Boolean
});

export default mongoose.model('Media', MediaSchema);
