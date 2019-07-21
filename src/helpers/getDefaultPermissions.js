const getDefaultPermissions = clientType => {
  const MAP = {
    app: {
      projectRead: false,
      projectUpdate: false,
      projectDelete: false,
      apiTokenCreate: false,
      apiTokenRead: false,
      apiTokenUpdate: false,
      apiTokenDelete: false,
    },
    user: {
      projectRead: true,
      projectUpdate: true,
      projectDelete: true,
      apiTokenCreate: true,
      apiTokenRead: true,
      apiTokenUpdate: true,
      apiTokenDelete: true,
    },
  }
  return MAP[clientType]
}

module.exports = { getDefaultPermissions }
