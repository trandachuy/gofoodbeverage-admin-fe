import { Col, Row } from "antd";
import { CustomerReportWidgetIcon, TriangleIncreaseIcon, TriangleReduceIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import customerDataService from "data-services/customer/customer-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatCurrencyWithoutSymbol } from "utils/helpers";
import CustomerPlatformPieChartComponent from "./customer-by-platform-pie-chart.component";
import FnbLineChartComponent from "components/fnb-line-chart";

export default function OverviewComponent(props) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { selectedDates, branchId, segmentTimeOption } = props;
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [t] = useTranslation();

  const pageData = {
    titleWidget: t("report.customer.titleWidget"),
    totalOrder: t("report.customer.totalOrder"),
    revenueByCustomer: t("report.customer.revenueByCustomer"),
    average: t("report.customer.average"),
    decrease: t("report.customer.decrease"),
    increase: t("report.customer.increase"),
    optionDatetime: {
      today: t("optionDatetime.today"),
      yesterday: t("optionDatetime.yesterday"),
      thisWeek: t("optionDatetime.thisWeek"),
      lastWeek: t("optionDatetime.lastWeek"),
      thisMonth: t("optionDatetime.thisMonth"),
      lastMonth: t("optionDatetime.lastMonth"),
      thisYear: t("optionDatetime.thisYear"),
      customize: t("optionDatetime.customize"),
      lastYear: t("optionDatetime.lastYear"),
      theDayBeforeYesterday: t("optionDatetime.theDayBeforeYesterday"),
      theWeekBeforeLast: t("optionDatetime.theWeekBeforeLast"),
      theMonthBeforeLast: t("optionDatetime.theMonthBeforeLast"),
    },
    title: t("report.customer.chartCustomer.title"),
    leftAxis: t("report.customer.chartCustomer.leftAxis"),
    rightAxis: t("report.customer.chartCustomer.rightAxis"),
    monday: t("report.customer.chartCustomer.weekdays.monday"),
    tuesday: t("report.customer.chartCustomer.weekdays.tuesday"),
    wednesday: t("report.customer.chartCustomer.weekdays.wednesday"),
    thursday: t("report.customer.chartCustomer.weekdays.thursday"),
    friday: t("report.customer.chartCustomer.weekdays.friday"),
    saturday: t("report.customer.chartCustomer.weekdays.saturday"),
    sunday: t("report.customer.chartCustomer.weekdays.sunday"),
    january: t("report.customer.chartCustomer.months.january"),
    february: t("report.customer.chartCustomer.months.february"),
    march: t("report.customer.chartCustomer.months.march"),
    april: t("report.customer.chartCustomer.months.april"),
    may: t("report.customer.chartCustomer.months.may"),
    june: t("report.customer.chartCustomer.months.june"),
    july: t("report.customer.chartCustomer.months.july"),
    august: t("report.customer.chartCustomer.months.august"),
    september: t("report.customer.chartCustomer.months.september"),
    october: t("report.customer.chartCustomer.months.october"),
    november: t("report.customer.chartCustomer.months.november"),
    december: t("report.customer.chartCustomer.months.december"),
  };

  const [dataCustomerReport, setDataCustomerReport] = useState();
  const [platformStatistical, setPlatformStatistical] = useState([]);
  const [periodForStatusWidget, setPeriodForStatusWidget] = useState();

  useEffect(() => {
    getCustomerReportData();
    getPeriodForStatusWidget();
    fetchCustomerGrowthData();
  }, [segmentTimeOption, branchId, selectedDates]);

  const getCustomerReportData = async () => {
    let startDate = moment(selectedDates?.startDate);
    let endDate = moment(selectedDates?.endDate).add(1, "d").seconds(-1);
    // Parse local time frome client to UTC time before comparation
    var fromDateUtc = moment.utc(startDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
    var toDateUtc = moment.utc(endDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS);

    const customerReportResult = await customerDataService.getCustomerReportPieChartAsync(
      fromDateUtc,
      toDateUtc,
      branchId,
      segmentTimeOption
    );
    setDataCustomerReport(customerReportResult);
    setPlatformStatistical(customerReportResult?.platformStatisticals);
  };

  const getPeriodForStatusWidget = () => {
    let periodValue = null;
    let daysBetween = new Date(selectedDates?.endDate).getDate() - new Date(selectedDates?.startDate).getDate();
    switch (segmentTimeOption) {
      case OptionDateTime.today:
        periodValue = pageData.optionDatetime.yesterday;
        break;
      case OptionDateTime.yesterday:
        periodValue = pageData.optionDatetime.theDayBeforeYesterday;
        break;
      case OptionDateTime.thisWeek:
        periodValue = pageData.optionDatetime.lastWeek;
        break;
      case OptionDateTime.lastWeek:
        periodValue = pageData.optionDatetime.theWeekBeforeLast;
        break;
      case OptionDateTime.thisMonth:
        periodValue = pageData.optionDatetime.lastMonth;
        break;
      case OptionDateTime.lastMonth:
        periodValue = pageData.optionDatetime.theMonthBeforeLast;
        break;
      case OptionDateTime.thisYear:
        periodValue = pageData.optionDatetime.lastYear;
        break;
      default:
        periodValue = t("optionDatetime.lastPeriod", { dayOfNumber: daysBetween });
        break;
    }
    setPeriodForStatusWidget(periodValue);
  };

  const fetchCustomerGrowthData = async () => {
    const customerData = await customerDataService.getCustomersByDateRangeAsync(
      selectedDates.startDate,
      selectedDates.endDate,
      branchId
    );
    const customerGrowthData = mapToCustomerGrowthData(customerData);
    setCustomerGrowth(customerGrowthData);
  };

  const convertToLocalTime = (time) => {
    return moment.utc(time).local();
  };

  const mapToCustomerGrowthDataByDay = (customerData, hours) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByHour = 0;
    for (let index = 0; index <= hours; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).hour() === index);
      countByHour += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByHour);
    }

    return data;
  };

  const mapToCustomerGrowthDataByWeek = (customerData, days) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let count = 0;
    for (let index = 1; index <= days; index++) {
      let day = index === days ? 0 : index;
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).day() === day);
      count += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(count);
    }

    return data;
  };

  const mapToCustomerGrowthDataByMonth = (customerData, days) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByHour = 0;
    for (let index = 1; index <= days; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).date() === index);
      countByHour += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByHour);
    }

    return data;
  };

  const mapToCustomerGrowthDataByYear = (customerData) => {
    const data = { newCustomerData: [], totalCustomerData: [] };
    let countByMonth = 0;
    const currentMonth = moment().month();
    for (let index = 0; index <= currentMonth; index++) {
      const group = customerData.filter((x) => convertToLocalTime(x?.createdTime).month() === index);
      countByMonth += group?.length;
      data.newCustomerData.push(group?.length);
      data.totalCustomerData.push(countByMonth);
    }

    return data;
  };

  const mapToCustomerGrowthData = (customerData) => {
    let startDate = moment(selectedDates?.startDate);
    let endDate = moment(selectedDates?.endDate).add(1, "d").seconds(-1);
    let data = {};
    switch (segmentTimeOption) {
      case OptionDateTime.today:
        data = mapToCustomerGrowthDataByDay(customerData, moment().hour());
        break;
      case OptionDateTime.yesterday:
        data = mapToCustomerGrowthDataByDay(customerData, 24);
        break;
      case OptionDateTime.thisWeek:
        data = mapToCustomerGrowthDataByWeek(customerData, moment().day());
        break;
      case OptionDateTime.lastWeek:
        data = mapToCustomerGrowthDataByWeek(customerData, 7);
        break;
      case OptionDateTime.thisMonth:
        data = mapToCustomerGrowthDataByMonth(customerData, moment().date());
        break;
      case OptionDateTime.lastMonth:
        data = mapToCustomerGrowthDataByMonth(customerData, moment(startDate).daysInMonth());
        break;
      case OptionDateTime.thisYear:
        data = mapToCustomerGrowthDataByYear(customerData);
        break;
      case OptionDateTime.customize:
        const isSameDate = moment(startDate).date() === moment(endDate).date();
        const isSameMonth = moment(startDate).month() === moment(endDate).month();
        const isSameYear = moment(startDate).year() === moment(endDate).year();

        if (isSameYear && isSameMonth && isSameDate) {
          data = mapToCustomerGrowthDataByDay(customerData, 24);
        } else if (isSameYear && isSameMonth) {
          data = mapToCustomerGrowthDataByMonth(customerData, moment(startDate).daysInMonth());
        } else {
          data = mapToCustomerGrowthDataByYear(customerData);
        }
        break;
      default:
        break;
    }
    return data;
  };

  const getLabelsByDay = (hours) => {
    return Array.from({ length: hours }, (_item, i) => `${i}:00`);
  };

  const getLabelsByWeek = () => {
    return [
      pageData.monday,
      pageData.tuesday,
      pageData.wednesday,
      pageData.thursday,
      pageData.friday,
      pageData.saturday,
      pageData.sunday,
    ];
  };

  const getLabelsByMonth = (days) => {
    return Array.from({ length: days }, (_item, i) => i + 1);
  };

  const getLabelsByYear = () => {
    return [
      pageData.january,
      pageData.february,
      pageData.march,
      pageData.april,
      pageData.may,
      pageData.june,
      pageData.july,
      pageData.august,
      pageData.september,
      pageData.october,
      pageData.november,
      pageData.december,
    ];
  };

  const getLabels = () => {
    const startDate = moment(selectedDates?.startDate);
    const endDate = moment(selectedDates?.endDate);
    let segment = [];
    switch (segmentTimeOption) {
      case OptionDateTime.today:
      case OptionDateTime.yesterday:
        segment = getLabelsByDay(24);
        break;
      case OptionDateTime.thisWeek:
      case OptionDateTime.lastWeek:
        segment = getLabelsByWeek();
        break;
      case OptionDateTime.thisMonth:
      case OptionDateTime.lastMonth:
        let daysInMonth = moment(startDate).daysInMonth();
        segment = getLabelsByMonth(daysInMonth);
        break;
      case OptionDateTime.thisYear:
        segment = getLabelsByYear();
        break;
      case OptionDateTime.customize:
        const isSameDate = moment(startDate).date() === moment(endDate).date();
        const isSameMonth = moment(startDate).month() === moment(endDate).month();
        const isSameYear = moment(startDate).year() === moment(endDate).year();

        if (isSameYear && isSameMonth && isSameDate) {
          segment = getLabelsByDay(24);
        } else if (isSameYear && isSameMonth) {
          let daysInMonth = moment(startDate).daysInMonth();
          segment = getLabelsByMonth(daysInMonth);
        } else {
          segment = getLabelsByYear();
        }

        break;
      default:
        break;
    }
    return segment;
  };

  const data = {
    dateRange: selectedDates,
    dateOption: segmentTimeOption,
    labels: getLabels(),
    datasets: [
      {
        label: pageData.leftAxis,
        data: customerGrowth?.totalCustomerData,
        color: "#50429B",
      },
      {
        label: pageData.rightAxis,
        data: customerGrowth?.newCustomerData,
        color: "#FF8C21",
      },
    ],
  };

  return (
    <Row>
      <Col span={24}>
        <div className="customer-by-platform">
          <Row>
            <Col xs={24} sm={24} md={8} lg={8} className="customer-report-widget">
              <div className="group-customer-widget-report">
                <div className="top-content-customer-report-widget">
                  <div className="icon-content-customer-report-widget">
                    <CustomerReportWidgetIcon />
                  </div>
                  <b className="title-widget">{pageData.titleWidget}</b>
                  <div className="compare-value">
                    {dataCustomerReport?.isDecreaseCustomerFromThePreviousSession ? (
                      <>
                        <TriangleReduceIcon />
                        &nbsp; &nbsp;
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${t("report.customer.decrease", {
                              value: dataCustomerReport?.percentageCustomerChangeFromThePreviousSession ?? 0,
                              period: periodForStatusWidget,
                            })}`,
                          }}
                        ></div>
                      </>
                    ) : (
                      <>
                        <TriangleIncreaseIcon />
                        &nbsp; &nbsp;
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${t("report.customer.increase", {
                              value: dataCustomerReport?.percentageCustomerChangeFromThePreviousSession ?? 0,
                              period: periodForStatusWidget,
                            })}`,
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                  <b className="total-customer-value">{dataCustomerReport?.totalCustomer ?? 0}</b>
                </div>
                <div className="bottom-content-customer-report-widget">
                  <div className="total-order-customer">
                    <p>{pageData.totalOrder}:</p>
                    <b>{dataCustomerReport?.totalOrder ?? 0}</b>
                  </div>
                  <div className="revenue-by-customer">
                    <p>{pageData.revenueByCustomer}:</p>
                    <b>{formatCurrencyWithoutSymbol(dataCustomerReport?.revenueByCustomer ?? 0)} đ</b>
                  </div>
                  <div className="average">
                    <p>{pageData.average}:</p>
                    <b>{t("report.customer.averageValue", { value: dataCustomerReport?.averageOrder ?? 0 })}</b>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              offset={isTabletOrMobile ? 0 : 1}
              md={15}
              lg={15}
              className={isTabletOrMobile && "margin-top"}
            >
              <div className="customer-report-chart">
                <CustomerPlatformPieChartComponent dataReportOrderList={platformStatistical} />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24}>
        <div className="customer-growth">
          <FnbLineChartComponent chartTitle={pageData.title} data={data} />
        </div>
      </Col>
      <Col span={24}>
        <div className="top-customer"></div>
      </Col>
    </Row>
  );
}
