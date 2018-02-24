const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { id: 1, title: 1, author: 1, url: 1, likes: 1 })

  response.json(users.map(User.format))

})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    //check password length
    if ((body.password).length < 3) {
      return response.status(400).json({ error: 'Password is too short' })
    }

    //check for unique usernames
    const existingUser = await User.find({ username: body.username })
    if (existingUser) {
      if (existingUser.length > 0) {
        return response.status(400).json({ error: 'Username already taken' })
      }
    }

    //set adult true if it's not defined
    let adult = true
    if (body.adult !== undefined) {
      adult = body.adult
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: adult,
      passwordHash
    })

    const savedUser = await user.save()
    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter