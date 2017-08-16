const React = require('react')
const get = require('lodash/get')
const merge = require('lodash/merge')
const getStyle = require('./task-adder.css')

module.exports = class PeoplePage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()

    this.submit = get(props, 'onSubmit')

    this.types = [
      'SEND_SURVEY_INTERNAL',
      'UNLOCK_NETWORK_LINKEDIN'
    ]

    const task = this.cleanTask()
    this.state = {task}
  }

  cleanTask () {
    return {
      type: this.types[0]
    }
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    const cleanTask = this.cleanTask()
    const existingTask = get(this.state, 'task', cleanTask)

    const task = merge(existingTask, { [key]: value })
    this.setState({task})
  }

  onSubmit (event) {
    event.preventDefault()

    // Validation?
    const cleanTask = this.cleanTask()

    const submit = get(this.props, 'onSubmit', () => {})
    const data = get(this.state, 'task', cleanTask)

    submit(data)
  }

  render () {
    const submitLabel = get(this.props, 'submitLabel', 'Add task')
    const submitButton = (<button className={this.style.submitButton}>{submitLabel}</button>)

    const cleanTask = this.cleanTask()
    const task = get(this.state, 'task', cleanTask)

    const types = this.types

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)}>
      <div className={this.style.formCard}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='taskType'>Type</label>
            <select className={this.style.selectBox} id='taskType' name='type' onChange={this.onChangeGeneric.bind(this)} value={task.type}>
              {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
            </select>
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
