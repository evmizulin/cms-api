const { Project } = require('../../../src/services/db/Db')
const randomstring = require('randomstring')

const getProject = async () => {
  const project = await Project.insert({ name: randomstring.generate() })
  return {
    project,
    remove: async () => {
      await Project.remove(project.id)
    },
  }
}

module.exports = { getProject }
