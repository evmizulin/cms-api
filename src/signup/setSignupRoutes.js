const cors = require('cors')
const { apiSignup } = require('./apiSignup')
const { allowMe } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setSignupRoutes = app => {
  app.options('/signup', cors(allowMe))

  app.post('/signup', cors(allowMe), async (req, res) => {
    await apiSignup.signup(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })

  app.options('/signup/confirmation', cors(allowMe))

  app.post('/signup/confirmation', cors(allowMe), async (req, res) => {
    await apiSignup.confirmation(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setSignupRoutes }
