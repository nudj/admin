const data = {
  companies: [],
  jobs: [],
  people: [],
  referrals: [],
  applications: [],
  hirers: [],
  recommendations: [],
  externalMessages: [],
  surveys: [],
  surveySections: [],
  surveyQuestions: [],
  surveyMessages: [],
  tasks: []
}

const {
  questionTypes
} = require('./lib/constants')

const {
  COMPANIES,
  CONNECTIONS
} = questionTypes

data.companies = data.companies.concat([
  {
    id: 'company1',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    industry: ['IT', 'Mining', 'Healthcare'],
    location: 'London',
    logo: 'https://slack-imgs.com/?c=1&url=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2Foriginals%2F2a%2F89%2Fde%2F2a89dee5376d13e8d378e797d4e7e5fc.gif',
    name: 'Fake Company',
    slug: 'fake-company',
    url: 'http://omg.fake-company.com',
    description: 'OMG this company is SO hot right now. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    onboarded: true
  },
  {
    id: 'company2',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    industry: ['Winning'],
    location: 'London',
    logo: 'https://slack-imgs.com/?c=1&url=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2Foriginals%2F2a%2F89%2Fde%2F2a89dee5376d13e8d378e797d4e7e5fc.gif',
    name: 'nudj',
    slug: 'nudj',
    url: 'https://nudj.co',
    description: 'OMG this company is SO hot right now. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    onboarded: true
  }
])
data.jobs = data.jobs.concat([
  {
    id: 'job1',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    title: 'Senior Full-Stack Software Engineer',
    slug: 'senior-full-stack-software-engineer-2',
    url: 'https://bulb.workable.com/j/389500EB72',
    status: 'PUBLISHED',
    bonus: 1000,
    roleDescription: 'Fake job! vitae sodales velit ligula quis ligula. Sed et tincidunt nisi. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    candidateDescription: '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    type: 'Permanent',
    remuneration: 'Competitive + Options',
    experience: '16 billion years',
    requirements: 'building large-scale web-based applications in 🐔, 💅🏼 and 💩.',
    templateTags: ['food'],
    tags: [
      'Software',
      'Developer',
      'Full-Stack'
    ],
    location: 'London',
    company: 'company2',
    relatedJobs: [
      'job2'
    ]
  },
  {
    id: 'job2',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    title: 'Senior Fake Test Job',
    slug: 'senior-fake-test-job',
    url: 'https://fake.com',
    status: 'PUBLISHED',
    bonus: 1000,
    roleDescription: 'Fake job! vitae sodales velit ligula quis ligula. Sed et tincidunt nisi. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    candidateDescription: '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    type: 'Permanent',
    remuneration: 'Competitive + Options',
    experience: '300+ years',
    requirements: 'building large-scale web-based applications in 🐔, 💅🏼 and 💩.',
    templateTags: ['food', 'film'],
    tags: [
      'Fake',
      'Job'
    ],
    location: 'London',
    company: 'company1',
    relatedJobs: [
      'job1'
    ]
  },
  {
    id: 'job3',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    title: 'A job that should show up first',
    slug: 'senior-fake-test-job-3',
    url: 'https://fake.com',
    status: 'PUBLISHED',
    bonus: 1000,
    roleDescription: 'Fake job! vitae sodales velit ligula quis ligula. Sed et tincidunt nisi. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    candidateDescription: '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    type: 'Permanent',
    remuneration: 'Competitive + Options',
    experience: '300+ years',
    requirements: 'building large-scale web-based applications in 🐔, 💅🏼 and 💩.',
    templateTags: ['food', 'film'],
    tags: [
      'Fake',
      'Job'
    ],
    location: 'London',
    company: 'company1',
    relatedJobs: []
  },
  {
    id: 'job4',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    title: 'Z should be the last job!',
    slug: 'senior-fake-test-job-4',
    url: 'https://fake.com',
    status: 'PUBLISHED',
    bonus: 1000,
    roleDescription: 'Fake job! vitae sodales velit ligula quis ligula. Sed et tincidunt nisi. Ut nec massa vitae dui ullamcorper malesuada nec in neque. Suspendisse nec sapien faucibus, mollis metus ac, tempus eros. Praesent at nisl consequat ligula auctor eleifend nec sit amet eros. Fusce consequat, ante ac maximus auctor, felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    candidateDescription: '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    type: 'Permanent',
    remuneration: 'Competitive + Options',
    experience: '300+ years',
    requirements: 'building large-scale web-based applications in 🐔, 💅🏼 and 💩.',
    templateTags: ['food', 'film'],
    tags: [
      'Fake',
      'Job'
    ],
    location: 'London',
    company: 'company1',
    relatedJobs: []
  },
  {
    id: 'job5',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    title: 'Senior Full-Stack Software Engineer',
    slug: 'senior-full-stack-software-engineer-2',
    url: 'https://bulb.workable.com/j/389500EB72',
    status: 'PUBLISHED',
    bonus: 1000,
    description: '5+ years software engineering experience, using Node (6+), ES6 (Babel) and TypeScript. You should also be familiar with Git, Github, PRs, Code Reviews - please send us a link to your Github profile.',
    type: 'Permanent',
    remuneration: 'Competitive + Options',
    experience: '16 billion years',
    requirements: 'building large-scale web-based applications in 🐔, 💅🏼 and 💩.',
    templateTags: ['food'],
    tags: [
      'Software',
      'Developer',
      'Full-Stack'
    ],
    location: 'London',
    company: 'company1',
    relatedJobs: [
      'job2'
    ]
  }
])
data.people = data.people.concat([
  {
    id: 'person1',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
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
    id: 'person2',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
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
    id: 'person3',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
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
    id: 'person4',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    firstName: 'Matt',
    lastName: 'Ellis',
    email: 'matt@nudj.co',
    url: 'http://test.com/',
    title: 'Design Wizard',
    type: 'external',
    company: 'nudj',
    status: 'user'
  },
  {
    id: 'person5',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    firstName: 'David',
    lastName: 'Platt',
    email: 'david@nudj.com',
    url: 'http://not-a-real-person.com',
    title: 'Senior Fake User',
    type: 'external',
    company: 'nudj',
    status: 'user'
  },
  {
    id: 'person6',
    created: '1986-07-06T07:34:54.000+00:00',
    modified: '2000-01-17T02:51:58.000+00:00',
    firstName: 'Tim',
    lastName: 'Robinson',
    email: 'tim@nudj.com',
    url: 'http://not-a-real-person.com',
    title: 'Junior Fake User',
    type: 'internal',
    company: 'nudj',
    status: 'user'
  }
])
data.hirers = data.hirers.concat([
  {
    id: 'hirer1',
    person: 'person5',
    company: 'company1'
  },
  {
    id: 'hirer2',
    person: 'person6',
    company: 'company1'
  },
  {
    id: 'hirer3',
    person: 'person1',
    company: 'company2'
  }
])
data.referrals = data.referrals.concat([
  {
    id: 'referral1',
    job: 'job1',
    person: 'person2',
    parent: null,
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00'
  },
  {
    id: 'referral2',
    job: 'job1',
    person: 'person4',
    parent: 'referral1',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00'
  }
])
data.applications = data.applications.concat([
  {
    id: 'application1',
    job: 'job1',
    person: 'person3',
    referral: null,
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00'
  },
  {
    id: 'application2',
    job: 'job1',
    person: 'person1',
    referral: 'referral2',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00'
  }
])
data.recommendations = data.recommendations.concat([
  {
    id: 'recommendation1',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    job: 'job2',
    person: 'person1',
    hirer: 'hirer1',
    source: 'HIRER'
  },
  {
    id: 'recommendation2',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    job: 'job2',
    person: 'person3',
    hirer: 'hirer1',
    source: 'NUDJ'
  },
  {
    id: 'recommendation3',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    job: 'job2',
    person: 'person2',
    hirer: 'hirer1',
    source: 'HIRER'
  },
  {
    id: 'recommendation4',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    job: 'job2',
    person: 'person5',
    hirer: 'hirer1',
    source: 'NUDJ'
  }
])
data.surveyMessages = data.surveyMessages.concat([
  {
    id: 'surveyMessage1',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    hirer: 'hirer2',
    recipients: ['nick@nudj.co'],
    subject: 'email subject',
    body: 'body1'
  },
  {
    id: 'surveyMessage2',
    created: '2017-06-09T11:38:19.485+00:00',
    modified: '2017-06-09T11:38:19.485+00:00',
    hirer: 'hirer1',
    recipients: ['nick@nudj.co', 'jamie@nudj.co'],
    subject: 'second email subject',
    body: 'body2'
  }
])
data.surveys = data.surveys.concat([
  {
    id: 'survey1',
    slug: 'aided-recall-baby',
    company: 'company1',
    introTitle: 'First Title for the Survey',
    introDescription: 'Felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    outroTitle: 'Outro Title for the Survey!',
    outroDescription: 'Congue congue, viverra quis iaculis et, ipsum ligula et lacus. Felis justo vestibulum elit, vivamus est risus, eleifend eget est.'
  },
  {
    id: 'survey2',
    slug: 'aided-recall-baby2',
    company: 'company1',
    introTitle: 'Second Intro Title',
    introDescription: 'Felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    outroTitle: 'Outro Title for the Survey!',
    outroDescription: 'Congue congue, viverra quis iaculis et, ipsum ligula et lacus. Felis justo vestibulum elit, vivamus est risus, eleifend eget est.'
  },
  {
    id: 'survey3',
    slug: 'aided-recall-baby3',
    company: 'company2',
    introTitle: 'Third Survey',
    introDescription: 'Felis justo vestibulum elit, congue congue ipsum ligula et lacus. Vivamus est risus, viverra quis iaculis et, eleifend eget est.',
    outroTitle: 'Outro Title for the Survey!',
    outroDescription: 'Congue congue, viverra quis iaculis et, ipsum ligula et lacus. Felis justo vestibulum elit, vivamus est risus, eleifend eget est.'
  }
])
data.surveySections = data.surveySections.concat([
  {
    id: 'section1',
    survey: 'survey1',
    title: 'Professional + Previous Employers',
    description: 'First up, the places that you\'ve worked before and the people you know professionally.',
    surveyQuestions: [
      'question1',
      'question2'
    ]
  },
  {
    id: 'section2',
    survey: 'survey3',
    title: 'Section Title',
    description: 'Viverra quis iaculis et, ipsum ligula et lacus.'
  },
  {
    id: 'section1B',
    survey: 'survey2',
    title: 'Cash + Money',
    description: 'Felis justo vestibulum elit, vivamus est risus, eleifend eget est.'
  }
])
data.surveyQuestions = data.surveyQuestions.concat([
  {
    id: 'question1',
    surveySection: 'section1',
    name: 'workBefore',
    title: 'Where did you work before Fake Company?',
    description: 'Please list all of your previous employers. Thanks!',
    type: COMPANIES,
    required: true
  },
  {
    id: 'question2',
    surveySection: 'section1',
    name: 'accountManagers',
    title: 'Do you know any account managers?',
    description: 'Add them manually or select them from your list of contacts below...',
    type: CONNECTIONS,
    required: false
  }
])
data.tasks = data.tasks.concat([
  {
    id: 'task1',
    hirer: 'hirer2',
    type: 'UNLOCK_NETWORK_LINKEDIN',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    completed: null
  },
  {
    id: 'task2',
    company: 'company2',
    type: 'SEND_SURVEY_INTERNAL',
    created: '2017-06-08T11:38:19.485+00:00',
    modified: '2017-06-08T11:38:19.485+00:00',
    completed: 'hirer2'
  }
])

module.exports = data
