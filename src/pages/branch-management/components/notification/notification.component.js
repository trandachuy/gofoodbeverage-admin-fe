import { Button, Modal } from "antd";
import { RocketNotifyIcon } from "constants/icons.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { store } from "store";
import "./notification.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const NotificationComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const [visible, setVisible] = React.useState(false);

  const pageData = {
    title: t("store.upgradeNotifyTitle"),
    ignore: t("store.ignore"),
    upgrade: t("store.upgrade"),
    content: "store.requestUpgradeMessage",
  };

  useImperativeHandle(ref, () => ({
    showNotification() {
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  const renderActionButton = () => {
    return (
      <div>
        <Button
          className="btn-ignore"
          onClick={() => {
            setVisible(false);
          }}
        >
          {pageData.ignore}
        </Button>
        <Button
          className="btn-upgrade"
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          {pageData.upgrade}
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    const { session } = store.getState();
    const fullName = session?.currentUser.fullName;
    const text = t(pageData.content, { userName: fullName });
    return <p className="your-text" dangerouslySetInnerHTML={{ __html: text }}></p>;
  };

  return (
    <>
      <Modal width={621} className="modal-notification" closeIcon visible={visible} footer={null}>
        <div className="icon">
          <RocketNotifyIcon />
        </div>
        <h3 className="title">{pageData.title}</h3>
        {renderContent()}
        {renderActionButton()}
      </Modal>
    </>
  );
});
