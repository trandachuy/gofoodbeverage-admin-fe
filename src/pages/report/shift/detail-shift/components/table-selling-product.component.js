import React from "react";
import { Table, Space } from "antd";

export default function TableSellingProduct(props) {
  const { t, dataSource, pageSize, onChangePage, total, totalQuantity } = props;

  const pageData = {
    no: t("table.no"),
    product: t("report.shiftDetail.sellingProduct.product"),
    quantity: t("report.shiftDetail.sellingProduct.quantity"),
    total: t("report.shiftDetail.sellingProduct.total"),
  };

  const getColumnSellingProduct = [
    {
      title: pageData.no,
      dataIndex: "no",
      key: "no",
      width: "10%",
    },
    {
      title: pageData.product,
      dataIndex: "productName",
      key: "productName",
      width: "20%",
    },
    {
      title: pageData.quantity,
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
    },
  ];

  return (
    <>
      <Table
        bordered
        className="form-table mt-3"
        columns={getColumnSellingProduct}
        dataSource={dataSource}
        pagination={{
          pageSize: pageSize,
          onChange: onChangePage,
          total: total,
        }}
      />
      <hr />
      <Space className="float-left">
        <div>
          <h3>{pageData.total}</h3>
        </div>
      </Space>
      <Space className="float-right">
        <div>
          <h3>{totalQuantity}</h3>
        </div>
      </Space>
    </>
  );
}
