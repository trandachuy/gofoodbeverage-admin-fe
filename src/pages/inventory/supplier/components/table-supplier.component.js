import React, { useEffect, useState } from "react";
import { Form, Row, message, Tooltip, Space } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import { Link, useHistory } from "react-router-dom";
import DeleteSupplier from "./delete-supplier.component";
import { useTranslation } from "react-i18next";
import supplierDataService from "data-services/supplier/supplier-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import { tableSettings } from "constants/default.constants";
import { FnbTable } from "components/fnb-table/fnb-table";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { TrashFill } from "constants/icons.constants";
import { hasPermission } from "utils/helpers";
import { Typography } from "antd";
const { Paragraph } = Typography;

export default function TableSupplier(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoSupplier, setInfoSupplier] = useState({});
  const [titleModal, setTitleModal] = useState({});

  const pageData = {
    search: t("supplier.search"),
    code: t("table.code"),
    name: t("table.name"),
    phone: t("table.phone"),
    email: t("table.email"),
    action: t("table.action"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteContent: t("messages.confirmDeleteContent"),
    notificationTitle: t("form.notificationTitle"),
    supplierDeleteSuccess: t("messages.isDeletedSuccessfully"),
    supplierDeleteFail: t("supplier.supplierDeleteFail"),
  };

  useEffect(() => {}, []);

  const onEditItem = (id) => {
    return history.push(`/inventory/supplier/edit/${id}`);
  };

  const onDeleteItem = (supplierId) => {
    purchaseOrderDataService.getPurchaseOrderBySupplierIdAsync(supplierId).then((res) => {
      if (res.isOpenPurchaseOrder) {
        setTitleModal(pageData.notificationTitle);
      } else {
        setTitleModal(pageData.confirmDelete);
      }
      setInfoSupplier(res);
      setIsModalVisible(true);
    });
  };

  const onDelete = (id, name) => {
    supplierDataService.deleteSupplierByIdAsync(id).then((res) => {
      if (res) {
        setIsModalVisible(false);
        props.refreshDataTable(tableSettings.page, tableSettings.pageSize, "");
        message.success(`${name} ${pageData.supplierDeleteSuccess}`);
      } else {
        message.error(pageData.supplierDeleteFail);
      }
    });
  };

  const getColumnsSupplier = () => {
    const columnsSupplier = [
      {
        title: pageData.code,
        dataIndex: "code",
        key: "code",
        width: "10%",
        align: "left",
        className: "grid-code-column",

        render: (_, record) => {
          let href = `/inventory/supplier/${record.id}`;
          return <Link to={href}>{record.code}</Link>;
        },
      },
      {
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "25%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-name">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.name }}
                color="#50429B"
              >
                <span>{record.name}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.phone,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "25%",
        align: "left",
        className: "grid-text-column",
      },
      {
        title: pageData.email,
        dataIndex: "email",
        key: "email",
        width: "20%",
        align: "left",
        className: "grid-text-column",
        render: (_, record) => {
          return (
            <div className="text-overflow-email">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.email }}
                color="#50429B"
              >
                <span>{record.email}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.action,
        key: "action",
        align: "left",
        width: "10%",
        render: (_, record) => (
          <>
            <div className="action-column">
              <EditButtonComponent
                className="action-button-space"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_SUPPLIER}
              />

              {hasPermission(PermissionKeys.DELETE_SUPPLIER) && (
                <Space wrap>
                  <div
                    className="fnb-table-action-icon pointer"
                    onClick={() => onDeleteItem(record?.id)}
                  >
                    <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                      <TrashFill className="icon-svg-hover" />
                    </Tooltip>
                  </div>
                </Space>
              )}
            </div>
          </>
        ),
      },
    ];

    return columnsSupplier;
  };

  return (
    <Form className="form-staff">
      <Row>
        <FnbTable
          className="form-table mt-3"
          columns={getColumnsSupplier()}
          pageSize={props.pageSize}
          dataSource={props.dataSource}
          currentPageNumber={props.currentPageNumber}
          total={props.total}
          onChangePage={props.onChangePage}
          editPermission={PermissionKeys.EDIT_SUPPLIER}
          deletePermission={PermissionKeys.DELETE_SUPPLIER}
          search={{
            placeholder: pageData.search,
            onChange: props.onSearch,
          }}
        />

        <DeleteSupplier
          isModalVisible={isModalVisible}
          infoSupplier={infoSupplier}
          titleModal={titleModal}
          handleCancel={() => setIsModalVisible(false)}
          onDelete={onDelete}
        />
      </Row>
    </Form>
  );
}
