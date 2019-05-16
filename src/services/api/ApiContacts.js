const { Contact } = require('../db/Db')
const { createContact } = require('./types/contacts/createContact')

class ApiContacts {
  async postContact(contact) {
    const createdContact = createContact(contact)
    await Contact.save(createdContact)
  }
}

module.exports = { apiContacts: new ApiContacts() }
