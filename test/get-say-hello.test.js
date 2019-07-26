/*global describe, it*/

const { request } = require('./helpers/request')

describe('GET /say-hello', () => {
  it('should return 200', done => {
    request
      .get('/say-hello')
      .expect(200, { message: 'hello' })
      .end(done)
  })
})
