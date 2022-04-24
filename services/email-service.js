require('dotenv').config()
const nodemailer = require('nodemailer')

 exports.sendingLetter = (email, template) => {
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
         to: email,
         subject: 'Message from Node js',
         text: 'This message was sent from Node js server.',
         html: template
     })
}