require('dotenv').config()
const nodemailer = require('nodemailer')

 exports.sendingLetter = () => {
     let transporter = nodemailer.createTransport({
         service: 'gmail',
         host: 'smtp.ethereal.email',
         port: 587,
         secure: false,
         auth: {
             user: process.env.EMAIL,
             pass: process.env.PASSWORD,
         },
     })

    transporter.sendMail({
         from: 'pashimatii@gmail.com',
         to: 'pashimatii@gmail.com',
         subject: 'Message from Node js',
         text: 'This message was sent from Node js server.',
         html:
             'This <i>message</i> was sent from <strong>Node js</strong> server.',
     })
}