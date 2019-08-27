/*global describe, it, before, after*/

const { request } = require('../helpers/request')
const { File, ProjectImage } = require('../../src/services/db/Db')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
const randomstring = require('randomstring')
const { getApiToken } = require('../helpers/getApiToken')
const { getModel } = require('../helpers/getModel')
const { getEntry } = require('../helpers/getEntry')

let auth
const projects = []

describe('DELETE /projects/${id}', () => {
  before(async () => {
    auth = await getAuth()
    projects.push(await getProject(), await getProject())
    await ProjectImage.insert({ projectId: projects[0].project.id, buffer: new Buffer(1) })
    await ProjectImage.insert({ projectId: projects[1].project.id, buffer: new Buffer(1) })
    await getProjectPermission(auth, projects[0])
    await getProjectPermission(auth, projects[1])

    const apiToken = await getApiToken()
    await getProjectPermission(apiToken, projects[1])
    await File.insert({
      projectId: projects[1].project.id,
      name: randomstring.generate(),
      buffer: new Buffer(1),
      mimetype: randomstring.generate(),
    })
    const model = await getModel(projects[1])
    await getEntry(model)
  })

  it('should return 200', done => {
    request
      .delete(`/projects/${projects[0].project.id}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  it('should return 200', done => {
    request
      .delete(`/projects/${projects[1].project.id}`)
      .set('AccessToken', auth.accessToken.token)
      .expect(200)
      .expect({ message: 'OK' })
      .end(done)
  })

  after(async () => {
    await auth.remove()
  })
})
