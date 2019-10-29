const mongo = require('mongoose');


var Schema   = mongo.Schema;
 
var ContactSchema = new Schema({
    email: String,
    subject: String,
    message  : String,
    created  : Date
});
 
var Contact =  mongo.model( 'Contact', ContactSchema );
 module.exports = Contact;