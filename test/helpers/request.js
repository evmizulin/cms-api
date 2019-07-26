const defaults = require('superagent-defaults')
const supertest = require('supertest')
const { app } = require('../../src/index')

const superagent = defaults(supertest(app))
superagent.set('Origin', 'supertest-agent')

module.exports = {
  request: superagent,
}
