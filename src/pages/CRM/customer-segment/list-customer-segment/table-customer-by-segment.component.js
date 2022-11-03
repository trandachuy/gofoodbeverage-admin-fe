import React, { useEffect, useState } from "react";
import { executeAfter, formatNumber, hasPermission } from "utils/helpers";
import { useTranslation } from "react-i18next";
import customerDataService from "data-services/customer/customer-data.service";
import { FnbTable } from "components/fnb-table/fnb-table";
import Paragraph from "antd/lib/typography/Paragraph";
import { Link } from "react-router-dom";
import { PermissionKeys } from "constants/permission-key.constants";

export default function TableCustomerBySegmentComponent(props) {
  const [t] = useTranslation();
  const { segment } = props;
  const [segmentId, setSegmentId] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const pageData = {
    addNew: t("button.addNew"),
    table: {
      searchPlaceholder: t("customer.searchbyNamePhone"),
      no: t("customer.no"),
      name: t("customer.name"),
      phone: t("customer.phone"),
    },
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 10,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "index",
        key: "index",
        width: "105px",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        key: "name",
        width: "300px",
        render: (_, record) => (
          <div className="text-name-overflow">
            <Paragraph
              style={{ maxWidth: "inherit" }}
              placement="top"
              ellipsis={{ tooltip: record?.name }}
              color="#50429B"
            >
              {hasPermission(PermissionKeys.VIEW_CUSTOMER) ? (
                <Link to={`/customer/detail/${record?.id}`}>
                  <span className="text-name">{record?.name}</span>
                </Link>
              ) : (
                <span>{record?.name}</span>
              )}
            </Paragraph>
          </div>
        ),
      },
      {
        title: pageData.table.phone,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "195px",
      },
      {
        title: "rank",
        dataIndex: "rank",
        key: "rank",
        width: "180px",
        render: (_, record) => <span>{record?.rank}</span>,
      },
      {
        title: "point",
        dataIndex: "point",
        key: "point",
        width: "155px",
        render: (_, record) => <span>{record?.point}</span>,
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, "", segmentId);
    },
    onSearch: async (e) => {
      const keySearch = e.target.value;
      executeAfter(500, async () => {
        await fetchDataTableAsync(1, tableSettings.pageSize, keySearch, segmentId);
      });
    },
  };

  useEffect(() => {
    props.tableFuncs.current = onInitCustomerData;
    onInitCustomerData();
  }, []);

  const onInitCustomerData = async (data) => {
    setSegmentId(data ? data.id : segment.id);
    fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, "", data ? data.id : segment.id);
  };

  const fetchDataTableAsync = async (pageNumber, pageSize, keySearch, segmentId) => {
    let responseData = await customerDataService.GetCustomersBySegmentAsync(pageNumber, pageSize, keySearch, segmentId);
    if (responseData) {
      const { customers, total, pageNumber } = responseData;
      const records = customers?.map((item) => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.fullName,
      phoneNumber: item?.phoneNumber ?? "-",
      rank: item?.rank ?? "-",
      point: item?.point ? formatNumber(item?.point) : "-",
    };
  };

  return (
    <FnbTable
      className="table-customer-by-segment"
      columns={tableSettings.columns}
      dataSource={dataSource}
      onChangePage={tableSettings.onChangePage}
      pageSize={tableSettings.pageSize}
      currentPageNumber={currentPageNumber}
      total={totalRecords}
      scrollY={96 * 5}
    />
  );
}
