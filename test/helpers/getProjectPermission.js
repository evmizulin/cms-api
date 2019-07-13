const { ProjectPermission } = require('../../src/services/db/Db')

const getProjectPermission = async (auth, project) => {
  const permission = await ProjectPermission.insert({
    projectId: project.project.id,
    clientId: auth.client.id,
    projectRead: true,
    projectUpdate: true,
    projectDelete: true,
    apiTokenCreate: true,
    apiTokenRead: true,
    apiTokenUpdate: true,
    apiTokenDelete: true,
  })
  return {
    permission,
    remove: async () => {
      await ProjectPermission.remove(permission.id)
    },
  }
}

module.exports = { getProjectPermission }
