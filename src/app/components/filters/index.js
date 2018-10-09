const React = require('react')
const { Link } = require('react-router-dom')

const getStyle = require('./style.css')
const { queryStringOmit } = require('../../lib/item/helpers')

const Filters = props => {
  const style = getStyle()
  const {
    app: {
      url: {
        path,
        query
      }
    }
  } = props
  const filterKeys = Object.keys(query)

  return (
    filterKeys.length ? (
      <div>
        <span>Filters:</span>
        <ul className={style.filters}>
          {filterKeys.map(filterKey => {
            let filterLabel = query[filterKey]
            const filterEntity = props[filterKey]
            if (filterEntity) {
              filterLabel = filterEntity.title || filterEntity.name
            }

            return (
              <li key={filterKey} className={style.filter}>
                <Link className={style.filterButton} to={`${path}${queryStringOmit(query, filterKey)}`}>{filterKey}: {filterLabel}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    ) : <div />
  )
}

module.exports = Filters
