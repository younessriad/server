var express = require('express');
var router = express();
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');


const Contact = require('../models/contact');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/contacts',function(req, res, next) {
    var  data =[];

 var time = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
 Contact.aggregate([
    {
        $group: {
            _id:{email:"$email"}, //$region is the column name in collection
            count: {$sum: 1}
        }
    }
], function (err, result) {
    if (err) {
        next(err);
    } else {
        for (let index = 0; index < result.length; index++) {
            data[index]=result[index]._id
            data[index].count=result[index].count

        }
       res.json(data);
    }
});

    Contact.find().select().then(contacts =>{
    //    res.json(contacts)
    }).catch(error => error);
       //  return Contact;
});


router.post('/',function(req, res, next) {

    const contact = new Contact({ email: req.body.email, subject: req.body.subject, message: req.body.message    });

    contact.save();

    console.log("message  "+req.body.message);   

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: 'younessriadme@gmail.com',
            pass: 'jjulxumgysrmhpxg'
        }
    });
    let mailOptions = {
        // should be replaced with real recipient's account
        to: 'younessriadme@gmail.com',
        subject: req.body.subject,
        body: req.body.message,
        html: '<b>Hello world? '+req.body.message+'</b>' // html body

    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.writeHead(301, { Location: 'index.html' });
    res.end();

});

router.get('/:email', (req, res) => {
  
    Contact.find({ email: req.params.email }) .select().then(
          contacts =>{return res.json(contacts)
          }).catch(error => error)
  //  return res.json('ok');

});

router.put('/:id', (req, res) => {
  
    Contact.findOne({ _id: req.params.id }) .select().then(
        contacts => res.json(contacts)
       ).catch(error => error)
    return res.json('ok');

});
 router.delete('/:id', (req, res) => {
    Contact.findOne({ _id: req.params.id }) .select().then(
        contact => res.json(contact)
       ).catch(error => error)
    return res.json('ok');

 });
module.exports = router;


