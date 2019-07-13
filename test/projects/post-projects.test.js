/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
const assert = require('assert')
const { Project, ProjectImage, ProjectPermission } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const randomstring = require('randomstring')

let auth
const sendedProject = { name: randomstring.generate() }
let createdProject

describe('POST /projects', () => {
  before(async () => {
    auth = await getAuth()
  })

  it('should return 200', done => {
    request(app)
      .post('/projects')
      .set('AccessToken', auth.accessToken.token)
      .send({ name: sendedProject.name })
      .expect(200)
      .expect(res => {
        const { id, name, ...rest } = res.body
        assert.equal(name, sendedProject.name)
        assert.equal(id.length, 24)
        assert.deepEqual(rest, {})
        createdProject = res.body
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
    const { project, projectImage, projectPermission } = await (async () => {
      const project = await Project.findOne({ name: sendedProject.name })
      const projectImage = await ProjectImage.findOne({ projectId: project.id })
      const projectPermission = await ProjectPermission.findOne({ clientId: auth.client.id })
      return { project, projectImage, projectPermission }
    })()

    await Project.remove(project.id)
    await ProjectImage.remove(projectImage.id)
    await ProjectPermission.remove(projectPermission.id)
    await auth.remove()

    {
      const { id, name, ...rest } = project
      assert.equal(id.toString(), createdProject.id)
      assert.deepEqual(rest, {})
    }

    {
      const { id, projectId, buffer, ...rest } = projectImage
      assert.equal(buffer instanceof Buffer, true)
      assert.deepEqual(rest, {})
    }

    {
      const {
        id,
        projectId,
        clientId,
        projectRead,
        projectUpdate,
        projectDelete,
        apiTokenCreate,
        apiTokenRead,
        apiTokenUpdate,
        apiTokenDelete,
        ...rest
      } = projectPermission
      assert.equal(projectId.toString(), project.id)
      assert.equal(projectRead, true)
      assert.equal(projectUpdate, true)
      assert.equal(projectDelete, true)
      assert.equal(apiTokenCreate, true)
      assert.equal(apiTokenRead, true)
      assert.equal(apiTokenUpdate, true)
      assert.equal(apiTokenDelete, true)
      assert.deepEqual(rest, {})
    }
  })
})
