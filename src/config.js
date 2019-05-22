const { config } = require('../config')

const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = {
  config: {
    email: config.email,
    sendMails: IS_DEV ? false : true,
    logsToFile: IS_DEV ? false : true,
    appUrl: IS_DEV ? config.devAppUrl : config.prodAppUrl,
    apiUrl: IS_DEV ? config.devApiUrl : config.prodApiUrl,
    apiServerHost: IS_DEV ? config.devApiServerHost : config.prodApiServerHost,
    apiServerPort: IS_DEV ? config.devApiServerPort : config.prodApiServerPort,
    mongoDbUrl: IS_DEV ? config.devMongoDbUrl : config.prodMongoDbUrl,
  },
}
