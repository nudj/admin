let Mailgun = require('mailgun-js')
let logger = require('../lib/logger')
var mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

module.exports.send = ({
  from,
  to,
  subject,
  html
}) => {
  return mailgun
    .messages()
    .send({
      from,
      to,
      subject,
      html
    })
    .then((reply) => {
      logger.log('info', 'Mailer response', reply)
      return {
        success: true
      }
    })
}
