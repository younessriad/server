const mongo = require('mongoose');
const User = require('./user');

const Category = require('./category');


const Schema = mongo.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  titleurl: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
  },
  user: [{ "type": mongo.Schema.Types.ObjectId, "ref": "User" }],
  comments: [{type:Schema.ObjectId, ref:'Comment'}],
  category: [{ "type": mongo.Schema.Types.ObjectId, "ref": "Category" }],
  created  : { type: Date,  required: true},
  image: {
    type: String,
    required: true,
  }
});
//module.exports = User;
var Article = mongo.model('Article', ArticleSchema);


 module.exports = Article;