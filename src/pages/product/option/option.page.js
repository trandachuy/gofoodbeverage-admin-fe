import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Space } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import PageTitle from "components/page-title";
import { TableOption } from "./components/table-option.component";
import CreateNewOptionManagement from "./components/create-new-option-management.component";
import EditOptionManagement from "./components/edit-option-management.component";
import optionDataService from "data-services/option/option-data.service";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import "./option.page.scss";

export default function OptionManagement(props) {
  const [t] = useTranslation();
  const optionTableComponentRef = React.useRef();
  const editComponentRef = React.useRef();
  const [showAddNewOptionForm, setShowAddNewOptionForm] = useState(false);
  const [showEditOptionForm, setShowEditOptionForm] = useState(false);

  const pageData = {
    optionManagement: t("option.optionManagement"),
    addNew: t("button.addNew"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteContent: t("option.confirmDeleteContent"),
    optionDeleteSuccess: t("option.optionDeleteSuccess"),
    optionDeleteFail: t("option.optionDeleteFail"),
    searchName: t("form.searchName"),
    no: t("table.no"),
    name: t("table.name"),
    options: t("table.options"),
    action: t("table.action"),
    percent: "%",
  };

  const onCancelAddNewForm = () => {
    setShowAddNewOptionForm(false);
    reFreshOptionTable();
  };

  const onCancelUpdateForm = () => {
    setShowEditOptionForm(false);
    reFreshOptionTable();
  };

  const reFreshOptionTable = () => {
    if (optionTableComponentRef && optionTableComponentRef.current) {
      optionTableComponentRef.current.refresh();
    }
  };

  const onEditItem = (id) => {
    optionDataService.getOptionByIdAsync(id).then((response) => {
      if (response) {
        const { option } = response;
        editComponentRef.current({ ...option });
        setShowEditOptionForm(true);
      }
    });
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Space className="page-title">
          <PageTitle content={pageData.optionManagement} />
        </Space>
        <Space className="page-action-group">
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_OPTION}
            onClick={() => setShowAddNewOptionForm(true)}
            text={pageData.addNew}
          />
        </Space>
      </Row>

      <CreateNewOptionManagement isModalVisible={showAddNewOptionForm} handleCancel={() => onCancelAddNewForm()} />

      <EditOptionManagement visible={showEditOptionForm} func={editComponentRef} handleCancel={() => onCancelUpdateForm()} />

      <TableOption ref={optionTableComponentRef} onEditItem={(itemId) => onEditItem(itemId)} />
    </>
  );
}
