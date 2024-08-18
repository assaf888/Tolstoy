const express = require('express')
const helmet = require('helmet')
const rateLimier = require('./middleware/rateLimiter')
const api = require('./src/routes')
const cors = require('cors')

const app = express()
const { PORT } = require('./consts')

app.use(cors())
app.use(helmet())
app.use(rateLimier) 

app.use(express.json())

app.use('/api', api)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
