import { Button, Card, Checkbox, Col, Form, Input, message, Row, Select, Space } from "antd";
import { SelectCheckedIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import fileDataService from "data-services/file/file-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import { fileNameNormalize, jsonToFormData } from "utils/helpers";
import { BillTemplate } from "./component/bill-template.component";
import "./index.scss";
const { Option } = Select;

export default function ReceiptPage(props) {
  const { t, billDataService, storeDataService } = props;
  const [form] = Form.useForm();
  const billTemplateRef = React.useRef(null);
  const [allBillConfiguration, setAllBillConfiguration] = useState();
  const [billConfiguration, setBillConfiguration] = useState();
  const [isDisableShowWifi, setIsDisableShowWifi] = useState(false);
  const [isDisableShowThanks, setIsDisableShowThanks] = useState(false);
  const [isDisableShowQR, setIsDisableShowQR] = useState(false);

  const [image, setImage] = useState(null);
  const [imageRequired, setImageRequired] = useState(true);

  const pageData = {
    btnSave: t("button.save"),
    upload: t("button.upload"),
    btnPrintPreview: t("button.printPreview"),
    title: t("receipt.title"),
    frameSize: t("receipt.frameSize"),
    smallSizeOption: t("receipt.smallSizeOption"),
    mediumSizeOption: t("receipt.mediumSizeOption"),
    showLogo: t("receipt.showLogo"),
    showAddress: t("receipt.showAddress"),
    showOrderTime: t("receipt.showOrderTime"),
    showCashierName: t("receipt.showCashierName"),
    showCustomerName: t("receipt.showCustomerName"),
    showTopping: t("receipt.showTopping"),
    showOption: t("receipt.showOption"),
    showThanksMessage: t("receipt.showThanksMessage"),
    enterThanksMessage: t("receipt.enterThanksMessage"),
    showWifi: t("receipt.showWifi"),
    enterWifi: t("receipt.enterWifi"),
    showPassword: t("receipt.showPassword"),
    enterPassword: t("receipt.enterPassword"),
    showQRCode: t("receipt.showQRCode"),
    enterQRCode: t("receipt.enterQRCode"),
    enterQRThumbnail: t("receipt.enterQRThumbnail"),
    qrThumbnailButton: t("receipt.qrThumbnailButton"),
    configureSuccessfully: t("receipt.configureSuccessfully"),
  };

  // mock data
  const mockOrderData = {
    storeName: "VEGAN MARKET",
    branchAddress: "8460A Truong Son, Tan Binh, Ho Chi Minh",
    orderCode: "#I1001",
    orderTime: moment().format(DateFormat.MM_DD_YYYY),
    cashierName: "Hoang Phuong",
    customerName: "Thai Thanh Sang",
    productList: [
      {
        productName: "Black coffee",
        quantity: 1,
        price: 39000,
        totalPrice: 49000,
        toppings: [
          {
            toppingName: "Bubble",
            quantity: 1,
            price: 10000,
          },
          {
            toppingName: "Peach",
            quantity: 1,
            price: 12000,
          },
        ],
        options: [
          {
            optionName: "Sugar (30%)",
          },
        ],
      },
    ],
    originalTotalPrice: 49000,
    discount: 0,
    feeAndTax: 4900,
    totalAmount: 53900,
    receivedAmount: 100000,
    change: 60100,
    paymentMethod: "Cash",
    thankMessage: "Have a nice day",
    wifi: "VEGAN MARKET 5G",
    password: "12345678",
  };

  useEffect(() => {
    setFormValues();
  }, []);

  const setFormValues = async () => {
    billDataService.getBillConfigurationAsync().then((res) => {
      let { billConfigurations } = res;
      setAllBillConfiguration(billConfigurations);
      const billConfiguration = billConfigurations.find((x) => x.isDefault === true);
      setBillConfiguration(billConfiguration);

      form.setFieldsValue({
        billConfiguration: billConfiguration,
      });

      setIsDisableShowWifi(billConfiguration.isShowWifiAndPassword);
      setIsDisableShowThanks(billConfiguration.isShowThanksMessage);
      setIsDisableShowQR(billConfiguration.isShowQRCode);
      setImage(billConfiguration.qrCodeThumbnail);

      if (billConfiguration.qrCodeThumbnail) {
        setImageRequired(false);
      }

      if (billTemplateRef && billTemplateRef.current) {
        billTemplateRef.current.renderTemplate(billConfiguration);
      }
    });
  };

  const onChangeFrameSize = (frameSizeKey) => {
    const billConfiguration = allBillConfiguration.find((x) => x.billFrameSize === frameSizeKey);

    setBillConfiguration(billConfiguration);
    form.setFieldsValue({
      billConfiguration: billConfiguration,
    });

    setIsDisableShowWifi(billConfiguration.isShowWifiAndPassword);
    setIsDisableShowThanks(billConfiguration.isShowThanksMessage);
    setIsDisableShowQR(billConfiguration.isShowQRCode);
    setImage(billConfiguration.qrCodeThumbnail);

    if (billConfiguration.qrCodeThumbnail) {
      setImageRequired(false);
    }

    if (billTemplateRef && billTemplateRef.current) {
      billTemplateRef.current.renderTemplate(billConfiguration);
    }
  };

  const onFinish = (values) => {
    const qrCodeImage = {
      qRCodeThumbnail: image,
    };
    const fromData = values?.billConfiguration;
    if (fromData?.qRCodeThumbnail !== null) {
      delete fromData?.qRCodeThumbnail;
    }
    let submitData = { ...qrCodeImage, ...values.billConfiguration };

    if (submitData.passwordData === undefined) {
      submitData.passwordData = null;
    }

    billDataService
      .updateBillConfigurationAsync({
        billConfiguration: submitData,
      })
      .then((res) => {
        if (res) {
          setFormValues(values?.billConfiguration?.billFrameSize);
          message.success(pageData.configureSuccessfully);
        }
      });
  };

  const onChangeSettingOption = () => {
    let { billConfiguration } = form.getFieldValue();

    setIsDisableShowWifi(billConfiguration.isShowWifiAndPassword);
    setIsDisableShowThanks(billConfiguration.isShowThanksMessage);
    setIsDisableShowQR(billConfiguration.isShowQRCode);

    setBillConfiguration(billConfiguration);
    if (billTemplateRef && billTemplateRef.current) {
      billTemplateRef.current.renderTemplate(billConfiguration);
    }
  };

  const printTemplate = () => {
    if (billTemplateRef && billTemplateRef.current) {
      billTemplateRef.current.printTemplate();
    }
  };

  const onUploadImage = (image) => {
    let buildFileName = moment(new Date()).format("DDMMYYYYHHmmss");
    const requestData = {
      file: image[0],
      fileName: fileNameNormalize(buildFileName),
    };
    const requestFormData = jsonToFormData(requestData);
    fileDataService.uploadFileAsync(requestFormData).then((res) => {
      if (res.success === true) {
        setImage(res.data);
        setImageRequired(false);
      }
    });
  };

  return (
    <Card bordered={false} className="fnb-card-full receipt-card">
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={[24, 24]} className="receipt-config-card-header">
          <Col lg={12} md={12} sm={24}>
            <p className="card-title-name">{pageData.title}</p>
          </Col>
          <Col lg={12} md={12} sm={24} className="card-button text-right">
            <Space>
              <a htmlType="button" type="primary" onClick={printTemplate} className="print-preview">
                {pageData.btnPrintPreview}
              </a>
              <Button htmlType="submit" type="primary" className="save-button">
                {pageData.btnSave}
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]} className="receipt-config-card-body">
          <Col lg={16} md={16} sm={24} className="receipt-form">
            <Row>
              <Col span={24}>
                <h4 className="fnb-form-label">{pageData.frameSize}</h4>
                <Form.Item name={["billConfiguration", "billFrameSize"]}>
                  <Select
                    onChange={onChangeFrameSize}
                    size="large"
                    placeholder="Select frame size"
                    autoComplete="none"
                    className="fnb-select-single"
                    dropdownClassName="fnb-select-single-dropdown"
                    menuItemSelectedIcon={<SelectCheckedIcon style={{ padding: "5px" }} />}
                  >
                    <Option key={0} value={0}>
                      <p className="option-frame-size">{pageData.smallSizeOption}</p>
                    </Option>
                    <Option key={1} value={1}>
                      <p className="option-frame-size">{pageData.mediumSizeOption}</p>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowLogo"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showLogo}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowAddress"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showAddress}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowOrderTime"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showOrderTime}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowCashierName"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showCashierName}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowCustomerName"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showCustomerName}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowToping"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showTopping}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowOption"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showOption}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowThanksMessage"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showThanksMessage}
                  </Checkbox>
                </Form.Item>
              </Col>
              {isDisableShowThanks === true && (
                <Col span={24}>
                  <Form.Item
                    name={["billConfiguration", "thanksMessageData"]}
                    rules={[
                      {
                        required: isDisableShowThanks,
                        message: pageData.enterThanksMessage,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input"
                      min={100}
                      placeholder={pageData.enterThanksMessage}
                      onChange={onChangeSettingOption}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowWifiAndPassword"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showWifi}
                  </Checkbox>
                </Form.Item>
              </Col>
              {isDisableShowWifi === true && (
                <Col span={24}>
                  <Row>
                    <Col lg={12} md={12} sm={24}>
                      <h4 className="fnb-form-label wifi-password-lable">Wifi</h4>
                      <Form.Item
                        name={["billConfiguration", "wifiData"]}
                        rules={[
                          {
                            required: isDisableShowWifi,
                            message: pageData.enterWifi,
                          },
                        ]}
                      >
                        <Input
                          className="fnb-input"
                          min={100}
                          placeholder={pageData.enterWifi}
                          onChange={onChangeSettingOption}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                      <h4 className="fnb-form-label wifi-password-lable">Password</h4>
                      <Form.Item name={["billConfiguration", "passwordData"]}>
                        <Input
                          className="fnb-input"
                          min={100}
                          placeholder={pageData.enterPassword}
                          onChange={onChangeSettingOption}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={["billConfiguration", "isShowQRCode"]} valuePropName="checked">
                  <Checkbox onclick={false} onChange={onChangeSettingOption}>
                    {pageData.showQRCode}
                  </Checkbox>
                </Form.Item>
              </Col>
              {isDisableShowQR === true && (
                <Col span={24}>
                  <Row>
                    <Col lg={19} md={19} sm={24}>
                      <Form.Item
                        name={["billConfiguration", "qrCodeData"]}
                        rules={[
                          {
                            required: isDisableShowQR,
                            message: pageData.enterQRCode,
                          },
                        ]}
                      >
                        <Input
                          className="fnb-input qrCode-input"
                          min={100}
                          placeholder={pageData.enterQRCode}
                          onChange={onChangeSettingOption}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={5} md={5} sm={24} className="button-upload-image">
                      <Form.Item
                        name={["billConfiguration", "qRCodeThumbnail"]}
                        rules={[
                          {
                            required: imageRequired,
                            message: pageData.enterQRThumbnail,
                          },
                        ]}
                      >
                        <ImageUploader
                          withIcon={false}
                          label=""
                          singleImage={true}
                          buttonText={pageData.qrThumbnailButton}
                          onChange={(value) => onUploadImage(value)}
                          imgExtension={[".jpg", ".png", ".jpeg"]}
                          maxFileSize={5242880}
                          className="btn-upload-image"
                          errorStyle={{
                            fontFamily: "Roboto Condensed",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "21x",
                            color: "#DB1B1B",
                          }}
                          fileSizeError=" file size is too big"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
          <Col lg={8} md={8} sm={24} className="template-preview">
            <p className="preview-text">Preview</p>
            <BillTemplate t={t} ref={billTemplateRef} orderData={mockOrderData} qrImage={image} />
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
