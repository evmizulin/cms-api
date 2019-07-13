/*global describe, before, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { User, Client, ClientPermission } = require('../../src/services/db/Db')
const hash = require('object-hash')
const assert = require('assert')
const randomstring = require('randomstring')

const users = [
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
  },
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
  },
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
  },
]

describe('POST /signup', () => {
  describe('Success - insert', () => {
    it('should return 200', done => {
      const { login, password } = users[0]
      request(app)
        .post('/signup')
        .send({ login, password })
        .expect(200)
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const { user, client, clientPermission } = await (async () => {
        const { login } = users[0]
        const user = await User.findOne({ login })
        const client = await Client.findOne({ clientSourceId: user.id })
        const clientPermission = await ClientPermission.findOne({ clientId: client.id })
        return { user, client, clientPermission }
      })()

      await User.remove(user.id)

      {
        const { id, type, clientSourceId, ...rest } = client
        assert.equal(type, 'user')
        assert.deepEqual(rest, {})
      }

      {
        const {
          id,
          clientId,
          projectCreate,
          projectRead,
          projectUpdate,
          projectDelete,
          apiTokenCreate,
          apiTokenRead,
          apiTokenUpdate,
          apiTokenDelete,
          ...rest
        } = clientPermission
        assert.equal(projectCreate, true)
        assert.equal(projectRead, true)
        assert.equal(projectUpdate, true)
        assert.equal(projectDelete, true)
        assert.equal(apiTokenCreate, true)
        assert.equal(apiTokenRead, true)
        assert.equal(apiTokenUpdate, true)
        assert.equal(apiTokenDelete, true)
        assert.deepEqual(rest, {})
      }

      {
        const { id, login, passHash, isVerified, ...rest } = user
        assert.equal(isVerified, false)
        assert.equal(passHash, hash(users[0].password))
        assert.deepEqual(rest, {})
      }
    })
  })

  describe('Success - update password', () => {
    before(async () => {
      const { login, password } = users[1]
      await User.insert({ login, passHash: hash(password), isVerified: false })
    })

    it('should return 200', done => {
      const { login, password } = users[1]
      request(app)
        .post('/signup')
        .send({ login, password: `${password}1` })
        .expect(200)
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const user = await User.findOne({ login: users[1].login })
      await User.remove(user.id)

      const { id, login, passHash, isVerified, ...rest } = user
      assert.equal(isVerified, false)
      assert.equal(passHash, hash(`${users[1].password}1`))
      assert.deepEqual(rest, {})
    })
  })

  describe('Unvalid user', () => {
    it('should return 400', done => {
      request(app)
        .post('/signup')
        .send({ login: '1', password: '1' })
        .expect(400)
        .expect({ message: 'String is too short (1 chars), minimum 6' })
        .end(done)
    })
  })

  describe('User exist', () => {
    before(async () => {
      const { login, password } = users[2]
      await User.insert({ login, passHash: hash(password), isVerified: true })
    })

    it('should return 400', done => {
      const { login, password } = users[2]
      request(app)
        .post('/signup')
        .send({ login, password })
        .expect(400)
        .expect({ message: 'User with that email already exists' })
        .end(done)
    })

    after(async () => {
      const { login } = users[2]
      const user = await User.findOne({ login })
      await User.remove(user.id)
    })
  })
})
