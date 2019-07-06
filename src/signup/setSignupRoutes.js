const cors = require('cors')
const { OK } = require('http-status-codes')
const { apiSignup } = require('./apiSignup')
const { allowAll } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setSignupRoutes = app => {
  app.options('/signup', cors(allowAll))
  /*
  app.post('/register', cors(allowMe), async (req, res) => {
    await apiRegister.register(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })
  */

  app.post('/signup', cors(allowAll), async (req, res) => {
    await apiSignup.signup(req.body)
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

  app.options('/signup/confirmation', cors(allowAll))

  app.post('/signup/confirmation', cors(allowAll), async (req, res) => {
    await apiSignup.confirmation(req.body)
    const apiResp = new ApiResp(OK)
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setSignupRoutes }
