import React from "react";
import FnbCard from "components/fnb-card/fnb-card.component";
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
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function FnbLineChartComponent(props) {
  const { chartTitle, data } = props;

  let maxAxis = 5;
  if (data?.datasets[0]?.data) {
    maxAxis = Math.max(...data?.datasets[0]?.data, maxAxis);
  }

  const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector("ul");

    if (!listContainer) {
      listContainer = document.createElement("ul");
      listContainer.style.display = "flex";
      listContainer.style.flexDirection = "row";
      listContainer.style.justifyContent = "flex-end";
      listContainer.style.margin = "0 0 24px 8px";
      listContainer.style.padding = 0;

      legendContainer.appendChild(listContainer);
    }

    return listContainer;
  };

  const renderLegendIcon = (node, fillColor) => {
    const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iconSvg.setAttribute("width", "61");
    iconSvg.setAttribute("height", "13");
    iconSvg.setAttribute("viewBox", "0 0 61 13");
    iconSvg.setAttribute("fill", fillColor);

    let iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute("fill-rule", "evenodd");
    iconPath.setAttribute("clip-rule", "evenodd");
    iconPath.setAttribute(
      "d",
      "M0 6C0 5.44772 0.447715 5 1 5H60C60.5523 5 61 5.44772 61 6C61 6.55228 60.5523 7 60 7H1C0.447715 7 0 6.55228 0 6Z"
    );
    iconSvg.appendChild(iconPath);
    iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute(
      "d",
      "M30.9603 12.9206C29.2472 12.9206 27.6042 12.2402 26.3927 11.029C25.1812 9.81783 24.5004 8.17503 24.5 6.46193C24.4996 4.74883 25.1796 3.1057 26.3905 1.8939C27.6014 0.682097 29.244 0.00085736 30.9571 8.08702e-07C32.6702 -0.000855743 34.3135 0.678743 35.5256 1.88933C36.7377 3.09992 37.4193 4.74237 37.4206 6.45548C37.4219 8.16858 36.7427 9.81205 35.5324 11.0245C34.3222 12.2369 32.6799 12.9189 30.9668 12.9206H30.9603Z"
    );
    iconSvg.appendChild(iconPath);

    return node.appendChild(iconSvg);
  };

  const htmlLegendPlugin = [
    {
      id: "htmlLegend",
      afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach((item) => {
          const li = document.createElement("li");
          li.style.alignItems = "center";
          li.style.cursor = "pointer";
          li.style.display = "flex";
          li.style.flexDirection = "row";
          li.style.marginLeft = "64px";

          li.onclick = () => {
            const { type } = chart.config;
            if (type === "pie" || type === "doughnut") {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };

          // Icon
          renderLegendIcon(li, item.fillStyle);

          // Text
          const textContainer = document.createElement("p");
          textContainer.style.color = item.fontColor;
          textContainer.style.margin = "0 0 0 12px";
          textContainer.style.padding = 0;
          textContainer.style.textDecoration = item.hidden ? "line-through" : "";

          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      },
    },
  ];

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
        text: chartTitle,
        align: "start",
        position: "top",
        font: {
          family: "Plus Jakarta Sans",
          size: 24,
          weight: "bold",
        },
      },
      htmlLegend: {
        containerID: "legendContainer",
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: (e) => externalTooltipHandler(e),
      },
    },
    elements: {
      point: {
        pointStyle: "circle",
        radius: 6,
        hoverRadius: 8,
        hoverBorderWidth: 2,
        borderWidth: 2,
        borderColor: "#fff",
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
          maxRotation: 0,
        },
      },
      left: {
        type: "linear",
        display: true,
        position: "left",
        suggestedMin: 0,
        suggestedMax: maxAxis,
        alignToPixels: true,
        offset: false,
        title: {
          display: true,
          text: data?.datasets[0]?.label,
          color: data?.datasets[0]?.color,
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
        },
      },
      right: {
        type: "linear",
        display: true,
        position: "right",
        suggestedMin: 0,
        suggestedMax: maxAxis,
        alignToPixels: true,
        offset: false,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: data?.datasets[1]?.label,
          color: data?.datasets[1]?.color,
          font: {
            family: "Plus Jakarta Sans",
            size: 20,
            weight: 600,
            style: "normal",
            lineHeight: 1.2,
          },
        },
      },
    },
  };

  const chartData = {
    labels: data?.labels,
    datasets: [
      {
        label: data?.datasets[0]?.label,
        data: data?.datasets[0]?.data,
        borderColor: data?.datasets[0]?.color,
        backgroundColor: data?.datasets[0]?.color,
      },
      {
        label: data?.datasets[1]?.label,
        data: data?.datasets[1]?.data,
        borderColor: data?.datasets[1]?.color,
        backgroundColor: data?.datasets[1]?.color,
      },
    ],
  };

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("[id='tooltipContainer']");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.setAttribute("id", "tooltipContainer");
      tooltipEl.style.background = "#ffffff";
      tooltipEl.style.borderRadius = "12px";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
      tooltipEl.style.zIndex = 9999;
      tooltipEl.style.marginTop = "10px";
      tooltipEl.style.padding = "0";
      tooltipEl.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 0px 16px 0px";

      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.whiteSpace = "nowrap";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    // Tooltip Element
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
        th.style.borderRadius = "12px 12px 0 0";
        th.style.background = "#50429B";
        th.style.padding = "8px 16px";
        th.style.textAlign = "left";
        const text = document.createElement("div");
        text.innerText = title;
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
      const tableBody = document.createElement("tbody");
      tableBody.style.background = "white";
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = "2px";
        span.style.marginRight = "10px";
        span.style.marginLeft = "5px";
        span.style.height = "12px";
        span.style.width = "12px";
        span.style.display = "inline-block";
        span.style.borderRadius = "50%";
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;
        const td = document.createElement("td");
        td.style.borderWidth = 0;
        td.style.paddingTop = i === 0 ? "16px" : "4px";
        td.style.paddingRight = "16px";
        td.style.paddingBottom = i === bodyLines.length - 1 ? "16px" : "4px";
        td.style.paddingLeft = "8px";
        td.style.borderRadius = "0px 0px 12px 12px";
        const text = document.createTextNode(body);
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
      const tableRoot = tooltipEl.querySelector("table");
      if (tableRoot) {
        // Remove old children
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove();
        }
        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
      }
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
  };

  return (
    <>
      <FnbCard title={chartTitle} className="p-3">
        <div id="legendContainer"></div>
        <Line id="chart" options={options} data={chartData} plugins={htmlLegendPlugin} />
      </FnbCard>
    </>
  );
}
