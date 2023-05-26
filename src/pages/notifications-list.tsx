import Form, { FormData } from "@/components/Form";
import Icon from "@/components/Icons";
import AppModal from "@/components/Modal";
import { db } from "@/firebase/client";
import { INotifications } from "@/interfaces/Notifications";
import styles from "@/styles/NotificationsList.module.css";
import { collection, getDocs } from "@firebase/firestore";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

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

  const handleFormSubmit = async (formData: FormData) => {
    const { title, description } = formData;

    try {
      const response = await axios.post("/api/send-notification", {
        title,
        description,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
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
          <button className={styles.button} onClick={openModal}>
            Create Notification
          </button>
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
                  <div className={styles.iconsWrapper}>
                    <button
                      className={`${styles.iconButton} ${styles.sendButton}`}
                    >
                      <span>
                        <Icon name="send" />
                      </span>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                    >
                      <span>
                        <Icon name="delete" />
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalVisible && (
        <AppModal onClose={closeModal}>
          <Form onSubmit={handleFormSubmit} />
        </AppModal>
      )}
    </div>
  );
}
