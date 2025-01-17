import PropTypes from "prop-types";
import styles from "./Input.module.scss";

export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  prefix,
  placeholder,
  ...props
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${prefix ? styles.withPrefix : ""}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
};
