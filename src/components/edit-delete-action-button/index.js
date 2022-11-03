import React from "react";
import { Space } from "antd";
import { EditIcon, TrashIcon } from "constants/icons.constants";
import { hasPermission } from "utils/helpers";

export function EditDeleteActionButton(props) {
  const { onEdit, onRemove, record, editPermission, deletePermission } = props;

  return (
    <Space size="middle">
      {hasPermission(editPermission) && (
        <a onClick={() => onEdit(record)}>
          <EditIcon />
        </a>
      )}

      {hasPermission(deletePermission) && (
        <a onClick={() => onRemove(record)}>
          <TrashIcon />
        </a>
      )}
    </Space>
  );
}
