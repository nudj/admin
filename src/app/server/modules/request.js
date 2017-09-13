let Mailgun = require('mailgun-js')
let logger = require('../lib/logger')
let intercom = require('../lib/intercom')
var mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

module.exports.send = (firstName, lastName, email, companyName) => {
  logger.log('info', 'Sending email', firstName, lastName, email, companyName)
  intercom.createUniqueLeadAndTag({
    name: `${firstName} ${lastName}`,
    email,
    companies: [
      {
        company_id: companyName.toLowerCase().split(' ').join('-'),
        name: companyName
      }
    ]
  }, 'hirer')
  return mailgun
    .messages()
    .send({
      from: 'hello@nudj.co',
      to: 'hello@nudj.co',
      subject: 'Request Access',
      html: `
        <html>
        <body>
          <br/>
          <p>Hi team,</p>
          <p>A new user has requested access.</p>
          <br/>
          <p>
            <strong>Full name:</strong> ${firstName} ${lastName}<br/>
            <strong>Email:</strong> ${email}<br/>
            <strong>Company Name:</strong> ${companyName}<br/>
          </p>
          <br/>
          <p>Love<br/> Your friendly nudj bot.</p>
          <br/>
        </body>
        </html>
      `
    })
    .then((reply) => {
      logger.log('info', 'Mailer response', reply)
      return {
        success: true
      }
    })
}
