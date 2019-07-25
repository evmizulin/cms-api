/*global describe, it, after, before*/

const { request } = require('../helpers/request')
const { app } = require('../../src/index')
const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')

let authOfProject
let authOfNoProject
let projectOfUser
let projectOfNoOne
let projectPermission

describe('GET /projects', () => {
  before(async () => {
    authOfProject = await getAuth()
    authOfNoProject = await getAuth()
    projectOfUser = await getProject()
    projectOfNoOne = await getProject()
    projectPermission = await getProjectPermission(authOfProject, projectOfUser)
  })

  it('should return 200', done => {
    request(app)
      .get('/projects')
      .set('AccessToken', authOfProject.accessToken.token)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.length, 1)
        const { id, name, ...rest } = res.body[0]
        assert.equal(id, projectOfUser.project.id)
        assert.equal(name, projectOfUser.project.name)
        assert.deepEqual(rest, {})
      })
      .end(done)
  })

  it('should return 200', done => {
    request(app)
      .get('/projects')
      .set('AccessToken', authOfNoProject.accessToken.token)
      .expect(200)
      .expect(res => {
        assert.equal(res.body.length, 0)
      })
      .end(done)
  })

  after(async () => {
    await authOfProject.remove()
    await authOfNoProject.remove()
    await projectOfUser.remove()
    await projectOfNoOne.remove()
    await projectPermission.remove()
  })
})
