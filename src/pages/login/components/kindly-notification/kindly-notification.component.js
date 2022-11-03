import React from "react";
import { Modal, Image, Button } from "antd";
import { useTranslation } from "react-i18next";
import notificationImage from "assets/images/kindly-notification.png";
import "./kindly-notification.component.scss";
import { accountStatusConstants } from "constants/account-status.constants";

const { forwardRef, useImperativeHandle } = React;
export const KindlyNotificationComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [kindlyNotifyType, setKindlyNotifyType] = React.useState({});

  const pageData = {
    title: t("activateAccount.title"),
    dear: t("activateAccount.dear"),
    your: t("activateAccount.your"),
    waitingApproval: t("activateAccount.waitingApproval"),
    please: t("activateAccount.please"),
    hotline: t("activateAccount.hotline"),
    email: t("activateAccount.email"),
    activateAccount: t("activateAccount.activateAccount"),
    gotIt: t("activateAccount.gotIt"),
  };

  useImperativeHandle(ref, () => ({
    setKindlyNotifyType(kindlyNotifyType) {
      setKindlyNotifyType(kindlyNotifyType);
      setVisible(true);
    },
  }));

  const onClickActivateAccount = () => {
    if (props.onActive) {
      props.onActive();
      setVisible(false);
    }
  };

  const renderActionButton = () => {
    if (kindlyNotifyType === accountStatusConstants.waitingForApproval) {
      return (
        <Button
          className="activate-account-btn"
          onClick={() => {
            setVisible(false);
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          {pageData.gotIt}
        </Button>
      );
    }
    return (
      <Button className="activate-account-btn" onClick={onClickActivateAccount}>
        {pageData.activateAccount}
      </Button>
    );
  };

  const renderContent = () => {
    if (kindlyNotifyType === accountStatusConstants.waitingForApproval) {
      return <p className="your-text">{pageData.waitingApproval}</p>;
    }
    return <p className="your-text">{pageData.your}</p>;
  };

  return (
    <>
      <Modal width={716} className="modal-notification" closeIcon visible={visible} footer={null}>
        <h3 className="title">{pageData.title}</h3>
        <div className="img-notification">
          <Image preview={false} width={242} src={notificationImage} />
        </div>
        <p className="dear-text">{pageData.dear}</p>
        {renderContent()}
        <p className="please-text">{pageData.please}</p>
        <p className="contact-text">
          {pageData.hotline}: <span>(028) 7303 0800</span> - {pageData.email}: <span>hotro@gosell.vn</span>
        </p>
        {renderActionButton()}
      </Modal>
    </>
  );
});
