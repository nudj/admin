const React = require('react')
const { Link } = require('react-router-dom')
const getStyle = require('./footer.css')

const Footer = (props) => {
  const style = getStyle()
  return (
    <div className={style.background}>
      <div className={style.container}>
        <ul className={style.links}>
          <li className={style.item}>
            <Link className={style.release} to='//headwayapp.co/nudj-updates' target='_blank'>Release Notes</Link>
            <p className={style.label}><small>Discover what we've just shipped.</small></p>
          </li>
          <li className={style.item}>
            <Link className={style.roadmap} to='//nudj.canny.io/product-roadmap' target='_blank'>Product Roadmap</Link>
            <p className={style.label}><small>Help us decide what to build next.</small></p>
          </li>
          <li className={style.item}>
            <Link className={style.hiring} to='/nudj/full-stack-software-engineer'>We're Hiring!</Link>
            <p className={style.label}><small>Join our team &amp; build something awesome.</small></p>
          </li>
          <li className={style.item}>
            <Link className={style.terms} to='//www.iubenda.com/privacy-policy/8051143' target='_blank'>Terms &amp; Privacy</Link>
            <p className={style.label}><small>The legal stuff, including &#x1F36A; policy.</small></p>
          </li>
        </ul>
        <small className={style.copyright}>&#169; 2017 <strong>nudj</strong>, All Rights Reserved</small>
      </div>
    </div>
  )
}

module.exports = Footer
