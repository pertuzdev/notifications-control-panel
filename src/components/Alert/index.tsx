import Loader from "../Loader";
import AppModal from "../Modal";
import styles from "./styles.module.css";

interface IAlert {
  title: string;
  description: string;
  primaryAction?: () => void;
  onCloseAlert?: () => void;
  type?: "delete" | "send";
  isLoading?: boolean;
}

const Alert = ({
  title,
  description,
  primaryAction,
  onCloseAlert,
  type = "send",
  isLoading = false,
}: IAlert) => {
  return (
    <AppModal onClose={onCloseAlert}>
      <div>
        <div className={styles.alertTextWrapper}>
          <h2>{title || ""}</h2>

          <p>{description || ""}</p>
        </div>
        <div className={styles.alertButtonsWrapper}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancel}`}
            onClick={onCloseAlert}
          >
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            onClick={primaryAction}
            className={
              type === "delete"
                ? `${styles.button} ${styles.danger}`
                : `${styles.button}`
            }
          >
            {isLoading ? (
              <Loader />
            ) : (
              <span>{type === "delete" ? "Delete" : "Send"}</span>
            )}
          </button>
        </div>
      </div>
    </AppModal>
  );
};

export default Alert;
