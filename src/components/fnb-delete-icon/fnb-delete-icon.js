import React from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "constants/icons.constants";

export function FnbDeleteIcon(props) {
  const [t] = useTranslation();
  return (
    <Tooltip placement="top" title={t("button.delete")}>
      <TrashIcon />
    </Tooltip>
  );
}
