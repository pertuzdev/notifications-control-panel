import Icon from "@/components/Icons";
import { db } from "@/firebase/client";
import { INotifications } from "@/interfaces/Notifications";
import styles from "@/styles/NotificationsList.module.css";
import { collection, getDocs } from "@firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<INotifications[]>([]);

  const fetchNotifications = async () => {
    await getDocs(collection(db, "notifications")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotifications(newData as INotifications[]);
      console.log(notifications, newData);
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Iglesia Ever App</h1>
          <span className="navLinkWrapper">
            <Link className="navLink" href="/">
              Create Notification
            </Link>
          </span>
        </div>
        <div className={styles.createButtonWrapper}>
          <button className={styles.button}>Create Notification</button>
        </div>
        <table className={styles["content-table"]}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications?.map((notification, index) => (
              <tr key={notification.id}>
                <td>{index + 1}</td>
                <td>{notification.title}</td>
                <td>{notification.description}</td>
                <td>{notification.image || ""}</td>
                <td>
                  <div>
                    <button>edit</button>
                    <button>delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
