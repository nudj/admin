const { merge } = require('@nudj/library')

const baseFetcherResponse = {
  activities: {
    applications: {
      lastWeek: 0,
      thisWeek: 0,
      total: 1,
      trend: 0
    },
    pageViews: {
      lastWeek: 0,
      thisWeek: 0,
      total: 0,
      trend: 0
    },
    referrers: {
      lastWeek: 0,
      thisWeek: 0,
      total: 1,
      trend: 0
    }
  },
  company: { id: 'companyId' },
  job: { id: 'jobId' },
  jobs: ['jobsResponse'],
  people: ['peopleResponse'],
  applications: [
    {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'McTest',
      person: 'personId'
    }
  ],
  referrals: [
    {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'McTest',
      person: 'personId'
    }
  ],
  jobTemplateTags: 'prismicTagsResponse'
}

const standardGetResponse = baseFetcherResponse

const standardPostReferralResponse = merge(baseFetcherResponse, {
  notification: {
    message: 'New referral referralId saved',
    type: 'success'
  },
  newPerson: ['peoplePostResponse'],
  referral: { id: 'referralId' }
})

const standardPostReferralPersonResponse = merge(baseFetcherResponse, {
  notification: {
    message: 'New referral referralId saved',
    type: 'success'
  },
  referral: { id: 'referralId' }
})

const standardPutResponse = merge(baseFetcherResponse, {
  notification: {
    message: 'Job Title saved',
    type: 'success'
  },
  job: {
    id: 'jobId',
    title: 'Job Title'
  },
  savedJob: {
    id: 'jobId',
    title: 'Job Title'
  }
})

module.exports = {
  standardGetResponse,
  standardPostReferralResponse,
  standardPostReferralPersonResponse,
  standardPutResponse
}
