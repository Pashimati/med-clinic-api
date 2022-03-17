const {addOrUpdateFileCollection, deleteFileCollection, getFileCollection} = require('./db/db')
const cors = require('cors')


const {DOCTORS} = require('./db/tables')

const express = require('express')

const jsonParser = express.json();
const app = express()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    next();  // передаем обработку запроса методу app.post("/postuser"...
});


app.post('/add-doctor', jsonParser, async (request, res) => {
    const name = request.body.name
    const surname = request.body.surname
    const age = request.body.age

    addOrUpdateFileCollection(DOCTORS, '3', {
        name: 'pasha',
        surname: 'surname',
        age: 28,

    })
    console.log(request.body)
    // console.log(name, surname, age)

    res.json({
        success: true,
        message: 'okey'
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Express server listening on port', port)
});




