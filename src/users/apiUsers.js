const { User } = require('../services/db/Db')

class ApiUsers {
  async search(login) {
    if (!login) return []
    const users = await User.find({ isVerified: true }, { login: true })
    return users.filter(user => user.login.toLowerCase().indexOf(login.toLowerCase()) > -1).slice(0, 4)
  }
}

module.exports = { apiUsers: new ApiUsers() }
