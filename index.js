const cors = require('cors')
const express = require('express')
const doctorController = require('./controllers/doctorController');
const authController = require('./controllers/authController');
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth")

// require('firebase/auth')

const app = express()
app.use(express.json());

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())

//controllers
app.use('/doctor', doctorController);
app.use('/auth', authController);

// app.get("/auth", async (req, res) => {
//
//     const email = 'just1pman@gmail.com'
//     const password = '123456789'
//
//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             // Signed in
//             const user = userCredential.user;
//             console.log(user)
//             // ...
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             console.log(`${errorCode}: ${errorMessage}`)
//             // ..
//         });
//
//     res.json({
//         success: true
//     })
// })

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    next();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Express server listening on port', port)
});




