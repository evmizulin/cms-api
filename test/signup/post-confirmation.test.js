/*global describe, before, it, after*/

const request = require('supertest')
const { app } = require('../../src/index')
const { User } = require('../../src/services/db/Db')
const assert = require('assert')
const { encrypter } = require('../../src/services/Encrypter')

describe('POST /signup/confirmation', () => {
  before(async () => {
    await User.insert({ login: 'email-confirm-success', passHash: '1', isVerified: false })
  })

  it('should return 200', done => {
    request(app)
      .post('/signup/confirmation')
      .send({ confirmationToken: encrypter.encrypt('email-confirm-success') })
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
    const { id, login, passHash, isVerified, ...rest } = await User.findOne({
      login: 'email-confirm-success',
    })
    await User.remove(id)
    assert.equal(isVerified, true)
    assert.equal(passHash, '1')
    assert.deepEqual(rest, {})
  })
})
