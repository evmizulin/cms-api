const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { apiLogin } = require('./ApiLogin')
const { OK } = require('http-status-codes')
const { ApiResp } = require('../helpers/ApiResp')
const { config } = require('../config')

const setLoginRoutes = app => {
  app.options('/login', cors(allowAll))

  app.post('/login', cors(allowAll), async (req, res) => {
    const accessToken = await apiLogin.login(req.body)
    const apiResp = new ApiResp(OK)
    res
      .status(apiResp.code)
      .set('Set-Cookie', `authToken=${accessToken};${config.isProd ? ' Secure;' : ''} HttpOnly`)
      .send(apiResp.body)
  })
}

module.exports = { setLoginRoutes }
