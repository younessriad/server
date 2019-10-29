var express = require('express');
const nodeMailer = require('nodemailer');
var router = express();


const Contact = require('../models/contact');



const mail='';

function sMail(email,subject,message){


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
        to: email,
        subject: subject,
        body: '',
        html: '<b>Hello world? '+message+'</b>' // html body
    
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
//    res.writeHead(301, { Location: 'index.html' });
//    res.end();
    


}
module.exports = {
    sMail: sMail
};


