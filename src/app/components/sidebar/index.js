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
            <Icon name='briefcase' style={style.icon} />
            Companies
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <NavLink
            className={css(style.link, style.candidatesLink)}
            to='/people'
          >
            <Icon name='candidates' style={style.icon} />
            People
          </NavLink>
        </li>
        <li className={css(style.menuItem)}>
          <a
            className={css(style.link, style.help)}
            href='http://help.nudj.co'
          >
            <Icon name='questionMark' style={style.icon} />
            Help
          </a>
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
