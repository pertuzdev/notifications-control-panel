import axios from "axios";
import { FormEvent, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/send-notification", {
        title,
        message,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Send Notification</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Send Notification</button>
      </form>
    </div>
  );
}
