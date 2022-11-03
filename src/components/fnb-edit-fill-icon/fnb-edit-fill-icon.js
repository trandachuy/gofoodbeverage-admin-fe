import React from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { EditFill } from "constants/icons.constants";

export function FnbEditFillIcon(props) {
  const [t] = useTranslation();
  return (
    <div className="fnb-table-action-icon">
      <Tooltip placement="top" title={t("button.edit")} color="#50429B">
        <EditFill className="icon-svg-hover" />
      </Tooltip>
    </div>
  );
}
