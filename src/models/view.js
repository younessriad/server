const mongo = require('mongoose');



const Schema = mongo.Schema;

var ViewSchema = new Schema({
  page: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
  },
  created  :{
    type: Date,
    required: true,
    
  } 



});

View = mongo.model('View', ViewSchema);



 module.exports = View;

