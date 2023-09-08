import RouteSummary from "/src/components/RouteSummary";

import styles from "./OverlayLayout.module.css";

const OverlayLayout = () => {
  return (
    <div className={styles.overlayLayout}>
      <RouteSummary />
    </div>
  );
};

export default OverlayLayout;
