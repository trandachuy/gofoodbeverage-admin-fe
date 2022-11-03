import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message, Space } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import userDataService from "../../../data-services/user/user-data.service";

import "./update-password.scss";

export function UpdatePasswordComponent(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { t } = useTranslation();
  const prefix = "updatePassword";
  const pageData = {
    title: t(`${prefix}.title`),
    currentPassword: t(`${prefix}.currentPassword`),
    placeholderCurrentPassword: t(`${prefix}.placeholderCurrentPassword`),
    showEmptyCurrentPassword: t(`${prefix}.showEmptyCurrentPassword`),
    showWrongCurrentPassword: t(`${prefix}.showWrongCurrentPassword`),
    newPassword: t(`${prefix}.newPassword`),
    placeholderNewPassword: t(`${prefix}.placeholderNewPassword`),
    showEmptyNewPassword: t(`${prefix}.showEmptyNewPassword`),
    confirmPassword: t(`${prefix}.confirmPassword`),
    placeholderConfirmPassword: t(`${prefix}.placeholderConfirmPassword`),
    showConfirmNewPassword: t(`${prefix}.showConfirmNewPassword`),
    showNotMatchPassword: t(`${prefix}.showNotMatchPassword`),
    showThanksMessage: t(`${prefix}.showThanksMessage`),
    showUpdateFailedMessage: t(`${prefix}.showUpdateFailedMessage`),
  };

  async function handleUpdate(e) {
    try {
      var initData = await userDataService.updatePasswordAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (initData !== true) {
        message.warning(pageData.showUpdateFailedMessage);
      } else {
        message.warning(pageData.showThanksMessage);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      message.warning(pageData.showUpdateFailedMessage);
    }
  }

  async function handleValidataionPassword(password) {
    try {
      if (password.length === 0) {
        return false;
      }
      var initData = await userDataService.validationPasswordAsync({
        currentPassword: password,
      });

      if (initData !== true) {
        setCurrentPasswordError(pageData.showWrongCurrentPassword);
      } else {
        setCurrentPasswordError("");
      }
    } finally {
      setPasswordFocus(false);
    }
  }

  function validataionPassword(value) {
    setCurrentPassword(value);
    if (value === "" || value.length < 1) {
      setCurrentPasswordError(pageData.showEmptyCurrentPassword);
      return;
    }
    setCurrentPasswordError("");
  }

  function validataionNewPassword(value) {
    setNewPassword(value);
    setConfirmPassword("");
    if (value.length === "" || value.length < 1) {
      setNewPasswordError(pageData.showEmptyNewPassword);
      return;
    }
    setNewPasswordError("");
  }

  function validataionConfirmPassword(value) {
    setConfirmPassword(value);
    if (value.length === "" || value.length < 1) {
      setConfirmPasswordError(pageData.showEmptyConfirmPassword);
      return;
    } else if (value.length > 0 && value !== newPassword) {
      setConfirmPasswordError(pageData.showNotMatchPassword);
      return;
    }
    setConfirmPasswordError("");
  }

  const renderError = (message) => {
    return <div className="ant-form-item-explain-error up-error">{message}</div>;
  };

  const renderButton = () => {
    const condition = [
      currentPasswordError?.length === 0,
      newPasswordError?.length === 0,
      confirmPasswordError?.length === 0,
      currentPassword?.length > 0,
      newPassword?.length > 0,
      confirmPassword?.length > 0,
    ];
    if (condition.every((v) => v === true) && passwordFocus === false) {
      return (
        <div className="btn-wraper">
          <Button className="up-btn" visible={true} onClick={handleUpdate} type="dashed" shape="default" size="small">
            update
          </Button>
        </div>
      );
    }
    return <div className="btn-wraper"></div>;
  };

  return (
    <div className="c-update-password c-update-password--border c-update-password--spacing">
      <div className="up-header up-header--spacing" size={"large"} align="baseline">
        <h4 className="title-group title">{pageData.title}</h4>
        {renderButton()}
      </div>

      <div className="up-content">
        <div className="up-content-wrap up-content-wrap--spacing">
          <Space direction="vertical" className="up-content-wrap-textbox up-content-wrap-textbox--spacing">
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.currentPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderCurrentPassword}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              value={currentPassword}
              onChange={(e) => validataionPassword(e.target.value)}
              onBlur={(e) => handleValidataionPassword(e.target.value)}
              onFocus={(e) => setPasswordFocus(true)}
            />
            {renderError(currentPasswordError)}
          </Space>
        </div>

        <div className="up-content-wrap up-content-wrap--spacing">
          <Space direction="vertical" className="up-content-wrap-textbox up-content-wrap-textbox--spacing">
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.newPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderNewPassword}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => validataionNewPassword(e.target.value)}
              value={newPassword}
            />
            {renderError(newPasswordError)}
          </Space>
          <Space direction="vertical" className="up-content-wrap-textbox up-content-wrap-textbox--spacing">
            <label className="fnb-form-label up-content-wrap-textbox-label">
              {pageData.confirmPassword}
              <span className="text-danger">*</span>
            </label>
            <Input.Password
              className="up-content-wrap-textbox-input"
              placeholder={pageData.placeholderConfirmPassword}
              value={confirmPassword}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => validataionConfirmPassword(e.target.value)}
            />
            {renderError(confirmPasswordError)}
          </Space>
        </div>
      </div>
    </div>
  );
}
