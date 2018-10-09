const React = require('react')
const { Helmet } = require('react-helmet')
const { Text } = require('@nudj/components')
const format = require('date-fns/format')

const Page = require('../../../components/page')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { intro = {} } } = props
  return (
    <Page
      {...props}
      title='Intro details'
      description={``}
    >
      <Helmet>
        <title>{`ADMIN - Intro details`}</title>
      </Helmet>
      <p className={style.formListItem}>
        <label className={style.label}>Candidate</label>
        <Text>{intro.candidate.firstName} {intro.candidate.lastName} ({intro.candidate.email})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Job</label>
        <Text>{intro.job.title} ({intro.job.company.name})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>From</label>
        <Text>{intro.person.firstName} {intro.person.lastName} ({intro.person.email})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Notes</label>
        <Text>{intro.notes}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Created</label>
        <Text>{format(intro.created, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Modified</label>
        <Text>{format(intro.modified, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
    </Page>
  )
}

module.exports = View
