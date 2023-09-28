import TopBar from "/src/components/TopBar";
import SearchResults from "/src/components/SearchResults";

import styles from "./OverlayWrapper.module.css";

const OverlayWrapper = () => {
  return (
    <div className={styles.overlayWrapper}>
      <TopBar />
      <SearchResults />
    </div>
  );
};

export default OverlayWrapper;
