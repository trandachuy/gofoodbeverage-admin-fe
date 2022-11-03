import React, { useEffect, useState } from "react";
import { Row, Card, Typography, Form } from "antd";
import { DateFormat } from "constants/string.constants";
import { executeAfter } from "utils/helpers";
import { formatDate, formatCurrencyWithoutSymbol, getCurrency } from "../../../../utils/helpers";
import { Link } from "react-router-dom";
import { FnbTable } from "components/fnb-table/fnb-table";
import { useTranslation } from "react-i18next";
import Paragraph from "antd/lib/typography/Paragraph";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import "./index.scss";

const { Text } = Typography;

export default function TablePurchaseOrderComponent(props) {
  const [t] = useTranslation();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [showPaging, setShowPaging] = useState(false);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();

  const pageData = {
    btnFilter: t("button.filter"),
    table: {
      searchPlaceholder: t("purchaseOrder.searchBySupplierName"),
      code: t("table.code"),
      supplier: t("supplier.title"),
      branch: t("purchaseOrder.branch"),
      amount: t("purchaseOrder.amount"),
      status: t("table.status"),
      createdBy: t("table.createdBy"),
      createdDate: t("purchaseOrder.createdDate"),
    },
    today: t("optionDatetime.today"),
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.code,
        dataIndex: "id",
        key: "index",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return <Link to={`/inventory/detail-purchase-order/${record?.id}`}>{record?.code}</Link>;
        },
      },
      {
        title: pageData.table.supplier,
        dataIndex: "supplier",
        key: "index",
        width: "30%",
        className: "table-text-supplier-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: record?.supplier }} color="#50429B">
                <span>{record?.supplier}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: pageData.table.branch,
        dataIndex: "branch",
        key: "index",
        width: "10%",
        className: "table-text-branch-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: record?.branch }} color="#50429B">
                <span>{record?.branch}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: `${pageData.table.amount} (${getCurrency()})`,
        dataIndex: "amount",
        key: "index",
        align: "right",
        render: (_, record) => {
          return <Text>{formatCurrencyWithoutSymbol(record.amount)}</Text>;
        },
      },
      {
        title: pageData.table.status,
        dataIndex: "status",
        key: "index",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return (
            <div className="status" style={{ backgroundColor: record.status.backGroundColor, color: record.status.color }}>
              {t(record.status.name)}
            </div>
          );
        },
      },
      {
        title: pageData.table.createdBy,
        dataIndex: "createdBy",
        key: "index",
        width: "10%",
        className: "table-text-createdBy-overflow",
        render: (_, record) => {
          return (
            <>
              <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: record?.createdBy }} color="#50429B">
                <span>{record?.createdBy}</span>
              </Paragraph>
            </>
          );
        },
      },
      {
        title: pageData.table.createdDate,
        dataIndex: "createdDate",
        key: "index",
        width: "10%",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await purchaseOrderDataService.getAllPurchaseOrderAsync(pageNumber, pageSize, keySearch);
    const data = response?.purchaseOrders.map((s) => mappingRecordToColumns(s));
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    setDataSource(data);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
    setNumberRecordCurrent(numberRecordCurrent);

    if (response.total <= 20) {
      setShowPaging(false);
    } else {
      setShowPaging(true);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      id: item?.id,
      code: item?.code,
      supplier: item?.supplier?.name,
      branch: item?.storeBranch?.name,
      amount: calculateTotalOfMaterialPrice(item?.purchaseOrderMaterials),
      status: item?.status,
      createdDate: formatDate(item?.createdTime, DateFormat.DD_MM_YYYY_DASH),
      createdBy: item?.createdBy,
    };
  };

  /**
   * Calculate the total of material price
   * @param {*} orderMaterial
   * @returns total price
   */
  const calculateTotalOfMaterialPrice = (orderMaterial) => {
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item?.total;
    });
    return total;
  };

  const getTableColumns = () => {
    return tableSettings.columns;
  };

  return (
    <>
      <Form className="form-staff">
        <Card className="fnb-card-full">
          <Row className="form-staff">
            <FnbTable
              className="mt-4 table-striped-rows"
              dataSource={dataSource}
              columns={getTableColumns()}
              pageSize={tableSettings.pageSize}
              pageNumber={currentPageNumber}
              total={totalRecords}
              onChangePage={tableSettings.onChangePage}
              numberRecordCurrent={numberRecordCurrent}
              search={{
                placeholder: pageData.table.searchPlaceholder,
                onChange: tableSettings.onSearch,
              }}
              filter={{
                onClickFilterButton: () => {},
                buttonTitle: pageData.btnFilter,
              }}
              calendarFilter={{ buttonTitle: pageData.today, onClick: () => {} }}
            />
          </Row>
        </Card>
      </Form>
    </>
  );
}
