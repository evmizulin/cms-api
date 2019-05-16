const { config } = require('../config')

/* all headers allowed */
const allowAll = {
  origin: true,
  credentials: true,
  // allowedHeaders: ['ApiKey']
}
const allowMe = {
  origin: (origin, cb) => {
    const list = [config.appUrl]
    const allow = list.indexOf(origin) !== -1
    const error = allow ? null : new Error('Not allowed by CORS')
    cb(error, allow)
  },
  credentials: true,
  // allowedHeaders: ['ApiKey'],
}

module.exports = { allowMe, allowAll }
