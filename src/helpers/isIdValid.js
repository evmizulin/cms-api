const mongoose = require('mongoose')

module.exports = { isIdValid: id => mongoose.Types.ObjectId.isValid(id) }
