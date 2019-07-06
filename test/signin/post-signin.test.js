/*global describe, before, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { User, AccessToken } = require('../../src/services/db/Db')
const hash = require('object-hash')
const assert = require('assert')

let token

describe('POST /signin', () => {
  describe('Success', () => {
    before(async () => {
      await User.insert({ login: 'signin-success', passHash: hash('123456'), isVerified: true })
    })

    it('should return 200', done => {
      request(app)
        .post('/signin')
        .send({ login: 'signin-success', password: '123456' })
        .expect(200)
        .expect('Set-Cookie', /authToken=/)
        .expect('Set-Cookie', /HttpOnly/)
        .expect(res => {
          token = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
          assert.equal(token.length, 40)
        })
        .expect({ message: 'OK' })
        .end(done)
    })

    after(async () => {
      const { id: userId } = await User.findOne({ login: 'signin-success' })
      const { id: tokenId } = await AccessToken.findOne({ token })
      await User.remove(userId)
      await AccessToken.remove(tokenId)
    })
  })

  describe('Fail', () => {
    before(async () => {
      await User.insert({ login: 'signin-fail', passHash: hash('123456'), isVerified: false })
    })

    it('should return 400', done => {
      request(app)
        .post('/signin')
        .send({ login: '1', password: '23' })
        .expect(400)
        .expect({ message: 'String is too short (2 chars), minimum 6' })
        .end(done)
    })

    it('should return 400', done => {
      request(app)
        .post('/signin')
        .send({ login: 'signin-not-found', password: '123456' })
        .expect(400)
        .expect({ message: 'Invalid username or password' })
        .end(done)
    })

    it('should return 400', done => {
      request(app)
        .post('/signin')
        .send({ login: 'signin-fail', password: '123456' })
        .expect(400)
        .expect({ message: 'Invalid username or password' })
        .end(done)
    })

    after(async () => {
      const { id: userId } = await User.findOne({ login: 'signin-fail' })
      await User.remove(userId)
    })
  })
})
