const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)
  .then( () => {
    console.log('connected to database')
  })
  .catch (error => {
    console.log(error.name)
  })

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})