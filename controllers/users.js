const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request,response)=> {
    const users = await User.find({}).populate('notes').populate('blogs')
    response.json(users)
})

usersRouter.get('/:id', async (request,response) => {
    const users = await User.findById(request.params.id)
    if (users) {
        response.json(users)
    } else {
        response.status(404).end()
    }
})


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
    const { username, name, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = {
      username,
      name,
      passwordHash,
    }
  
    const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
    response.json(updatedUser)
  })

usersRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


module.exports = usersRouter