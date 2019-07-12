/*global describe, before, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { User } = require('../../src/services/db/Db')
const assert = require('assert')
const { encrypter } = require('../../src/services/Encrypter')
const randomstring = require('randomstring')
const hash = require('object-hash')

const users = [
  {
    login: randomstring.generate(),
    password: randomstring.generate(),
  },
]

describe('POST /signup/confirmation', () => {
  before(async () => {
    const { login, password } = users[0]
    await User.insert({ login, passHash: hash(password), isVerified: false })
  })

  it('should return 200', done => {
    const { login } = users[0]
    request(app)
      .post('/signup/confirmation')
      .send({ confirmationToken: encrypter.encrypt(login) })
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post('/signup/confirmation')
      .send({ a: '1' })
      .expect(400)
      .expect({ message: 'Missing required property: confirmationToken' })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post('/signup/confirmation')
      .send({ confirmationToken: '1_asd' })
      .expect(400)
      .expect({ message: 'Unvalid confirmation token' })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post('/signup/confirmation')
      .send({ confirmationToken: encrypter.encrypt('wrong-login') })
      .expect(400)
      .expect({ message: 'Unvalid confirmation token' })
      .end(done)
  })

  after(async () => {
    const { login } = users[0]
    const user = await User.findOne({ login })
    await User.remove(user.id)
    {
      const { id, login, passHash, isVerified, ...rest } = user
      assert.equal(isVerified, true)
      assert.deepEqual(rest, {})
    }
  })
})
