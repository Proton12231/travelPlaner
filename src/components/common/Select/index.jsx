import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Select.module.scss";

export const Select = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.selector} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.value}>
          {selectedOption ? selectedOption.label : placeholder || "请选择"}
        </span>
        <i className={`ri-arrow-down-s-line ${styles.arrow}`} />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.active : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
