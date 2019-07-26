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
      permissionsRead: false,
      permissionsUpdate: false,
      fileCreate: true,
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
      permissionsRead: true,
      permissionsUpdate: true,
      fileCreate: true,
    },
  }
  return MAP[clientType]
}

module.exports = { getDefaultProjectPermissions }
