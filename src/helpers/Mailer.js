var Email = require('email').Email
const templateUtil = require('string-template')
const fs = require('fs')
const { config } = require('../config')
const recoverPassHtml = fs.readFileSync(__dirname + '/mails/recoverPass.html', 'utf8')
const emailConfirmHtml = fs.readFileSync(__dirname + '/mails/emailConfirm.html', 'utf8')

const MAP = {
  'recover-pass': {
    subject: 'Forgot your password?',
    getText: props => templateUtil(recoverPassHtml, props),
  },
  'email-confirm': {
    subject: 'Confirm your email',
    getText: props => templateUtil(emailConfirmHtml, props),
  },
}

const send = ({ to, subject, text, html = false }) => {
  return new Promise(resolve => {
    const opt = {
      from: config.email,
      to,
      subject,
      body: text,
    }
    if (html) {
      opt.bodyType = 'html'
    }
    const email = new Email(opt)

    if (config.sendMails) {
      email.send(function(err) {
        if (err) console.log(err) // eslint-disable-line no-console
        resolve()
      })
    } else {
      console.log(opt) // eslint-disable-line no-console
      resolve()
    }
  })
}

class Mailer {
  send(template, { to, props }) {
    return send({
      to,
      subject: MAP[template].subject,
      text: MAP[template].getText(props),
      html: true,
    })
  }
}

module.exports = { mailer: new Mailer() }
