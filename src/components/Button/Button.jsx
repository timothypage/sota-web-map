import classnames from "classnames";

import styles from "./Button.module.css";

const Button = ({ children, className, ...props }) => {
  return (
    <button {...props} className={classnames(styles.button, className)}>
      {children}
    </button>
  );
};

export default Button;
