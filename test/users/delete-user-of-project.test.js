/*global describe, it, after, before*/

const request = require('supertest')
const { app } = require('../../src/index')
// const assert = require('assert')
const { getAuth } = require('../helpers/getAuth')
const { getProject } = require('../helpers/getProject')
const { getProjectPermission } = require('../helpers/getProjectPermission')
// const { ProjectPermission } = require('../../src/services/db/Db')

describe('DELETE /projects/${id}/users/${id}', () => {
  describe('Success', () => {
    let auth
    let user
    let project
    let userProjectPermissions

    before(async () => {
      auth = await getAuth()
      user = await getAuth()
      project = await getProject()
      userProjectPermissions = await getProjectPermission(auth, project)
      await getProjectPermission(user, project)
    })

    it('should return 200', done => {
      request(app)
        .delete(`/projects/${project.project.id}/users/${user.user.id}`)
        .set('AccessToken', auth.accessToken.token)
        .expect(200)
        .end(done)
    })

    after(async () => {
      await auth.remove()
      await user.remove()
      await project.remove()
      await userProjectPermissions.remove()
    })
  })

  describe('Fail', () => {
    let auth
    let user
    let project
    let userProjectPermissions
    const fakeId = '5d14c75f2d32f92ae2cc831a'

    before(async () => {
      auth = await getAuth()
      user = await getAuth()
      project = await getProject()
      userProjectPermissions = await getProjectPermission(auth, project)
    })

    it('should return 404', done => {
      request(app)
        .delete(`/projects/${project.project.id}/users/${fakeId}aaa`)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })

    it('should return 404', done => {
      request(app)
        .delete(`/projects/${project.project.id}/users/${fakeId}`)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })

    it('should return 404', done => {
      request(app)
        .delete(`/projects/${project.project.id}/users/${user.user.id}`)
        .set('AccessToken', auth.accessToken.token)
        .expect(404)
        .end(done)
    })

    after(async () => {
      await auth.remove()
      await user.remove()
      await project.remove()
      await userProjectPermissions.remove()
    })
  })
})
