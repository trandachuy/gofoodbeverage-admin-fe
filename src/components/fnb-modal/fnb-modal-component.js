import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import "./fnb-modal-component.scss";

export function FnbModal(props) {
  const [t] = useTranslation();
    const { width, visible, title, cancelText, handleCancel, okText, onOk, content, footer, closeIcon, className, okButtonProps,
        cancelButtonProps,
        centered } =
    props;

  return (
    <>
      <Modal
        closeIcon={closeIcon}
        width={width}
        className={`modal-component ${className}`}
        visible={visible}
        title={title}
        cancelText={cancelText}
        onCancel={handleCancel}
        okText={okText}
        onOk={onOk}
              footer={footer}
              okButtonProps={okButtonProps}
              cancelButtonProps={cancelButtonProps}
              centered={centered}
      >
        {content}
      </Modal>
    </>
  );
}
