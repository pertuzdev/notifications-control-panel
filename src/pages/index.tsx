import Alert from "@/components/Alert";
import Form, { NotificationFormData } from "@/components/Form";
import Icon from "@/components/Icons";
import Loader from "@/components/Loader";
import AppModal from "@/components/Modal";
import { useNotifications } from "@/hooks/useNotifications";
import { useSendNotifications } from "@/hooks/useSendNotifications";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotificationToSendState {
  title: string;
  description: string;
  imageURL: string;
}

interface NotificationToDeleteState {
  id: string;
  imageURL: string;
}

export default function NotificationsList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationToDeleteState | null>(null);
  const [notificationToSend, setNotificationToSend] =
    useState<NotificationToSendState | null>(null);

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

  const handleSaveNotification = (formData: NotificationFormData) => {
    const { title, description, imageURL } = formData;
    saveNotifications({
      notificationData: {
        title,
        description,
        imageURL,
      },
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
    if (notificationToDelete) {
      deleteNotification({
        notificationId: notificationToDelete?.id,
        imageURL: notificationToDelete?.imageURL,
        onSuccess: () => {
          fetchNotifications();
          setNotificationToDelete(null);
          toast.success("Deleted succesfully!!!");
        },
        onFail: () => {
          setNotificationToDelete(null);
          toast.error("There was a problem. Try again!");
        },
      });
    }
  };

  const handleSubmit = (formData: NotificationFormData) => {
    const { title, description, imageURL } = formData;
    sendNotification({
      title,
      description,
      imageURL,
      onSuccess: () => {
        saveNotifications({
          notificationData: { title, description, imageURL },
          onSuccess: () => {
            fetchNotifications();
          },
        });
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
      const { title, description, imageURL } = notificationToSend;
      sendNotification({
        title,
        description,
        imageURL,
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

  if (isNotificationsLoading) {
    return (
      <div className={`${styles.container} ${styles.LoaderPageContainer}`}>
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
              <th>Created date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications?.map((notification, index) => (
              <tr key={notification.id}>
                <td>{index + 1}</td>
                <td>{notification.title}</td>
                <td>{notification.description}</td>
                <td>
                  {notification.imageURL && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={notification.imageURL}
                        className={styles.image}
                      />
                    </div>
                  )}
                </td>
                <td>{notification.createdAt}</td>
                <td>
                  <div className={styles.iconsWrapper}>
                    <button
                      className={`${styles.iconButton} ${styles.sendButton}`}
                      onClick={() =>
                        setNotificationToSend({
                          title: notification.title,
                          description: notification.description,
                          imageURL: notification.imageURL,
                        })
                      }
                    >
                      <span>
                        <Icon name="send" />
                      </span>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      onClick={() =>
                        setNotificationToDelete({
                          id: notification.id,
                          imageURL: notification.imageURL,
                        })
                      }
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
      {Boolean(notificationToDelete) && (
        <Alert
          title="Are you sure you want to delete this notification?"
          description="This action is irreversible"
          type="delete"
          onCloseAlert={() => setNotificationToDelete(null)}
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
