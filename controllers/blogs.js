const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception.name)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    let likes = 0
    // if the request has likes, add them to the blog object
    if (body.likes !== undefined) {
      likes = body.likes
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: likes
    })

    const savedBlog = await blog.save()
    response.json(savedBlog)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = blogsRouter