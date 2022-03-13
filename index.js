const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, res) => {
    res.json({
        name: 'pasha',
        age: '20',
    })
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Express server listening on port', port)
});