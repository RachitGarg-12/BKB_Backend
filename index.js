const connectToMongo = require('./db');
connectToMongo();

let cors = require('cors')
const express = require('express')
const app = express()
const port = 8000;

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/auth', require('./routes/item'))
app.use('/api/auth', require('./routes/order'))
app.use('/api/auth', require('./routes/service'))

app.listen(port, () => {
  console.log(`B2C running at http://localhost:${port}`)
})