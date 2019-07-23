/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

describe('GET /projects/${id}/users', () => {
  let auth
  let users
  let project
  let userProjectPermission

  before(async () => {
    auth = await getAuth()
    users = [await getAuth(), await getAuth()]
    project = await getProject()
    userProjectPermission = [
      await getProjectPermission(auth, project),
      await getProjectPermission(users[0], project),
    ]
  })

  it('should return 200', done => {
    request(app)
      .get(`/projects/${project.project.id}/users`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.length, 2)
        const [userOne, userTwo] = res.body
        const check = (user, originlUser) => {
          const { id, login, ...rest } = user
          assert.equal(id, originlUser.user.id.toString())
          assert.equal(login, originlUser.user.login)
          assert.deepEqual(rest, {})
        }
        check(userOne, auth)
        check(userTwo, users[0])
      })
      .end(done)
  })

  after(async () => {
    await auth.remove()
    await Promise.all(users.map(item => item.remove()))
    await project.remove()
    await Promise.all(userProjectPermission.map(item => item.remove()))
  })
})
