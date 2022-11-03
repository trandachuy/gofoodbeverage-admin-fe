import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { FnbTable } from "components/fnb-table/fnb-table";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { BackToPieChartIcon } from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatTextNumber, getCurrency } from "utils/helpers";
import "./index.scss";

export default function RevenuePieChart(props) {
  const { dataSourceRevenue, getDataForPieChart, titleBack, chartName } = props;
  const [t] = useTranslation();

  const [isChart, setIsChart] = useState(true);
  const [sumTotalOrder, setSumTotalOrder] = useState();
  const [sumTotalAmount, setSumTotalAmount] = useState();

  useEffect(() => {
    convertRevenueObjectToArray(dataSourceRevenue);
  }, [dataSourceRevenue]);

  const convertRevenueObjectToArray = (revenueList) => {
    let totalOrder = 0;
    let totalAmount = 0;
    revenueList?.map((item) => {
      if (item.name) {
        totalOrder += item?.totalOrder;
        totalAmount += item?.totalAmount;
      }
    });
    setSumTotalOrder(totalOrder);
    setSumTotalAmount(totalAmount);
  };

  const pageData = {
    totalOrder: t("order.totalOrder"),
    totalAmount: t("order.totalAmount"),
    detail: t("table.detail"),
    back: t("form.button.back"),
    total: t("table.total"),
    revenue: t("order.revenue"),
  };

  const tableSettings = {
    columns: [
      {
        title: titleBack,
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "40%",
      },
      {
        title: pageData.totalOrder,
        dataIndex: "totalOrder",
        key: "totalOrder",
        align: "right",
        width: "20%",
      },
      {
        title: pageData.totalAmount,
        dataIndex: "totalAmount",
        key: "totalAmount",
        align: "right",
        width: "40%",
        render: (value) => {
          return formatCurrency(value);
        },
      },
    ],
  };

  function renderRevenueOrderPieChartDescription(pieChartDes) {
    const colorDescriptions = pieChartDes?.map((item) => {
      return (
        <div className="pie-chart-report-legend">
          <div className="legend-name">
            <div className="icon-text">
              <div className="marker" style={{ backgroundColor: item?.color }}></div>
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
    <div className="revenue-order-chart">
      <div className="revenue-order-chart-wrapper" style={{ display: !isChart ? "none" : "flex" }}>
        <>
          <div className="header-chart-detail">
            <span className="pie-chart-title">{chartName}</span>
            <span className="pie-chart-title-detail" onClick={() => setIsChart(!isChart)}>
              {pageData.detail}
            </span>
          </div>
          {sumTotalOrder > 0 ? (
            <div className="pie-chart-content">
              <FnbPieChart
                className="order-report-pie-chart"
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
                          label: `${formatTextNumber(sumTotalAmount)} ${getCurrency()}`,
                          fontSize: "20px",
                          fontWeight: "800",
                          lineHeight: "25px",
                          color: "#50429B",
                          formatter: (w) => {
                            return pageData.revenue;
                          },
                        },
                      },
                    },
                  },
                }}
                title={pageData.revenue}
                dataSource={getDataForPieChart}
              />
              <div className="revenue-chart-description">
                {renderRevenueOrderPieChartDescription(getDataForPieChart)}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <NoDataFoundComponent />
            </div>
          )}
        </>
      </div>
      <div className="revenue-order-chart-wrapper" style={{ display: isChart ? "none" : "flex" }}>
        <div className="header-chart-detail">
          <span className="back-to-icon" onClick={() => setIsChart(!isChart)}>
            <BackToPieChartIcon />
          </span>
          <span>{chartName}</span>
        </div>
        {sumTotalOrder > 0 ? (
          <div className="table-chart-detail">
            <FnbTable columns={tableSettings.columns} dataSource={dataSourceRevenue} className="table-revenue" />
            <hr />
            <table>
              <tr>
                <td width={"40%"}>{pageData.total}</td>
                <td width={"20%"}>{sumTotalOrder}</td>
                <td width={"40%"} className="text-right">
                  {formatCurrency(sumTotalAmount)}
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
