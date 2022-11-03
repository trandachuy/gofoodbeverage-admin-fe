import React from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { TrashFill } from "constants/icons.constants";

export function FnbTrashFillIcon(props) {
  const [t] = useTranslation();
  return (
    <div className="fnb-table-action-icon">
      <Tooltip placement="top" title={t("button.delete")} color="#50429B">
        <TrashFill className="icon-svg-hover" />
      </Tooltip>
    </div>
  );
}
