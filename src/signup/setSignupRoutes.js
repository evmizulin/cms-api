const cors = require('cors')
const { apiSignup } = require('./apiSignup')
const { allowAll } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setSignupRoutes = app => {
  app.options('/signup', cors(allowAll))

  app.post('/signup', cors(allowAll), async (req, res) => {
    await apiSignup.signup(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })

  app.options('/signup/confirmation', cors(allowAll))

  app.post('/signup/confirmation', cors(allowAll), async (req, res) => {
    await apiSignup.confirmation(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setSignupRoutes }
