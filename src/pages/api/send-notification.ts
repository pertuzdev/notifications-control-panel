import admin from "@/firebase/admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description, imageURL } = req.body;

    try {
      // Send the notification using Firebase Admin SDK
      const payload = {
        notification: {
          title,
          body: description,
          image: imageURL,
        },
        topic: "allDevices-1501",
      };

      const response = await admin.messaging().send(payload);
      console.log("Notification sent:", response);

      res.status(200).json({ message: "Notification sent successfully." });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
