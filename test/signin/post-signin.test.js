/*global describe, before, it, after*/

const { request } = require('../helpers/request')
const { User, AccessToken, Client } = require('../../src/services/db/Db')
const hash = require('object-hash')
const assert = require('assert')
const randomstring = require('randomstring')

const users = [
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
    accessToken: null,
  },
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
  },
]

describe('POST /signin', () => {
  describe('Success', () => {
    before(async () => {
      const { login, password } = users[0]
      await User.insert({ login, passHash: hash(password), isVerified: true })
    })

    it('should return 200', done => {
      const { login, password } = users[0]
      request
        .post('/signin')
        .send({ login, password })
        .expect(200)
        .expect('Set-Cookie', /accessToken=/)
        .expect('Set-Cookie', /HttpOnly/)
        .expect(res => {
          const accessToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
          users[0].accessToken = accessToken
          assert.equal(accessToken.length, 40)
        })
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const { user, client, accessToken } = await (async () => {
        const { login, accessToken } = users[0]
        const user = await User.findOne({ login })
        const client = await Client.findOne({ clientSourceId: user.id })
        const token = await AccessToken.findOne({ token: accessToken })
        return { user, client, accessToken: token }
      })()

      await User.remove(user.id)
      await AccessToken.remove(accessToken.id)

      const { id, clientId, token, ...rest } = accessToken
      assert.deepEqual(clientId, client.id)
      assert.deepEqual(rest, {})
    })
  })

  describe('Fail', () => {
    const { login, password } = users[1]
    before(async () => {
      await User.insert({ login, passHash: hash(password), isVerified: false })
    })

    it('should return 400', done => {
      request
        .post('/signin')
        .send({ login: '1', password: '23' })
        .expect(400)
        .expect({ message: 'String is too short (2 chars), minimum 6' })
        .end(done)
    })

    it('should return 400', done => {
      request
        .post('/signin')
        .send({ login: 'signin-not-found', password: '123456' })
        .expect(400)
        .expect({ message: 'Invalid username or password' })
        .end(done)
    })

    it('should return 400', done => {
      const { login, password } = users[1]
      request
        .post('/signin')
        .send({ login, password })
        .expect(400)
        .expect({ message: 'Invalid username or password' })
        .end(done)
    })

    after(async () => {
      const { login } = users[1]
      const { id } = await User.findOne({ login })
      await User.remove(id)
    })
  })
})
