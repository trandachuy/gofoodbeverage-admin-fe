/**
 * Revenue line chart
 */
import { Card } from "antd";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat, OrderMaxValue, RevenueMaxValue } from "constants/string.constants";
import i18n from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getCurrency, roundNumber } from "utils/helpers";
import "./line-chart.component.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const RevenueLineChartComponent = React.forwardRef(({ chartTitle }, ref) => {
  const [chartConfiguration, setChartConfiguration] = useState(null);
  const [t] = useTranslation();
  const [minRevenue, setMinRevenue] = useState(0);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [maxOrder, setMaxOrder] = useState(0);
  const languageSessionDefault = useSelector((state) => state?.session?.languageSession?.default);
  const pageData = {
    title: t("chartRevenue.title"),
    leftAxis: t("chartRevenue.leftAxis"),
    rightAxis: t("chartRevenue.rightAxis"),
    totalOrder: t("chartRevenue.totalOrder"),
    totalRevenue: t("chartRevenue.totalRevenue"),
    hour: t("chartRevenue.hour"),
    monday: t("chartRevenue.weekdays.monday"),
    tuesday: t("chartRevenue.weekdays.tuesday"),
    wednesday: t("chartRevenue.weekdays.wednesday"),
    thursday: t("chartRevenue.weekdays.thursday"),
    friday: t("chartRevenue.weekdays.friday"),
    saturday: t("chartRevenue.weekdays.saturday"),
    sunday: t("chartRevenue.weekdays.sunday"),
    january: t("chartRevenue.months.january"),
    february: t("chartRevenue.months.february"),
    march: t("chartRevenue.months.march"),
    april: t("chartRevenue.months.april"),
    may: t("chartRevenue.months.may"),
    june: t("chartRevenue.months.june"),
    july: t("chartRevenue.months.july"),
    august: t("chartRevenue.months.august"),
    september: t("chartRevenue.months.september"),
    october: t("chartRevenue.months.october"),
    november: t("chartRevenue.months.november"),
    december: t("chartRevenue.months.december"),
  };

  const [data, setData] = useState();

  const options = {
    responsive: true,
    interaction: {
      mode: "point",
      intersect: false,
    },
    stacked: false,
    layout: {
      padding: 10,
    },
    plugins: {
      title: {
        display: false,
        text: chartTitle || pageData.title,
        align: "start",
        position: "top",
        font: {
          family: "Plus Jakarta Sans",
          size: 24,
          weight: "bold",
        },
      },
      legend: {
        align: "end",
        labels: {
          boxHeight: 0,
          boxWidth: 90,
        },
        fullSize: true,
        display: true,
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        usePointStyle: true,
        backgroundColor: "#F7F5FF",
        titleColor: "#50429B",
        titleAlign: "Left",
        titleSpacing: 5,
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyColor: "#50429B",
        bodySpacing: 5,
        bodyFont: {
          size: 12,
          weight: 400,
        },
        xAlign: "center",
        yAlign: "bottom",
        boxPadding: 7,
        displayColors: true,
        padding: 15,
        cornerRadius: 12,
        caretSize: 8,
        caretPadding: 6,
        callbacks: {
          label: (context) => {
            let label = "";

            if (context.dataset.yAxisID === "revenue" && context.parsed.y !== null) {
              let currencyValue = new Intl.NumberFormat(
                `${languageSessionDefault?.languageCode}-${languageSessionDefault?.countryCode}`,
                {
                  style: "currency",
                  currency: getCurrency(),
                }
              ).format(context.parsed.y);
              label = `Revenue:           ${currencyValue}`;
            }

            if (context.dataset.yAxisID === "order" && context.parsed.y !== null) {
              label = `Order:                  ${context.parsed.y}`;
            }

            return label;
          },
        },
        external: (e) => externalTooltipHandler(e),
      },
    },
    elements: {
      point: {
        pointStyle: "circle",
        radius: 3,
        hoverRadius: 5,
      },
      line: {
        tension: 0.35,
        borderWidth: 2,
        borderDashOffset: 2,
        borderJoinStyle: "round",
      },
    },
    scales: {
      x: {
        display: true,
        beginAtZero: true,
        ticks: {
          callback: function (val, index) {
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },
        },
      },
      revenue: {
        type: "linear",
        display: true,
        position: "left",
        min: minRevenue,
        max: maxRevenue > 1000000 ? null : 1000000,
        alignToPixels: true,
        offset: true,
        ticks: {
          padding: 0,
          stepSize: 100000,
        },
        title: {
          display: true,
          text: `${pageData.rightAxis} (${getCurrency()})`,
          color: "#50429B",
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 0, left: 0, right: 0, bottom: 0 },
        },
      },
      order: {
        type: "linear",
        display: true,
        position: "right",
        min: minOrder,
        max: maxOrder > 10 ? null : 10,
        alignToPixels: true,
        offset: true,
        ticks: {
          padding: 0,
          stepSize: 1,
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: pageData.leftAxis,
          color: "#FF8C21",
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
          padding: { top: 0, left: 0, right: 0, bottom: 0 },
        },
      },
    },
  };

  React.useImperativeHandle(ref, () => ({
    fillData(date, typeOptionDate, data, isAverage = false) {
      let convertedData = [];
      if (data?.orderData.length > 0) convertedData = mappingOrderDataToLocalTime(data?.orderData);
      drawChart(date, typeOptionDate, convertedData, isAverage);
    },
  }));

  const drawChart = (date, typeOptionDate, data, isAverage) => {
    let convertedData = calculateOrderData(date, typeOptionDate, data);
    let labels = [];
    if (isAverage === true) {
      for (let index = 0; index < 23; index++) {
        let timeItem = `${index}:00`;
        labels.push(timeItem);
      }
    } else {
      labels = getHorizontalTime(date, typeOptionDate);
    }

    let currentData = {
      labels,
      datasets: [
        {
          label: pageData.totalRevenue,
          data: isAverage === true ? convertedData?.countAverageRevenueData : convertedData?.countRevenueData,
          yAxisID: "revenue",
          borderColor: "#50429B",
          backgroundColor: "#50429B",
        },
        {
          label: pageData.totalOrder,
          data: isAverage === true ? convertedData?.countAverageOrderData : convertedData?.countOrderData,
          yAxisID: "order",
          borderColor: "#FF8C21",
          backgroundColor: "#FF8C21",
        },
      ],
    };

    let maxRevenueValue = 0;
    let maxOrderValue = 0;
    let revenueMaxValue =
      isAverage === true
        ? Math.max(...convertedData?.countAverageRevenueData)
        : Math.max(...convertedData?.countRevenueData);
    if (revenueMaxValue < RevenueMaxValue) {
      maxRevenueValue = RevenueMaxValue;
    } else {
      maxRevenueValue = revenueMaxValue;
    }

    let orderMaxValue =
      isAverage === true
        ? Math.max(...convertedData?.countAverageOrderData)
        : Math.max(...convertedData?.countOrderData);
    if (orderMaxValue < OrderMaxValue) {
      maxOrderValue = OrderMaxValue;
    } else {
      maxOrderValue = orderMaxValue;
    }

    setMinRevenue(
      isAverage === true
        ? Math.min(...convertedData?.countAverageRevenueData)
        : Math.min(...convertedData?.countRevenueData)
    );
    setMaxRevenue(maxRevenueValue);
    setMinOrder(
      isAverage === true
        ? Math.min(...convertedData?.countAverageOrderData)
        : Math.min(...convertedData?.countOrderData)
    );
    setMaxOrder(maxOrderValue);
    setData(currentData);
    setChartConfiguration(options);
  };

  const getDateTime = (dateTimeUtc, formatPattern) => {
    if (!formatPattern) {
      formatPattern = "yyyy-MM-DD HH:mm:ss";
    }

    let languageCode = i18n.language;
    let dateTimeResult = moment.utc(dateTimeUtc).locale(languageCode).local().format(formatPattern);
    return dateTimeResult;
  };

  const mappingOrderDataToLocalTime = (orderData) => {
    return orderData?.map((item) => {
      return {
        id: item.id,
        priceAfterDiscount: item.priceAfterDiscount,
        createdTime: getDateTime(item?.createdTime),
      };
    });
  };

  const calculateOrderData = (date, typeOptionDate, orderData) => {
    let startDate = moment(date?.startDate);
    let endDate = moment(date?.endDate).add(1, "d").seconds(-1);
    var countOrderData = [],
      countRevenueData = [],
      countAverageOrderData = [],
      countAverageRevenueData = [];
    let divideValue = 0;
    switch (typeOptionDate) {
      case OptionDateTime.today: {
        const currentHour = +moment().local().format("HH");
        divideValue = 1;

        if (orderData.length <= 0) {
          for (let hour = 0; hour <= currentHour; hour++) {
            let revenueTmp = 0;
            let dataInHour = 0;
            countOrderData.push(dataInHour);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let hour = 0; hour <= currentHour; hour++) {
            let revenueTmp = 0;
            let dataInHour = orderData.filter((m) => moment(m?.createdTime).hour() === hour);
            if (dataInHour.length > 0) {
              dataInHour.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }
            countOrderData.push(dataInHour?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
      }

      case OptionDateTime.yesterday: {
        divideValue = 1;

        if (orderData.length <= 0) {
          for (let hour = 0; hour <= 23; hour++) {
            let revenueTmp = 0;
            let dataInHour = 0;
            countOrderData.push(dataInHour);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let hour = 0; hour <= 23; hour++) {
            let revenueTmp = 0;
            let dataInHour = orderData.filter((order) => moment(order?.createdTime).hour() === hour);
            if (dataInHour.length > 0) {
              dataInHour.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }
            countOrderData.push(dataInHour?.length);
            countRevenueData.push(revenueTmp);
          }
        }

        break;
      }

      case OptionDateTime.thisWeek: {
        let currentDayOfWeek = moment().local().day();
        if (orderData.length <= 0) {
          for (let day = 1; day <= currentDayOfWeek; day++) {
            let revenueTmp = 0;
            let dataInCurrentWeek = 0;
            divideValue += 1;
            countOrderData.push(dataInCurrentWeek);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let day = 1; day <= currentDayOfWeek; day++) {
            let revenueTmp = 0;
            let dataInCurrentWeek = orderData.filter((order) => moment(order?.createdTime).day() === day);
            if (dataInCurrentWeek.length > 0) {
              dataInCurrentWeek.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }
            divideValue += 1;
            countOrderData.push(dataInCurrentWeek?.length);
            countRevenueData.push(revenueTmp);
          }
        }

        // Data for only sunday
        let revenueOnSunday = 0;
        let dataForSunday = null;
        if (orderData.length <= 0) {
          dataForSunday = 0;
        } else {
          dataForSunday = orderData.filter((order) => moment(order?.createdTime).day() === 0);
          if (dataForSunday.length > 0) {
            divideValue += 1;
            dataForSunday.forEach((item) => {
              revenueOnSunday += item?.priceAfterDiscount;
            });
          }
        }

        if (orderData.length <= 0) countOrderData.push(dataForSunday);
        else countOrderData.push(dataForSunday?.length);
        countRevenueData.push(revenueOnSunday);
        break;
      }

      case OptionDateTime.lastWeek: {
        divideValue = 7;

        if (orderData.length <= 0) {
          for (let day = 1; day <= 6; day++) {
            let revenueTmp = 0;
            let dataInLastWeek = 0;

            countOrderData.push(dataInLastWeek);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let day = 1; day <= 6; day++) {
            let revenueTmp = 0;
            let dataInLastWeek = orderData.filter((order) => moment(order?.createdTime).day() === day);
            if (dataInLastWeek.length > 0) {
              dataInLastWeek.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInLastWeek?.length);
            countRevenueData.push(revenueTmp);
          }
        }

        // Data for only sunday
        let revenueOnSunday = 0;
        let dataForSunday = null;
        if (orderData.length <= 0) {
          dataForSunday = 0;
        } else {
          dataForSunday = orderData.filter((order) => moment(order?.createdTime).day() === 0);
          if (dataForSunday.length > 0) {
            dataForSunday.forEach((item) => {
              revenueOnSunday += item?.priceAfterDiscount;
            });
          }
        }
        if (countOrderData.length >= 6 && countRevenueData.length >= 6) {
          if (orderData.length <= 0) countOrderData.push(dataForSunday);
          else countOrderData.push(dataForSunday?.length);
          countRevenueData.push(revenueOnSunday);
        }
        break;
      }

      case OptionDateTime.thisMonth: {
        let currentDayInMonth = moment().date();
        divideValue = currentDayInMonth;
        if (orderData.length <= 0) {
          for (let day = 1; day <= currentDayInMonth; day++) {
            let revenueTmp = 0;
            let dataInCurrentMonth = 0;

            countOrderData.push(dataInCurrentMonth);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let day = 1; day <= currentDayInMonth; day++) {
            let revenueTmp = 0;
            let dataInCurrentMonth = orderData.filter((order) => moment(order?.createdTime).date() === day);
            if (dataInCurrentMonth.length > 0) {
              dataInCurrentMonth.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInCurrentMonth?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
      }

      case OptionDateTime.lastMonth: {
        let currentDayInMonth = moment(startDate).daysInMonth();
        divideValue = currentDayInMonth;
        if (orderData.length <= 0) {
          for (let day = 1; day <= currentDayInMonth; day++) {
            let revenueTmp = 0;
            let dataInCurrentMonth = 0;

            countOrderData.push(dataInCurrentMonth);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let day = 1; day <= currentDayInMonth; day++) {
            let revenueTmp = 0;
            let dataInCurrentMonth = orderData.filter((order) => moment(order?.createdTime).day() === day);
            if (dataInCurrentMonth.length > 0) {
              dataInCurrentMonth.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInCurrentMonth?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
      }

      case OptionDateTime.thisYear: {
        let currentMonth = moment().month();
        divideValue = currentMonth;
        if (orderData.length <= 0) {
          for (let month = 1; month <= currentMonth; month++) {
            let revenueTmp = 0;
            let dataInEachMonth = 0;

            countOrderData.push(dataInEachMonth);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let month = 1; month <= currentMonth; month++) {
            let revenueTmp = 0;
            let dataInEachMonth = orderData.filter((order) => moment(order?.createdTime).month() === month);
            if (dataInEachMonth.length > 0) {
              dataInEachMonth.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInEachMonth?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
      }

      case OptionDateTime.customize: {
        if (moment(startDate).date() === moment(endDate).date()) {
          divideValue = 24;
          for (let hour = 0; hour <= 23; hour++) {
            let revenueTmp = 0;
            let dataInHour = orderData.filter((order) => moment(order?.createdTime).hour() === hour);
            if (dataInHour.length > 0) {
              dataInHour.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }
            countOrderData.push(dataInHour?.length);
            countRevenueData.push(revenueTmp);
          }
          break;
        } else if (
          moment(startDate).date() !== moment(endDate).date() &&
          moment(startDate).month() === moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          let currentDayInMonth = moment(startDate).daysInMonth();
          divideValue = currentDayInMonth;
          for (let day = 1; day <= currentDayInMonth; day++) {
            let revenueTmp = 0;
            let dataInCurrentMonth = orderData.filter((order) => moment(order?.createdTime).day() === day);
            if (dataInCurrentMonth.length > 0) {
              dataInCurrentMonth.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInCurrentMonth?.length);
            countRevenueData.push(revenueTmp);
          }
        } else if (
          moment(startDate).month() !== moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          let currentMonth = moment().month();
          divideValue = currentMonth;
          for (let month = 1; month <= currentMonth; month++) {
            let revenueTmp = 0;
            let dataInEachMonth = orderData.filter((order) => moment(order?.createdTime).month() === month);
            if (dataInEachMonth.length > 0) {
              dataInEachMonth.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }

            countOrderData.push(dataInEachMonth?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
      }
      default:
        const currentHour = +moment().local().format("HH");
        divideValue = currentHour;

        if (orderData.length <= 0) {
          for (let hour = 0; hour <= currentHour; hour++) {
            let revenueTmp = 0;
            let dataInHour = 0;
            countOrderData.push(dataInHour);
            countRevenueData.push(revenueTmp);
          }
        } else {
          for (let hour = 0; hour <= currentHour; hour++) {
            let revenueTmp = 0;
            let dataInHour = orderData.filter((m) => moment(m?.createdTime).hour() === hour);
            if (dataInHour.length > 0) {
              dataInHour.forEach((item) => {
                revenueTmp += item?.priceAfterDiscount;
              });
            }
            countOrderData.push(dataInHour?.length);
            countRevenueData.push(revenueTmp);
          }
        }
        break;
    }

    for (let hour = 0; hour <= 23; hour++) {
      let sumRevenueValue = 0;
      let averageRevenueValue = 0;
      let dataByHour = orderData.filter((order) => moment(order?.createdTime).hour() === hour);
      let averageDataByHour = 0;
      if (dataByHour.length > 0) {
        averageDataByHour = roundNumber(dataByHour?.length / divideValue, 2);
        dataByHour.forEach((item) => {
          sumRevenueValue += item?.priceAfterDiscount;
        });
        averageRevenueValue = roundNumber(sumRevenueValue / divideValue, 2);
      }
      countAverageOrderData.push(averageDataByHour);
      countAverageRevenueData.push(averageRevenueValue);
    }

    return {
      countOrderData,
      countRevenueData,
      countAverageOrderData,
      countAverageRevenueData,
    };
  };

  const getHorizontalTime = (date, typeOptionDate) => {
    const startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    const endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let segment = [];
    switch (typeOptionDate) {
      case OptionDateTime.today:
      case OptionDateTime.yesterday:
        for (let index = 0; index <= 23; index++) {
          let time = `${index}:00`;
          segment.push(time);
        }
        break;
      case OptionDateTime.thisWeek:
      case OptionDateTime.lastWeek:
        segment = [
          pageData.monday,
          pageData.tuesday,
          pageData.wednesday,
          pageData.thursday,
          pageData.friday,
          pageData.saturday,
          pageData.sunday,
        ];
        break;
      case OptionDateTime.thisMonth:
      case OptionDateTime.lastMonth:
        let numbsInmonth = moment(startDate).daysInMonth();
        let tempSegment = [];
        for (let numb = 1; numb < numbsInmonth + 1; numb++) {
          tempSegment.push(numb);
        }
        segment = tempSegment;
        break;
      case OptionDateTime.thisYear:
        segment = [
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
        break;
      case OptionDateTime.customize:
        if (moment(startDate).date() === moment(endDate).date()) {
          for (let index = 0; index <= 23; index++) {
            let time = `${index}:00`;
            segment.push(time);
          }
        } else if (
          moment(startDate).date() !== moment(endDate).date() &&
          moment(startDate).month() === moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          let numbsInmonth = moment(startDate).daysInMonth();
          let tempSegment = [];
          for (let numb = 1; numb < numbsInmonth + 1; numb++) {
            tempSegment.push(numb);
          }
          segment = tempSegment;
        } else if (
          moment(startDate).month() !== moment(endDate).month() &&
          moment(startDate).year() === moment(endDate).year()
        ) {
          segment = [
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
        }
        break;
      default:
        break;
    }
    return segment;
  };

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "#50429B";
      tooltipEl.style.borderRadius = "15px";
      tooltipEl.style.color = "#FFFFFF";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
      tooltipEl.style.zIndex = 9999;
      tooltipEl.style.marginTop = "10px";

      const table = document.createElement("table");
      table.style.width = "100%";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    //Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);
      const tableHead = document.createElement("thead");
      tableHead.style.color = "white";
      titleLines.forEach((title) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = 0;
        tr.style.width = "100%";
        const th = document.createElement("th");
        th.style.borderWidth = 0;
        const text = document.createTextNode(title);
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
      const tableBody = document.createElement("tbody");
      tableBody.style.background = "white";
      tableBody.style.color = "#50429B";
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = "2px";
        span.style.marginRight = "5px";
        span.style.marginLeft = "5px";
        span.style.height = "15px";
        span.style.width = "15px";
        span.style.display = "inline-block";
        span.style.borderRadius = "50%";
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;
        tr.style.lineHeight = 3;
        const td = document.createElement("td");
        td.style.borderWidth = 0;
        td.style.paddingRight = "5px";
        td.style.borderRadius = "0px 0px 5px 5px";
        const text = document.createTextNode(body);
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
      const tableRoot = tooltipEl.querySelector("table");
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  return (
    <>
      <Card className="w-100 fnb-card">
        <div className="chart-title">{chartTitle || pageData.title}</div>
        <div>{data && <Line options={options} data={data} />}</div>
      </Card>
    </>
  );
});
