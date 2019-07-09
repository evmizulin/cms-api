const { ProjectPermission } = require('../../../src/services/db/Db')

const getProjectPermission = async (auth, project) => {
  const permission = await ProjectPermission.insert({
    projectId: project.project.id,
    clientId: auth.client.id,
    read: true,
    update: true,
    delete: true,
  })
  return {
    permission,
    asd: 1,
    remove: async () => {
      await ProjectPermission.remove(permission.id)
    },
  }
}

module.exports = { getProjectPermission }
