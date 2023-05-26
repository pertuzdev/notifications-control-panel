import axios from "axios";
import { useState } from "react";

type SendNotificationsParams = {
  title: string;
  description: string;
  onSuccess?: () => void;
  onFail?: () => void;
};

export const useSendNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendNotification = async ({
    title,
    description,
    onSuccess,
    onFail,
  }: SendNotificationsParams) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-notification", {
        title,
        description,
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
