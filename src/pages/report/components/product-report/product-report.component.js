import { SwapLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Popover, Radio, Row, Tooltip, Typography } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbPieChart } from "components/fnb-pie-chart/fnb-pie-chart";
import { FnbTable } from "components/fnb-table/fnb-table";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { TopSellingProductComponent } from "components/top-selling-product/top-selling-product";
import { localeDateFormat } from "constants/default.constants";
import {
  BranchIcon,
  CubeIcon,
  DownIcon,
  InfoCircleIcon,
  TriangleIncreaseIcon,
  TriangleReduceIcon,
} from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import orderDataService from "data-services/order/order-data.service";
import "font-awesome/css/font-awesome.min.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatCurrency, formatNumber, getCurrency } from "utils/helpers";
import { ProductReportWidgetComponent } from "../product-report-widget/product-report-widget.component";
import "./product-report.component.scss";

const { Text, Paragraph } = Typography;

export default function ReportProductTransaction(props) {
  const [t] = useTranslation();

  const [ellipsis, setEllipsis] = useState(true);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const pageData = {
    id: t("table.id"),
    status: t("table.status"),
    type: t("table.type"),
    detail: t("table.detail"),
    customer: t("table.customer"),
    point: t("customer.point"),
    total: t("table.total"),
    paymentMethod: t("payment.paymentMethod"),
    discount: t("promotion.table.discount"),
    grossTotal: t("table.grossTotal"),
    txt_reduce: t("dashboard.txt_reduce"),
    txt_increase: t("dashboard.txt_increase"),
    allBranch: t("dashboard.allBranch"),
    date: {
      yesterday: "dashboard.compareDate.yesterday",
      previousDay: "dashboard.compareDate.previousDay",
      lastWeek: "dashboard.compareDate.lastWeek",
      previousWeek: "dashboard.compareDate.previousWeek",
      lastMonth: "dashboard.compareDate.lastMonth",
      previousMonth: "dashboard.compareDate.previousMonth",
      lastYear: "dashboard.compareDate.lastYear",
      previousSession: "dashboard.compareDate.previousSession",
    },
    noDataFound: t("table.noDataFound"),
    topSellingProductTitle: t("dashboard.topSellingProduct.title"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
    topSellingProductItems: t("dashboard.topSellingProduct.items"),
    topCustomerTitle: t("dashboard.topCustomer.title"),
    btnExport: t("button.export"),
    totalOrder: t("order.totalOrder"),
    reportTitle: t("report.product.reportTitle"),
    totalSoldItem: t("report.product.totalSoldItem"),
    average: t("report.product.average"),
    itemPerOrder: t("report.product.itemPerOrder"),
    costGoodsSold: t("report.product.costGoodsSold"),
    costGoodsAdd: t("report.product.costGoodsAdd"),
    profit: t("report.product.profit"),
    revenue: t("dashboard.revenue"),
    netRevenue: t("report.product.netRevenue"),
    grossRevenue: t("report.product.grossRevenue"),
    grossRevenueTooltip: t("report.product.grossRevenueTooltip"),
    cost: t("dashboard.cost"),
    percent: "%",
    bestSellingProduct: t("dashboard.bestSellingProduct.title"),
    worstSellingProduct: t("dashboard.worstSellingProduct.title"),
    no: t("table.no"),
    product: t("menu.product"),
    category: t("form.category"),
    quantity: t("table.quantity"),
    amount: t("purchaseOrder.amount"),
    soldProducts: t("report.product.soldProduct") 
  };

  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [visible, setVisible] = useState(false);
  const [branches, setBranches] = useState([]);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString(localeDateFormat.enUS),
    endDate: moment().toDate().toLocaleDateString(localeDateFormat.enUS),
  });
  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [productTransactionReport, setProductTransactionReport] = useState({});
  const [productReportWidgetData, setProductReportWidgetData] = useState({});
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [worstSellingProduct, setWorstSellingProduct] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [sortNo, setSortNo] = useState(null);
  const [sortProductName, setSortProductName] = useState(null);
  const [sortCategory, setSortCategory] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortAmount, setSortAmount] = useState(null);
  const [sortCost, setSortCost] = useState(null);
  const [page, setPage] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      getInfoDataAsync(branchId, selectedDate, typeOptionDate);
    };
    fetchData();
  }, []);

  const getInfoDataAsync = async (branchId, date, typeOptionDate) => {
    var response = await branchDataService.getAllBranchsAsync();
    if (response && response?.branchs) {
      const { branchs } = response;
      setBranches(branchs);
    }

    setBranchName(pageData.allBranch);
    onConditionCompare(OptionDateTime.today);
    getOrderInfoByFilterAsync(branchId, date, typeOptionDate);
  };

  const listBranch = (
    <>
      <Row className="branch-content">
        <Col span={24}>
          <Radio.Group onChange={(e) => handleChangeBranchAsync(e)} className="group-branch">
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

  const handleChangeBranchAsync = async (e) => {
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

    await getOrderInfoByFilterAsync(branchIdSelected, selectedDate, typeOptionDate);
    setVisible(false);
  };

  const getOrderInfoByFilterAsync = async (branchId, date, typeOptionDate) => {
    setPage(1);
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: 1,
      pageSize: pageSize,
    };

    const orderProductReportResponse = await orderDataService.getOrderProductReportAsync(req);
    setProductTransactionReport(orderProductReportResponse);
    const { averageOrder, totalOrder, totalSoldItems } = orderProductReportResponse?.orderProductReport;
    var newProductReportWidgetData = {
      icon: <CubeIcon className="icon-cube" />,
      title: pageData.totalSoldItem,
      value: totalSoldItems,
      totalOrder: totalOrder,
      description: productReportWidgetDescription(orderProductReportResponse?.orderProductReport),
      average: `${averageOrder}`,
    };

    setProductReportWidgetData(newProductReportWidgetData);

    let products = await orderDataService.getOrderTopSellingProductAsync(req);
    setTopSellingProducts(products.listTopSellingProduct);
    setWorstSellingProduct(products.listWorstSellingProduct);

    var productSolds = await orderDataService.getOrderSoldProductAsync(req);
    var data = productSolds.listSoldProduct?.map((s) => mappingRecordToColumns(s));
    setSoldProducts(data);
    setTotalQuantity(productSolds.totalQuantity);
    setTotalAmount(productSolds.totalAmount);
    setTotalCost(productSolds.totalCost);
  };

  const onSelectedDatePickerAsync = async (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    await getOrderInfoByFilterAsync(branchId, date, typeOptionDate);
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
        break;
    }
  };

  const productReportWidgetDescription = (orderProductReport) => {
    if (!orderProductReport) return <></>;
    const { percentage } = orderProductReport;
    const isIncrease = percentage >= 0 ? true : false;
    const icon =
      percentage >= 0 ? (
        <TriangleIncreaseIcon className="icon-increase-triangle" />
      ) : (
        <TriangleReduceIcon className="icon-increase-triangle ml-2" />
      );

    const description = t("{{increase}} <span>{{value}}%</span> {{compareWith}}", {
      increase: isIncrease === true ? t(pageData.txt_increase) : t(pageData.txt_reduce),
      value: Math.abs(percentage),
      compareWith: t(titleConditionCompare),
    });

    return (
      <>
        <div className="description-report">
          {icon}
          <Paragraph
            className="label"
            ellipsis={
              ellipsis
                ? {
                    rows: 1,
                    expandable: false,
                    symbol: "",
                    tooltip: description,
                  }
                : false
            }
          >
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
          </Paragraph>
        </div>
      </>
    );
  };

  const getDataForPieChart = () => {
    const { productCostReport, profitPercentage, totalProfit, totalRevenue } = productTransactionReport;

    if (productCostReport) {
      const { percentage, totalCost } = productCostReport;
      const pieChartData = [
        {
          label: pageData.cost, /// Required for pie chart
          value: totalCost, /// Required for pie chart
          color: "#50429B", /// Required for pie chart
          comparePercent: percentage,
        },
        {
          label: pageData.profit,
          value: totalProfit,
          color: "#6C5ACA",
          comparePercent: profitPercentage,
        },
      ];

      return pieChartData;
    }

    return [];
  };

  function renderRevenuePieChartDescriptions(pieChartDes) {
    const { productCostReport, profitPercentage, totalProfit, totalRevenue } = productTransactionReport;
    const colorDescriptions = pieChartDes?.map((item) => {
      const icon =
        item?.comparePercent >= 0 ? (
          <TriangleIncreaseIcon className="icon-increase-triangle mr-2" />
        ) : (
          <TriangleReduceIcon className="icon-increase-triangle mr-2" />
        );

      return (
        <div className="pie-chart-report-legend">
          <div className="legend-name">
            <div className="marker" style={{ backgroundColor: item?.color }}></div>
            <span className="legend-label">{item?.label}</span>
          </div>
          <div className="legend-value">
            <span>{icon}</span>
            <span>
              {item?.comparePercent} {pageData.percent}
            </span>
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="mb-5">{colorDescriptions}</div>
        <div className="description-summary">
          <div className="d-flex">
            <span className="mr-2">{pageData.grossRevenue}</span>
            <span className="ml-1 pointer">
              <Tooltip placement="top" title={pageData.grossRevenueTooltip}>
                <InfoCircleIcon size={24} />
              </Tooltip>
            </span>
          </div>
          <div className="summary-value">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="description-summary">
          <div>{pageData.costGoodsAdd}</div>
          <div className="summary-value">{formatCurrency(productCostReport?.totalCost)}</div>
        </div>
        <div className="description-summary total">
          <div>{pageData.profit}</div>
          <div>{formatCurrency(totalProfit)}</div>
        </div>
      </>
    );
  }

  function renderPieChart() {
    if (productTransactionReport?.totalRevenue > 0) {
      return (
        <>
          <FnbPieChart
            width={"620px"}
            className="product-report-pie-chart"
            plotOptions={{
              pie: {
                offsetX: -30,
                offsetY: 20,
              },
            }}
            title={pageData.grossRevenue}
            unit={getCurrency()}
            dataSource={getDataForPieChart()}
          />
          <div class="chart-description-wrapper">{renderRevenuePieChartDescriptions(getDataForPieChart())}</div>
        </>
      );
    } else {
      return (
        <div className="no-data">
          <NoDataFoundComponent />
        </div>
      );
    }
  }

  const resetSort = () => {
    setSortNo(null);
    setSortProductName(null);
    setSortCategory(null);
    setSortQuantity(null);
    setSortAmount(null);
    setSortCost(null);
  };

  const tableSoldSettings = {
    columns: [
      {
        title: (
          <>
            {pageData.no}
            <SwapLeftOutlined
              style={sortNo === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortNo === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "10%",
        sortOrder: sortNo,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortNo === "ascend") {
                setSortNo("descent");
                lazyLoading(page, pageSize, "descent", null, null, null, null, null);
              } else if (sortNo === "descent") {
                setSortNo(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortNo("ascend");
                lazyLoading(page, pageSize, "ascend", null, null, null, null, null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {pageData.product}
            <SwapLeftOutlined
              style={sortProductName === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortProductName === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "productName",
        key: "productName",
        align: "left",
        width: "30%",
        render: (value, record) => {
          return (
            <Row>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={15} className="table-selling-product-no">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-name-overflow"
                  >
                    <Paragraph
                      style={{ maxWidth: "inherit" }}
                      placement="top"
                      ellipsis={{ tooltip: value }}
                      color="#50429B"
                    >
                      {value}
                    </Paragraph>
                  </Col>
                </Row>
                <Row style={record?.priceName && { marginTop: "4px" }}>
                  <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                    {record?.priceName}
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        },
        sortOrder: sortProductName,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortProductName === "ascend") {
                setSortProductName("descent");
                lazyLoading(page, pageSize, null, "descent", null, null, null, null);
              } else if (sortProductName === "descent") {
                setSortProductName(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortProductName("ascend");
                lazyLoading(page, pageSize, null, "ascend", null, null, null, null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {pageData.category}
            <SwapLeftOutlined
              style={sortCategory === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortCategory === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "category",
        key: "category",
        align: "left",
        width: "15%",
        sortOrder: sortCategory,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: async () => {
              resetSort();
              if (sortCategory === "ascend") {
                setSortCategory("descent");
                lazyLoading(page, pageSize, null, null, "descent", null, null, null);
              } else if (sortCategory === "descent") {
                setSortCategory(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortCategory("ascend");
                lazyLoading(page, pageSize, null, null, "ascend", null, null, null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {pageData.quantity}
            <SwapLeftOutlined
              style={sortQuantity === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortQuantity === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
        width: "15%",
        sortOrder: sortQuantity,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortQuantity === "ascend") {
                setSortQuantity("descent");
                lazyLoading(page, pageSize, null, null, null, "descent", null, null);
              } else if (sortQuantity === "descent") {
                setSortQuantity(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortQuantity("ascend");
                lazyLoading(page, pageSize, null, null, null, "ascend", null, null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {`${pageData.amount}(${getCurrency()})`}
            <SwapLeftOutlined
              style={sortAmount === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortAmount === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "totalCost",
        key: "totalCost",
        align: "right",
        width: "15%",
        sortOrder: sortAmount,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortAmount === "ascend") {
                setSortAmount("descent");
                lazyLoading(page, pageSize, null, null, null, null, "descent", null);
              } else if (sortAmount === "descent") {
                setSortAmount(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortAmount("ascend");
                lazyLoading(page, pageSize, null, null, null, null, "ascend", null);
              }
            },
          };
        },
      },
      {
        title: (
          <>
            {`${pageData.cost}(${getCurrency()})`}
            <SwapLeftOutlined
              style={sortCost === "descent" ? { marginLeft: "8px" } : { marginLeft: "8px", color: "#AA9AFF" }}
              rotate={270}
            />
            <SwapLeftOutlined
              style={sortCost === "ascend" ? { marginLeft: "-10px" } : { marginLeft: "-10px", color: "#AA9AFF" }}
              rotate={90}
            />
          </>
        ),
        dataIndex: "totalProductCost",
        key: "totalProductCost",
        align: "right",
        width: "15%",
        sortOrder: sortCost,
        className: "table-header-click",
        onHeaderCell: () => {
          return {
            onClick: () => {
              resetSort();
              if (sortCost === "ascend") {
                setSortCost("descent");
                lazyLoading(page, pageSize, null, null, null, null, null, "descent");
              } else if (sortCost === "descent") {
                setSortCost(null);
                lazyLoading(page, pageSize, null, null, null, null, null, null);
              } else {
                setSortCost("ascend");
                lazyLoading(page, pageSize, null, null, null, null, null, "ascend");
              }
            },
          };
        },
      },
    ],
  };

  const onScrollSpace = async (event) => {
    let target = event.target;
    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let max = target.scrollHeight;
    let current = top + offsetHeight;
    if (current + 1 >= max) {
      await lazyLoading(page + 1, pageSize, sortNo, sortProductName, sortCategory, sortQuantity, sortAmount, sortCost);
      setPage(page + 1);
    }
  };

  const lazyLoading = async (page, size, sortNo, sortProductName, sortCategory, sortQuantity, sortAmount, sortCost) => {
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: page,
      pageSize: size,
      sortNo: sortNo,
      sortProductName: sortProductName,
      sortCategory: sortCategory,
      sortQuantity: sortQuantity,
      sortAmount: sortAmount,
      sortCost: sortCost,
    };

    var productSolds = await orderDataService.getOrderSoldProductAsync(req);
    var data = productSolds.listSoldProduct?.map((s) => mappingRecordToColumns(s));
    setSoldProducts(data);
  };

  const mappingRecordToColumns = (item) => {
    return {
      no: item?.no,
      productName: item?.productName,
      category: item?.category,
      quantity: formatNumber(item?.quantity),
      totalCost: formatCurrency(item?.totalCost),
      totalProductCost: formatCurrency(item?.totalProductCost),
      thumbnail: item?.thumbnail,
    };
  };

  return (
    <>
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
                      <Text className="branch-name">{branchName}</Text>
                    </Col>
                    <Col span={2} className="div-icon-down">
                      <DownIcon />
                    </Col>
                  </Row>
                </Button>
              </Popover>
              <FnbDatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date, typeOptionDate) => onSelectedDatePickerAsync(date, typeOptionDate)}
                setConditionCompare={onConditionCompare}
              />
            </Row>
          </Col>
        </Row>
      </Col>
      <div className="mt-5 product-report-summary w-100">
        <ProductReportWidgetComponent
          data={{ ...productReportWidgetData }}
          description={productReportWidgetDescription(productTransactionReport?.orderProductReport)}
        />
        <Card className="w-100 revenue">
          <h2 className="product-revenue-title">{pageData.reportTitle}</h2>
          <div className="product-revenue-summary">{renderPieChart()}</div>
        </Card>
      </div>
      <div className="top-selling-product-transaction">
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} style={isTabletOrMobile ? "" : { paddingRight: "16px" }}>
            <TopSellingProductComponent
              dataSource={topSellingProducts}
              title={pageData.bestSellingProduct}
              hideSeeMore={true}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            style={isTabletOrMobile ? { marginTop: "36px" } : { paddingLeft: "16px" }}
          >
            <TopSellingProductComponent
              dataSource={worstSellingProduct}
              title={pageData.worstSellingProduct}
              hideSeeMore={true}
            />
          </Col>
        </Row>
      </div>
      <div className="sold-product mt-5">
        <div className="cc-wrapper cc-wrapper--scroll sold-product-modal-table" onScroll={onScrollSpace}>
          <PageTitle className="mb-3 title-dashboard" content={pageData.soldProducts} />
          <div className="ccw-table ccw-table--full">
            <FnbTable columns={tableSoldSettings.columns} dataSource={soldProducts} />
          </div>
        </div>
      </div>
      <Row className="sold-product-report-total">
        <Col span={12}>
          <span className="total-text">{pageData.total.toUpperCase()}</span>
        </Col>
        <Col span={4}>
          <span className="quantity-text">{formatNumber(totalQuantity)}</span>
        </Col>
        <Col span={4}>
          <span className="amount-text">{formatCurrency(totalAmount)}</span>
        </Col>
        <Col span={4}>
          <span className="cost-text">{formatCurrency(totalCost)}</span>
        </Col>
      </Row>
    </>
  );
}
