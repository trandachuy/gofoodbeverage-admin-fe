import React, { useEffect, useState } from "react";
import PageTitle from "components/page-title";
import { Form, Card, Row, Col, Space, Modal, message } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { executeAfter, hasPermission } from "utils/helpers";
import TableCustomerBySegmentComponent from "./table-customer-by-segment.component";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { CloseModalIcon } from "constants/icons.constants";
import "./list-customer-segment.scss";

/**
 * Page Customer Segment
 * description: page manage customer segment primary template
 */
export default function ListCustomerSegment(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showTableCustomersModal, setShowTableCustomersModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const tableCustomersFunc = React.useRef(null);

  const pageData = {
    title: t("customerSegment.management"),
    linkAddNew: "/customer/segment/create-new",
    button: {
      addNew: t("button.addNew"),
      delete: t("button.delete"),
      ignore: t("button.ignore"),
    },
    table: {
      searchPlaceholder: t("customerSegment.searchPlaceholder"),
      no: t("customerSegment.no"),
      name: t("customerSegment.name"),
      member: t("customerSegment.member"),
      action: t("customerSegment.action"),
    },
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    customerSegmentDeleteSuccess: t("customerSegment.customerSegmentDeleteSuccess"),
    customerSegmentDeleteFail: t("customerSegment.customerSegmentDeleteFail"),
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "index",
        key: "index",
        width: "5%",
        align: "center",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        key: "name",
        width: "50%",
      },
      {
        title: pageData.table.member,
        dataIndex: "member",
        key: "member",
        width: "10%",
        align: "center",
        render: (value, record) => {
          if (value && value > 0) {
            return (
              <span
                className="color-primary pointer"
                onClick={() => {
                  setSelectedSegment(record);
                  setShowTableCustomersModal(true);

                  if (tableCustomersFunc.current) {
                    tableCustomersFunc.current(record);
                  }
                }}
              >
                {value}
              </span>
            );
          } else {
            return <span>{value}</span>;
          }
        },
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return (
            <div className="action-column">
              <EditButtonComponent
                className="mr-3"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_SEGMENT}
              />
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.button.delete}
                cancelText={pageData.button.ignore}
                permission={PermissionKeys.DELETE_SEGMENT}
                onOk={() => onRemoveItem(record?.id)}
              />
            </div>
          );
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDataTableAsync(1, tableSettings.pageSize, keySearch);
      });
    },
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  useEffect(() => {
    fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDataTableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await customerSegmentDataService.getCustomerSegmentsAsync(pageNumber, pageSize, keySearch);
    const data = response?.customerSegments.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.name,
      member: item?.member,
    };
  };

  const renderContent = () => {
    const segment = dataSource?.find((s) => s.id === selectedSegment?.id);
    return <TableCustomerBySegmentComponent segment={segment} tableFuncs={tableCustomersFunc} />;
  };

  const renderTableCustomerModal = () => {
    const segment = dataSource?.find((s) => s.id === selectedSegment?.id);
    return (
      <FnbModal
        className="modal-customer-segment"
        closeIcon={<CloseModalIcon />}
        width={"1004px"}
        title={segment?.name}
        visible={showTableCustomersModal}
        handleCancel={() => setShowTableCustomersModal(false)}
        content={renderContent()}
        footer={(null, null)}
      />
    );
  };

  const onEditItem = (id) => {
    return history.push(`/customer/segment/edit/${id}`);
  };

  const onRemoveItem = async (id) => {
    var res = await customerSegmentDataService.deleteCustomerSegmentByIdAsync(id);
    if (res) {
      message.success(pageData.customerSegmentDeleteSuccess);
    } else {
      message.error(pageData.customerSegmentDeleteFail);
    }

    await fetchDataTableAsync(1, tableSettings.pageSize, "");
  };

  /// Render table columns by permission
  const getTableColumns = () => {
    if (hasPermission(PermissionKeys.EDIT_SEGMENT || hasPermission(PermissionKeys.DELETE_SEGMENT))) {
      return tableSettings.columns;
    } else {
      return tableSettings.columns.filter((c) => c.key !== "action");
    }
  };

  return (
    <>
      {renderTableCustomerModal()}
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col span={12}>
          <Space className="float-right">
            <FnbAddNewButton
              permission={PermissionKeys.CREATE_SEGMENT}
              onClick={() => history.push(pageData.linkAddNew)}
              text={pageData.button.addNew}
            />
          </Space>
        </Col>
      </Row>

      <Card className="fnb-card-full">
        <Form className="form-staff">
          <Row>
            <FnbTable
              className="mt-3"
              columns={getTableColumns()}
              pageSize={tableSettings.pageSize}
              dataSource={dataSource}
              currentPageNumber={currentPageNumber}
              total={totalRecords}
              onChangePage={tableSettings.onChangePage}
              search={{
                placeholder: pageData.table.searchPlaceholder,
                onChange: tableSettings.onSearch,
              }}
            />
          </Row>
        </Form>
      </Card>
    </>
  );
}
