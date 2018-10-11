const React = require('react')
const { Helmet } = require('react-helmet')
const { Text, Link } = require('@nudj/components')
const format = require('date-fns/format')

const Page = require('../../../components/page')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { hirer = {} } } = props
  return (
    <Page
      {...props}
      title='Hirer details'
    >
      <Helmet>
        <title>{`ADMIN - Hirer details`}</title>
      </Helmet>
      <p className={style.formListItem}>
        <label className={style.label}>Person</label>
        <Link href={`/people/${hirer.person.id}`} subtle>{hirer.person.firstName} {hirer.person.lastName} ({hirer.person.email})</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Company</label>
        <Link href={`/companies/${hirer.company.slug}`} subtle>{hirer.company.name}</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Type</label>
        <Text>{hirer.type}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Onboarded</label>
        <Text>{`${!!hirer.onboarded}`}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Created</label>
        <Text>{format(hirer.created, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Modified</label>
        <Text>{format(hirer.modified, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
    </Page>
  )
}

module.exports = View
