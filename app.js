const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000

const index = require('./index')
const app = express()

app.set('view engine', 'pug')
app.set('views', './views')
app.set('port', port)

app.use(bodyParser.json())
app.use(cookieParser())


app.listen(port, () => {
  console.log('Listening on port ' + port)
})
