const React = require('react')
const { Link } = require('react-router-dom')
const getStyle = require('./header.css')

const Header = (props) => {
  const style = getStyle()
  return (
    <nav className={style.nav}>
      <div className={style.main}>
        <Link className={style.home} to='/'>
          <img className={style.brand} src='/assets/images/nudj-logo-light.svg' />
          <p className={style.admin}>Admin</p>
        </Link>
        <ul className={style.menu}>
          <li className={style.menuItem}><Link className={style.jobs} to={'/'}>Companies</Link></li>
          <li className={style.menuItem}><a className={style.help} href='http://help.nudj.co'>Help</a></li>
        </ul>
      </div>
      <div className={style.sub}>
        <ul className={style.menu}>
          <li className={style.menuItem}><Link className={style.logout} to={'/logout'}>Log out</Link></li>
        </ul>
      </div>
    </nav>
  )
}

module.exports = Header
