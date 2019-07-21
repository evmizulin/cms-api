const { ProjectPermission } = require('../../src/services/db/Db')
const { getDefaultPermissions } = require('../../src/helpers/getDefaultPermissions')

const getProjectPermission = async (auth, project) => {
  const permission = await ProjectPermission.insert({
    projectId: project.project.id,
    clientId: auth.client.id,
    ...getDefaultPermissions('user'),
  })
  return {
    permission,
    remove: async () => {
      await ProjectPermission.remove(permission.id)
    },
  }
}

module.exports = { getProjectPermission }
