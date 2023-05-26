import { useState } from "react";
import styles from "./styles.module.css";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "@/firebase/client";
import Loader from "../Loader";

interface FormProps {
  onSubmit: (formData: NotificationData) => void;
  onSave: (formData: NotificationData) => void;
  isSaving?: boolean;
  isSending?: boolean;
}

export interface NotificationData {
  title: string;
  description: string;
  image: File | null;
}

const Form = ({
  onSubmit,
  onSave,
  isSaving = false,
  isSending = false,
}: FormProps) => {
  const [formData, setFormData] = useState<NotificationData>({
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

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formTitleWrapper}>
        <h2>Create Notification</h2>
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
      <div className={styles.buttonsWrapper}>
        <button
          type="button"
          className={styles.cardSecondaryButton}
          onClick={handleSave}
          disabled={!formData.title || !formData.description}
        >
          {isSaving ? <Loader /> : <span>Save</span>}
        </button>
        <button
          type="submit"
          className={styles.cardSubmitButton}
          disabled={!formData.title || !formData.description}
        >
          {isSending ? <Loader /> : <span>Send</span>}
        </button>
      </div>
    </form>
  );
};

export default Form;
