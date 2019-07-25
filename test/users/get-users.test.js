/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')

describe('GET /users', () => {
  describe('Empty array', () => {
    let auth

    before(async () => {
      auth = await getAuth()
    })

    it('should return 200', done => {
      request(app)
        .get(`/users`)
        .set('AccessToken', auth.accessToken.token)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.length, 0)
        })
        .end(done)
    })

    after(async () => {
      await auth.remove()
    })
  })

  describe('Filled array', () => {
    let auth
    let user

    before(async () => {
      auth = await getAuth()
      user = await getAuth()
    })

    it('should return 200', done => {
      request(app)
        .get(`/users?login=${user.user.login.slice(1, -1)}`)
        .set('AccessToken', auth.accessToken.token)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.length, 1)
          const { id, login, ...rest } = res.body[0]
          assert.equal(id, user.user.id.toString())
          assert.equal(login, user.user.login)
          assert.deepEqual(rest, {})
        })
        .end(done)
    })

    after(async () => {
      await auth.remove()
      await user.remove()
    })
  })
})
