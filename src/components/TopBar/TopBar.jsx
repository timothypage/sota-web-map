import { AiFillGithub } from "react-icons/ai";
import { useAuth } from "react-oidc-context";
import SearchBox from "/src/components/SearchBox";
import Button from "/src/components/Button";
import Dropdown from 'react-bootstrap/dropdown';
import RouteSummary from "/src/components/RouteSummary";

import { FaCaretDown } from "react-icons/fa"

import styles from "./TopBar.module.css";

const TopBar = () => {
  const auth = useAuth();

  let LoginButton = (
    <Button onClick={() => auth.signinRedirect()}>Login</Button>
  );
  switch (auth.activeNavigator) {
    case "signinSilent":
      LoginButton = <Button disabled>Logging in...</Button>;
      break;

    case "signoutRedirect":
      LoginButton = <Button disabled>Logging out...</Button>;
      break;
  }

  if (auth.isAuthenticated) {
    LoginButton = (
      <Dropdown className={styles.dropdown} align="end">
        <Dropdown.Toggle id="dropdown-basic" className={styles.dropdownToggle}>
          {auth.user?.profile.name} <FaCaretDown />
        </Dropdown.Toggle>

        <Dropdown.Menu className={styles.dropdownMenu}>
          <Dropdown.Item className={styles.dropdownItem}>My Page</Dropdown.Item>
          <Dropdown.Item>Something else</Dropdown.Item>
          <div className={styles.divider} role="separator" />
          <Dropdown.Item onClick={() => auth.signoutRedirect({post_logout_redirect_uri: window.location.href})}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
