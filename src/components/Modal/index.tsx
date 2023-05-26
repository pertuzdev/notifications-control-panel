import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";
import Icon from "../Icons";

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  showCloseBtn?: boolean;
  width?: string;
  onClose?: () => void;
}

function Modal({ children, onClose, showCloseBtn = true, width }: ModalProps) {
  const handleModalClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className={styles.modalWrapper} onClick={onClose}>
      <div className={styles.modalBodyWrapper}>
        <div className={styles.modalBody} onClick={handleModalClick}>
          <div className={styles.modalHeader}>
            <button className={styles.iconButton} onClick={onClose}>
              <Icon name="exit" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AppModal({
  children,
  onClose,
  showCloseBtn,
  width,
}: ModalProps) {
  const [pageRendered, setPageRendered] = useState(false);

  useEffect(() => {
    setPageRendered(true);
  }, []);

  if (!pageRendered) return <></>;

  return ReactDOM.createPortal(
    <Modal onClose={onClose} showCloseBtn={showCloseBtn} width={width}>
      {children}
    </Modal>,
    document && (document.getElementById("modal-root") as Element)
  );
}
