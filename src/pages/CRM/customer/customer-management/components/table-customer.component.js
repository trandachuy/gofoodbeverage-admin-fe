import { Col, Form, message, Row, Space } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { PermissionKeys } from "constants/permission-key.constants";
import { EnDash } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { executeAfter, formatNumber } from "utils/helpers";
import "./index.scss";

export default function TableCustomer(props) {
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const history = useHistory();

  const pageData = {
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    searchPlaceholder: t("customer.searchbyNamePhone"),
    no: t("customer.no"),
    name: t("customer.name"),
    phone: t("customer.phone"),
    rank: t("customer.rank"),
    action: t("customer.action"),
    point: t("customer.point"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteCustomerMessage: t("customer.confirmDeleteCustomerMessage"),
    customerDeleteSuccess: t("customer.customerDeleteSuccess"),
    customerDeleteFail: t("customer.customerDeleteFail"),
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
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "27%",
        className: "table-text-membership-name-overflow",
        render: (_, record) => {
          return (
            <div>
              <Link to={`/customer/detail/${record?.id}`}>
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: record.name }}
                  color="#50429B"
                >
                  <a> {record.name}</a>
                </Paragraph>
              </Link>
            </div>
          );
        },
      },
      {
        title: pageData.phone,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "23%",
      },
      {
        title: pageData.rank,
        dataIndex: "rank",
        key: "rank",
        width: "33%",
        render: (_, record) => {
          if (!record?.rank && record?.point === EnDash) {
            return (
              <>
                <Row>
                  <Col span={24}>{EnDash}</Col>
                </Row>
              </>
            );
          } else {
            return (
              <>
                <Row className="membership-rank-margin">
                  <Col span={12}>
                    <span className="float-left membership-rank-title-margin">{pageData.rank}</span>
                  </Col>
                  <Col span={12}>
                    <p className="float-left membership-rank" style={{ background: record?.color }}>
                      {record?.rank}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <span className="float-left">{pageData.point}</span>
                  </Col>
                  <Col span={12}>
                    <span className="float-left">{record?.point}</span>
                  </Col>
                </Row>
              </>
            );
          }
        },
      },
      {
        title: pageData.action,
        key: "action",
        width: "7%",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            {
              <EditButtonComponent
                className="mr-3"
                onClick={() => onEditItem(record)}
                permission={PermissionKeys.EDIT_CUSTOMER}
              />
            }
            {
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_CUSTOMER}
                onOk={() => handleDeleteItem(record.id)}
              />
            }
          </Space>
        ),
      },
    ],

    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
      });
    },

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, "");
    },
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteCustomerMessage, { name: name });
    return mess;
  };

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.customerDeleteSuccess);
      } else {
        message.error(pageData.customerDeleteFail);
      }
    });
    await fetchDatableAsync(1, tableSettings.pageSize, "");
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await customerDataService.getCustomersAsync(keySearch, pageNumber, pageSize);
    const data = response?.customers?.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.fullName,
      phoneNumber: item?.phoneNumber,
      point: item?.point === 0 ? EnDash : formatNumber(item?.point),
      rank: item?.rank,
      color: item?.color ?? "#efbb00",
    };
  };

  const onEditItem = (item) => {
    return history.push(`/customer/edit/${item?.id}`);
  };

  return (
    <>
      <Form className="form-staff">
        <Row>
          <FnbTable
            className="mt-4"
            columns={tableSettings.columns}
            pageSize={tableSettings.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
            search={{
              placeholder: pageData.searchPlaceholder,
              onChange: tableSettings.onSearch,
            }}
            editPermission={PermissionKeys.EDIT_CUSTOMER}
            deletePermission={PermissionKeys.DELETE_CUSTOMER}
          />
        </Row>
      </Form>
    </>
  );
}
