/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const { getAuth } = require('../helpers/getAuth')
const { PasswordRecoveryToken } = require('../../src/services/db/Db')
const assert = require('assert')

let auth

describe('POST /password-recovery', () => {
  before(async () => {
    auth = await getAuth()
  })

  it('should return 200', done => {
    request(app)
      .post(`/password-recovery`)
      .send({ login: auth.user.login })
      .expect(200)
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post(`/password-recovery`)
      .send({ l: auth.user.login })
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post(`/password-recovery`)
      .send({ login: 'a@a.a' })
      .expect(400)
      .end(done)
  })

  after(async () => {
    const recoveryToken = await PasswordRecoveryToken.findOne({ userId: auth.user.id })
    await PasswordRecoveryToken.remove(recoveryToken.id)
    await auth.remove()

    const { id, userId, token, ...rest } = recoveryToken
    assert.equal(token.length, 40)
    assert.deepEqual(rest, {})
  })
})
