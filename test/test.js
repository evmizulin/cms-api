/*global describe, after*/

const { connection } = require('../src/services/db/tables')

describe('All tests', () => {
  require('./get-not-found.test')
  require('./get-say-hello.test')
  require('./projects/get-projects.test')
  require('./projects/post-projects.test')

  after(async () => {
    connection.close()
  })
})
