import { Button, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hasPermission } from "utils/helpers";

/**
 * Cancel to leave with confirm dialog
 * @param {*} param
 * @returns
 */
export function CancelButton({ buttonText, skipPermission, permission, className, onOk, onCancel, showWarning }) {
  const [t] = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showWarningDialog = () => {
    if (showWarning === true) {
      setIsModalVisible(true);
    } else {
      if (onOk) {
        onOk();
      }
    }
  };

  const onConfirm = () => {
    setIsModalVisible(false);
    if (onOk) {
      onOk();
    }
  };

  const onCloseWarningDialog = () => {
    setIsModalVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  const renderWarningDialog = () => {
    return (
      <Modal
        className="delete-confirm-modal"
        title={t("leaveDialog.confirmation")}
        visible={isModalVisible}
        okText={t("button.confirmLeave")}
        okType={"danger"}
        closable={false}
        cancelText={t("button.discard")}
        onOk={onConfirm}
        onCancel={onCloseWarningDialog}
      >
        <span dangerouslySetInnerHTML={{ __html: t("messages.leaveForm") }}></span>
      </Modal>
    );
  };

  const renderActionButton = () => {
    return (
      (!permission || hasPermission(permission) || skipPermission) && (
        <>
          <Button type="link" onClick={showWarningDialog} className="action-cancel">
            {buttonText ?? t("button.cancel", "Cancel")}
          </Button>
          {renderWarningDialog()}
        </>
      )
    );
  };

  return <>{renderActionButton()}</>;
}
