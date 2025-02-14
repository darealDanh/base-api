const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('viewing a specific user', () => {
  test('succeeds with a valid id', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToView = usersAtStart[0]

    const resultUser = await api
      .get(`/api/users/${userToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultUser.body, userToView)
  })

  test('fails with statuscode 404 if user does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/users/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/users/${invalidId}`)
      .expect(400)
  })
})

describe('deletion of a user', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToDelete = usersAtStart[0]

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(!usernames.includes(userToDelete.username))
  })
})

describe('updating a user', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToUpdate = usersAtStart[0]

    const updatedUser = {
      username: 'updatedUsername',
      name: 'Updated Name',
      password: 'updatedPassword',
    }

    await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    const updatedUserFromDb = usersAtEnd.find(u => u.id === userToUpdate.id)
    assert.strictEqual(updatedUserFromDb.username, updatedUser.username)
    assert.strictEqual(updatedUserFromDb.name, updatedUser.name)
  })
})

after(async () => {
  await mongoose.connection.close()
})