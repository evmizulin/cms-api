/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project, ProjectImage, ProjectPermission } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')

let auth
let project

describe('POST /projects', () => {
  before(async () => {
    auth = await getAuth()
  })

  it('should return 200', done => {
    request(app)
      .post('/projects')
      .set('AccessToken', auth.accessToken.token)
      .send({ name: 'post-projects-success' })
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body
        assert.equal(name, 'post-projects-success')
        assert.equal(id.length, 24)
        assert.deepEqual(rest, {})
        project = res.body
      })
      .end(done)
  })

  it('should return 400', done => {
    request(app)
      .post('/projects')
      .set('AccessToken', auth.accessToken.token)
      .send({ id: 'abc', name: 'post-projects-fail' })
      .expect(400, { message: 'Additional properties not allowed' })
      .end(done)
  })

  after(async () => {
    await (async () => {
      const images = await ProjectImage.find({ projectId: project.id })
      const { id, projectId, buffer, ...rest } = images[0]
      assert.equal(images.length, 1)
      assert.equal(id.toString().length, 24)
      assert.equal(buffer instanceof Buffer, true)
      assert.deepEqual(rest, {})
      await ProjectImage.remove(id)
    })()
    await (async () => {
      const permissions = await ProjectPermission.find({ clientId: auth.client.id })
      const { id, projectId, clientId, projectRead, projectUpdate, projectDelete, ...rest } = permissions[0]
      assert.equal(projectId.toString(), project.id)
      assert.equal(projectRead, true)
      assert.equal(projectUpdate, true)
      assert.equal(projectDelete, true)
      assert.deepEqual(rest, {})
      await ProjectPermission.remove(id)
    })()

    await Project.remove(project.id)
    await auth.remove()
  })
})
