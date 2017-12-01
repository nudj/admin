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

type Survey = {
  id: string | number,
  introTitle?: string,
  outroTitle?: string,
  outroDescription?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company
}
