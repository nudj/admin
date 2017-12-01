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
  company?: Company,
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
  title?: string,
  description?: string,
  name?: string,
  type?: string,
  required?: Boolean,
  tags?: Array<ID>
}
