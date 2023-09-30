import styles from "./MaxWidthWrapper.module.css";

const MaxWidthWrapper = ({ maxWidth, children }) => {
  return (
    <div
      style={{ "--max-width": maxWidth ? `${maxWidth}px` : "1200px" }}
      className={styles.maxWidthWrapper}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
