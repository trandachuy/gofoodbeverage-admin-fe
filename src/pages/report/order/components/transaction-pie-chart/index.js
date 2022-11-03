import { FnbTable } from "components/fnb-table/fnb-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "utils/helpers";
import { BackToPieChartIcon } from "constants/icons.constants";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import "./index.scss";

export default function TransactionPieChart(props) {
  const { dataSourceRevenue, getDataForPieChart, titleBack, chartName } = props;
  const [t] = useTranslation();

  const [isChart, setIsChart] = useState(true);

  const pageData = {
    totalOrder: t("order.totalOrder"),
    totalAmount: t("order.totalAmount"),
    detail: t("table.detail"),
    back: t("form.button.back"),
    total: t("table.total"),
    orders: t("order.orders"),
  };

  const tableSettings = {
    columns: [
      {
        title: titleBack,
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "50%",
      },
      {
        title: pageData.totalOrder,
        dataIndex: "totalOrder",
        key: "totalOrder",
        align: "right",
        width: "50%",
      },
    ],
  };

  function renderTransactionOrderPieChartDescription(pieChartDes) {
    const colorDescriptions = pieChartDes?.map((item) => {
      return (
        <div className="pie-chart-report-legend">
          <div className="legend-name">
            <div className="icon-text">
              <div
                className="marker"
                style={{ backgroundColor: item?.color }}
              ></div>
              <span className="legend-label">{item?.label}</span>
            </div>

            <span>{formatCurrency(item?.totalAmount)}</span>
          </div>
        </div>
      );
    });
    return <div>{colorDescriptions}</div>;
  }

  return (
    <div className="transaction-order-chart">
      <div
        className="transaction-order-chart-wrapper"
        style={{ display: !isChart ? "none" : "flex" }}
      >
        <>
          <div className="header-chart-detail">
            <span className="pie-chart-title">{chartName}</span>
            <span
              className="pie-chart-title-detail"
              onClick={() => setIsChart(!isChart)}
            >
              {pageData.detail}
            </span>
          </div>
          {dataSourceRevenue?.reduce((sumOrder, obj) => {
            return sumOrder + obj.totalOrder;
          }, 0) > 0 ? (
            <>
              <FnbPieChart
                className="order-report-pie-chart"
                plotOptions={{
                  pie: {
                    customScale: 0.7,
                    offsetX: 0,
                    offsetY: -40,
                    donut: {
                      size: "60%",
                      labels: {
                        show: true,
                        name: {},
                        value: {
                          fontSize: "28px",
                          fontWeight: "500",
                          color: "#A5ABDE",
                        },
                        total: {
                          show: true,
                          showAlways: true,
                          label: getDataForPieChart?.reduce((sumOrder, obj) => {
                            return sumOrder + obj.value;
                          }, 0),
                          fontSize: "42px",
                          fontWeight: "800",
                          lineHeight: "40px",
                          color: "#50429B",
                          formatter: (w) => {
                            return pageData.orders;
                          },
                        },
                      },
                    },
                  },
                }}
                title={pageData.orders}
                dataSource={getDataForPieChart}
              />
              <div className="transaction-chart-description">
                {renderTransactionOrderPieChartDescription(getDataForPieChart)}
              </div>
            </>
          ) : (
            <div className="no-data">
              <NoDataFoundComponent />
            </div>
          )}
        </>
      </div>
      <div
        className="transaction-order-chart-wrapper"
        style={{ display: isChart ? "none" : "flex" }}
      >
        <div className="header-chart-detail">
          <span className="back-to-icon" onClick={() => setIsChart(!isChart)}>
            <BackToPieChartIcon />
          </span>
          <span>{chartName}</span>
        </div>
        {dataSourceRevenue?.reduce((sumOrder, obj) => {
          return sumOrder + obj.totalOrder;
        }, 0) > 0 ? (
          <div className="table-chart-detail">
            <FnbTable
              columns={tableSettings.columns}
              dataSource={dataSourceRevenue}
              className="table-revenue"
            />
            <hr />
            <table>
              <tr>
                <td width={"50%"}>{pageData.total}</td>
                <td width={"50%"}>
                  {dataSourceRevenue?.reduce((sumOrder, obj) => {
                    return sumOrder + obj.totalOrder;
                  }, 0)}
                </td>
              </tr>
            </table>
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
