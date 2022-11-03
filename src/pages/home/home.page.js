import { Button, Card, Col, Popover, Radio, Row, Table, Typography } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnBWidget } from "components/fnb-widget/fnb-widget.component";
import { RevenueLineChartComponent } from "components/line-chart/line-chart.component";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { BranchIcon, CostIcon, CubeIcon, DownIcon, FolderIcon, RevenueIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { resetSession } from "store/modules/session/session.actions";
import { formatTextNumber, getCurrency, getStartDateEndDateInUtc, tokenExpired } from "utils/helpers";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";
import StaffActivitiesComponent from "./components/staff-activities.component";
import "./index.scss";

const { Text, Paragraph } = Typography;

function Home(props) {
  const { orderDataService, branchDataService } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const currency = getCurrency();
  const pageData = {
    title: t("dashboard.title"),
    order: t("dashboard.order"),
    revenue: t("dashboard.revenue"),
    cost: t("dashboard.cost"),
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
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    noDataFound: t("table.noDataFound"),
    topSellingProductTitle: t("dashboard.topSellingProduct.title"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
    topSellingProductItems: t("dashboard.topSellingProduct.items"),
    topCustomerTitle: t("dashboard.topCustomer.title"),
    recentlyActivitiesText: t("homePage.recentlyActivitiesText"),
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
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const tableLineChartRef = React.useRef(null);

  useEffect(() => {
    let isTokenExpired = checkTokenExpired();
    if (isTokenExpired) {
      dispatch(resetSession());
      props.history.push("/login");
    } else {
      getInfoData(branchId, selectedDate, typeOptionDate);
      getStatisticalData(branchId, selectedDate, typeOptionDate);
    }
  }, []);

  const checkTokenExpired = () => {
    let isTokenExpired = true;
    let token = getStorage(localStorageKeys.TOKEN);
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token);
    }
    return isTokenExpired;
  };

  const getInfoData = (branchId, date, typeOptionDate) => {
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    branchDataService.getAllBranchsAsync().then((res) => {
      setBranches(res.branchs);
    });
    onConditionCompare(OptionDateTime.today);
  };

  const getStatisticalData = (branchId, date, typeOptionDate) => {
    let dateTimeFormatInUtc = getStartDateEndDateInUtc(date?.startDate, date?.endDate);

    let req = {
      branchId: branchId ?? "",
      startDate: dateTimeFormatInUtc?.fromDate,
      endDate: dateTimeFormatInUtc?.toDate,
      segmentTimeOption: typeOptionDate,
    };

    orderDataService
      .calculateStatisticalDataAsync(req)
      .then((res) => {
        if (tableLineChartRef && tableLineChartRef.current) {
          tableLineChartRef.current.fillData(date, typeOptionDate, res);
        }
      })
      .catch((errors) => {
        if (tableLineChartRef && tableLineChartRef.current) {
          tableLineChartRef.current.fillData(date, typeOptionDate, { orderData: [] });
        }
      });
  };

  const getOrderInfoByFilter = (branchId, date, typeOptionDate) => {
    // startDate and endDate are local time from client
    let startDate = moment(date?.startDate).format(DateFormat.MM_DD_YYYY);
    let endDate = moment(date?.endDate).format(DateFormat.MM_DD_YYYY);
    let req = {
      branchId: branchId ?? "",
      startDate: startDate,
      endDate: endDate,
      typeOptionDate: typeOptionDate,
    };
    orderDataService.getOrderBusinessSummaryWidgetAsync(req).then((res) => {
      setInitData(res);
    });

    orderDataService.getOrderTopSellingProductAsync(req).then((res) => {
      setTopSellingProducts(res.listTopSellingProduct);
      setTopCustomers(res.listTopCustomer);
    });
  };

  const renderWidgets = () => {
    let listBusiness = [
      {
        total: formatTextNumber(initData?.totalOrder),
        name: pageData.order,
        percent: initData?.percentOrder,
        icon: <CubeIcon className="icon-cube" />,
      },
      {
        total: formatTextNumber(initData?.totalRevenue),
        name: pageData.revenue,
        percent: initData?.percentRevenue,
        icon: <RevenueIcon className="icon-cube" />,
      },
      {
        total: formatTextNumber(initData?.totalCost),
        name: pageData.cost,
        percent: initData?.percentCost,
        icon: <CostIcon className="icon-cube" />,
      },
    ];

    const widgets = listBusiness?.map((item, index) => {
      const value = `${item?.total} ${index === 0 ? "" : currency}`;
      const descriptionFormat = "{{status}} {{value}}% {{compareWith}}";
      const status = item?.percent >= 0 ? pageData.txt_increase : pageData.txt_reduce;
      const description = `${t(descriptionFormat, {
        status: status,
        value: item?.percent,
        compareWith: t(titleConditionCompare),
      })}`;
      return (
        <Col key={index} xs={24} sm={24} md={24} lg={24} xl={8} xxl={8} className="col-group-business">
          <FnBWidget
            title={item?.name}
            icon={item?.icon}
            value={value}
            description={description}
            isIncrease={item?.percent >= 0}
          />
        </Col>
      );
    });

    return <>{widgets}</>;
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

  const handleChangeBranch = (e) => {
    let branchIdSelected = e?.target?.value;
    if (branchIdSelected !== null) {
      setBranchId(branchIdSelected);
      let branchInfo = branches.find((b) => b.id === branchIdSelected);
      setBranchName(branchInfo?.name);
    } else {
      branchIdSelected = "";
      setBranchId(null);
      setBranchName("");
    }
    getOrderInfoByFilter(branchIdSelected, selectedDate, typeOptionDate);
    setVisible(false);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
    getOrderInfoByFilter(branchId, date, typeOptionDate);
    getStatisticalData(branchId, date, typeOptionDate);
  };

  const onConditionCompare = (key) => {
    let titleConditionCompare = "";
    switch (key) {
      case OptionDateTime.today:
        titleConditionCompare = pageData.date.yesterday;
        break;
      case OptionDateTime.yesterday:
        titleConditionCompare = pageData.date.previousDay;
        break;
      case OptionDateTime.thisWeek:
        titleConditionCompare = pageData.date.lastWeek;
        break;
      case OptionDateTime.lastWeek:
        titleConditionCompare = pageData.date.previousWeek;
        break;
      case OptionDateTime.thisMonth:
        titleConditionCompare = pageData.date.lastMonth;
        break;
      case OptionDateTime.lastMonth:
        titleConditionCompare = pageData.date.previousMonth;
        break;
      case OptionDateTime.thisYear:
        titleConditionCompare = pageData.date.lastYear;
        break;
      default:
        break;
    }

    setTitleConditionCompare(titleConditionCompare);
  };

  const tableTopSellingProductSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: "productName",
        width: "65%",
        align: "left",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <div className="table-selling-product-row">
              <Row>
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-no table-selling-product-name-mobile">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
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
                    <Col span={24} className="table-selling-product-text-no" style={{ fontSize: "14px" }}>
                      {record?.priceName}
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          ) : (
            <Row>
              <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={10} className="table-selling-product-no">
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
      },
      {
        dataIndex: "quantity",
        width: "35%",
        align: "right",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <>
              <div
                className={
                  record?.priceName
                    ? "table-selling-product-item-mobile table-selling-product-row"
                    : "table-selling-product-item-mobile table-selling-product-row table-selling-product-item-mobile-margin"
                }
              >
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${value} ${pageData.topSellingProductItems}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <Row>
                <Col
                  span={24}
                  className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                >
                  {`${value} ${pageData.topSellingProductItems}`}
                </Col>
              </Row>
              <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
              </Row>
            </>
          );
        },
      },
    ],
  };

  const tableTopCustomerSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: "customerName",
        width: "65%",
        align: "left",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <div className="table-customer-row">
              <Row>
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-no table-selling-product-name-mobile">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
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
                </div>
              </Row>
            </div>
          ) : (
            <Row>
              <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={10} className="table-selling-product-no">
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
              </Col>
            </Row>
          );
        },
      },
      {
        dataIndex: "cost",
        width: "35%",
        align: "right",
        render: (value) => {
          return isTabletOrMobile ? (
            <>
              <div className="table-selling-product-item-mobile table-customer-row table-customer-item-mobile-margin">
                <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  <Col span={24}>{`${formatTextNumber(value)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <Row className="table-selling-product-text-no table-selling-product-text-no-font-size">
                <Col span={24}>{`${formatTextNumber(value)} ${getCurrency()}`}</Col>
              </Row>
            </>
          );
        },
      },
    ],
  };

  const renderTopSellingProductAndCustomer = () => {
    return (
      <>
        <Row className="mt-5">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} style={isTabletOrMobile ? "" : { paddingRight: "20px" }}>
            <Card
              className={
                isTabletOrMobile
                  ? "fnb-box custom-box card-selling-product-thumbnail"
                  : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-width"
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: "#2B2162" }}>{pageData.topSellingProductTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p
                    className="table-selling-product-see-more"
                    onClick={() => {
                      props.history.push("/report/transaction/3");
                    }}
                  >
                    {pageData.topSellingProductSeemore}
                  </p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  ),
                }}
                className="fnb-table form-table table-selling-product"
                columns={tableTopSellingProductSettings.columns}
                dataSource={topSellingProducts}
                pagination={false}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={isTabletOrMobile ? { marginTop: "36px" } : { paddingLeft: "20px" }}
          >
            <Card
              className={
                isTabletOrMobile
                  ? "fnb-box custom-box card-selling-product-thumbnail"
                  : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-width"
              }
            >
              <Row className="group-header-top-selling-product-box">
                <Col xs={18} sm={18} lg={18}>
                  <p style={{ color: "#2B2162" }}>{pageData.topCustomerTitle}</p>
                </Col>
                <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align">
                  <p className="table-selling-product-see-more">{pageData.topSellingProductSeemore}</p>
                </Col>
              </Row>
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
                    </>
                  ),
                }}
                className="fnb-table form-table table-selling-product"
                columns={tableTopCustomerSettings.columns}
                dataSource={topCustomers}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  return (
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
                      <Text className="branch-name">{branchName ? branchName : pageData.allBranch}</Text>
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
        <Row gutter={[44, 28]}>{renderWidgets()}</Row>
        <Row gutter={[40, 0]}>
          <Col xs={24} sm={24} lg={16} className="mt-4">
            <Row>
              <RevenueLineChartComponent ref={tableLineChartRef} />
            </Row>
            {renderTopSellingProductAndCustomer()}
          </Col>
          <Col xs={24} sm={24} lg={8} className="mt-4">
            <StaffActivitiesComponent />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default Home;
