const mongo = require('mongoose');
const User = require('./user');



const Schema = mongo.Schema;


var CategorySchema = new Schema({

  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'active',
  },
  count: {
    type: Number,
    default: 0,
  },
});
//module.exports = User;
var Category = mongo.model('Category', CategorySchema);
module.exports = Category;



