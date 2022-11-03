import { Button, Col, Popover, Radio, Row, Tabs, Typography } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import PageTitle from "components/page-title";
import { BranchIcon, DownIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import branchDataService from "data-services/branch/branch-data.service";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrency } from "utils/helpers";
import OverviewComponent from "./component/overview.component";
import "./customer.page.scss";

const { Text } = Typography;
const { TabPane } = Tabs;

export default function CustomerReport() {
  const [t] = useTranslation();

  const pageData = {
    title: t("report.customer.title"),
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
    tabOverView: t("report.customer.tabOverView"),
    tabView: t("report.customer.tabView"),
    tabAccessTimes: t("report.customer.tabAccessTimes"),
    allBranch: t("dashboard.allBranch"),
  };

  const defaultScreen = "1";
  const [activeScreen, setActiveScreen] = React.useState(defaultScreen);
  const currency = getCurrency();
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [visible, setVisible] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);

  const screens = [
    {
      name: pageData.tabOverView,
      key: "1",
      component: (
        <OverviewComponent
          selectedDates={selectedDate}
          branchId={branchId}
          segmentTimeOption={typeOptionDate}
          key={1}
        />
      ),
    },
    {
      name: pageData.tabView,
      key: "2",
      component: "",
    },
    {
      name: pageData.tabAccessTimes,
      key: "3",
      component: "",
    },
  ];

  useEffect(() => {
    getBranches();
    onConditionCompare(OptionDateTime.today);
  }, []);

  const getBranches = async () => {
    const branchesResponse = await branchDataService.getAllBranchsAsync();
    if (branchesResponse) {
      setBranches(branchesResponse.branchs);
      setBranchName(pageData.allBranch);
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

    setVisible(false);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
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

  const renderScreenContent = () => {
    const screenActive = screens.find((item) => item.key === activeScreen);
    if (screenActive !== null) {
      return screenActive.component;
    }

    return defaultScreen;
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
          <Tabs defaultActiveKey={1} className="transaction-report-tabs" onChange={(key) => setActiveScreen(key)}>
            {screens?.map((screen) => {
              return <TabPane tab={screen.name} key={screen.key}></TabPane>;
            })}
          </Tabs>
          <div>{renderScreenContent()}</div>
        </Col>
      </Row>
    </>
  );
}
