declare type ID = number | string

declare type Dispatch = (Object) => {}

declare type Company = {
  id: string,
  name: string
}

declare type Draft = {
  intro?: string,
  outro?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string
}

declare type Survey = {
  id: ID,
  introTitle?: string,
  outroTitle?: string,
  outroDescription?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company: Company,
  surveySections?: Array<ID>
}

declare type SurveySection = {
  id: ID,
  created: Date,
  modified: Date,
  survey: Survey,
  title: string,
  description?: string,
  questions?: Array<ID>,
  surveyQuestions?: Array<ID>
}

declare type SurveyQuestion = {
  id?: ID,
  created?: Date,
  modified?: Date,
  surveySection?: SurveySection,
  section: {
    id: string,
    title: string
  },
  title?: string,
  description?: string,
  name?: string,
  type?: string,
  required?: Boolean,
  tags?: Array<ID>
}

declare type Location = {
  pathname: string,
  search: string,
  hashname: string,
  key: string
}

declare type AppState = {
  app: Object,
  router: Object,
  surveyPage: {
    draft: Draft
  },
  surveyQuestionPage: {
    draft: Draft
  },
  surveyRelationsPage: {
    order: Object
  },
  surveySectionRelationsPage: {
    order: Object
  }
}

declare type DraftAction = {
  type: string,
  draft: Draft
}

declare type State = {
  draft?: Draft,
  order?: Object
}

declare type GetState = () => AppState
