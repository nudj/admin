const React = require('react')
const { Link, NavLink } = require('react-router-dom')

const { Icon } = require('@nudj/components')
const { css, mergeStyleSheets } = require('@nudj/components/lib/css')

const defaultStyleSheet = require('./style.css')

const Sidebar = ({ styleSheet }) => {
  const style = mergeStyleSheets(defaultStyleSheet, styleSheet)

  return (
    <nav className={css(style.root)}>
      <ul className={css(style.menu)}>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link, style.headerLink)}
            to='/'
          >
            <img
              className={css(style.icon)}
              src='/assets/images/nudj-logo-light.svg'
            />
            Admin
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link)}
            to='/'
          >
            Companies
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link)}
            to='/jobs'
          >
            Jobs
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link, style.candidatesLink)}
            to='/people'
          >
            People
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link)}
            to='/surveys'
          >
            Surveys
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <Link
            className={css(style.link)}
            to={'/logout'}
          >
            <Icon name='exitArrow' style={style.icon} />
            Log out
          </Link>
        </li>
      </ul>
    </nav>
  )
}

Sidebar.defaultProps = {
  styleSheet: {}
}

module.exports = Sidebar
