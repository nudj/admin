declare type ID = number | string

declare type Dispatch = (Object) => {}

declare type Company = {
  id: String,
  name: String
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
  title: String,
  description?: String,
  surveyQuestions?: Array<ID>
}
