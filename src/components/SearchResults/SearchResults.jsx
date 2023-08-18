import { useSelector } from 'react-redux'
import { selectSearchResults } from '/src/reducers/searchReducer.js'
import { useMap } from '/src/providers/MapProvider.jsx'

import MaxWidthWrapper from '/src/components/MaxWidthWrapper'

import styles from "./SearchResults.module.css"

const SearchResults = () => {
  const results = useSelector(selectSearchResults)
  const map = useMap()

  return (
    <MaxWidthWrapper maxWidth={600}>
      <div className={styles.searchResults}>
        {results.map(r => 
          <div key={r.name} className={styles.result}>
            <p>{r.name}</p>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  )
}

export default SearchResults
