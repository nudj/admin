let dummy = require('@nudj/dummy')
let schemas = require('@nudj/schemas')

let dummyData = dummy({
  companies: {
    schema: schemas.company,
    count: 5
  },
  jobs: {
    schema: schemas.job,
    count: 50
  },
  people: {
    schema: schemas.people,
    count: 5
  },
  referrals: {
    schema: schemas.referrals,
    count: 2
  },
  applications: {
    schema: schemas.applications,
    count: 2
  },
  hirers: {
    schema: schemas.hirers,
    count: 1
  }
})
dummyData.jobs = dummyData.jobs.concat([
  {
    'id': '99',
    'created': '2009-05-23T12:22:13.000+00:00',
    'modified': '2010-01-08T21:39:25.000+00:00',
    'title': 'Senior Full-Stack Software Engineer',
    'slug': 'senior-full-stack-software-engineer',
    'url': 'https://bulb.workable.com/j/389500EB72',
    'status': 'Open',
    'bonus': 1000,
    'description': '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    'type': 'Permanent',
    'remuneration': 'Competitive + Options',
    'tags': [
      'Software',
      'Developer',
      'Full-Stack'
    ],
    'location': 'London',
    'companyId': '2',
    'related': [
      {
        'url': '/bulb/operations-strategy-analyst',
        'title': 'Operations Strategy Analyst',
        'location': 'London'
      }
    ]
  }
])
dummyData.people = dummyData.people.concat([
  {
    id: '21',
    firstName: 'Nick',
    lastName: 'Collings',
    email: 'nick@nudj.co',
    url: 'http://test.com/',
    title: 'Tech Lead',
    type: 'external',
    company: 'nudj',
    status: 'user'
  },
  {
    id: '22',
    firstName: 'Robyn',
    lastName: 'McGirl',
    email: 'robyn@nudj.co',
    url: 'http://test.com/',
    title: 'CEO',
    type: 'external',
    company: 'nudj',
    status: 'user'
  },
  {
    id: '23',
    firstName: 'Jamie',
    lastName: 'Gunson',
    email: 'jamie@nudj.co',
    url: 'http://test.com/',
    title: 'Head of Product',
    type: 'external',
    company: 'nudj',
    status: 'user'
  },
  {
    id: '24',
    firstName: 'Matt',
    lastName: 'Ellis',
    email: 'matt@nudj.co',
    url: 'http://test.com/',
    title: 'Design Wizard',
    type: 'external',
    company: 'nudj',
    status: 'user'
  }
])

module.exports = dummyData
