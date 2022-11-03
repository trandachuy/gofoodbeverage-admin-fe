import { Button, Card, Col, Popover, Radio, Row, Typography } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { BranchIcon, DownIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import orderDataService from "data-services/order/order-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { capitalize, executeAfter, formatCurrencyWithoutSuffix, isJsonString } from "utils/helpers";
import { getStorage, localStorageKeys, setStorage } from "utils/localStorage.helpers";
import FilterOrderReport from "./filter-order-report.component";
import TransactionPieChart from "./transaction-pie-chart/index";

import "./index.scss";
const { Text } = Typography;

export default function TableOrder(props) {
  const [t] = useTranslation();
  const {
    currentPageNumber,
    dataSource,
    pageSize,
    total,
    keySearch,
    setOrderTransactionReport,
    orderTransactionReport,
    setListOrder,
    setTotalOrder,
    mappingToDataTable,
    setKeySearch,
    setCurrentPageNumber,
    setPageSize,
    orderManagementReportFilters,
  } = props;
  const customerDetailLink = "/customer/detail/";

  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const clearFilterFunc = React.useRef(null);

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
    subtotal: t("table.subtotal"),
    feeAndTax: t("order.feeAndTax"),
    shippingFee: t("order.shippingFee"),
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
    noDataFound: t("table.noDataFound"),
    topSellingProductTitle: t("dashboard.topSellingProduct.title"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
    topSellingProductItems: t("dashboard.topSellingProduct.items"),
    topCustomerTitle: t("dashboard.topCustomer.title"),
    btnExport: t("button.export"),
    totalOrder: t("order.totalOrder"),
    canceled: t("order.canceled"),
    inStore: t("order.inStore"),
    takeAway: t("order.takeAway"),
    goFnBApp: t("order.goFnBApp"),
    storeWeb: t("order.storeWeb"),
    storeApp: t("order.storeApp"),
    summary: t("report.summary"),
    orderManagement: t("order.orderManagement"),
    search: t("order.search"),
    allTypes: t("order.allTypes"),
    allMethods: t("order.allMethods"),
    allCustomer: t("order.allCustomer"),
    all: t("order.all"),
    platform: t("platform.title"),
    orderByPlatform: t("platform.orderByPlatform"),
    serviceType: t("reportRevenue.serviceType"),
    orderByServiceType: t("reportRevenue.orderByServiceType"),
    orderByStatus: t("reportRevenue.orderByStatus"),
  };

  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);
  const [visible, setVisible] = useState(false);
  const [branches, setBranches] = useState([]);
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [orderReportFilters, setOrderReportFilters] = useState({});
  const [serviceTypes, setServiceTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [revenueByPlatform, setRevenueByPlatform] = useState([]);
  const [revenueByServiceType, setRevenueByServiceType] = useState([]);
  const [revenueByOrderStatus, setRevenueByOrderStatus] = useState([]);
  const [pageNumberFilter, setPageNumberFilter] = useState(null);

  useEffect(() => {
    setPageNumberFilter(currentPageNumber);
    getInfoData();
    getOrderTransactionPieChartByFilter(branchId, selectedDate, typeOptionDate);
  }, []);

  const getInfoData = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      setBranches(res.branchs);
      setBranchName(pageData.allBranch);
    });
    onConditionCompare(OptionDateTime.today);
  };

  const getColumnOrder = [
    {
      title: pageData.id,
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (_, record) => {
        let href = `/report/order/detail/${record.id}`;
        return (
          <Link to={href} target="_blank">
            {record.code}
          </Link>
        );
      },
    },
    {
      title: pageData.status,
      dataIndex: "statusName",
      key: "statusName",
      width: "15%",
      render: (_, record) => {
        const orderStatusColor = {
          0: "new-order-color",
          1: "returned-order-color",
          2: "canceled-order-color",
          3: "to-confirm-order-color",
          4: "processing-order-color",
          5: "delivering-order-color",
          6: "completed-order-color",
          7: "draft-order-color",
        };
        return <span className={`order-status ${orderStatusColor[record?.statusId]}`}>{record?.statusName}</span>;
      },
    },
    {
      title: pageData.type,
      dataIndex: "orderTypeName",
      key: "orderTypeName",
      width: "15%",
    },
    {
      title: pageData.detail,
      dataIndex: "detail",
      key: "detail",
      width: "28%",
      render: (_, record) => {
        return (
          <>
            <Row className="order-report-detail">
              <Col span={12}>{pageData.subtotal}</Col>
              <Col span={12} className="text-right">
                {formatCurrencyWithoutSuffix(record?.grossTotal)}
              </Col>
            </Row>
            <Row className="order-report-detail">
              <Col span={12}>{pageData.discount}</Col>
              <Col span={12} className="text-right">
                -{formatCurrencyWithoutSuffix(record?.discount)}
              </Col>
            </Row>
            <Row className="order-report-detail">
              <Col span={12}>{pageData.feeAndTax}</Col>
              <Col span={12} className="text-right">
                {formatCurrencyWithoutSuffix(record?.totalFee)}
              </Col>
            </Row>
            {record?.orderTypeId === OrderTypeConstants.Delivery && (
              <Row className="order-report-detail">
                <Col span={12}>{pageData.shippingFee}</Col>
                <Col span={12} className="text-right">
                  {formatCurrencyWithoutSuffix(record?.deliveryFee)}
                </Col>
              </Row>
            )}
            <Row className="order-report-detail">
              <Col span={12}>{capitalize(pageData.paymentMethod)}</Col>
              <Col span={12} className="text-right">
                {record?.paymentMethod}
              </Col>
            </Row>
            <Row className="order-report-total">
              <Col span={12}>
                <b>{pageData.total}</b>
              </Col>
              <Col span={12} className="text-right">
                <b>{formatCurrencyWithoutSuffix(record?.totalAmount)}</b>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "2%",
    },
    {
      title: pageData.customer,
      dataIndex: "customer",
      key: "customer",
      width: "30%",
      align: "left",
      render: (_, record) => {
        return (
          record?.customerId === undefined || (
            <div className="order-report-customer">
              <Row className="order-report-customer-row">
                <Col span={12} className="order-report-customer-name">
                  <Link to={`${customerDetailLink}${record?.customerId}`} target="_blank">
                    {record?.fullName}
                  </Link>
                </Col>
                <Col span={12} className="text-right">
                  {record?.phoneNumber}
                </Col>
              </Row>
              <Row className="order-report-customer-row">
                <Col span={12}>Rank</Col>
                {record?.rank ? (
                  <Col span={12} className="order-report-customer-rank text-right">
                    {record?.rank}
                  </Col>
                ) : (
                  <Col span={12} className="text-right">
                    _
                  </Col>
                )}
              </Row>
              <Row className="order-report-customer-row">
                <Col span={12}>{pageData.point}</Col>
                <Col span={12} className="text-right">
                  {record?.accumulatedPoint}
                </Col>
              </Row>
            </div>
          )
        );
      },
    },
  ];

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

  const handleClearFilterAndSearch = () => {
    onClearFilter();
    setKeySearch("");
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
    getOrderInfoByFilter(branchIdSelected, selectedDate, typeOptionDate, pageNumberFilter, pageSize, keySearch);
    setVisible(false);
    getOrderTransactionPieChartByFilter(branchIdSelected, selectedDate, typeOptionDate);
    handleClearFilterAndSearch();
  };

  const getOrderInfoByFilter = (branchId, date, typeOptionDate, currentPageNumber, pageSize, keySearch) => {
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: currentPageNumber,
      pageSize: pageSize,
      keySearch: keySearch,
    };
    orderDataService.getOrderManagementAsync(req).then((res) => {
      let orders = mappingToDataTable(res.orders);
      setListOrder(orders);
      setOrderTransactionReport(res.orderTransactionReport);
      setTotalOrder(res.total);
      setOrderReportFilters(res.orderReportFilters);
    });
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    getOrderInfoByFilter(branchId, date, typeOptionDate, pageNumberFilter, pageSize, keySearch);
    getOrderTransactionPieChartByFilter(branchId, date, typeOptionDate);
    handleClearFilterAndSearch();
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

  const onSearchOrder = (keySearch) => {
    let data = {};
    let sessionOrderReportFilter = getStorage(localStorageKeys.ORDER_REPORT_FILTER);
    if (isJsonString(sessionOrderReportFilter)) {
      let orderReportFilter = JSON.parse(sessionOrderReportFilter);
      if (orderReportFilter && orderReportFilter.count > 0) {
        data = {
          serviceTypeId: orderReportFilter.serviceTypeId,
          paymentMethodId: orderReportFilter.paymentMethodId,
          customerId: orderReportFilter.customerId,
          orderStatusId: orderReportFilter.orderStatusId,
        };
      } else {
        data = {
          serviceTypeId: "",
          paymentMethodId: "",
          customerId: "",
          orderStatusId: "",
        };
      }
    }
    executeAfter(500, async () => {
      setKeySearch(keySearch);
      let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
      let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
      let req = {
        branchId: branchId,
        startDate: startDate,
        endDate: endDate,
        typeOptionDate: typeOptionDate,
        pageNumber: pageNumberFilter,
        pageSize: pageSize,
        keySearch: keySearch,
        serviceTypeId: data?.serviceTypeId ?? "",
        paymentMethodId: data?.paymentMethodId ?? "",
        customerId: data?.customerId ?? "",
        orderStatusId: data?.orderStatusId ?? "",
      };
      const response = await orderDataService.getOrderReportByFilterAsync(req);
      let orders = mappingToDataTable(response.orders);
      setListOrder(orders);
      setTotalOrder(response.total);
      setCurrentPageNumber(response.pageNumber);
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    setCurrentPageNumber(pageNumber);
    setPageSize(pageSize);
    getOrderInfoByFilter(branchId, selectedDate, typeOptionDate, pageNumber, pageSize, keySearch);
  };

  const handleFilterOrderReport = async (data) => {
    let startDate = moment(selectedDate?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(selectedDate?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId,
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
      pageNumber: pageNumberFilter,
      pageSize: pageSize,
      keySearch: keySearch,
      serviceTypeId: data?.serviceTypeId ?? "",
      paymentMethodId: data?.paymentMethodId ?? "",
      customerId: data?.customerId ?? "",
      orderStatusId: data?.orderStatusId ?? "",
    };
    const response = await orderDataService.getOrderReportByFilterAsync(req);
    let orders = mappingToDataTable(response.orders);
    setListOrder(orders);
    setTotalOrder(response.total);
    setCurrentPageNumber(response.pageNumber);
    setCountFilter(data?.count);
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterOrderReport
          fetchDataOrderReport={handleFilterOrderReport}
          serviceTypes={serviceTypes}
          paymentMethods={paymentMethods}
          customers={customers}
          orderStatus={orderStatus}
          tableFuncs={clearFilterFunc}
        />
      )
    );
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }

    if (orderManagementReportFilters.serviceTypes) {
      const allServiceType = {
        id: "",
        name: pageData.allTypes,
      };
      const serviceTypes = [allServiceType, ...orderManagementReportFilters.serviceTypes];
      setServiceTypes(serviceTypes);
    }

    if (orderManagementReportFilters.paymentMethods) {
      const allPaymentMethod = {
        id: "",
        name: pageData.allMethods,
      };
      const paymentMethods = [allPaymentMethod, ...orderManagementReportFilters.paymentMethods];
      setPaymentMethods(paymentMethods);
    }

    if (orderManagementReportFilters.customers) {
      const allCustomer = {
        id: "",
        name: pageData.allCustomer,
      };
      const customers = [allCustomer, ...orderManagementReportFilters.customers];
      setCustomers(customers);
    }

    if (orderManagementReportFilters.orderStatus) {
      const allOrderStatus = {
        id: "",
        name: pageData.all,
      };
      const orderStatus = [allOrderStatus, ...orderManagementReportFilters.orderStatus];
      setOrderStatus(orderStatus);
    }
  };

  const onClearFilter = () => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current();
      setShowPopover(false);
    } else {
      setStorage(localStorageKeys.ORDER_REPORT_FILTER, null);
      setCountFilter(0);
      setShowPopover(false);
    }
  };

  /* Transaction Order by Pie Chart */
  const getOrderTransactionPieChartByFilter = (branchId, date, typeOptionDate) => {
    let startDate = moment(date?.startDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
    let endDate = moment(date?.endDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
    let req = {
      branchId: branchId,
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
    };
    orderDataService.getRevenueByTypeAsync(req).then((res) => {
      if (res) {
        setRevenueByPlatform(res.revenueByPlatforms);
        setRevenueByServiceType(res.revenueByServiceTypes);
        setRevenueByOrderStatus(res.revenueByOrderStatus);
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

  const getDataServiceTypeForPieChart = () => {
    const serviceTypeColor = ["#FF8C21", "#FFAD62", "#F3D2B3", "#FFEDDD"];
    return revenueByServiceType?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalOrder,
        color: serviceTypeColor[index],
        totalAmount: item?.totalAmount,
      };
    });
  };

  const getDataOrderStatusColorForPieChart = () => {
    return revenueByOrderStatus?.map((item, index) => {
      return {
        label: item?.name,
        value: item?.totalOrder,
        color: getColorForOrder(index),
        totalAmount: item?.totalAmount,
      };
    });
  };

  //Fill color by index of status
  const getColorForOrder = (index) => {
    switch (index) {
      case 0:
        return "#50429B";
      case 1:
        return "#5949AD";
      case 2:
        return "#6452C8";
      case 3:
        return "#6F5CDA";
      case 4:
        return "#7D69EE";
      case 5:
        return "#917DFE";
      case 6:
        return "#A798FA";
      default:
        return "#FF8C21";
    }
  };

  const renderPieChartSummary = () => {
    return (
      <Row gutter={[24, 24]} className="order-summary-pie-chart">
        <Col xs={24} sm={24} md={24} lg={8}>
          <div className="pie-chart-element">
            <div className="pie-chart-element-wrapper">
              <TransactionPieChart
                dataSourceRevenue={revenueByPlatform}
                getDataForPieChart={getDataPlatformForPieChart()}
                titleBack={pageData.platform.toUpperCase()}
                chartName={pageData.orderByPlatform}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          {/* OrderByServiceType */}
          <div className="pie-chart-element">
            <div className="pie-chart-element-wrapper">
              <TransactionPieChart
                dataSourceRevenue={revenueByServiceType}
                getDataForPieChart={getDataServiceTypeForPieChart()}
                titleBack={pageData.serviceType.toUpperCase()}
                chartName={pageData.orderByServiceType}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          {/* OrderByStatus */}
          <div className="pie-chart-element">
            <div className="pie-chart-element-wrapper">
              <TransactionPieChart
                dataSourceRevenue={revenueByOrderStatus}
                getDataForPieChart={getDataOrderStatusColorForPieChart()}
                titleBack={pageData.status.toUpperCase()}
                chartName={pageData.orderByStatus}
              />
            </div>
          </div>
        </Col>
      </Row>
    );
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
        <Row className="fnb-row-page-header">
          <Col span={12}>
            <PageTitle content={pageData.summary} />
          </Col>
        </Row>
      </Col>
      <Row className="mt-5 mb-5">{renderPieChartSummary()}</Row>
      <Row className="fnb-row-page-header">
        <Col span={24}>
          <PageTitle content={pageData.orderManagement} />
        </Col>
      </Row>
      <Card className="fnb-card">
        <FnbTable
          className="report-transaction-order-table mt-4"
          columns={getColumnOrder}
          pageSize={pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={total}
          onChangePage={onChangePage}
          search={{
            placeholder: pageData.search,
            onChange: onSearchOrder,
          }}
          filter={{
            onClickFilterButton: onClickFilterButton,
            totalFilterSelected: countFilter,
            onClearFilter: onClearFilter,
            buttonTitle: pageData.btnFilter,
            component: filterComponent(),
          }}
        />
      </Card>
    </>
  );
}
