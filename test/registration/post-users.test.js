/*global describe, before, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { User } = require('../../src/services/db/Db')
const hash = require('object-hash')
const assert = require('assert')

describe('POST /users', () => {
  describe('Success - insert', () => {
    it('should return 200', done => {
      request(app)
        .post('/users')
        .send({ login: 'success', password: '1234567' })
        .expect(200)
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const { id, login, passHash, isVerified, ...rest } = await User.findOne({ login: 'success' })
      assert.equal(isVerified, false)
      assert.equal(passHash, hash('1234567'))
      assert.deepEqual(rest, {})
      await User.remove(id)
    })
  })

  describe('Success - update password', () => {
    before(async () => {
      await User.insert({ login: 'update', passHash: '1', isVerified: false })
    })

    it('should return 200', done => {
      request(app)
        .post('/users')
        .send({ login: 'update', password: '1234567' })
        .expect(200)
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const { id, login, passHash, isVerified, ...rest } = await User.findOne({ login: 'update' })
      assert.equal(isVerified, false)
      assert.equal(passHash, hash('1234567'))
      assert.deepEqual(rest, {})
      await User.remove(id)
    })
  })

  describe('Unvalid creds', () => {
    it('should return 400', done => {
      request(app)
        .post('/users')
        .send({ login: '1', password: '1' })
        .expect(400)
        .expect({ message: 'String is too short (1 chars), minimum 6' })
        .end(done)
    })
  })

  describe('User exist', () => {
    before(async () => {
      await User.insert({ login: 'exist', passHash: '1', isVerified: true })
    })

    it('should return 400', done => {
      request(app)
        .post('/users')
        .send({ login: 'exist', password: '1234567' })
        .expect(400)
        .expect({ message: 'User with that email already exists' })
        .end(done)
    })

    after(async () => {
      const user = await User.findOne({ login: 'exist' })
      await User.remove(user.id)
    })
  })
})
