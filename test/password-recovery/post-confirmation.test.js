/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { getAuth } = require('../helpers/getAuth')
const { PasswordRecoveryToken, User } = require('../../src/services/db/Db')
const assert = require('assert')
const randomstring = require('randomstring')
const hash = require('object-hash')

let auth
let passwordRecoveryToken

describe('POST /password-recovery/confirmation', () => {
  before(async () => {
    auth = await getAuth()
    passwordRecoveryToken = await PasswordRecoveryToken.insert({
      userId: auth.user.id,
      token: randomstring.generate(),
    })
  })

  it('should return 200', done => {
    request
      .post(`/password-recovery/confirmation`)
      .send({ password: '123456', token: passwordRecoveryToken.token })
      .expect(200)
      .end(done)
  })

  it('should return 400', done => {
    request
      .post(`/password-recovery/confirmation`)
      .send({ l: 'l' })
      .expect(400)
      .end(done)
  })

  it('should return 400', done => {
    request
      .post(`/password-recovery`)
      .send({ password: '654321', token: '123' })
      .expect(400)
      .end(done)
  })

  after(async () => {
    const user = await User.findById(auth.user.id)
    await auth.remove()

    const { id, login, passHash, isVerified, ...rest } = user
    assert.equal(login, auth.user.login)
    assert.equal(passHash, hash('123456'))
    assert.deepEqual(rest, {})
  })
})
