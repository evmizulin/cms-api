const { ApiError } = require('../helpers/ApiError')
const { User } = require('../services/db/Db')
const { NOT_FOUND } = require('http-status-codes')
const { isIdValid } = require('../helpers/isIdValid')

const extractUserId = async (req, res, next) => {
  const { userId } = req.params

  if (!isIdValid(userId)) throw new ApiError(NOT_FOUND, 'UserId is not valid')
  const foundedUser = await User.findById(userId, { _id: true })
  if (!foundedUser) throw new ApiError(NOT_FOUND, 'User is not found')

  req.extractedProps = { ...(req.extractedProps || {}), userId: foundedUser.id }

  next()
}

module.exports = { extractUserId }
