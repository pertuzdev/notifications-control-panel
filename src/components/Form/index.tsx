import { useState } from "react";
import styles from "./styles.module.css";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "@/firebase/client";

interface FormProps {
  onSubmit: (formData: FormData) => void;
}

export interface FormData {
  title: string;
  description: string;
  image: File | null;
}

const Form = ({ onSubmit }: FormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: null,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSaveNotification = async () => {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...formData,
      });
      console.log("Document written with ID:", docRef.id);
    } catch (e) {
      console.log("Error adding document:", e);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formTitleWrapper}>
        <h2>Send Notification</h2>
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Title"
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className={styles.textarea}
          placeholder="Message"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.uploadLabel}>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          <span className={styles.uploadText}>Upload Image</span>
        </label>
      </div>
      <button
        type="button"
        className={styles.textButton}
        onClick={handleSaveNotification}
      >
        <span>Save as draft</span>
      </button>
      <div className={styles.buttonsWrapper}>
        <button type="button" className={styles.cardSecondaryButton}>
          <span>Save</span>
        </button>
        <button type="submit" className={styles.cardSubmitButton}>
          Send
        </button>
      </div>
    </form>
  );
};

export default Form;
