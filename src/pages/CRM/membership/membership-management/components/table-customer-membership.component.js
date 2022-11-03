import { Form, message, Modal, Row } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { PermissionKeys } from "constants/permission-key.constants";
import { ClassicMember, Percent } from "constants/string.constants";
import membershipDataService from "data-services/membership/membership-data.service";
import storeDataService from "data-services/store/store-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "utils/helpers";
import TableMembershipLevelByAccumulatedPointComponent from "./table-membership-level-name-by-accumulatedPoint.component";

export default function TableCustomerMemberShip(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currencyCode, setCurrencyCode] = useState(null);
  const tableMembershipLevelFuncs = React.useRef(null);
  const [showMembershipLevel, setShowMembershipLevelModel] = useState(false);
  const [accumulatedPoint, setAccumulatedPoint] = useState(0);

  const pageData = {
    title: t("membership.title"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    accumulatedPoint: t("membership.accumulatedPoint"),
    membershipDiscount: t("membership.membershipDiscount"),
    membershipMember: t("membership.membershipMember"),
    no: t("membership.no"),
    action: t("membership.action"),
    name: t("membership.Name"),
    phone: t("membership.Phone"),
    titleModal: t("membership.titleModal"),
    membershipLevel: t("membership.membershipLevel"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    membershipDeleteSuccess: t("membership.membershipDeleteSuccess"),
    membershipDeleteFail: t("membership.membershipDeleteFail"),
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "10%",
        align: "center",
      },
      {
        title: pageData.membershipLevel,
        dataIndex: "name",
        key: "name",
        width: "30%",
      },
      {
        title: pageData.accumulatedPoint,
        dataIndex: "accumulatedPoint",
        key: "accumulatedPoint",
        width: "20%",
        align: "center",
      },
      {
        title: pageData.membershipDiscount,
        dataIndex: "discount",
        key: "discount",
        width: "15%",
        align: "center",
      },
      {
        title: pageData.membershipMember,
        dataIndex: "member",
        key: "member",
        width: "15%",
        align: "center",
        render: (value, record) => {
          return (
            <span
              className="color-primary pointer"
              onClick={() => {
                setShowMembershipLevelModel(true);
                setAccumulatedPoint(record?.accumulatedPoint);
                if (tableMembershipLevelFuncs.current) {
                  tableMembershipLevelFuncs.current(record?.accumulatedPoint);
                }
              }}
            >
              {value}
            </span>
          );
        },
      },
      {
        title: pageData.action,
        key: "action",
        align: "center",
        render: (_, record) => {
          // if the data is default, can't edit or delete
          if (record?.index > 1) {
            return (
              <div className="action-column">
                <EditButtonComponent
                  className="mr-3"
                  onClick={() => onEditItem(record?.id)}
                  permission={PermissionKeys.EDIT_MEMBERSHIP_LEVEL}
                />
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.DELETE_MEMBERSHIP_LEVEL}
                  onOk={() => onRemoveItem(record?.id)}
                />
              </div>
            );
          }
        },
      },
    ],

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize);
    },
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize);
    getCurrency();
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize) => {
    const response = await membershipDataService.getMembershipsAsync(pageNumber, pageSize);
    const data = response?.customerMemberships?.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      member: item?.member,
      name: item?.accumulatedPoint === 0 ? ClassicMember : item?.name,
      accumulatedPoint: item?.accumulatedPoint,
      discount: item?.maximumDiscount ? formatCurrency(item?.maximumDiscount) : item.discount + Percent,
    };
  };

  const getCurrency = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const renderMembershipLevelLevelModal = () => {
    return (
      <Modal
        title={pageData.titleModal}
        visible={showMembershipLevel}
        onCancel={() => setShowMembershipLevelModel(false)}
        footer={(null, null)}
      >
        <TableMembershipLevelByAccumulatedPointComponent
          t={t}
          tableFuncs={tableMembershipLevelFuncs}
          membershipAccumulatedPoint={accumulatedPoint}
        />
      </Modal>
    );
  };

  const onEditItem = (id) => {
    return history.push(`/membership/edit/${id}`);
  };

  const onRemoveItem = async (id) => {
    var res = await membershipDataService.deleteMembershipByIdAsync(id);
    if (res) {
      message.success(pageData.membershipDeleteSuccess);
    } else {
      message.error(pageData.membershipDeleteFail);
    }
    await fetchDatableAsync(1, tableSettings.pageSize);
  };

  return (
    <>
      {renderMembershipLevelLevelModal()}
      <Form className="form-staff">
        <Row>
          <FnbTable
            className="mt-3"
            columns={tableSettings.columns}
            pageSize={tableSettings.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
            editPermission={PermissionKeys.EDIT_MEMBERSHIP_LEVEL}
            deletePermission={PermissionKeys.DELETE_MEMBERSHIP_LEVEL}
          />
        </Row>
      </Form>
    </>
  );
}
