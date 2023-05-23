import Form, { FormData } from "@/components/Form";
import styles from "@/styles/NotificationsList.module.css";
import axios from "axios";
import Link from "next/link";

export default function NotificationsList() {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Iglesia Ever App</h1>
        <span className="navLinkWrapper">
          <Link className="navLink" href="/">
            Create Notification
          </Link>
        </span>
      </div>
      <table className={styles["content-table"]}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Domenic imfoiwmiowmf joiwfj</td>
            <td>88,110</td>
            <td>dcode</td>
            <td>dcode</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
