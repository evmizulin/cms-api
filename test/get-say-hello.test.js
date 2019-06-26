/*global describe, it*/

const request = require('supertest')
const { app } = require('../src/index')

describe('GET /say-hello', () => {
  it("should return 'hello'", done => {
    request(app)
      .get('/say-hello')
      .expect(200, { message: 'hello' })
      .end(done)
  })
})
