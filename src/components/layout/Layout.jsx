import PropTypes from "prop-types";
import { Navbar } from "../navbar/Navbar";
import styles from "./Layout.module.scss";

export const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
