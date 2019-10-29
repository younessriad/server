var express = require('express');
var router = express();
const bodyParser = require('body-parser');


const user = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Category = require('../models/category');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/new', (req, res) => {
 
    console.log( 'req' + req.body);

    new Category({
        name : req.body.page
      }).save();
    return res.json('req' + req.body)

  
  });


  router.get('/all', (req, res) => {

    Category.find().select().then(
        users => res.json(users)
     ).catch(error => error)
  //  return res.send('pp')
  
  });
  router.get('/active', (req, res) => {

    Category.find({status:'active'}).select().then(
      categories => res.json(categories)
    ).catch(error => error)
  });

  router.get('/activei', (req, res) => {
    let data=[{"status":"active","_id":"","name":"","count":0}];
    Category.find({status:'active'}).select().then(
         categories =>{
          let count=0;
           for (let index = 0; index < categories.length; index++) {
             const catid = categories[index]._id;
              Article.find({ category:catid }) .select().then(
               (articles ) =>{
                 count=articles.length 
                console.log( 'count' + count);
        //        data[index].count=count;
             //     scount=count;

                

             });
             console.log( 'count out ' +count);
       //      data[index].count=9;
                  data[index]={"status":"active","_id":categories[index]._id,"name":categories[index].name,"count": count};



           }
         //  data=categories;
           res.json(data)

         }
         
     ).catch(error => error)
  //  return res.send('pp')
  
  });

  router.get('/new', (req, res) => {
    new Category({
      name : 'polld',
      status : 'inactive'

    }).save();
    new Category({
      name : 'faced'
    }).save();

    return res.json('req')
 
  });

  router.get('/delete', (req, res) => {
     Category.remove({name:'short'});
    return res.json('req')
 
  });

  module.exports = router;