const mongo = require('mongoose');
const User = require('./user');


var Schema   = mongo.Schema;
 
var CommentSchema = new Schema({
    user: [{ "type": mongo.Schema.Types.ObjectId, "ref": "User" }],
    content  : String,
    created  : Date
});
 
var Comment =  mongo.model( 'Comment', CommentSchema );
 module.exports = Comment;