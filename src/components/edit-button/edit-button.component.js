import React from "react";
import { Space, Tooltip } from "antd";
import { EditFill } from "constants/icons.constants";
import { hasPermission } from "utils/helpers";
import { useTranslation } from "react-i18next";

export function EditButtonComponent(props) {
  const { className, onClick, permission } = props;
  const [t] = useTranslation();

  return (
    <>
      {!permission || hasPermission(permission) ? (
        <Space wrap className={className}>
          <a onClick={() => onClick()}>
            <div className="fnb-table-action-icon">
              <Tooltip placement="top" title={t("button.edit")} color="#50429B">
                <EditFill className="icon-svg-hover" />
              </Tooltip>
            </div>
          </a>
        </Space>
      ) : (
        <></>
      )}
    </>
  );
}
