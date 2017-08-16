const React = require('react')
const get = require('lodash/get')

const RowItem = require('../row-item/row-item')
const getStyle = require('./tasks-list.css')

const TaskList = (props) => {
  const style = getStyle()
  const tasks = get(props, 'tasks', [])

  if (!tasks.length) {
    return (<p className={style.copy}>💩 None here</p>)
  }

  const tasksList = tasks.map(task => {
    const completed = get(task, 'completed', false)
    const key = get(task, 'id', '')
    const title = get(task, 'type', '')

    const scope = get(task, 'company', '') ? 'Company' : 'Hirer'

    return (<RowItem
      rowKey={key}
      rowClass='rowSmall'
      title={title}
      details={[
        {
          term: 'Scope',
          description: scope
        },
        {
          term: 'Completed',
          description: completed ? 'YES' : 'NO'
        }
      ]}
    />)
  })

  return (<ul className={style.tasks}>
    {tasksList}
  </ul>)
}

module.exports = TaskList
