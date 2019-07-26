/*global describe, it*/

const { request } = require('./helpers/request')
const { app } = require('../src/index')

describe('GET /not-found', () => {
  it('should return 404', done => {
    request
      .get('/not-found')
      .expect(404, { message: 'Not Found' })
      .end(done)
  })
})
