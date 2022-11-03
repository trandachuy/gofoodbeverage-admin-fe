import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, DatePicker, Form, Row, Select, Space } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import shiftDataService from "data-services/shift/shift-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatCurrency, getCurrency, hasPermission } from "utils/helpers";
import "../index.scss";
const { Option } = Select;

export default function TableShift(props) {
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [branches, setBranches] = useState([]);
  const [date, setDate] = useState(moment(new Date()));
  const [shiftData, setShiftData] = useState({});
  const [branchId, setBranchId] = useState("");

  const pageData = {
    title: t("report.shift.title"),
    no: t("table.no"),
    staff: t("report.shift.staff"),
    order: t("report.shift.order"),
    soldProducts: t("report.shift.soldProducts"),
    totalDiscount: t("report.shift.totalDiscount"),
    revenue: t("report.shift.revenue"),
    paymentMethod: t("report.shift.paymentMethod"),
    initialAmount: t("report.shift.initialAmount"),
    discount: t("report.shift.discount"),
    withdrawalAmount: t("report.shift.withdrawalAmount"),
    remainAmount: t("report.shift.remainAmount"),
    cash: t("report.shift.cash"),
    checkIn: t("report.shift.checkIn"),
    checkOut: t("report.shift.checkOut"),
    moMo: t("report.shift.moMo"),
    atm: t("report.shift.atm"),
    canceledOrder: t("report.shift.canceledOrder"),
    branchSelectPlaceholder: t("material.inventory.branchSelectPlaceholder"),
    percent: "%",
    blank: "_",
    paymentMethod: t("payment.paymentMethod"),
    canceledOrder: t("order.canceledOrder"),
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "5%",
        align: "center",
        render: (_, record) => {
          return (
            <div>
              <Link to={`/shift/detail/${record?.id}`}>{record?.index}</Link>
            </div>
          );
        },
      },
      {
        title: pageData.staff,
        dataIndex: "staff",
        key: "staff",
        width: "5%",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  <h1>{record?.name}</h1>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span>{pageData.checkIn}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span>{record?.checkIn}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span>{pageData.checkOut}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span>{record?.checkOut}</span>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.revenue,
        dataIndex: "revenue",
        key: "revenue",
        width: "7%",
        align: "right",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.initialAmount}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{formatCurrency(record?.initialAmount)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.revenue}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{formatCurrency(record?.revenue)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.discount}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{formatCurrency(record?.discount)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.withdrawalAmount}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{formatCurrency(record?.withdrawalAmount)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.remainAmount}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right" style={{ color: "red" }}>
                    {formatCurrency(record?.remain)}
                  </span>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.paymentMethod,
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: "5%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.cash}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{record?.cash}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.moMo}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{record?.moMo}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className="float-left">{pageData.atm}</span>
                </Col>
                <Col span={12} className="mt-1">
                  <span className="float-right">{record?.atm}</span>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.canceledOrder,
        dataIndex: "cancleOrderAmount",
        key: "cancleOrderAmount",
        width: "5%",
        align: "center",
      },
    ],

    onChangePage: async (page, pageSize) => {
      fetchDatableAsync(page, pageSize, moment(date).format(DateFormat.YYYY_MM_DD), "");
    },
  };

  useEffect(() => {
    var currentPageNumberInitial = currentPageNumber ?? 1;
    fetchDatableAsync(currentPageNumberInitial, tableSettings.pageSize, moment(date).format(DateFormat.YYYY_MM_DD), "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, date, branchId) => {
    const response = await shiftDataService.getShiftssAsync(date, branchId, pageNumber, pageSize);
    const data = response?.shift?.shiftTableModels.map((s) => mappingRecordToColumns(s));

    setShiftData(response?.shift);
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);

    branchDataService.getAllBranchsAsync().then((res) => {
      if (res && res?.branchs?.length > 0) {
        setBranches(res.branchs);
      }
    });
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      name: item?.staffName,
      checkIn: item?.checkIn,
      checkOut: item?.checkOut,
      initialAmount: item?.initialAmount,
      withdrawalAmount: item?.withdrawalAmount,
      revenue: item?.revenue,
      discount: item?.discount,
      remain: item?.remain,
      moMo: item?.moMo,
      cash: item?.cash,
      atm: item?.atm,
      cancleOrderAmount: item?.cancleOrderAmount,
      id: item?.shiftId,
    };
  };

  /// Render table columns by permission
  const getTableColumns = () => {
    if (hasPermission(PermissionKeys.EDIT_CUSTOMER || hasPermission(PermissionKeys.DELETE_CUSTOMER))) {
      return tableSettings.columns;
    } else {
      return tableSettings.columns.filter((c) => c.key !== "action");
    }
  };

  const onChangeDate = (dateInput) => {
    setDate(dateInput);

    if (dateInput) {
      fetchDatableAsync(1, tableSettings.pageSize, moment(dateInput).format(DateFormat.YYYY_MM_DD), branchId);
    }
  };

  const onChangeBranch = (id) => {
    setBranchId(id);
    if (id) {
      fetchDatableAsync(1, tableSettings.pageSize, moment(date).format(DateFormat.YYYY_MM_DD), id);
    }
  };

  return (
    <>
      <Form className="form-staff">
        <Row>
          <Col span={24}>
            <Space className="float-right mb-3">
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                showSearch
                allowClear
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder={pageData.branchSelectPlaceholder}
                onChange={(value) => onChangeBranch(value)}
              >
                {branches?.map((item) => (
                  <Option key={item?.id} value={item.key}>
                    {item?.name}
                  </Option>
                ))}
              </Select>
            </Space>
            <Space className="float-right mb-3">
              <div style={{ width: 20 }}></div>
            </Space>
            <Space className="float-right mb-3">
              <DatePicker
                className="w-100"
                format={DateFormat.DD_MM_YYYY}
                onChange={(date) => onChangeDate(date)}
                defaultValue={moment(new Date(), DateFormat)}
              />
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Card className="border-div">
              <Row className="text-align-center"> {pageData.order}</Row>
              <br />
              <Row className="text-align-center">
                <h1>{shiftData?.orderValue} </h1>
              </Row>
              <Row className="text-align-center">
                {shiftData?.orderIncrease === true ? (
                  <div style={{ color: "#08c" }}>
                    <ArrowUpOutlined style={{ color: "#08c" }} />
                    {shiftData?.orderPercent}
                    {pageData.percent}
                  </div>
                ) : shiftData?.orderIncrease === false ? (
                  <div style={{ color: "red" }}>
                    <ArrowDownOutlined style={{ color: "red" }} />
                    {shiftData?.orderPercent}
                    {pageData.percent}
                  </div>
                ) : (
                  pageData.blank
                )}
              </Row>
            </Card>
          </Col>
          <Col span={1}> </Col>
          <Col span={5}>
            <Card className="border-div">
              <Row className="text-align-center">{pageData.soldProducts}</Row>
              <br />
              <Row className="text-align-center">
                <h1>{shiftData?.soldProductValue}</h1>
              </Row>
              <Row className="text-align-center">
                {shiftData?.soldProductIncrease === true ? (
                  <div style={{ color: "#08c" }}>
                    <ArrowUpOutlined style={{ color: "#08c" }} />
                    {shiftData?.soldProductPercent}
                    {pageData.percent}
                  </div>
                ) : shiftData?.soldProductIncrease === false ? (
                  <div style={{ color: "red" }}>
                    <ArrowDownOutlined style={{ color: "red" }} />
                    {shiftData?.soldProductPercent}
                    {pageData.percent}
                  </div>
                ) : (
                  pageData.blank
                )}
              </Row>
            </Card>
          </Col>
          <Col span={1}> </Col>
          <Col span={5}>
            <Card className="border-div">
              <Row className="text-align-center"> {pageData.totalDiscount}</Row>
              <Row className="text-align-center"> {"(".concat(getCurrency()).concat(")")}</Row>
              <Row className="text-align-center">
                <h1>{formatCurrency(shiftData?.totalDiscountValue)}</h1>
              </Row>
              <Row className="text-align-center">
                {shiftData?.totalDiscountIncrease === true ? (
                  <div style={{ color: "#08c" }}>
                    <ArrowUpOutlined style={{ color: "#08c" }} />
                    {shiftData?.totalDiscountPercent}
                    {pageData.percent}
                  </div>
                ) : shiftData?.totalDiscountIncrease === false ? (
                  <div style={{ color: "red" }}>
                    <ArrowDownOutlined style={{ color: "red" }} />
                    {shiftData?.totalDiscountPercent}
                    {pageData.percent}
                  </div>
                ) : (
                  pageData.blank
                )}
              </Row>
            </Card>
          </Col>
          <Col span={1}> </Col>
          <Col span={5}>
            <Card className="border-div">
              <Row className="text-align-center"> {pageData.revenue}</Row>
              <Row className="text-align-center"> {"(".concat(getCurrency()).concat(")")}</Row>
              <Row className="text-align-center">
                <h1>{formatCurrency(shiftData?.revenueValue)}</h1>
              </Row>
              <Row className="text-align-center">
                {shiftData?.revenueIncrease === true ? (
                  <div style={{ color: "#08c" }}>
                    <ArrowUpOutlined style={{ color: "#08c" }} />
                    {shiftData?.revenuePercent}
                    {pageData.percent}
                  </div>
                ) : shiftData?.revenueIncrease === false ? (
                  <div style={{ color: "red" }}>
                    <ArrowDownOutlined style={{ color: "red" }} />
                    {shiftData?.revenuePercent}
                    {pageData.percent}
                  </div>
                ) : (
                  pageData.blank
                )}
              </Row>
            </Card>
          </Col>
          <Col span={1}> </Col>
        </Row>
        <br />
        <br />
        <Row>
          <FnbTable
            className="mt-4"
            columns={getTableColumns()}
            pageSize={tableSettings.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
          />
        </Row>
      </Form>
    </>
  );
}
