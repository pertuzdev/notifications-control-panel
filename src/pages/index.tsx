import Form, { FormData } from "@/components/Form";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const handleFormSubmit = async (formData: FormData) => {
    const { title, description: message } = formData;

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
    <div className={styles.cardFormContainer}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Iglesia Ever App</h1>
        <span className="navLinkWrapper">
          <Link className="navLink" href="/notifications-list">
            Notification List
          </Link>
        </span>
      </div>
      <Form onSubmit={handleFormSubmit} />
    </div>
  );
}
