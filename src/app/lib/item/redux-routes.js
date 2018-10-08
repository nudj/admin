module.exports = ({
  plural,
  List,
  View,
  Form
}) => {
  const routes = {}
  if (List) {
    routes[`/${plural}`] = List
  }
  if (View) {
    routes[`/${plural}/:id`] = View
  }
  if (Form) {
    routes[`/${plural}/:id/new`] = Form
    routes[`/${plural}/:id/edit`] = Form
  }
  return routes
}
