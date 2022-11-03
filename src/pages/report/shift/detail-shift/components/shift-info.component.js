import React from "react";
import { Form, Row, Col, Card, Space, Typography } from "antd";
import { UserOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { formatCurrency } from "utils/helpers";
import moment from "moment";
import { DateFormat } from "constants/string.constants";
const { Text, Title } = Typography;

const ShiftInfoComponent = props => {
  const { t, infoShift } = props;
  const [form] = Form.useForm();
  const pageData = {
    staff: t("report.shift.staff"),
    checkIn: t("report.shift.checkIn"),
    checkOut: t("report.shift.checkOut"),
    orderSuccess: t("report.shift.successOrder"),
    orderCanceled: t("report.shift.canceledOrder"),
    initialAmount: t("report.shift.initialAmount"),
    discount: t("report.shift.discount"),
    revenue: t("report.shift.revenue"),
    withdrawalAmount: t("report.shift.withdrawalAmount"),
    remain: t("report.shift.remainAmount"),
    titleWithdrawalAmount: t("shift.titleWithdrawalAmount"),
    min: 0,
    max: 999999999,
    pleaseInputAmount: t("shift.pleaseInputAmount"),
    endShift: t("shift.endShift"),
  };

  return (
    <Form
      autoComplete="off"
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 24,
      }}
      form={form}
    >
      <Row style={{ justifyContent: "center" }} gutter={16}>
        <Col span={16}>
          <Card style={{ borderRadius: 15 }}>
            <Row>
              <Title level={4}>
                {"#"}
                {infoShift?.codeStaff}
              </Title>
            </Row>
            <Row>
              <Text>
                <UserOutlined className="mr-1" />
                <Text>{pageData.staff}: </Text>
                <Text strong>{infoShift?.nameStaff}</Text>
              </Text>
            </Row>
            <Row>
              <Col span={12}>
                <Text>
                  <LoginOutlined className="mr-1" />
                  <Text>{pageData.checkIn}: </Text>
                  <Text strong>{moment(infoShift?.checkInDateTime).format(DateFormat.HH_MM_DD_MM_YYYY)}</Text>
                </Text>
              </Col>
              <Col span={12}>
                <Text>
                  <LogoutOutlined className="mr-1" />
                  <Text>{pageData.checkOut}: </Text>
                  <Text strong>
                    {infoShift?.checkOutDateTime === null
                      ? ""
                      : moment(infoShift?.checkOutDateTime).format(DateFormat.HH_MM_DD_MM_YYYY)}
                  </Text>
                </Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text type="success">{pageData.orderSuccess}:</Text>
                <Text type="success" className="ml-3">
                  {infoShift?.numberOrderSuccess}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="danger">{pageData.orderCanceled}:</Text>
                <Text type="danger" className="ml-3">
                  {infoShift?.numberOrderCanceled}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 15 }}>
            <Row style={{ justifyContent: "center" }}>
              <Title level={4}>{formatCurrency(infoShift?.revenue)}</Title>
            </Row>
            <Row>
              <Col span={8}>
                <Space direction="vertical">
                  <Text>{pageData.initialAmount}:</Text>
                  <Text>{pageData.revenue}:</Text>
                  <Text>{pageData.discount}:</Text>
                  <Text>{pageData.withdrawalAmount}:</Text>
                  <Text>{pageData.remain}:</Text>
                </Space>
              </Col>
              <Col span={16}>
                <Space direction="vertical" className="float-right">
                  <Text strong>{formatCurrency(infoShift?.initialAmount)}</Text>
                  <Text strong>{formatCurrency(infoShift?.revenue)}</Text>
                  <Text strong>{formatCurrency(infoShift?.discount)}</Text>
                  <Text strong>{formatCurrency(infoShift?.withdrawalAmount)}</Text>
                  <Text type="danger">{formatCurrency(infoShift?.remain)}</Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default ShiftInfoComponent;
