import React, { useState } from "react";
import { Modal, Space } from "antd";
import { hasPermission } from "utils/helpers";
import { useTranslation } from "react-i18next";
import { CancelIcon } from "constants/icons.constants";
import "./cancel-confirm.component.scss";

export default function CancelConfirmComponent(props) {
  const {
    title,
    content,
    okText,
    cancelText,
    permission,
    onOk,
    okType,
    canClose,
  } = props;
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onOk();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    hasPermission(permission) && (
      <>
        <Space wrap>
          <a className="cancel-btn" onClick={showModal}><CancelIcon /><span> {t("button.cancel")}</span></a>
          <Modal
            className="cancel-confirm-modal"
            title={title}
            visible={isModalVisible}
            okText={okText}
            okType={okType ? okType : "danger"}
            closable={canClose ? canClose : false}
            cancelText={cancelText}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {content}
          </Modal>
        </Space>
      </>
    )
  );
}
