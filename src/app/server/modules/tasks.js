const {
  merge,
  promiseMap
} = require('@nudj/library')

const request = require('../../../framework/lib/request')

function fetchTaskById (id) {
  return request(`tasks/filter?id=${id}`)
    .then(results => results.pop())
}

function fetchTasksByHirer (hirer) {
  return request(`tasks/filter?hirer=${hirer}`)
}

function fetchTasksByCompany (company) {
  return request(`tasks/filter?company=${company}`)
}

function saveTask (data) {
  const method = 'post'
  return request('tasks', { data, method })
}

module.exports.getAllByCompany = function (data, company) {
  data.tasks = fetchTasksByCompany(company)
  return promiseMap(data)
}

module.exports.getAllByHirer = function (data, hirer) {
  data.tasks = fetchTasksByHirer(hirer)
  return promiseMap(data)
}

module.exports.getAllByHirerAndCompany = function (data, hirer, company) {
  data.tasks = Promise.all([
    fetchTasksByHirer(hirer),
    fetchTasksByCompany(company)
  ]).then(taskResults => [].concat.apply([], taskResults || []))

  return promiseMap(data)
}

module.exports.get = function (data, task) {
  data.task = fetchTaskById(task)
  return promiseMap(data)
}

module.exports.post = function (data, task) {
  const completed = null
  data.newTask = saveTask(merge(task, {completed}))
  return promiseMap(data)
}
