/*global describe, it*/

const request = require('supertest')
const { app } = require('../../src/index')

const unvalidId = 'sad'
const fakeId = '5d14c75f2d32f92ae2cc831a'

describe('Check id /projects/${id}', () => {
  it('DELETE should return 404', done => {
    request(app)
      .delete(`/projects/${unvalidId}`)
      .expect(404)
      .end(done)
  })

  it('DELETE should return 404', done => {
    request(app)
      .delete(`/projects/${fakeId}`)
      .expect(404)
      .end(done)
  })

  it('GET should return 404', done => {
    request(app)
      .get(`/projects/${unvalidId}/image.png`)
      .expect(404)
      .end(done)
  })

  it('GET should return 404', done => {
    request(app)
      .get(`/projects/${fakeId}/image.png`)
      .expect(404)
      .end(done)
  })

  it('PUT should return 404', done => {
    request(app)
      .put(`/projects/${unvalidId}`)
      .send({ id: 'aaa', name: 'New project' })
      .expect(404)
      .end(done)
  })

  it('PUT should return 404', done => {
    request(app)
      .put(`/projects/${fakeId}`)
      .send({ id: 'aaa', name: 'New project' })
      .expect(404)
      .end(done)
  })
})
