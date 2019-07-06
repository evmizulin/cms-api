const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { apiSignin } = require('./apiSignin')
const { OK } = require('http-status-codes')
const { ApiResp } = require('../helpers/ApiResp')
const { config } = require('../config')

const setSigninRoutes = app => {
  app.options('/signin', cors(allowAll))

  app.post('/signin', cors(allowAll), async (req, res) => {
    const accessToken = await apiSignin.signin(req.body)
    const apiResp = new ApiResp(OK)
    res
      .status(apiResp.code)
      .set('Set-Cookie', `authToken=${accessToken};${config.isProd ? ' Secure;' : ''} HttpOnly`)
      .send(apiResp.body)
  })
}

module.exports = { setSigninRoutes }
