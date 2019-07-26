/*global describe, before, it, after*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const { User } = require('../../src/services/db/Db')
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
      request
        .post('/signup')
        .send({ login, password })
        .expect(200)
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const user = await User.findOne({ login: users[0].login })
      await User.remove(user.id)

      const { id, login, passHash, isVerified, ...rest } = user
      assert.equal(isVerified, false)
      assert.equal(passHash, hash(users[0].password))
      assert.deepEqual(rest, {})
    })
  })

  describe('Success - update password', () => {
    before(async () => {
      const { login, password } = users[1]
      await User.insert({ login, passHash: hash(password), isVerified: false })
    })

    it('should return 200', done => {
      const { login, password } = users[1]
      request
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
      request
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
      request
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
