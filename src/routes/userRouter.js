var express = require('express');
var router = express();
var multer  = require('multer');
const bodyParser = require('body-parser');
const mail = require('../services/mail');
const User = require('../models/user');

const jwtoken = require('jsonwebtoken');
var url = require('url');

function getFormattedUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
}

let usernameimg='';
let username='';
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

 var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/images/users');
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
      cb(null, 'image-' +usernameimg+ '.' + filetype);
    //  cb(null, 'image-' +usernameimg + '.' + filetype);
      userimg ='image-' +usernameimg+ '.' + filetype;
    }
  });
var upload = multer({storage: storage});




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
         //    console.log('Username "' + req.body.username + '" is already taken');
       }
       console.log('Username "' + req.body.username + '" is already taken');
   
    
   
       const user = new User({ email: req.body.email, username: req.body.username, password: req.body.password, image: req.body.gendre,status:'inactive',role:'user', created :Date.now()   });
   
       // hash password
       if (req.body.password ) {
         //  user.hash = bcrypt.hashSync(password, 10);
       }
   
        user.save();
        return res.send({message:" user saved"});
     }
   
     //  routes
     router.post('/register', (req, res) => {
       console.log(req.body);  
       let token = jwtoken.sign( {email:req.body.email},'worldisfullofdevelopers',{ expiresIn: '720h'  } );
       let link=  getFormattedUrl(req)+'/api/user/active/'+token;
       mail.sMail(req.body.email,'inscrire postm','love link here <a href="'+link+'">active</a>');
       
       return  create(req, res);
     });
   
     router.post('/login', (req, res) => {
       console.log("    login   ");   
   
       console.log(req.body);   
   
       User.findOne({ username: req.body.username}) .select().then((user) => {
              let token = jwtoken.sign( {user:user},'worldisfullofdevelopers',{ expiresIn: '24h'  } );
              console.log("    login   "+token);   
              console.log("    user.password   "+user.password);   

              if ( user.password == req.body.password) {
                return res.send({token:token});

              }else{
                return res.send({token:''});

              }
             
         })
     });
   
   
   
     router.post('/me', function(req, res) {
       var token = req.body.token;
       if (!token) return res.status(401).send({ auth: false, message: 'No token provided.',user:{status:''} });
      // console.log("    token   "+token);   
   
       jwtoken.verify(token, 'worldisfullofdevelopers', function(err, decoded) {
         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' ,user:{status:''}});
         console.log("    token   "+decoded);   

         res.status(200).send(decoded);
       });
     });

     router.put('/profil',upload.single('image'),function(req, res, next) {
        var token = req.body.token;
    
        console.log("token  "+token);   
    
        jwtoken.verify(token, 'worldisfullofdevelopers', function(err, decoded) {
         // if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          username=decoded.user.username;   
          usernameimg=decoded.user.username;  
          console.log("   username "+decoded.user.username);   
        });
      //router.post('/profil/update',upload, function(req, res) {
        console.log("    req.email   "+req.body.email);   
    
    
        User.findOne({ username: username}) .select().then((user) => {
          console.log("    user.email   "+user.email);   
    
              user.email = req.body.email;
          //    user.username = username;
              user.image = userimg;
              user.save();
    
        })
        upload.single('image');
        res.status(200).send(username);
    
      });

  // api routes
  router.get('/users', (req, res) => {
    return  getAll(req, res);
  });


  router.get('/:username', (req, res) => {
     User.findOne({ username: req.params.username }) .select().then(
      user => res.json(user)
     ).catch(error => error)
       return User;
  });
  
  
  router.delete('/:username', (req, res) => {
   //     User.findOne({ username: req.params.username}) .select().then((user) => {
          User.remove({
            username: req.params.username
          }, function (err, user) {
            if (err)
              return console.error(err);

            console.log('User successfully removed from polls collection!');
            res.status(200).send();


          });   

     });
     router.get('/contacts',function(req, res, next) {
      var  data =[];
       var time = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
       Contact.aggregate([
          {
              $group: {
                  _id:{email:"$email",   count: {$sum: 1}}
              }
          }
      ], function (err, result) {
          if (err) {
              next(err);
          } else {
              for (let index = 0; index < result.length; index++) {
                  data[index]=result[index]._id
                  
              }
             res.json(result);
          }
      });
      
          Contact.find().select().then(contacts =>{
            // res.json(contacts)
          }).catch(error => error);
             //  return Contact;
      });
      

     router.get('/active/:token', (req, res) => {
      var token= req.params.token;

      console.log("   token "+token); 

      jwtoken.verify(token, 'worldisfullofdevelopers', function(err, decoded) {
        // if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
       let  email=decoded.email;   
         console.log("   email "+email); 
         
         User.findOne({ email: email}) .select().then(
          user => {
            user.status='active';
            user.save();
            res.json(user)
          }).catch(error => error)

       });
       res.json('ok')
   });
module.exports = router;