import TopBar from "/src/components/TopBar";

import styles from "./OverlayWrapper.module.css";

const OverlayWrapper = () => {
  return (
    <div className={styles.overlayWrapper}>
      <TopBar />
    </div>
  );
};

export default OverlayWrapper;
