import { Button, Col, Image, Popover, Radio, Row, Typography } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { RevenueLineChartComponent } from "components/line-chart/line-chart.component";
import PageTitle from "components/page-title";
import RevenuePieChart from "components/revenue-pie-chart/index";
import { BranchIcon, DownIcon, TriangleIncreaseIcon, TriangleReduceIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import orderDataService from "data-services/order/order-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrencyWithSymbol, formatTextNumber, getCurrency, getStartDateEndDateInUtc } from "utils/helpers";
import iconExtrafee from "../../../assets/images/icon-extra-fee.png";
import iconReceived from "../../../assets/images/icon-received.png";
import iconShippingFee from "../../../assets/images/icon-shipping-fee.png";
import iconTotalCost from "../../../assets/images/icon-total-cost.png";
import iconTotalDiscount from "../../../assets/images/icon-total-discount.png";
import iconUnpaid from "../../../assets/images/icon-unpaid.png";

import "./revenue.page.scss";

const { Text } = Typography;

function Revenue(props) {
  const [t] = useTranslation();
  const currency = getCurrency();

  const pageData = {
    title: t("report.summary"),
    totalCost: t("reportRevenue.totalCost"),
    totalDiscount: t("reportRevenue.totalDiscount"),
    shippingFee: t("reportRevenue.shippingFee"),
    extraFee: t("reportRevenue.extraFee"),
    totalRevenue: t("reportRevenue.totalRevenue"),
    profit: t("reportRevenue.profit"),
    paid: t("reportRevenue.paid"),
    received: t("reportRevenue.received"),
    unpaid: t("reportRevenue.unpaid"),
    txt_reduce: t("dashboard.txt_reduce"),
    txt_increase: t("dashboard.txt_increase"),
    allBranch: t("dashboard.allBranch"),
    date: {
      yesterday: t("dashboard.compareDate.yesterday"),
      previousDay: t("dashboard.compareDate.previousDay"),
      lastWeek: t("dashboard.compareDate.lastWeek"),
      previousWeek: t("dashboard.compareDate.previousWeek"),
      lastMonth: t("dashboard.compareDate.lastMonth"),
      previousMonth: t("dashboard.compareDate.previousMonth"),
      lastYear: t("dashboard.compareDate.lastYear"),
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    platform: t("platform.title"),
    paymentMethod: t("payment.paymentMethod"),
    serviceType: t("reportRevenue.serviceType"),

    revenuePaymentMethod: t("reportRevenue.revenuePaymentMethod"),
    revenuePlatform: t("reportRevenue.revenuePlatform"),
    revenueServiceType: t("reportRevenue.revenueServiceType"),
  };

  const [initData, setInitData] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [visible, setVisible] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [revenueByPlatform, setRevenueByPlatform] = useState([]);
  const [revenueByPaymentMethod, setRevenueByPaymentMethod] = useState([]);
  const [revenueByServiceType, setRevenueByServiceType] = useState([]);
  const revenueChartReportRef = React.useRef(null);
  const averageRevenueChartReportRef = React.useRef(null);

  useEffect(() => {
    getInitialData(branchId, selectedDate, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchId, selectedDate, typeOptionDate);
  }, []);

  const getBranches = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      setBranches(res.branchs);
      setBranchName(pageData.allBranch);
    });
  };

  const getInitialData = (branchId, date, typeOptionDate) => {
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getDataForRevenueLineChart(branchId, date, typeOptionDate);
    getBranches();
    onConditionCompare(OptionDateTime.today);
  };

  const getOrderInfoByFilter = (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate);
    let endDate = moment(date?.endDate).add(1, "d").seconds(-1);

    // Parse local time frome client to UTC time before comparation
    var fromDate = moment.utc(startDate).format("yyyy-MM-DD HH:mm:ss");
    var toDate = moment.utc(endDate).format("yyyy-MM-DD HH:mm:ss");

    let req = {
      branchId: branchId ?? "",
      startDate: fromDate,
      endDate: toDate,
      typeOptionDate: typeOptionDate,
    };

    orderDataService.getOrderBusinessRevenueWidgetAsync(req).then((res) => {
      setInitData(res);
    });
  };

  const renderWidgetSummary = () => {
    let listSummary = [
      {
        total: formatCurrencyWithSymbol(initData?.totalCost),
        name: pageData.totalCost,
        percent: initData?.percentCost,
        icon: <Image preview={false} src={iconTotalCost} />,
      },
      {
        total: formatCurrencyWithSymbol(initData?.totalDiscount),
        name: pageData.totalDiscount,
        percent: initData?.percentDiscount,
        icon: <Image preview={false} src={iconTotalDiscount} />,
      },
      {
        total: formatCurrencyWithSymbol(initData?.totalShippingFee),
        name: pageData.shippingFee,
        percent: initData?.percentShippingFee,
        icon: <Image preview={false} src={iconShippingFee} />,
      },
      {
        total: formatCurrencyWithSymbol(initData?.totalExtraFee),
        name: pageData.extraFee,
        percent: initData?.percentExtraFee,
        icon: <Image preview={false} src={iconExtrafee} />,
      },
    ];

    const widgetSummary = listSummary?.map((item, index) => {
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = item?.percent >= 0 ? pageData.txt_increase : pageData.txt_reduce;
      const description = `${t(descriptionFormat, {
        status: status,
        value: item?.percent,
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} xs={24} sm={24} md={6} lg={6} className="report-widget-summary">
          <div className="group-information-summary">
            <div className="summary-icon">{item.icon}</div>
            <div className="summary-name">{item.name}</div>
            <div className="summary-compare">
              {item?.percent >= 0 ? (
                <>
                  <TriangleIncreaseIcon className="icon-increase-triangle" />
                  {description}
                </>
              ) : (
                <>
                  <TriangleReduceIcon className="icon-increase-triangle" />
                  {description}
                </>
              )}
            </div>
            <div className="summary-total">
              {item?.total} {currency}
            </div>
          </div>
        </Col>
      );
    });

    return <>{widgetSummary}</>;
  };

  const renderWidgetRevenue = () => {
    let listRevenue = [
      {
        total: formatTextNumber(initData?.totalRevenue),
        name: pageData.totalRevenue,
        percent: initData?.percentRevenue,
        paid: formatTextNumber(initData?.totalRevenuePaid),
        unpaid: formatTextNumber(initData?.totalRevenueUnpaid),
        iconReceived: <Image preview={false} src={iconReceived} />,
        iconUnpaid: <Image preview={false} src={iconUnpaid} />,
      },
      {
        total: formatTextNumber(initData?.totalProfit),
        name: pageData.profit,
        percent: initData?.percentProfit,
        paid: formatTextNumber(initData?.totalProfitPaid),
        unpaid: formatTextNumber(initData?.totalProfitUnpaid),
        iconReceived: <Image preview={false} src={iconReceived} />,
        iconUnpaid: <Image preview={false} src={iconUnpaid} />,
      },
    ];

    const widgetRevenue = listRevenue?.map((item, index) => {
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = item?.percent >= 0 ? pageData.txt_increase : pageData.txt_reduce;
      const description = `${t(descriptionFormat, {
        status: status,
        value: item?.percent,
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} xs={0} sm={0} md={0} lg={12} className="report-widget-revenue">
          <div className="group-information-revenue">
            <div className="revenue-left-col">
              <div className="revenue-left-header">
                <span className="revenue-name">{item?.name}</span>
                <span className="revenue-total">
                  {item?.total} {currency}
                </span>
              </div>
              <div className="revenue-left-footer-col">
                <div className="revenue-received-icon">{item?.iconReceived}</div>
                <div className="revenue-received-info">
                  <span className="revenue-received-name">{pageData.received}</span>
                  <span className="revenue-received-total">
                    {item?.paid} {currency}
                  </span>
                </div>
              </div>
            </div>
            <div className="revenue-right-col">
              <div className="revenue-compare">
                {item?.percent >= 0 ? (
                  <>
                    <TriangleIncreaseIcon className="icon-increase-triangle" />
                    {description}
                  </>
                ) : (
                  <>
                    <TriangleReduceIcon className="icon-increase-triangle" />
                    {description}
                  </>
                )}
              </div>
              <div className="revenue-right-footer-col">
                <div className="revenue-received-icon">{item?.iconUnpaid}</div>
                <div className="revenue-received-info">
                  <span className="revenue-received-name">{pageData.unpaid}</span>
                  <span className="revenue-received-total">
                    {item?.unpaid} {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });

    return <>{widgetRevenue}</>;
  };

  const handleChangeBranch = (e) => {
    let branchIdSelected = e?.target?.value;
    if (branchIdSelected !== null) {
      setBranchId(branchIdSelected);
      let branchInfo = branches.find((b) => b.id === branchIdSelected);
      setBranchName(branchInfo?.name);
    } else {
      branchIdSelected = "";
      setBranchId(null);
      setBranchName(pageData.allBranch);
    }
    getOrderInfoByFilter(branchIdSelected, selectedDate, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchIdSelected, selectedDate, typeOptionDate);
    setVisible(false);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getOrderRevenuePieChartByFilter(branchId, date, typeOptionDate);
    getDataForRevenueLineChart(branchId, date, typeOptionDate);
  };

  const onConditionCompare = (key) => {
    switch (key) {
      case OptionDateTime.today:
        setTitleConditionCompare(pageData.date.yesterday);
        break;
      case OptionDateTime.yesterday:
        setTitleConditionCompare(pageData.date.previousDay);
        break;
      case OptionDateTime.thisWeek:
        setTitleConditionCompare(pageData.date.lastWeek);
        break;
      case OptionDateTime.lastWeek:
        setTitleConditionCompare(pageData.date.previousWeek);
        break;
      case OptionDateTime.thisMonth:
        setTitleConditionCompare(pageData.date.lastMonth);
        break;
      case OptionDateTime.lastMonth:
        setTitleConditionCompare(pageData.date.previousMonth);
        break;
      case OptionDateTime.thisYear:
        setTitleConditionCompare(pageData.date.lastYear);
        break;
      default:
        setTitleConditionCompare(pageData.date.previousSession);
        break;
    }
  };

  const listBranch = (
    <>
      <Row className="branch-content">
        <Col span={24}>
          <Radio.Group onChange={(e) => handleChangeBranch(e)} className="group-branch">
            <Row>
              <Col span={24}>
                <Radio.Button key={null} value={null} className="branch-option">
                  {pageData.allBranch}
                </Radio.Button>
              </Col>
            </Row>
            {branches?.map((item, index) => {
              return (
                <Row key={index}>
                  <Col span={24}>
                    <Radio.Button key={item?.id} value={item?.id} className="branch-option">
                      {item?.name}
                    </Radio.Button>
                  </Col>
                </Row>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>
    </>
  );

  /* Revenue by Pie Chart */
  const getOrderRevenuePieChartByFilter = (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
    };
    orderDataService.getRevenueByTypeAsync(req).then((res) => {
      if (res) {
        setRevenueByPlatform(res.revenueByPlatforms);
        setRevenueByPaymentMethod(res.revenueByPaymentMethods);
        setRevenueByServiceType(res.revenueByServiceTypes);
      }
    });
  };

  const getDataForRevenueLineChart = (branchId, selectedDateTime, typeOptionDate) => {
    let dateTimeFormatInUtc = getStartDateEndDateInUtc(selectedDateTime?.startDate, selectedDateTime?.endDate);

    let req = {
      branchId: branchId ?? "",
      startDate: dateTimeFormatInUtc?.fromDate,
      endDate: dateTimeFormatInUtc?.toDate,
      segmentTimeOption: typeOptionDate,
    };
    orderDataService.calculateStatisticalDataAsync(req).then((res) => {
      if (res) {
        if (revenueChartReportRef && revenueChartReportRef.current) {
          revenueChartReportRef.current.fillData(selectedDateTime, typeOptionDate, res);
        }
        setTimeout(() => {
          if (averageRevenueChartReportRef && averageRevenueChartReportRef.current) {
            averageRevenueChartReportRef.current.fillData(selectedDateTime, typeOptionDate, res, true);
          }
        }, 1000);
      }
    });
  };

  const getDataPlatformForPieChart = () => {
    const platformColor = ["#50429B", "#6C5ACA"];
    return revenueByPlatform?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalOrder,
        color: platformColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const getDataPaymentMethodForPieChart = () => {
    const paymentMethodColor = [
      "#FF8C21",
      "#FFAD62",
      "#F3D2B3",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(175, 292, 92, 0.2)",
      "rgba(253, 102, 255, 0.2)",
    ];
    return revenueByPaymentMethod?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalOrder,
        color: paymentMethodColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const getDataServiceTypeForPieChart = () => {
    const serviceTypeColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(155, 216, 76, 0.2)",
    ];
    return revenueByServiceType?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalOrder,
        color: serviceTypeColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  return (
    <>
      <Row className="fnb-form-title" gutter={[0, 29]}>
        <Col span={24}>
          <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
            <Col xs={24} sm={24} md={24} lg={8}>
              <PageTitle className="mb-0 title-dashboard" content={pageData.title} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} className="fnb-form-btn-popover">
              <Row className="fnb-row-top" gutter={[24, 24]} justify="end">
                <Popover
                  placement="bottom"
                  overlayClassName="dashboard-branch"
                  content={listBranch}
                  trigger="click"
                  visible={visible}
                  onVisibleChange={(isClick) => setVisible(isClick)}
                  className="branch-popover"
                >
                  <Button className="btn-branch">
                    <Row>
                      <Col span={22} className="div-branch-name">
                        <div className="icon-branch">
                          <BranchIcon />
                        </div>
                        <Text className="branch-name">{t(branchName)}</Text>
                      </Col>
                      <Col span={2} className="div-icon-down">
                        <DownIcon />
                      </Col>
                    </Row>
                  </Button>
                </Popover>
                <FnbDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
                  setConditionCompare={onConditionCompare}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>{renderWidgetSummary()}</Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>{renderWidgetRevenue()}</Row>
        </Col>
      </Row>

      <Row gutter={[16, 30]}>
        <Col span={24} style={{ marginTop: 30 }}>
          <RevenueLineChartComponent ref={revenueChartReportRef} />
        </Col>
        <Col span={24}>
          <RevenueLineChartComponent chartTitle={t("chartAverageRevenue.title")} ref={averageRevenueChartReportRef} />
        </Col>
      </Row>

      <div className="c-revenue-pie-chart">
        {/* revenueByPlatform */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              dataSourceRevenue={revenueByPlatform}
              getDataForPieChart={getDataPlatformForPieChart()}
              titleBack={pageData.platform.toUpperCase()}
              chartName={pageData.revenuePlatform}
            />
          </div>
        </div>

        {/* revenueByPaymentMethod */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              dataSourceRevenue={revenueByPaymentMethod}
              getDataForPieChart={getDataPaymentMethodForPieChart()}
              titleBack={pageData.paymentMethod.toUpperCase()}
              chartName={pageData.revenuePaymentMethod}
            />
          </div>
        </div>

        {/* revenueByServiceType */}
        <div className="rpc-element">
          <div className="rpc-element-wrapper">
            <RevenuePieChart
              dataSourceRevenue={revenueByServiceType}
              getDataForPieChart={getDataServiceTypeForPieChart()}
              titleBack={pageData.serviceType.toUpperCase()}
              chartName={pageData.revenueServiceType}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Revenue;
