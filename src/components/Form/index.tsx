import { useState } from "react";
import styles from "./styles.module.css";
import { addDoc, collection } from "@firebase/firestore";
import { db, storage } from "@/firebase/client";
import Loader from "../Loader";
import Icon from "../Icons";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

interface FormProps {
  onSubmit: (formData: NotificationFormData) => void;
  onSave: (formData: NotificationFormData) => void;
  isSaving?: boolean;
  isSending?: boolean;
}

export interface NotificationFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  imageURL: string;
}

const Form = ({
  onSubmit,
  onSave,
  isSaving = false,
  isSending = false,
}: FormProps) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    description: "",
    imageFile: null,
    imageURL: "",
  });
  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

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

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        setPreviewImage(readerEvent.target?.result);
      };
      setFormData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
    }
  };

  const handleClosePreviewImage = () => {
    setPreviewImage(null);
    setFormData((prevData) => ({
      ...prevData,
      imageFile: null,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.imageFile) {
      const storageRef = ref(storage, `images/${formData.imageFile.name}`);
      const uploadTask = await uploadBytes(storageRef, formData.imageFile);

      getDownloadURL(uploadTask.ref).then((downloadURL) => {
        onSubmit({ ...formData, imageURL: downloadURL });
      });
    } else {
      onSubmit(formData);
    }
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
      <div className={`${styles.formGroup} ${styles.formImageGroup}`}>
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
        {formData.imageFile && (
          <div className={styles.previewImageWrapper}>
            <button
              className={styles.iconWrapper}
              onClick={handleClosePreviewImage}
            >
              <Icon name="exit" width={30} height={30} />
            </button>
            <img src={previewImage as string} className={styles.previewImage} />
          </div>
        )}
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
