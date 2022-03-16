const {addOrUpdateFileCollection, deleteFileCollection, getFileCollection} = require('./db/db')
const {getDocs} = require('firebase/firestore/lite')
const { doc, setDoc, collection, deleteDoc } = require("firebase/firestore");

const {DOCTORS} = require('./db/tables')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
});


app.get('/', async (request, res) => {

    addOrUpdateFileCollection(DOCTORS, '1', {
        name: 'Vadim',
        surname: 'Zhuk',
        age: 26,
    })

    res.json({
        success: true
    })
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Express server listening on port', port)
});

