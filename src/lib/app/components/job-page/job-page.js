const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const { Autosuggest } = require('react-autosuggest')

console.log(Autosuggest)

const getStyle = require('./job-page.css')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const CopyToClipboard = require('../copy-to-clipboard/copy-to-clipboard')

function renderJobActivitiy ({activity, style}) {
  let trendStyle = style.jobActivityHighlightPositive

  if (activity.trend === -1) {
    trendStyle = style.jobActivityHighlightNegative
  } else if (activity.trend === 0) {
    trendStyle = style.jobActivityHighlightNeutral
  }

  return (<div className={style.jobActivity}>
    <h4 className={style.jobActivityTitle}>{activity.title}</h4>
    <p className={style.jobActivitySummary}><span className={trendStyle}>{activity.thisWeek}</span> in the last week</p>
    <p className={style.jobActivityFooter}>{activity.total} in total</p>
  </div>)
}

function getActivityData (title, data) {
  const activityData = {
    title: title,
    thisWeek: data.thisWeek,
    total: data.total,
    trend: data.trend
  }
  return activityData
}

function getActivitesData ({props}) {
  const pageViewData = get(props, 'activities.pageViews', {})
  const referrerData = get(props, 'activities.referrers', {})
  const applicationData = get(props, 'activities.applications', {})

  const pageViews = getActivityData('Page views', pageViewData)
  const referrers = getActivityData('Referrers', referrerData)
  const applications = getActivityData('Applications', applicationData)

  return {pageViews, referrers, applications}
}

function renderJobActivities ({props, style}) {
  const {referrers, applications} = getActivitesData({props})

  return (<div className={style.jobActivities}>
    {renderJobActivitiy({ activity: referrers, style })}
    {renderJobActivitiy({ activity: applications, style })}
  </div>)
}

function findRelatedReferral ({props, referralId}) {
  const referrals = get(props, 'referrals', [])
  return referrals.find(referral => referral.id === referralId)
}

function renderApplicationsList ({props, style}) {
  const applications = get(props, 'applications', [])

  return (<div>
    {applications.map(application => {
      const name = `${get(application, 'firstName')} ${get(application, 'lastName')}`
      const referralId = get(application, 'referralId')
      const relatedReferral = findRelatedReferral({props, referralId})
      const relatedReferralInfo = relatedReferral ? `${relatedReferral.id} (${relatedReferral.firstName} ${relatedReferral.lastName})` : '-'
      return (<RowItem
        title={name}
        details={[
          {
            term: 'Email',
            description: get(application, 'email')
          },
          {
            term: 'Referral',
            description: relatedReferralInfo
          }
        ]}
      />)
    })}
  </div>)
}

function renderReferralsList ({props, style}) {
  const referrals = get(props, 'referrals', [])
  const companySlug = get(props, 'company.slug')
  const jobSlug = get(props, 'job.slug', '')

  return (<div>
    {referrals.map(referral => {
      const name = `${get(referral, 'firstName')} ${get(referral, 'lastName')}`
      const slug = `${companySlug}+${jobSlug}+${get(referral, 'id', '')}`
      const referralLink = `https://nudj.co/jobs/${slug}`
      const referralId = get(referral, 'referralId')
      const relatedReferral = findRelatedReferral({props, referralId})

      const relatedReferralInfo = relatedReferral ? `${relatedReferral.id} (${relatedReferral.firstName} ${relatedReferral.lastName})` : '-'

      return (<RowItem
        key={slug}
        title={name}
        uri={referralLink}
        details={[
          {
            term: 'Referral Id',
            description: get(referral, 'id')
          },
          {
            term: 'Email',
            description: get(referral, 'email')
          },
          {
            term: 'Link',
            description: referralLink
          },
          {
            term: 'Related referral',
            description: relatedReferralInfo
          }
        ]}
        actions={[
          <CopyToClipboard className={style.copyLink} data-clipboard-text={referralLink}>Copy link</CopyToClipboard>
        ]}
      />)
    })}
  </div>)
}

const JobPage = (props) => {
  const style = getStyle()

  const jobSlug = get(props, 'job.slug', '')
  const nudjLink = `/${jobSlug}/nudj`

  const applicationsList = renderApplicationsList({props, style})
  const referralsList = renderReferralsList({props, style})
  const jobActivity = renderJobActivities({props, style})

  return (
    <div className={style.pageBody}>
      <Helmet>
        <title>{`nudj - ${get(props, 'job.title')} @ ${get(props, 'company.name')}`}</title>
      </Helmet>
      <PageHeader
        title={get(props, 'job.title')}
        subtitle={<span>@ <Link className={style.headerLink} to={'/'}>{get(props, 'company.name')}</Link></span>}
      >
        <CopyToClipboard className={style.copyLink} data-clipboard-text={`https://nudj.co/${get(props, 'company.slug')}+${get(props, 'job.slug')}`}>Copy job link</CopyToClipboard>
        <Link className={style.nudjLink} to={nudjLink}>nudj job</Link>
      </PageHeader>
      <div className={style.pageContent}>
        <div className={style.pageMainContainer}>
          <h3 className={style.pageHeadline}>Job activity</h3>
          <div className={style.pageMain}>
            {jobActivity}
          </div>
          <hr className={style.sectionDivider} />
          <h3 className={style.pageHeadline}>Referrals</h3>
          <div className={style.pageMain}>
            {referralsList}
          </div>
          <div className={style.pageMain}>
            {
            // <Autosuggest
            //   suggestions={suggestions}
            //   onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            //   onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            //   getSuggestionValue={getSuggestionValue}
            //   renderSuggestion={renderSuggestion}
            //   inputProps={inputProps} />
            }
            <button className={style.nudjLink}>MOAR</button>
          </div>
          <hr className={style.sectionDivider} />
          <h3 className={style.pageHeadline}>Applications</h3>
          <div className={style.pageMain}>
            {applicationsList}
          </div>
        </div>
      </div>
    </div>
  )
}

module.exports = JobPage
