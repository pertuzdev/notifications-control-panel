import { NotificationData } from "@/components/Form";
import { db } from "@/firebase/client";
import { INotifications } from "@/interfaces/Notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type SaveNotificationsParams = {
  formData: NotificationData;
  onSuccess: () => void;
  onFail: () => void;
};

type DeleteNotificationParams = {
  notificationId: string;
  onSuccess: () => void;
  onFail: () => void;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveNotificationsLoading, setNotificationsLoading] = useState(false);
  const [deleteNotificationLoading, setDeleteNotificationLoading] =
    useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    await getDocs(collection(db, "notifications"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotifications(newData as INotifications[]);
        console.log(notifications, newData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const saveNotifications = async ({
    formData,
    onFail,
    onSuccess,
  }: SaveNotificationsParams) => {
    setNotificationsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...formData,
      });
      console.log("Document written with ID:", docRef.id);
      setNotificationsLoading(false);
      onSuccess();
    } catch (e) {
      console.log("Error adding document:", e);
      setNotificationsLoading(false);
      onFail();
    }
  };

  const deleteNotification = async ({
    notificationId,
    onFail,
    onSuccess,
  }: DeleteNotificationParams) => {
    setDeleteNotificationLoading(true);
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
      console.log("Document deleted successfully");
      setDeleteNotificationLoading(false);
      onSuccess();
    } catch (e) {
      console.log("Error deleting document:", e);
      setDeleteNotificationLoading(false);
      onFail();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    fetchNotifications,
    saveNotifications,
    saveNotificationsLoading,
    deleteNotification,
    deleteNotificationLoading,
  };
};
