/*global describe, it*/

const { request } = require('./helpers/request')

describe('GET /not-found', () => {
  it('should return 404', done => {
    request
      .get('/not-found')
      .expect(404, { message: 'Route is not found' })
      .end(done)
  })
})
