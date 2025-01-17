import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Cascader.module.scss";

export const Cascader = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOptions, setActiveOptions] = useState([options, []]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [hoveredOption, setHoveredOption] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) {
      const findOption = (opts, targetValue) => {
        for (const opt of opts) {
          if (opt.value === targetValue) return opt;
          if (opt.children) {
            const found = findOption(opt.children, targetValue);
            if (found) return found;
          }
        }
        return null;
      };

      const findPath = (opts, targetValue, path = []) => {
        for (const opt of opts) {
          const newPath = [...path, opt];
          if (opt.value === targetValue) return newPath;
          if (opt.children) {
            const found = findPath(opt.children, targetValue, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      const path = findPath(options, value);
      if (path) {
        const lastOption = path[path.length - 1];
        const parentOption = path[path.length - 2];

        setSelectedLabels(path.map((opt) => opt.label));
        setHoveredOption(parentOption);
        if (parentOption?.children) {
          setActiveOptions([options, parentOption.children]);
        }
      }
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionHover = (option, level) => {
    if (level === 0 && option.children) {
      setActiveOptions([options, option.children]);
      setHoveredOption(option);
    }
  };

  const handleOptionClick = (option, level) => {
    if (level === 0) {
      if (!option.children) {
        setSelectedLabels([option.label]);
        onChange(option.value, [option]);
        setIsOpen(false);
      } else {
        setActiveOptions([options, option.children]);
        setHoveredOption(option);
      }
    } else {
      const selectedLabels = [hoveredOption.label, option.label];
      onChange(option.value, [hoveredOption, option]);
      setSelectedLabels(selectedLabels);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.selector} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.value}>
          {selectedLabels.length > 0
            ? selectedLabels.join(" / ")
            : placeholder || "请选择"}
        </span>
        <i className={`ri-arrow-down-s-line ${styles.arrow}`} />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.column}>
            {activeOptions[0].map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${
                  selectedLabels[0] === option.label ? styles.active : ""
                } ${hoveredOption === option ? styles.hover : ""}`}
                onClick={() => handleOptionClick(option, 0)}
                onMouseEnter={() => handleOptionHover(option, 0)}
              >
                {option.label}
                {option.children && <i className="ri-arrow-right-s-line" />}
              </div>
            ))}
          </div>
          {activeOptions[1].length > 0 && (
            <div className={styles.column}>
              {activeOptions[1].map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${
                    selectedLabels[1] === option.label ? styles.active : ""
                  }`}
                  onClick={() => handleOptionClick(option, 1)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Cascader.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
