const { globalConfig: config } = require('../config')

const IS_TEST = process.env.NODE_ENV === 'test'
const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = process.env.NODE_ENV === 'production'

if (!IS_TEST && !IS_DEV && !IS_PROD) {
  throw new Error('NODE_ENV must be set!')
}

module.exports = {
  config: {
    env: process.env.NODE_ENV,
    shouldStartServer: !IS_TEST,
    isCookieSecure: IS_PROD,
    email: config.email,
    sendMails: IS_PROD,
    logsTo: IS_DEV ? 'console' : IS_TEST ? 'no' : 'file',
    appUrl: IS_PROD ? config.prodAppUrl : IS_DEV ? config.devAppUrl : config.testAppUrl,
    apiUrl: IS_PROD ? config.prodApiUrl : config.devApiUrl,
    apiServerHost: IS_PROD ? config.prodApiServerHost : config.devApiServerHost,
    apiServerPort: IS_PROD ? config.prodApiServerPort : config.devApiServerPort,
    mongoDbUrl: IS_PROD ? config.prodMongoDbUrl : config.devMongoDbUrl,
  },
}
