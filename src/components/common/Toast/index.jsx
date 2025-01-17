import { createRoot } from "react-dom/client";
import styles from "./Toast.module.scss";
import PropTypes from "prop-types";

const ToastComponent = ({ message, type = "info" }) => (
  <div className={`${styles.toast} ${styles[type]}`}>
    <i className={`ri-${getIconByType(type)}-line`} />
    <span>{message}</span>
  </div>
);

ToastComponent.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

const getIconByType = (type) => {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "error-warning";
    case "warning":
      return "alert";
    default:
      return "information";
  }
};

export const Toast = {
  _container: null,

  _createContainer() {
    const container = document.createElement("div");
    container.className = styles.container;
    document.body.appendChild(container);
    this._container = container;
    return container;
  },

  show(message, type = "info", duration = 3000) {
    const container = this._container || this._createContainer();
    const wrapper = document.createElement("div");
    container.appendChild(wrapper);

    const root = createRoot(wrapper);
    root.render(<ToastComponent message={message} type={type} />);

    setTimeout(() => {
      wrapper.classList.add(styles.exit);
      setTimeout(() => {
        root.unmount();
        container.removeChild(wrapper);
        if (container.childNodes.length === 0) {
          document.body.removeChild(container);
          this._container = null;
        }
      }, 300);
    }, duration);
  },

  success(message, duration) {
    this.show(message, "success", duration);
  },

  error(message, duration) {
    this.show(message, "error", duration);
  },

  warning(message, duration) {
    this.show(message, "warning", duration);
  },

  info(message, duration) {
    this.show(message, "info", duration);
  },
};
