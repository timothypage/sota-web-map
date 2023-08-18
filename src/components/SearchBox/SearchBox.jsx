import Fuse from 'fuse.js'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateSearchResults } from '/src/reducers/searchReducer.js'

import { AiOutlineSearch } from 'react-icons/ai'

import styles from './SearchBox.module.css'

// TODO move geocoding to backend service...go with the hacky solution for now
let fuse = new Fuse([], {
  keys: ['properties.SummitCode', 'properties.SummitName'],
  threshold: 0.4
})

fetch('/tiles/summitslistw0c-active.geojson')
  .then(response => response.json())
  .then(data =>
    data.features.filter(item => Boolean(item.properties.SummitCode))
  )
  .then(data => fuse.setCollection(data))

const SearchBox = () => {
  const dispatch = useDispatch()
  const searchRef = useRef()

  return (
    <form
      className={styles.searchBox}
      onSubmit={() => {
        const results = fuse
          .search(searchRef.current.value)
          .slice(0, 6)
          .map(hit => ({
            type: 'summit',
            name: hit.item.properties.SummitName,
            code: hit.item.properties.SummitCode,
            points: hit.item.properties.Points,
            lat: hit.item.properties.Latitude,
            lon: hit.item.properties.Longitude
          }))

        dispatch(updateSearchResults({ results }))
      }}
    >
      <input className={styles.searchInput} type='text' ref={searchRef} />
      <button type='submit' className={styles.searchButton}>
        <AiOutlineSearch />
      </button>
    </form>
  )
}

export default SearchBox
