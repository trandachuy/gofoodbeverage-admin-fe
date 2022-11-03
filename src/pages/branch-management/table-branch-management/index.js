import React, { useEffect, useState } from "react";
import { Form, Row, Space, Card, Tooltip, message } from "antd";
import { FnbEditFillIcon } from "components/fnb-edit-fill-icon/fnb-edit-fill-icon";
import { FnbTrashFillIcon } from "components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import { FnbTable } from "components/fnb-table/fnb-table";
import TooltipParagraph from "components/fnb-tooltip-paragraph/fnb-tooltip-paragraph";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { PermissionKeys } from "constants/permission-key.constants";
import { hasPermission } from "utils/helpers";
import { TrashFill } from "constants/icons.constants";
import DeleteBranch from "../components/delete-branch.component";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import branchDataService from "data-services/branch/branch-data.service";

export default function TableBranchManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState({});
  const [infoPurchaseOrders, setInfoPurchaseOrders] = useState({});
  const { dataSource, total, onChangePage, pageSize, pageNumber, onSearch, numberRecordCurrent } =
    props;

  const pageData = {
    no: t("table.no"),
    branchName: t("table.branchName"),
    phone: t("table.phone"),
    action: t("table.action"),
    status: t("table.status"),
    active: t("status.active"),
    inactive: t("status.inactive"),
    searchNameOrPhone: t("form.searchNameOrPhone"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    notificationTitle: t("form.notificationTitle"),
    isDeletedSuccessfully: t("messages.isDeletedSuccessfully"),
  };

  //name columns Branch management
  const columnsBranchManagement = [
    {
      title: pageData.no,
      dataIndex: "no",
      key: "no",
      width: "140px",
      align: "center",
      render: (_, record) => <div className="text-name">{record.no}</div>,
    },
    {
      title: pageData.branchName,
      dataIndex: "name",
      key: "name",
      width: "498px",
      render: (_, record) => {
        return (
          <div>
            <div className="text-name text-overflow">
              <TooltipParagraph>{record.name}</TooltipParagraph>
            </div>
            <div className="text-addressInfo text-overflow">
              <TooltipParagraph>{record.addressInfo}</TooltipParagraph>
            </div>
          </div>
        );
      },
    },
    {
      title: pageData.phone,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "322px",
      render: (_, record) => <div className="text-name">{record.phoneNumber}</div>,
    },
    {
      title: pageData.status,
      dataIndex: "status",
      key: "status",
      width: "237px",
      align: "center",
      render: (_, record) => {
        if (record.statusId === 0) {
          return (
            <div className="div-inactive">
              <p className="text-inactive">{pageData.inactive}</p>
            </div>
          );
        } else {
          return (
            <div className="div-active">
              <p className="text-active">{pageData.active}</p>
            </div>
          );
        }
      },
    },
    {
      title: pageData.action,
      key: "action",
      width: "20px",
      align: "center",
      render: (_, record) => (
        <div className="action-column">
          <EditButtonComponent
            className="action-button-space"
            onClick={() => onEditItem(record)}
            permission={PermissionKeys.ADMIN}
          />
          {hasPermission(PermissionKeys.ADMIN) && (
            <Space wrap>
              <div className="fnb-table-action-icon">
                <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                  <TrashFill className="icon-svg-hover" onClick={() => onDeleteItem(record?.id)} />
                </Tooltip>
              </div>
            </Space>
          )}
        </div>
      ),
    },
  ];

  const onEditItem = (record) => {
    history.push(`/branch/edit/${record?.id}`);
  };

  const onDeleteItem = async (branchId) => {
    const res = await purchaseOrderDataService.getPurchaseOrderByBranchIdAsync(branchId);
    if (res.isOpenPurchaseOrder) {
      setTitleModal(pageData.notificationTitle);
    } else {
      setTitleModal(pageData.confirmDelete);
    }
    setInfoPurchaseOrders(res);
    setIsModalVisible(true);
  };

  const onDelete = async (id, name) => {
    const res = await branchDataService.deleteStoreBranchByIdAsync(id);
    if (res) {
      setIsModalVisible(false);
      onChangePage(pageNumber, pageSize);
      message.success(`${name} ${pageData.isDeletedSuccessfully}`);
    }
  };

  return (
    <>
      <Form className="form-staff">
        <Card className="fnb-card-full">
          <Row>
            <FnbTable
              className="mt-4"
              columns={columnsBranchManagement}
              dataSource={dataSource}
              pageSize={pageSize}
              pageNumber={pageNumber}
              total={total}
              onChangePage={onChangePage}
              numberRecordCurrent={numberRecordCurrent}
              search={{
                placeholder: pageData.searchNameOrPhone,
                onChange: onSearch,
              }}
            />
          </Row>
        </Card>
      </Form>
      <DeleteBranch
        isModalVisible={isModalVisible}
        infoPurchaseOrder={infoPurchaseOrders}
        titleModal={titleModal}
        handleCancel={() => setIsModalVisible(false)}
        onDelete={onDelete}
      />
    </>
  );
}
