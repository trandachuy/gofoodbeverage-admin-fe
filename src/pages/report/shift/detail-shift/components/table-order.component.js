import React from "react";
import { Table, Row, Col } from "antd";
import { formatCurrency, capitalize } from "utils/helpers";

export default function TableShiftOrderDetail(props) {
  const { t, dataSource, pageSize, onChangePage, total } = props;

  const pageData = {
    id: t("table.id"),
    status: t("table.status"),
    type: t("table.type"),
    detail: t("table.detail"),
    customer: t("table.customer"),
    point: t("customer.point"),
    total: t("table.total"),
    paymentMethod: t("payment.paymentMethod"),
    discount: t("promotion.table.discount"),
    grossTotal: t("table.grossTotal")
  };

  const getColumnOrder = [
    {
      title: pageData.id,
      dataIndex: "code",
      key: "code",
      width: "10%",
    },
    {
      title: pageData.status,
      dataIndex: "statusName",
      key: "statusName",
      width: "20%",
    },
    {
      title: pageData.type,
      dataIndex: "orderTypeName",
      key: "orderTypeName",
      width: "20%",
    },
    {
      title: pageData.detail,
      dataIndex: "detail",
      key: "detail",
      width: "30%",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col span={12}>{pageData.grossTotal}:</Col>
              <Col span={12} className="text-right">{formatCurrency(record?.grossTotal)}</Col>
            </Row>
            <Row>
              <Col span={12}>{pageData.discount}:</Col>
              <Col span={12} className="text-right">-{formatCurrency(record?.discount)}</Col>
            </Row>
            <Row>
              <Col span={12}>{capitalize(pageData.paymentMethod)}:</Col>
              <Col span={12} className="text-right">{record?.paymentMethod}</Col>
            </Row>
            <hr />
            <Row>
              <Col span={12}><b>{pageData.total}</b></Col>
              <Col span={12} className="text-right"><b>{formatCurrency(record?.totalAmount)}</b></Col>
            </Row>
          </>
        );
      },
    },
    {
      title: pageData.customer,
      dataIndex: "customer",
      key: "customer",
      width: "20%",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col span={24}>{record?.fullName}</Col>
              <Col span={24}>{record?.phoneNumber}</Col>
            </Row>
            <Row>
              <Col span={12}><b>{pageData.point}:</b></Col>
              <Col span={12}><b>{record?.accumulatedPoint}</b></Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <Table
      bordered
      className="form-table mt-3"
      columns={getColumnOrder}
      dataSource={dataSource}
      pagination={{
        pageSize: pageSize,
        onChange: onChangePage,
        total: total,
      }}
    />
  );
}
