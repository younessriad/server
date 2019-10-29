const express = require('express');
const mongo = require('mongoose');
const path= require('path');
const http = require('http');
var cors = require('cors');
const uploudRouter = require('./uploudRouter');
const bodyParser = require('body-parser');
const JSRSASign = require('jsrsasign');
console.log(__dirname +'/public/')
//const bcrypt = require('bcrypt');



//console.log(__dirname +'/public/images/')
publicpath=path.join(__dirname +'/public/');
//const path= require('path');

const app = express();
//app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2', 
   },
};



const Schema = mongo.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

var User = mongo.model('User', UserSchema);
//module.exports = User;










 // const bcrypt = require('bcryptjs');

  function getAll(req, res) {
 //   User.find().select()
      //  .then(users => res.json(users))
      User.find().select().then(
           users => res.json(users)
        ).catch(error => error)

  }
  function create(req, res) {
    // validate
    if ( User.findOne({ username: req.body.username })) {
   //     throw 'Username "' + vusername + '" is already taken';
          console.log('Username "' + req.body.username + '" is already taken');
    }
    console.log('Username "' + req.body.username + '" is already taken');

    var multer  = require('multer');
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './src/public/images');
        },
        filename: (req, file, cb) => {
          console.log(file);
          var filetype = '';
          if(file.mimetype === 'image/gif') {
            filetype = 'gif';
          }
          if(file.mimetype === 'image/png') {
            filetype = 'png';
          }
          if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
          }
          cb(null, 'image-' + Date.now() + '.' + filetype);

        }
    });
    var upload = multer({storage: storage});
    console.log('Username /n "' + req.body + '"/n is already taken');

    return res.send({message:" user saved"});

    upload.single('image');
    const user = new User({ email: req.body.email, username: req.body.username, password: req.body.password ,image: req.file.filename });

    // hash password
    if (req.body.password ) {
      //  user.hash = bcrypt.hashSync(password, 10);
    }

    // save user
     user.save();
     return res.send({message:" user saved"});
  }

  //  routes
  app.post('/register', (req, res) => {
    console.log(req.body);   
    return  create(req, res);
  });

  app.post('/login', (req, res) => {
          User.findByCredentials(data.email, data.password).then((userData) => {
            userData.generateAuthToken().then((token) => {
          const { id_, username , email} = jwt.decode(token);
          payload = {id_, username , email};
                res.header('x-auth', token).send(payload);
            });
        }).catch((e) => {
            writeLog(e, {file: 'server.js:63'});
            res.status(400).send('invalid');
        });
  });




  
  // api routes
  app.get('/api/users', (req, res) => {
    return  getAll(req, res);

//User.findAll().then(users => res.json(users))

  });


  app.get('/user/:username', (req, res) => {
    //  console.log(req.body);      // your JSON
    //  res.body.json(username)
        console.log("username: "+req.params.username);      // your JSON
     // return res.send({message:req.body.username});
     User.findOne({ username: req.params.username }) .select().then(
      user => res.json(user)
     ).catch(error => error)

       return User;
   //  return res.send(Object.values({msg :req.params.username}));
    });
  
  



app.use('/api', uploudRouter);

app.get('/home', (req, res) => {
  return res.send(Object.values(messages));
});
app.post('/home', (req, res) => {
  console.log(req.body  );      // your JSON
  //response.send(req.body); 
  return res.send(Object.values(messages));
});

app.get('/users/:userId', (req, res) => {
  return res.send(
    `PUT HTTP method on user/${req.params.userId} resource`,
  );
});
app.delete('/users/:userId', (req, res) => {
  return res.send(
    `DELETE HTTP method on user/${req.params.userId} resource`,
  );
});
app.get('/messages', (req, res) => {
  return res.send(Object.values(messages));
});
app.get('/messages/:messageId', (req, res) => {


  console.log(sJWT);

  return res.send(messages[req.params.messageId]);
});

//route.get("/", (req ,res) => res.send({message:"api home"}));
console.log("Server logo: " );

/*
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
*/

//app.use('/static', express.static('src/public'));
// Generation
const claims = {
  Username: "praveen",
  Age: 27,
  Fullname: "Praveen Kumar"
};
const key = "$PraveenIsAwesome!";
const header = {
  alg: "HS512",
  typ: "JWT"
};
const route = express.Router();

const sHeader = JSON.stringify(header);
const sPayload = JSON.stringify(claims);
// Generate the JWT
const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
// Log it to the console.
console.log("JSON Web Token: ", sJWT);

const token =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InByYXZlZW4iLCJBZ2UiOjI3LCJGdWxsbmFtZSI6IlByYXZlZW4gS3VtYXIifQ.Nut6I57FYUGP973LgfOUNUBjMlaIm6NKk8ffgX4BTdQ_Wc2ob8m6uOwWlgoNMxpuRQaOoeFQOHhrIOJ_V8E-YA";
const algorithm = "HS512";

// Log it to the console.
console.log(
  "Verification: ",
  // Validation
  JSRSASign.jws.JWS.verifyJWT(token, key, {
    alg: [algorithm]
  })
);

// Decoding
const sJWS = token;
const aJWT = sJWS.split(".");
const uHeader = JSRSASign.b64utos(aJWT[0]);
const uClaim = JSRSASign.b64utos(aJWT[1]);
const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);
// Decoded objects.
// Log it to the console.
console.log("Header: ", pHeader);
console.log("Claim: ", pClaim);


const jwtoken = require('jsonwebtoken');


app.use('/user/login', (req, res) => {

  User.findOne({ username: 'usernamevvv'}) .select().then((user) => {
   // console.log("JSON Web body username: ", req.body.username);
  //  console.log("JSON Web body : ", req.body);
  //  console.log("JSON Web user : ", user);

    let token = jwtoken.sign({username:user.username},
      //config.secret,
      'worldisfullofdevelopers',
      { expiresIn: '24h' // expires in 24 hours
      }
    );
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotalySecretKey');
     
    const encryptedString = cryptr.encrypt('bacon');
    const decryptedString = cryptr.decrypt(encryptedString);
     
    console.log(encryptedString); // 5590fd6409be2494de0226f5d7
    console.log(decryptedString); // bacon

    console.log("JSON Web token : ", token);
  //  res.json({
  //    success: true,
   //   message: 'Authentication successful!',
   //   token: token
   // });
    //res.header('x-auth', token).send(payload);
   // res.status('ok').send(token);

  // payload = {id_, username , email};


   return res.send({token:token});


  }).catch((e) => {
  //    writeLog(e, {file: 'server.js:63'});
   //   res.status(400).send('invalid');
  });
});


app.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});


app.use('/userlogin', (req, res) => {

  User.findByCredentials(data.email, data.password).then((userData) => {
      userData.generateAuthToken().then((token) => {
    const { id_, username , email} = jwt.decode(token);
    payload = {id_, username , email};
          res.header('x-auth', token).send(payload);
      });
  }).catch((e) => {
      writeLog(e, {file: 'server.js:63'});
      res.status(400).send('invalid');
  });
});

module.exports=app;