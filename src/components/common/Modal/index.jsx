import PropTypes from "prop-types";
import { useEffect } from "react";
import styles from "./Modal.module.scss";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "500px",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth: width }}>
        <div className={styles.header}>
          <h2>{typeof title === "string" ? title : title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="ri-close-line" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};
