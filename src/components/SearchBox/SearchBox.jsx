import { AiOutlineSearch } from 'react-icons/ai'

import styles from "./SearchBox.module.css"


const SearchBox = () => {
  return (
    <div className={styles.searchBox} >
      <input className={styles.searchInput} type="text" />
      <button className={styles.searchButton} >
        <AiOutlineSearch />
      </button>
    </div>
  )
}

export default SearchBox
