const defaults = require('superagent-defaults')
const supertest = require('supertest')

module.exports = {
  request: (...props) => {
    const superagent = defaults(supertest(...props))
    superagent.set('Origin', 'supertest-agent')
    return superagent
  },
}
