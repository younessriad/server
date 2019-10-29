var express = require('express');
var router = express();
var multer  = require('multer');
const bodyParser = require('body-parser');
var forEach = require('async-foreach').forEach;

const jwtoken = require('jsonwebtoken');

const user = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Category = require('../models/category');

let articleimage =Date.now() ;
let title_url=Date.now();
let filetype='';
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const mypath= require('../mypath');


const publicpath =mypath

console.log("publicpath  "+publicpath);   

 var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/images/articles');
    },
    filename: (req, file, cb) => {

   //   console.log("req-------------"+req.body);
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' +title_url+ '.' + filetype);
      articleimage ='image-' +title_url+ '.' + filetype;
    }
  });
var upload = multer({storage: storage});

var upld = multer({ dest: 'images/' });


router.post('/',upload.single('image'),function(req, res, next) {
  var token = req.body.token;
  console.log("token  "+token);   

  jwtoken.verify(token, 'worldisfullofdevelopers', function(err, decoded) {
    username=decoded.user.username;   
    console.log("   username "+decoded.user.username);   
  });


  User.findOne({ username: username}) .select().then((user) => {
    console.log("    user.email   "+user.email);   

    var   vuserid=  user._id ;
    title_url =  req.body.title.replace(" ", "-");
    title_url =  title_url.replace(" ", "-");

    var img_url= title_url+'.'+filetype;

    var fs = require('fs');
    fs.rename(publicpath+'/images/articles/'+articleimage, publicpath+'/images/articles/'+img_url, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
      const article = new Article({ user:vuserid,titleurl: title_url, title: req.body.title,category: req.body.category, content: req.body.content, comments:[], image: img_url,created :Date.now()    });
      article.save();
      Category.findOne({ _id: req.body.category}) .select().then((category) => {
        category.count=category.count+1;
        category.save();
      });

  })
  upload.single('image');

  res.status(200).send("mm"+req.body.category);

});

router.get('/articles', (req, res) => {
  return Article.find().populate("user").populate("category").populate("comments").select().then(
              articles => res.json(articles)
         ).catch(error => error)

});

router.get('/articles/category/:category', (req, res) => {

  Category.findOne({ name:  req.params.category}).select().then((category) => {
        return Article.find({category:  category._id }).populate("user").populate("category").select().then(
                    articles => res.json(articles)
              ).catch(error => error)
  });

});



router.get('/articles/popular', (req, res) => {
  let adata=[];


  View.aggregate([
    { $match : { created : { $gt: new Date('2015-01-01'), $lt: new Date('2020-01-01') } } },
    { $group: {  _id: "$page", count: {$sum: 1}  }},
    { $sort: { count: -1 } }

  ], function (err, result) {
    if (err) {

    } else {
    //  // res.json( result);
      for (let index = 0; index < result.length; index++) {
        const element = result[index]._id;
        console.log('User'+element+' count '+result[index].count);

        Article.findOne({titleurl: { $regex: '.*' +  element  + '.*' } }).limit(5).select().then(
          article => {
             if (article!=null) {
              adata.push(article);
              console.log('User'+adata.length);
             }
           

            if (adata.length==2) {
              res.send(adata);
              console.log('User'+adata);

            }
        }).catch(error => error)
      }
    }         
       
  });


});


router.get('/articles/:search', (req, res) => {
  return Article.find({title: { $regex: '.*' +  req.params.search  + '.*' } }).limit(5).select().then(
              articles => res.json(articles)
         ).catch(error => error)

});



router.get('i/:title', (req, res) => {
  Article.findOne({ titleurl: req.params.title }) .select().then(
   article => res.json(article)
  ).catch(error => error)
    return Article;
 });
 let cmts={_id:"",title:"",titleurl:"",image:"",comments:[],user:{},category:{}};

 router.get('/:title', (req, res) => {
 
    let adata=[];

  Article.findOne({ titleurl: req.params.title }).populate("user").populate("category").exec(function(err,data) {
    if (err) return handleError(err);
    cmts={_id:data._id,title:data.title,titleurl:data.titleurl,image:data.image,content:data.content,user:data.user,category:data.category,comments:[]}
    // adata.push(idcomment);
     Comment.find().populate("user").select().then(comments => {
      for (let index = 0; index <  data.comments.length; index++) {
        for (let jindex = 0; jindex <  comments.length; jindex++) {

          console.log( data.comments[index]+' -');
          console.log( comments[jindex]._id+'  +');

          if (data.comments[index]+''== comments[jindex]._id+'') {
            console.log(  comments[jindex]._id+'  =');

            cmts.comments.push( comments[jindex]);
          }
        }
      }

      return res.json( cmts)
     });


  });


});
 router.delete('/:title', (req, res) => {
    Article.remove({  titleurl: req.params.title }, function (err, article) {
          if (err)
              return console.error(err);
          });   


          Category.findOne({ _id: article.category}) .select().then((category) => {
            category.count=category.count-1;
            category.save();
          });
          console.log('Article successfully removed from polls collection!');
          res.status(200).send();

    });
module.exports = router;