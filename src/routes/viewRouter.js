var express = require('express');
var router = express();
const bodyParser = require('body-parser');


const user = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');
const View = require('../models/view');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/new', (req, res) => {
 
    console.log( 'req' + req.body);

    new View({
        page : req.body.page,
        country : req.body.country,
        ip : req.body.ip,
        created :Date.now()

      }).save();
    return res.json('req' + req.body)

  
  });

  router.get('/views', (req, res) => {


    var year = new Array();


  function  getdataYear(year){

      var stime = year+'-01-01';
      var ftime = year+'-12-31';
      View.aggregate([
        { $match : { created : { $gt: new Date(stime), $lt: new Date(ftime) } } },
        { $project: {
            "month": { "$month": "$created" },
        }}, 
        { $group: {
            _id: "$month",
          //  year:"$year",
            count: {$sum: 1}
  
        }}
  
        
      ], function (err, result) {
        if (err) {

        } else {
            let data=[]
            for (let j = 0; j <12; j++) {
              data[j]=0
            }
            for (let j = 0; j <12; j++) {
              for (let index = 0; index < result.length; index++) {
  
                if (result[index]._id==j) {
                  data[j]=result[index].count
    
                }
                
              }
            }
    //    console.log( {name: year,data: data })
        doSomethingElseWith( {name: year,data: data });

    //    return  {name: year,data: data };
      //  return;

        }
    });

    };
    var dt = new Date();
    var y=dt.getFullYear();
    
    console.log(dt)
    getdataYear(y-4);
    getdataYear(y-3);
    getdataYear(y-2);
    getdataYear(y-1);
    getdataYear(y);

    function doSomethingElseWith(row){
     // console.log(row)

      year.push(row);
      if (year.length==5) {
        res.json( year);

      }
    }
    console.log(year)



  
  });



  router.get('/country', (req, res) => {
   var   data =[];
   var labels = [];
   var series = [];


      View.aggregate([
        { $match : { created : { $gt: new Date('2015-01-01'), $lt: new Date('2020-01-01') } } },

        { $group: {
            _id: "$country",
          //  year:"$year",
            count: {$sum: 1}
  
        }}
  
        
      ], function (err, result) {
        if (err) {

        } else {

          for (let index = 0; index < result.length; index++) {
            labels[index] = result[index]._id;
            series[index] = result[index].count;

          }
        res.json({labels:labels,series:series, chart: {   height: 300,     "type": "pie",  }   });

        }         
           
      });



    


  
  });

  
  router.get('/all', (req, res) => {
    return View.find().select().then(
        views => res.json(views)
          ).catch(error => error)
  
  });

  router.get('/new', (req, res) => {
    new View({
      page : 'Embedded-Comments',
      country : 'france',
      ip : '192.168.0.1',
      created : '2017-03-09T23:00:19.881Z' //Date.now()

    }).save();
    new View({
      page : 'Embedded-Comments',
      country : 'france',
      ip : '192.168.0.1',
      created : '2017-02-09T23:00:19.881Z' //Date.now()

    }).save();

    return res.json('req')
 
  });


  router.get('/articles/2019', (req, res) => {
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


  router.get('/users', (req, res) => {


    var year = new Array();


  function  getdataYear(year){

      var stime = year+'-01-01';
      var ftime = year+'-12-31';
      User.aggregate([
        { $match : { created : { $gt: new Date(stime), $lt: new Date(ftime) } } },
        { $project: {
            "month": { "$month": "$created" },
        }}, 
        { $group: {
            _id: "$month",
          //  year:"$year",
            count: {$sum: 1}
  
        }}
  
        
      ], function (err, result) {
        if (err) {

        } else {
            let data=[]
            for (let j = 0; j <12; j++) {
              data[j]=0
            }
            for (let j = 0; j <12; j++) {
              for (let index = 0; index < result.length; index++) {
  
                if (result[index]._id==j) {
                  data[j]=result[index].count
    
                }
                
              }
            }
    //    console.log( {name: year,data: data })
        doSomethingElseWith( {name: year,data: data });

    //    return  {name: year,data: data };
      //  return;

        }
    });

    };
    var dt = new Date();
    var y=dt.getFullYear();
    
    console.log(dt)
    getdataYear(y-4);
    getdataYear(y-3);
    getdataYear(y-2);
    getdataYear(y-1);
    getdataYear(y);

    function doSomethingElseWith(row){
     // console.log(row)

      year.push(row);
      if (year.length==5) {
        res.json( year);

      }
    }
    console.log(year)



  
  });



  router.get('/articles', (req, res) => {


    var year = new Array();


    function  getdataYear(year){

        var stime = year+'-01-01';
        var ftime = year+'-12-31';
        Article.aggregate([
          { $match : { created : { $gt: new Date(stime), $lt: new Date(ftime) } } },
          { $project: {
              "month": { "$month": "$created" },
          }}, 
          { $group: {
              _id: "$month",
            //  year:"$year",
              count: {$sum: 1}
    
          }}
    
          
        ], function (err, result) {
          if (err) {

          } else {
              let data=[]
              for (let j = 0; j <12; j++) {
                data[j]=0
              }
              for (let j = 0; j <12; j++) {
                for (let index = 0; index < result.length; index++) {
    
                  if (result[index]._id==j) {
                    data[j]=result[index].count
      
                  }
                  
                }
              }
      //    console.log( {name: year,data: data })
          doSomethingElseWith( {name: year,data: data });

      //    return  {name: year,data: data };
        //  return;

          }
      });

    };

    var dt = new Date();
    var y=dt.getFullYear();
    
    console.log(dt)
    getdataYear(y-4);
    getdataYear(y-3);
    getdataYear(y-2);
    getdataYear(y-1);
    getdataYear(y);

    function doSomethingElseWith(row){
     // console.log(row)

      year.push(row);
      if (year.length==5) {
        res.json( year);

      }
    }
    console.log(year)



  
  });




  router.get('/articles/popular', (req, res) => {


    var year = new Array();


    function  getdataYear(year){

        var stime = year+'-01-01';
        var ftime = year+'-12-31';
        Article.aggregate([
          { $match : { created : { $gt: new Date(stime), $lt: new Date(ftime) } } },
          { $project: {
              "month": { "$month": "$created" },
          }}, 
          { $group: {
              _id: "$month",
            //  year:"$year",
              count: {$sum: 1}
    
          }}
    
          
        ], function (err, result) {
          if (err) {

          } else {
              let data=[]
              for (let j = 0; j <12; j++) {
                data[j]=0
              }
              for (let j = 0; j <12; j++) {
                for (let index = 0; index < result.length; index++) {
    
                  if (result[index]._id==j) {
                    data[j]=result[index].count
      
                  }
                  
                }
              }
      //    console.log( {name: year,data: data })
          doSomethingElseWith( {name: year,data: data });

      //    return  {name: year,data: data };
        //  return;

          }
      });

    };

    var dt = new Date();
    var y=dt.getFullYear();
    
    console.log(dt)
    getdataYear(y-4);
    getdataYear(y-3);
    getdataYear(y-2);
    getdataYear(y-1);
    getdataYear(y);

    function doSomethingElseWith(row){
     // console.log(row)

      year.push(row);
      if (year.length==5) {
        res.json( year);

      }
    }
    console.log(year)



  
  });



  module.exports = router;