import { useSelector } from 'react-redux'
import { selectTopSearchResults } from '/src/reducers/searchReducer.js'
import { useMap } from '/src/providers/MapProvider.jsx'

import MaxWidthWrapper from '/src/components/MaxWidthWrapper'

import styles from './SearchResults.module.css'

const SearchResults = () => {
  const results = useSelector(selectTopSearchResults)
  const map = useMap()

  return (
    <MaxWidthWrapper maxWidth={600}>
      <div className={styles.searchResults}>
        {results.map(r => (
          <div
            key={r.code}
            className={styles.result}
            onClick={() =>
              map.jumpTo({
                center: [r.lon, r.lat + 0.01],
                zoom: 13
              })
            }
          >
            <p>{r.name}</p>
            <p>{r.code}</p>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  )
}

export default SearchResults
