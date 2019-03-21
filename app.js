const express       = require('express')
const bodyParser    = require('body-parser')
const listEndPoints = require('express-list-endpoints')

const app = express()

app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

const dbConfig = require('./Config/database.config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(dbConfig.url).then(() => {
  console.log('Successfully connected to the database')
}).catch(connectionError => {
  console.log(connectionError)
  console.log('Could not connect to the database. Exiting now...')
})

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the URL shortener application. Create short links and use them.',
    endPoints: listEndPoints(app)
  })
})

require('./App/Routers/url.router.js')(app)

const PORT = 8080
app.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}`)
})
