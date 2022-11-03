import React from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { EditIcon } from "constants/icons.constants";

export function FnbEditIcon(props) {
  const [t] = useTranslation();
  return (
    <Tooltip placement="top" title={t("button.edit")}>
      <EditIcon />
    </Tooltip>
  );
}
