import React from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

/**
 * Badge Status
 * @param {bool} status - Status of the badge
 * @returns Active or Inactive label
 */
export function BadgeStatus(props) {
  const [t] = useTranslation();
  const { isActive } = props;

  const pageData = {
    active: t("status.active"),
    inactive: t("status.inactive"),
  };

  const renderStatus = () => {
    if (isActive) {
      return (
        <span className="badge-status active">
          <span> {pageData.active}</span>
        </span>
      );
    }

    return (
      <span className="badge-status default">
        <span> {pageData.inactive}</span>
      </span>
    );
  };

  return <>{renderStatus()}</>;
}
