/*global describe, it*/

const request = require('supertest')
const { app } = require('../src/index')

describe('GET /not-found', () => {
  it('should return 404', done => {
    request(app)
      .get('/not-found')
      .expect(404, { message: 'Not Found' })
      .end(done)
  })
})
