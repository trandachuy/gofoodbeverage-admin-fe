import { Col, Row } from "antd";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { FnbTable } from "components/fnb-table/fnb-table";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { BackToPieChartIcon, TriangleIncreaseIcon, TriangleReduceIcon } from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTextNumber } from "utils/helpers";
import "./customer-by-platform-pie-chart.component.scss";

export default function CustomerPlatformPieChartComponent({ dataReportOrderList }) {
  const [t] = useTranslation();
  const [isChart, setIsChart] = useState(true);
  const [sumTotalCustomer, setSumTotalCustomer] = useState();
  const [columnCustomerReportTable, setColumnCustomerReportTable] = useState([]);
  const [dataReport, setDataReport] = useState();

  const pageData = {
    totalOrder: t("order.totalOrder"),
    totalAmount: t("order.totalAmount"),
    detail: t("table.detail"),
    back: t("form.button.back"),
    total: t("table.total"),
    revenue: t("order.revenue"),
    chartName: t("report.customer.chartName"),
    platform: t("platform.title"),
    percentColumn: t("report.customer.percent"),
    customerNumberColumn: t("report.customer.customerNumber"),
    titleChart: t("report.customer.titleChart"),
  };

  const colorList = ["#50429B", "#6C5ACA", "#8973FF", "#AA9AFF", "#CDC6FF"];

  useEffect(() => {
    initialDataReport();
    getColumnCustomerPlatformTable();
  }, [dataReportOrderList]);

  const initialDataReport = () => {
    let totalCustomer = 0;
    let dataReportOrderListMapping = dataReportOrderList?.map((data, index) => {
      totalCustomer += data?.totalCustomer;
      let indexCopy = index;
      if (index > colorList.length) {
        indexCopy = colorList.length;
      }
      return {
        ...data,
        color: colorList[indexCopy],
        label: data?.platformName,
        value: data?.totalCustomer,
      };
    });
    setSumTotalCustomer(totalCustomer);
    setDataReport(dataReportOrderListMapping);
  };

  const getColumnCustomerPlatformTable = () => {
    const columns = [
      {
        title: pageData.platform.toLowerCase(),
        dataIndex: "platformName",
        key: "platformName",
        align: "left",
        width: "40%",
      },
      {
        title: pageData.percentColumn,
        dataIndex: "percentageChangeFromThePreviousSession",
        key: "percentageChangeFromThePreviousSession",
        align: "right",
        width: "20%",
        render: (value, record) => {
          if (record?.isDecreaseFromThePreviousSession) {
            return (
              <>
                <TriangleReduceIcon />
                &nbsp; &nbsp;{value}%
              </>
            );
          } else {
            return (
              <>
                <TriangleIncreaseIcon />
                &nbsp; &nbsp;{value}%
              </>
            );
          }
        },
      },
      {
        title: pageData.customerNumberColumn,
        dataIndex: "totalCustomer",
        key: "totalCustomer",
        align: "right",
        width: "40%",
      },
    ];
    setColumnCustomerReportTable(columns);
  };

  function renderCustomerReportPieChartDescription(pieChartDes) {
    const colorDescriptions = pieChartDes?.map((item, index) => {
      return (
        <div className={`content-chart-information ${index > 0 && "padding-top"}`} key={index}>
          <div className="plat-form-name">
            <div className="dot-platform" style={{ backgroundColor: item?.color }}></div>
            <div className="dot-platform-name">{item?.label}</div>
          </div>
          <div className="total-customer-value">{item?.totalCustomer}</div>
          <div className="percent-value">
            {item?.isDecreaseFromThePreviousSession ? (
              <>
                <TriangleReduceIcon />
                &nbsp; &nbsp;{item?.percentageChangeFromThePreviousSession}%
              </>
            ) : (
              <>
                <TriangleIncreaseIcon />
                &nbsp; &nbsp;{item?.percentageChangeFromThePreviousSession}%
              </>
            )}
          </div>
        </div>
      );
    });
    return <>{colorDescriptions}</>;
  }

  return (
    <div className="revenue-order-chart">
      <div className="revenue-order-chart-wrapper" style={{ display: !isChart ? "none" : "flex" }}>
        <div className="header-chart-detail">
          <span className="pie-chart-title">{pageData.chartName}</span>
          <span className="pie-chart-title-detail" onClick={() => setIsChart(!isChart)}>
            {pageData.detail}
          </span>
        </div>
        {sumTotalCustomer > 0 ? (
          <Row className="height-100">
            <Col xs={24} sm={24} md={13} className="height-100 display-center">
              <FnbPieChart
                className="customer-report-pie-chart"
                plotOptions={{
                  pie: {
                    customScale: 1,
                    offsetX: 0,
                    offsetY: 0,
                    donut: {
                      size: "70%",
                      labels: {
                        show: true,
                        name: {},
                        value: {
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "#A5ABDE",
                        },
                        total: {
                          show: true,
                          showAlways: true,
                          label: `${formatTextNumber(sumTotalCustomer)}`,
                          fontSize: "20px",
                          fontWeight: "800",
                          lineHeight: "25px",
                          color: "#50429B",
                          formatter: (w) => {
                            return pageData.titleChart;
                          },
                        },
                      },
                    },
                  },
                }}
                title={pageData.revenue}
                dataSource={dataReport}
              />
            </Col>
            <Col xs={24} sm={24} md={10} className="height-100 display-center">
              <div className="information-customer-report">{renderCustomerReportPieChartDescription(dataReport)}</div>
            </Col>
          </Row>
        ) : (
          <div className="no-data">
            <NoDataFoundComponent />
          </div>
        )}
      </div>
      <div className="revenue-order-chart-wrapper" style={{ display: isChart ? "none" : "flex" }}>
        <div className="header-chart-detail">
          <span className="back-to-icon" onClick={() => setIsChart(!isChart)}>
            <BackToPieChartIcon />
          </span>
          <span>{pageData.chartName}</span>
        </div>
        {sumTotalCustomer > 0 ? (
          <div className="table-chart-detail">
            <FnbTable columns={columnCustomerReportTable} dataSource={dataReportOrderList} className="table-revenue" />
          </div>
        ) : (
          <div className="no-data">
            <NoDataFoundComponent />
          </div>
        )}
      </div>
    </div>
  );
}
