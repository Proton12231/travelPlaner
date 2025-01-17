import { createRoot } from "react-dom/client";
import { Modal } from "../Modal";
import { Button } from "../Button";
import styles from "./Confirm.module.scss";
import PropTypes from "prop-types";

const ConfirmComponent = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "确认",
  cancelText = "取消",
  type = "warning",
}) => {
  return (
    <Modal isOpen={true} onClose={onCancel} title={title} width="400px">
      <div className={styles.confirm}>
        <div className={`${styles.icon} ${styles[type]}`}>
          <i className={`ri-${getIconByType(type)}-line`} />
        </div>
        <div className={styles.content}>{content}</div>
        <div className={styles.actions}>
          <Button variant="text" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={type === "warning" ? "primary" : "text"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["warning", "info"]),
};

const getIconByType = (type) => {
  switch (type) {
    case "warning":
      return "alert";
    default:
      return "question";
  }
};

export const Confirm = {
  _container: null,
  _root: null,

  show({ title, content, confirmText, cancelText, type }) {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      this._container = container;
      this._root = createRoot(container);

      const handleConfirm = () => {
        this.destroy();
        resolve(true);
      };

      const handleCancel = () => {
        this.destroy();
        resolve(false);
      };

      this._root.render(
        <ConfirmComponent
          title={title}
          content={content}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmText={confirmText}
          cancelText={cancelText}
          type={type}
        />
      );
    });
  },

  destroy() {
    if (this._root) {
      this._root.unmount();
      document.body.removeChild(this._container);
      this._root = null;
      this._container = null;
    }
  },
};
