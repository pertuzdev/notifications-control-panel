import * as React from "react";
import styles from "./styles.module.css";
const Loader = (props: any) => (
  <svg strokeWidth={5} className={styles.ring} viewBox="25 25 50 50" {...props}>
    <circle cx={50} cy={50} r={20} />
  </svg>
);
export default Loader;
