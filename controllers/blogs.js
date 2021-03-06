const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { id: 1, username: 1, name: 1 })

  response.json((blogs.map(Blog.format)))
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(Blog.format(blog))
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception.name)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  try {
    //console.log(request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const user = await User.findById(decodedToken.id)

    let likes = 0
    // if the request has likes, add them to the blog object
    if (body.likes !== undefined) {
      likes = body.likes
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'Something went wrong' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    console.log('asdf')
    const body = request.body
    console.log(body)
    Blog.findByIdAndUpdate(request.params.id,
      { author: body.author, title: body.title, likes: body.likes },
      { new: true },
      (err, todo) => { if (err) return response.status(500).send(err); return response.send(todo)
      })
  }
  catch (exception) {
    console.log(exception.name)
    response.status(500).json({ error: 'Something broke' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //console.log(request.token)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const userid = user.id
    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === userid.toString() ) {
      await Blog.findByIdAndRemove(request.params.id)
      //remove blog from users blogs?
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'only the creator can delete blogs' })
    }
  }
  catch (exception) {
    console.log(exception.name)
    response.status(400).json({ error: 'invalid id' })
  }
})

module.exports = blogsRouter