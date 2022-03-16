const {addOrUpdateFileCollection, deleteFileCollection, getFileCollection} = require('./db/db')
const {getDocs} = require('firebase/firestore/lite')
const { doc, setDoc, collection, deleteDoc } = require("firebase/firestore");

const {DOCTORS} = require('./db/tables')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

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

