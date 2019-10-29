var express = require('express');
var router = express();
const bodyParser = require('body-parser');

const jwtoken = require('jsonwebtoken');

const user = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());




router.post('/',function(req, res, next) {
    var token = req.body.token;
    var username = " ";

    jwtoken.verify(token, 'worldisfullofdevelopers', function(err, decoded) {
      username=decoded.user._id;   
      console.log("   username "+decoded.user.username);   
    });
  // create a comment

 new Comment({
        user : username,
        content : req.body.content,
        created :Date.now()

      }).save( function( err, comment, count ){

        Article.findOne({ titleurl: req.body.titleurl }).populate("comments").select().then( article =>{
         
           article.comments.push(comment._id);

        
         article.save();
          console.log("article  "+article);   

         return res.status(200).send();

        });
   
      });


});

router.get('/comments', (req, res) => {
  return Comment.find().populate("user").select().then(
           comments => res.json(comments)
         ).catch(error => error)

});
router.get('/:comment', (req, res) => {
  Comment.findOne({ titleurl: req.params.title }) .select().then(
    Comment => res.json(Comment)
  ).catch(error => error)
    return Comment;
 });

 router.put('/:comment', (req, res) => {
    //     User.findOne({ username: req.params.username}) .select().then((user) => {
      Comment.remove({  titleurl: req.params.title }, function (err, user) {
            if (err)
                return console.error(err);
            });   
            console.log('User successfully removed from polls collection!');
            res.status(200).send();
  
  });

 router.delete('/:comment', (req, res) => {
  //     User.findOne({ username: req.params.username}) .select().then((user) => {
    Comment.remove({  titleurl: req.params.title }, function (err, user) {
          if (err)
              return console.error(err);
          });   
          console.log('User successfully removed from polls collection!');
          res.status(200).send();

});
router.get('/clear', (req, res) => {
  //     User.findOne({ username: req.params.username}) .select().then((user) => {
    Comment.remove([]);      
          console.log('User successfully removed from polls collection!');
          res.status(200).send();

});
//Comment.remove([]);      
//console.log( Comment.find());

module.exports = router;