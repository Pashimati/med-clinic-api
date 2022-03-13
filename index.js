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


app.get('/', async (request, res) => {

    deleteFileCollection(DOCTORS, 'hgfd')

    res.json({
        success: true
    })
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    // console.log( getFileCollection('doctors', 'two'))
    console.log('Express server listening on port', port)
});

