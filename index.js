const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Blog = require('./models/blog')
const mongoose = require('mongoose')
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

mongoose.Promise = global.Promise

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(error => {
      console.log(error)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})