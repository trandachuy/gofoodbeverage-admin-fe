import { Table, } from "antd";
import React, { useEffect, useState } from "react";
import customerDataService from "data-services/customer/customer-data.service";

export default function TableMembershipLevelByAccumulatedPointComponent(props) {
  const { t, membershipAccumulatedPoint } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [accumulatedPoint, setAccumulatedPoint] = useState(0);
  const pageData = {
    title: t("membership.title"),
    accumulatedPoint: t("membership.accumulatedPoint"),
    discount: t("membership.discount"),
    member: t("membership.member"),
    no: t("membership.no"),
    action: t("membership.action"),
    name: t("membership.Name"),
    phone: t("membership.Phone"),
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 10,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
      },
      {
        title: pageData.name,
        dataIndex: "name",
      },
      {
        title: pageData.accumulatedPoint,
        dataIndex: "accumulatedPoint",
      },
      {
        title: pageData.phone,
        dataIndex: "phoneNumber",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, accumulatedPoint);
    },
  };

  useEffect(() => {
    props.tableFuncs.current = onRefreshTable;
    onRefreshTable(membershipAccumulatedPoint);
  }, []);

  const onRefreshTable = async (accumulatedPoint) => {
    setAccumulatedPoint(accumulatedPoint);
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, accumulatedPoint);
  };

  const fetchDatableAsync = async (page, pageSize, accumulatedPoint) => {
    let responseData = await customerDataService.getCustomerByAccumulatedPointAsync(
      page,
      pageSize,
      accumulatedPoint
    );

    if (responseData) {
      const { customers, total, pageNumber } = responseData;
      const records = customers?.map(item => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = item => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.fullName ?? "N/A",
      accumulatedPoint: item?.accumulatedPoint,
      phoneNumber: item?.phoneNumber,
    };
  };

  return (
    <>
      <Table
        columns={tableSettings.columns}
        dataSource={dataSource}
        pagination={{
          current: currentPageNumber,
          pageSize: tableSettings.pageSize,
          total: totalRecords,
          onChange: tableSettings.onChangePage,
        }}
      />
    </>
  );
}
