const React = require('react')
const Textarea = require('react-textarea-autosize')
const get = require('lodash/get')
const classnames = require('classnames')
const styles = require('./style.css')

const errorLabel = (className, template) => <p className={className}>{template}</p>

module.exports = (props) => {
  const style = props.css(styles)
  const placeholders = {
    recipients: get(props, 'recipientsPlaceholder', 'Enter email addresses here'),
    subject: get(props, 'subjectPlaceholder', 'Enter subject here'),
    template: get(props, 'templatePlaceholder', 'Enter message here')
  }

  let recipientInteractions = { readOnly: true }
  if (props.onChangeRecipients) {
    recipientInteractions = {
      onChange: props.onChangeRecipients,
      onBlur: props.onBlurRecipients
    }
  }

  return (
    <div className={classnames(style.emailForm, props.className)}>
      <div className={style.recipientsWrap}>
        <label className={style.addLabel}>Sending to</label>
        <div className={style.inputWrap}>
          {props.recipientsError ? errorLabel(style.errorLabel, props.recipientsError) : null}
          <input
            className={classnames({
              [style.recipients]: !!props.onChangeRecipients,
              [style.recipientsReadonly]: !props.onChangeRecipients
            })}
            id='recipients'
            name='recipients'
            value={get(props, 'recipients', '')}
            {...recipientInteractions}
            placeholder={placeholders.recipients}
          />
        </div>
      </div>
      <div className={style.email}>
        <div className={style.subjectWrap}>
          <label className={style.addLabel} htmlFor='subject'>Subject</label>
          <div className={style.inputWrap}>
            {props.subjectError ? errorLabel(style.errorLabel, props.subjectError) : null}
            {get(props, 'editing') ? <input className={style.subject} type='text' name='subject' value={get(props, 'subject', get(props, 'subjectFallback', ''))} onChange={props.onChangeSubject} id='subject' placeholder={placeholders.subject} /> : <div className={style.subject}>{get(props, 'subject', get(props, 'subjectFallback', ''))}</div>}
          </div>
          {get(props, 'js') ? <button className={props.editing ? style.doneButton : style.editButton} onClick={props.onClickEdit}>{props.editing ? 'Done' : 'Edit'}</button> : ''}
        </div>
        <div className={style.templateWrap}>
          <label className={style.messageLabel} htmlFor='template'>Message</label>
          <div className={style.inputWrap}>
            {props.templateError ? errorLabel(style.errorLabel, props.templateError) : null}
            {get(props, 'editing') ? <Textarea className={style.template} name='template' value={get(props, 'template', get(props, 'templateFallback', ''))} onChange={props.onChangeMessage} id='template' placeholder={placeholders.template} /> : <div className={style.template}> {props.renderMessage(get(props, 'template', get(props, 'templateFallback', '')))}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
