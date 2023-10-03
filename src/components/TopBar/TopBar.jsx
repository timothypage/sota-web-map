import { AiFillGithub } from "react-icons/ai";
import { useAuth } from "react-oidc-context";
import SearchBox from "/src/components/SearchBox";
import Button from "/src/components/Button";
import RouteSummary from "/src/components/RouteSummary";

import styles from "./TopBar.module.css";

const TopBar = () => {
  const auth = useAuth();

  let LoginButton = (
    <Button onClick={() => auth.signinRedirect()}>Login</Button>
  );
  switch (auth.activeNavigator) {
    case "signinSilent":
      LoginButton = <Button disabled>Logging in...</Button>;

    case "signoutRedirect":
      LoginButton = <Button disabled>Logging out...</Button>;
  }

  if (auth.isAuthenticated) {
    LoginButton = (
      <Button onClick={() => auth.removeUser()}>
        {auth.user?.profile.name}
      </Button>
    );
  }

  return (
    <div className={styles.topBar}>
      <div className={styles.navWrapper}>
        <RouteSummary className={styles.routeDisplay} />
      </div>
      <h1 className={styles.title}>SOTA Map</h1>
      <SearchBox />
      {LoginButton}
      <a href="https://github.com/timothypage/sota-web-map" target="_blank">
        <AiFillGithub className={styles.github} size={36} />
      </a>
    </div>
  );
};

export default TopBar;
