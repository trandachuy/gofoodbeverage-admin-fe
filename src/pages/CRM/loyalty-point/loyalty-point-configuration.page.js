import { Button, Card, Checkbox, Col, DatePicker, Form, InputNumber, message, Row, Space, Switch } from "antd";
import PageTitle from "components/page-title";
import { DateFormat } from "constants/string.constants";
import { useEffect, useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/vi_VN";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import { formatTextNumber, getCurrency } from "utils/helpers";

export default function LoyaltyPointConfiguration(props) {
  const { t, customerDataService, history } = props;
  const { i18n } = useTranslation();
  const [form] = Form.useForm();
  const [showExpiryDate, setShowExpiryDate] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [expiryDate, setExpiryDate] = useState(null);
  const [earningExchangeNumber, setEarningExchangeNumber] = useState(0);
  const [redeemExchangeNumber, setRedeemExchangeNumber] = useState(0);
  const [currencyCode, setCurrencyCode] = useState();
  const [language, setLanguage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    btnSave: t("button.save"),
    btnCancel: t("button.cancel"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    title: t("loyaltyPoint.title"),
    exchange: t("loyaltyPoint.exchange"),
    pointProgram: t("loyaltyPoint.pointProgram"),
    earningPoint: t("loyaltyPoint.earningPoint"),
    redeemPoint: t("loyaltyPoint.redeemPoint"),
    expiryDateMessage: t("loyaltyPoint.expiryDateMessage"),
    enableExpiryDateMessage: t("loyaltyPoint.enableExpiryDateMessage"),
    earningMessage: t("loyaltyPoint.earningMessage"),
    redeemMessage: t("loyaltyPoint.redeemMessage"),
    earningOnePoint: t("loyaltyPoint.earningOnePoint"),
    redeemOnePoint: t("loyaltyPoint.redeemOnePoint"),
    pointValidateMessage: t("loyaltyPoint.pointValidateMessage"),
    modifySuccessMessage: t("loyaltyPoint.modifySuccessMessage"),
    modifySuccessErr: t("loyaltyPoint.modifySuccessErr"),
    enable: t("status.enable"),
    disable: t("status.disable"),
    point: {
      min: 0,
      max: 999999999,
      format: "^[0-9]*$",
      range:
        "^([1-9]|[1-9][0-9]{1,7}|[1-8][0-9]{8}|9[0-8][0-9]{7}|99[0-8][0-9]{6}|999[0-8][0-9]{5}|9999[0-8][0-9]{4}|99999[0-8][0-9]{3}|999999[0-8][0-9]{2}|9999999[0-8][0-9]|99999999[0-8])$", //range number 1-99999998
    },
    btnConfirmLeave: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  useEffect(() => {
    setLanguage(i18n.language);
    setCurrencyCode(getCurrency());
    fetchInitData();
  }, [i18n.language]);

  const fetchInitData = async () => {
    await getConfigurationData();
  };

  const setInitialFormValue = async (res) => {
    if (res.hasData) {
      const { configuration } = res;
      const loyaltyPointConfig = {
        isActivated: configuration.isActivated,
        isExpiryDate: configuration.isExpiryDate,
        expiryDate: configuration.isExpiryDate ? moment(configuration.expiryDate) : null,
        earningPointExchangeValue: configuration.earningPointExchangeValue,
        redeemPointExchangeValue: configuration.redeemPointExchangeValue,
      };
      setShowExpiryDate(configuration.isExpiryDate);
      setEarningExchangeNumber(formatTextNumber(configuration.earningPointExchangeValue));
      setRedeemExchangeNumber(formatTextNumber(configuration.redeemPointExchangeValue));
      form.setFieldsValue({ loyaltyPointConfig });
    } else {
      const loyaltyPointConfig = {
        isActivated: false,
        isExpiryDate: false,
        earningPointExchangeValue: 0,
        redeemPointExchangeValue: 0,
      };
      setShowExpiryDate(false);
      setEarningExchangeNumber(formatTextNumber(loyaltyPointConfig.earningPointExchangeValue));
      setRedeemExchangeNumber(formatTextNumber(loyaltyPointConfig.redeemPointExchangeValue));
      form.setFieldsValue({ loyaltyPointConfig });
    }
  };

  const getConfigurationData = async () => {
    let res = await customerDataService.getLoyaltyPointByStoreIdAsync();
    setInitialFormValue(res);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const onFinish = async (value) => {
    if (!value.loyaltyPointConfig.expiryDate && value.loyaltyPointConfig.isExpiryDate) {
      message.error(pageData.modifySuccessErr);
      return;
    }
    await customerDataService.modifyLoyaltyPointAsync(value.loyaltyPointConfig).then((res) => {
      if (res) {
        message.success(pageData.modifySuccessMessage);
        getConfigurationData();
      }
    });
  };

  const onChangeEarningPoint = (value) => {
    setEarningExchangeNumber(formatTextNumber(value));
  };

  const onChangeRedeemPoint = (value) => {
    setRedeemExchangeNumber(formatTextNumber(value));
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      navigateToManagementPage();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  // Redirect to home page
  const navigateToManagementPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/customer/management");
    }, 100);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Row className="fnb-row-page-header">
          <Col span={12}>
            <Space className="page-title">
              <PageTitle content={pageData.title} />
            </Space>
            <Space className="page-action-group"></Space>
          </Col>
          <Col span={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button htmlType="submit" type="primary">
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: null,
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </a>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>

        <Card className="fnb-card-full">
          <Row></Row>

          <Row>
            <Col span={23}>
              <Form.Item name={["loyaltyPointConfig", "isActivated"]} valuePropName="checked" className="float-right">
                <Switch checkedChildren={pageData.enable} unCheckedChildren={pageData.disable} />
              </Form.Item>
            </Col>
          </Row>
          <h3>{pageData.pointProgram}</h3>
          <div className="border-div">
            <Form.Item name={["loyaltyPointConfig", "isExpiryDate"]} valuePropName="checked">
              <Checkbox onClick={() => setShowExpiryDate(!showExpiryDate)}>{pageData.enableExpiryDateMessage}</Checkbox>
            </Form.Item>
            {showExpiryDate && (
              <>
                <Row>
                  <h4>{pageData.expiryDateMessage}</h4>
                  <Form.Item name={["loyaltyPointConfig", "expiryDate"]}>
                    <DatePicker
                      className="float-left ml-2"
                      disabledDate={disabledDate}
                      format={DateFormat.DD_MM_YYYY}
                      onChange={(date) => setExpiryDate(date)}
                      placeholder="DD/MM/YYY"
                      locale={language === "vi" ? locale : ""}
                    />
                  </Form.Item>
                </Row>
              </>
            )}
          </div>
          <br />
          <h3>{pageData.earningPoint}</h3>
          <div className="border-div">
            <h4>{pageData.exchange}</h4>
            <Row>
              <Row className="w-100">
                <Col span={10} className="float-left ml-2">
                  <Form.Item
                    name={["loyaltyPointConfig", "earningPointExchangeValue"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.pointValidateMessage,
                      },
                      {
                        pattern: new RegExp(pageData.point.format),
                        message: pageData.pointValidateMessage,
                      },
                      {
                        pattern: new RegExp(pageData.point.range),
                        message: pageData.pointValidateMessage,
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-100"
                      placeholder=""
                      addonAfter={getCurrency()}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) => onChangeEarningPoint(value)}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <div className="float-left ml-2">{pageData.earningOnePoint}</div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col span={24}>
                  <ArrowRightOutlined />
                  {t(pageData.earningMessage, {
                    number: earningExchangeNumber,
                    currency: currencyCode,
                  })}
                </Col>
              </Row>
            </Row>
          </div>

          <br />
          <h3>{pageData.redeemPoint}</h3>
          <div className="border-div">
            <h4>{pageData.exchange}</h4>
            <Row>
              <Row className="w-100">
                <Col span={2}>
                  <div className="float-left">{pageData.redeemOnePoint}</div>
                </Col>
                <Col span={10} className="float-left">
                  <Form.Item
                    name={["loyaltyPointConfig", "redeemPointExchangeValue"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.pointValidateMessage,
                      },
                      {
                        pattern: new RegExp(pageData.point.format),
                        message: pageData.pointValidateMessage,
                      },
                      {
                        pattern: new RegExp(pageData.point.range),
                        message: pageData.pointValidateMessage,
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-100"
                      placeholder=""
                      addonAfter={getCurrency()}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) => onChangeRedeemPoint(value)}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col span={24}>
                  <ArrowRightOutlined />
                  {t(pageData.redeemMessage, {
                    number: redeemExchangeNumber,
                    currency: currencyCode,
                  })}
                </Col>
              </Row>
            </Row>
          </div>
        </Card>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.btnConfirmLeave}
        onCancel={onDiscard}
        onOk={navigateToManagementPage}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
