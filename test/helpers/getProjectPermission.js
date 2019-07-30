const { ProjectPermission } = require('../../src/services/db/Db')
const { getDefaultProjectPermissions } = require('../../src/helpers/getDefaultProjectPermissions')

const getProjectPermission = async (auth, project) => {
  const permission = await ProjectPermission.insert({
    projectId: project.project.id,
    clientId: auth.client.id,
    ...getDefaultProjectPermissions(auth.user ? 'user' : 'app'),
  })
  return {
    permission,
    remove: async () => {
      await ProjectPermission.remove(permission.id)
    },
  }
}

module.exports = { getProjectPermission }
