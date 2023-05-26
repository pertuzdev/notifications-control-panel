import Alert from "@/components/Alert";
import Form, { NotificationData } from "@/components/Form";
import Icon from "@/components/Icons";
import Loader from "@/components/Loader";
import AppModal from "@/components/Modal";
import { useNotifications } from "@/hooks/useNotifications";
import { useSendNotifications } from "@/hooks/useSendNotifications";
import styles from "@/styles/NotificationsList.module.css";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationsList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationToDeleteId, setNotificationToDeleteId] = useState("");
  const [notificationToSend, setNotificationToSend] =
    useState<NotificationData | null>(null);

  const {
    fetchNotifications,
    isLoading: isNotificationsLoading,
    notifications,
    saveNotifications,
    saveNotificationsLoading,
    deleteNotification,
    deleteNotificationLoading,
  } = useNotifications();

  const { isLoading: sendNotificationsLoading, sendNotification } =
    useSendNotifications();

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = (formData: NotificationData) => {
    const { title, description } = formData;
    sendNotification({
      title,
      description,
      onSuccess: () => {
        closeModal();
        toast.success("Notification sent!!!");
      },
      onFail: () => {
        closeModal();
        toast.error("There was a problem. Try again!");
      },
    });
  };

  const handleSendNotification = () => {
    if (notificationToSend?.title && notificationToSend.description) {
      const { title, description } = notificationToSend;
      sendNotification({
        title,
        description,
        onSuccess: () => {
          setNotificationToSend(null);
          toast.success("Notification sent!!!");
        },
        onFail: () => {
          setNotificationToSend(null);
          toast.error("There was a problem. Try again!");
        },
      });
    }
  };

  const handleSaveNotification = (formData: NotificationData) => {
    saveNotifications({
      formData,
      onSuccess: () => {
        fetchNotifications();
        closeModal();
        toast.success("Saved succesfully!!!");
      },
      onFail: () => {
        closeModal();
        toast.error("There was a problem. Try again!");
      },
    });
  };

  const handleDeleteNotification = () => {
    deleteNotification({
      notificationId: notificationToDeleteId,
      onSuccess: () => {
        fetchNotifications();
        setNotificationToDeleteId("");
        toast.success("Deleted succesfully!!!");
      },
      onFail: () => {
        setNotificationToDeleteId("");
        toast.error("There was a problem. Try again!");
      },
    });
  };

  if (isNotificationsLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

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
                      onClick={() =>
                        setNotificationToSend({
                          title: notification.title,
                          description: notification.description,
                          image: notification.image,
                        })
                      }
                    >
                      <span>
                        <Icon name="send" />
                      </span>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      onClick={() => setNotificationToDeleteId(notification.id)}
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
          <Form
            onSubmit={handleSubmit}
            onSave={handleSaveNotification}
            isSaving={saveNotificationsLoading}
            isSending={sendNotificationsLoading}
          />
        </AppModal>
      )}
      {Boolean(notificationToDeleteId) && (
        <Alert
          title="Are you sure you want to delete this notification?"
          description="This action is irreversible"
          type="delete"
          onCloseAlert={() => setNotificationToDeleteId("")}
          primaryAction={handleDeleteNotification}
          isLoading={deleteNotificationLoading}
        />
      )}
      {Boolean(notificationToSend) && (
        <Alert
          title="Are you sure you want to send this notification?"
          description="This action is irreversible"
          onCloseAlert={() => setNotificationToSend(null)}
          primaryAction={handleSendNotification}
          isLoading={sendNotificationsLoading}
        />
      )}
      <ToastContainer />
    </div>
  );
}
