import axios from "axios";
import { useState } from "react";

type SendNotificationsParams = {
  title: string;
  description: string;
  imageURL: string;
  onSuccess?: () => void;
  onFail?: () => void;
};

export const useSendNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendNotification = async ({
    title,
    description,
    imageURL,
    onSuccess,
    onFail,
  }: SendNotificationsParams) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-notification", {
        title,
        description,
        imageURL,
      });
      console.log(response.data);
      setIsLoading(false);
      onSuccess && onSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      onFail && onFail();
    }
  };

  return {
    isLoading,
    sendNotification,
  };
};
