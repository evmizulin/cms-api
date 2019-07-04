const cors = require('cors')
const { OK } = require('http-status-codes')
const { apiRegistration } = require('./apiRegistration')
const { allowAll } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setRegistrationRoutes = app => {
  app.options('/users', cors(allowAll))
  /*
  app.post('/register', cors(allowMe), async (req, res) => {
    await apiRegister.register(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })
  */

  app.post('/users', cors(allowAll), async (req, res) => {
    await apiRegistration.postUser(req.body)
    const apiResp = new ApiResp(OK)
    res.status(apiResp.code).send(apiResp.body)
  })
  /*
  app.options('/email-confirm', cors(allowMe))

  app.post('/email-confirm', cors(allowMe), async (req, res) => {
    await apiRegister.emailConfirm(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })
  */
}

module.exports = { setRegistrationRoutes }
