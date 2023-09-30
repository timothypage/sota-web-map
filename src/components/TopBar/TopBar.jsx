import { AiFillGithub } from "react-icons/ai";
import SearchBox from "/src/components/SearchBox";
import RouteSummary from "/src/components/RouteSummary";
import styles from "./TopBar.module.css";

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.navWrapper}>
        <RouteSummary className={styles.routeDisplay} />
      </div>
      <h1 className={styles.title}>SOTA Map</h1>
      <SearchBox />
      <button>Login</button>
      <a href="https://github.com/timothypage/sota-web-map" target="_blank">
        <AiFillGithub className={styles.github} size={36} />
      </a>
    </div>
  );
};

export default TopBar;
