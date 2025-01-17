import PropTypes from "prop-types";
import styles from "./Button.module.scss";

export const Button = ({
  children,
  variant = "default",
  icon,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <i className={icon} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["default", "primary", "text"]),
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
