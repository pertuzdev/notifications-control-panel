import { NotificationFormData } from "@/components/Form";
import { db, storage } from "@/firebase/client";
import { INotifications } from "@/interfaces/Notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
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

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    await getDocs(q)
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const formattedData = newData.map((data) => {
          const createdAt = (data as any).createdAt.toDate();
          const formattedDate = createdAt.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });

          return {
            ...data,
            createdAt: formattedDate,
          };
        });
        setNotifications(formattedData as INotifications[]);
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
        createdAt: serverTimestamp(),
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
