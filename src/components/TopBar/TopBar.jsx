import SearchBox from '/src/components/SearchBox'

import styles from "./TopBar.module.css"

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <SearchBox />
    </div>
  )
}

export default TopBar
