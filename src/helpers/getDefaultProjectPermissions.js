const getDefaultProjectPermissions = clientType => {
  const MAP = {
    app: {
      projectRead: false,
      projectUpdate: false,
      projectDelete: false,
      apiTokenCreate: false,
      apiTokenRead: false,
      apiTokenUpdate: false,
      apiTokenDelete: false,
      userOfProjectCreate: false,
      userOfProjectRead: false,
      userOfProjectDelete: false,
    },
    user: {
      projectRead: true,
      projectUpdate: true,
      projectDelete: true,
      apiTokenCreate: true,
      apiTokenRead: true,
      apiTokenUpdate: true,
      apiTokenDelete: true,
      userOfProjectCreate: true,
      userOfProjectRead: true,
      userOfProjectDelete: true,
    },
  }
  return MAP[clientType]
}

module.exports = { getDefaultProjectPermissions }
