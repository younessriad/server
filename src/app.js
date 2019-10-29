const express = require('express');
const mongo = require('mongoose');
const path= require('path');
const http = require('http');
var cors = require('cors');
const userRouter = require('./routes/userRouter');
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');
const contactRouter = require('./routes/contactRouter');
const viewRouter = require('./routes/viewRouter');

const categoryRouter = require('./routes/categoryRouter');

const JSRSASign = require('jsrsasign');
console.log(__dirname +'/public/')
//const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;



//console.log(__dirname +'/public/images/')
publicpath=path.join(__dirname +'/public/');
//const path= require('path');

const app = express();
//app.use(express.static('public'));

let  server = http.createServer(app);
app.use(express.static(publicpath));
connections =[];
app.use(cors());



mongo.connect('mongodb://localhost:27017/mernapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongo.connection.on('connected',()=>{
  console.log("Server connected with  mongodb" );
});
mongo.Promise = global.Promise;


mongo.connection.on('error',(err)=>{
  console.log("Server connection with  mongodb have error"+err+"/n" );

});




let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'By World',
   },
};




app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use('/api/comment', commentRouter);
app.use('/api/contact', contactRouter);
app.use('/api/view', viewRouter);
app.use('/api/category', categoryRouter);



app.get('/home', (req, res) => {
  return res.send(Object.values(messages));
});
app.post('/home', (req, res) => {
  console.log(req.body  );      // your JSON
  //response.send(req.body); 
  return res.send(Object.values(messages));
});

module.exports=app;