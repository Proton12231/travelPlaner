import { Button } from "../common/Button";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <i className="ri-route-line"></i>
        <span>出行规划助手</span>
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          icon="ri-add-line"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("openCreateModal"))
          }
        >
          创建方案
        </Button>
      </div>
    </nav>
  );
};
