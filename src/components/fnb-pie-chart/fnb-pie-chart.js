import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { formatTextNumber, getCurrency } from "utils/helpers";
import "./fnb-pie-chart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Follow docs: https://apexcharts.com/docs/options/legend/
 * @param {} props {dataSource}
 * @returns
 */
export function FnbPieChart(props) {
  const { className, title, unit, dataSource, width, descriptions, showDefaultLegend, legend, plotOptions } = props;
  const [t] = useTranslation();

  useEffect(() => {}, []);

  const getChartSettings = () => {
    const labels = dataSource?.map((item) => item?.label);
    const colors = dataSource?.map((item) => item?.color);
    const totalValue = dataSource?.reduce((a, b) => a + (b?.value || 0), 0);
    const settings = {
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            if (val === totalValue) {
              return 100 + "%";
            }

            let percent = (val / totalValue) * 100;
            return percent.toFixed(2) + "%";
          },
          title: {
            formatter: function (seriesName) {
              return seriesName + "";
            },
          },
        },
      },
      labels: labels,
      colors: colors,
      chart: {
        width: "100px",
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
        events: {
          animationEnd: function (ctx) {
            ctx.toggleDataPointSelection(2);
          },
        },
      },
      stroke: {
        show: false,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1,
          startAngle: 0,
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
                label: `${formatTextNumber(totalValue)} ${getCurrency()}`,
                fontSize: "20px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#50429B",
                formatter: (w) => {
                  return title;
                },
              },
            },
          },
          ...plotOptions?.pie,
        },
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
          return `${Math.floor(val)}%`;
        },
        dropShadow: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 860,
          options: {
            chart: {
              width: width,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        show: showDefaultLegend ? true : false,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: "right",
        horizontalAlign: "center",
        floating: true,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        formatter: function (seriesName, opts) {
          return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex], getCurrency()];
        },
        labels: {
          colors: undefined,
          useSeriesColors: false,
        },
        itemMargin: {
          horizontal: 0,
          vertical: 10,
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: "#fff",
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0,
        },
        ...legend,
      },
    };

    return settings;
  };

  const getChartSeries = () => {
    if (dataSource) {
      return dataSource?.map((item) => {
        return item?.value;
      });
    }

    return [];
  };

  return (
    <div className={className} style={{ width: width }}>
      <Chart className="fnb-pie-chart" series={getChartSeries()} options={getChartSettings()} type="donut" />
      <div className="chart-description-wrapper">{descriptions}</div>
    </div>
  );
}
