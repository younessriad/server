var express = require('express');
var router = express();
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

/* GET home page. */
router.post('/Product', function(req, res, next) {
  Product.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/upload',upload.single('image'),function(req, res, next) {
  console.log(req.file);

  console.log(req.body.title);

 // if(!req.file) {
 //   res.status(500);
 //   return next(err);
 // }
  res.json({ fileUrl: 'http://192.168.0.7:4000/images/' + req.file.filename });
})

module.exports = router;