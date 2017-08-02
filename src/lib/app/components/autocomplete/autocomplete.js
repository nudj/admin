const Autosuggest = require('react-autosuggest')
const React = require('react')
const get = require('lodash/get')

const getStyle = require('./autocomplete.css')

module.exports = class Autocomplete extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()

    const value = get(props, 'value', '')
    const suggestions = get(props, 'suggestions', [])

    this.state = {value, suggestions}
  }

  onChange (event, {newValue}) {
    const value = newValue
    this.setState({ value })

    const suggestions = this.getSuggestions(value)
    const change = get(this.props, 'onChange', () => {})
    change(value, suggestions)
  }

  onSuggestionsFetchRequested ({value}) {
    const suggestions = this.getSuggestions(value)
    this.setState({ suggestions })
  }

  onSuggestionsClearRequested () {
    const suggestions = []
    this.setState({ suggestions })
  }

  getSuggestions (value) {
    const matcher = new RegExp(`${value}`, 'ig')
    const suggestions = get(this.props, 'suggestions', [])
    return suggestions.filter(suggestion => matcher.test(suggestion.value))
  }

  getSuggestionValue (suggestion) {
    return suggestion.value
  }

  renderSuggestion (suggestion) {
    return (<span className={this.style.suggestion}>{suggestion.value}</span>)
  }

  renderInputComponent (inputProps) {
    return (<input {...inputProps} className={this.style.inputBox} />)
  }

  render () {
    const placeholder = get(this.props, 'placeholder', '')
    const { suggestions, value } = this.state

    const onChange = this.onChange.bind(this)

    const inputProps = {placeholder, onChange, value}

    return (<div className={this.style.inputBoxHole}>
      <Autosuggest
        className={this.style.inputBox}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        getSuggestionValue={this.getSuggestionValue.bind(this)}
        renderSuggestion={this.renderSuggestion.bind(this)}
        renderInputComponent={this.renderInputComponent.bind(this)}
        inputProps={inputProps} />
    </div>)
  }
}
