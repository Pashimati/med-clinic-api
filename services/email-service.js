require('dotenv').config()
const nodemailer = require('nodemailer')

 exports.sendingLetter = (email, info) => {
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
         from: 'pashkatest54@gmail.com',
         to: email,
         subject: 'Message from SkyLab Clinic.',
         text: 'This message was sent SkyLab Clinic.',
         html: `
               <h3>Здраствуйте!</h3>
                   <h2>${info.user.name} ${info.user.surname}.</h2>
               <p>Вы записались на дату <h2>${info.date}.</h2></p>
                             <p>${info.doctor.speciality} ${info.doctor.name} ${info.doctor.surname}</p>
                `,
     })
}