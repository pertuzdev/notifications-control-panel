import { NotificationFormData } from "@/components/Form";
import { db, storage } from "@/firebase/client";
import { INotifications } from "@/interfaces/Notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";

interface ICloudNotification {
  title: string;
  description: string;
  imageURL: string;
}

type SaveNotificationsParams = {
  notificationData: ICloudNotification;
  onSuccess?: () => void;
  onFail?: () => void;
};

type DeleteNotificationParams = {
  notificationId: string;
  imageURL: string;
  onSuccess?: () => void;
  onFail?: () => void;
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
    notificationData,
    onFail,
    onSuccess,
  }: SaveNotificationsParams) => {
    setNotificationsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...notificationData,
      });
      console.log("Document written with ID:", docRef.id);
      setNotificationsLoading(false);
      onSuccess && onSuccess();
    } catch (e) {
      console.log("Error adding document:", e);
      setNotificationsLoading(false);
      onFail && onFail();
    }
  };

  const deleteNotification = async ({
    notificationId,
    imageURL,
    onFail,
    onSuccess,
  }: DeleteNotificationParams) => {
    setDeleteNotificationLoading(true);
    if (imageURL) {
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);
    }
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
      console.log("Document deleted successfully");
      setDeleteNotificationLoading(false);
      onSuccess && onSuccess();
    } catch (e) {
      console.log("Error deleting document:", e);
      setDeleteNotificationLoading(false);
      onFail && onFail();
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
