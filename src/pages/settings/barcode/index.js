import { Button, Card, Checkbox, Col, Form, message, Row, Select, Space, Typography } from "antd";
import { BarcodeType } from "constants/barcode-type.constants";
import { StampType } from "constants/stamp-type.constants";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/helpers";
import BarcodeConfigComponent from "./components/barcode-config.component";
import "./index.scss";

const { Option } = Select;
const { Text } = Typography;

export default function BarcodeConfig(props) {
  const { t, barcodeDataService } = props;

  const pageData = {
    barcode: t("barcode.barcode"),
    type: t("barcode.type"),
    model: t("barcode.model"),
    showItemName: t("barcode.showItemName"),
    showPrice: t("barcode.showPrice"),
    showCode: t("barcode.showCode"),
    isUpdatedSuccessfully: t("messages.isUpdatedSuccessfully"),
    save: t("button.save"),
  };

  const printExampleData = {
    nameValue: "Mayonnaise",
    priceValue: formatCurrency(55000),
    codeValue: "NVL10021001",
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [barcodeTypeList, setBarcodeTypeList] = useState([]);
  const [barcodeType, setBarcodeType] = useState(BarcodeType.barcode);
  const [stampTypeList, setStampTypeList] = useState([]);
  const [stampType, setStampType] = useState(StampType.mm50x30);
  const [showName, setShowName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = () => {
    barcodeDataService.getBarcodeConfigByStoreIdAsync().then((res) => {
      setStampTypeList(res.stampTypeList);
      setBarcodeTypeList(res.barcodeTypeList);
      if (res.barcodeConfig !== undefined) {
        let data = res?.barcodeConfig;
        let formValue = {
          stampType: data.stampType,
          barcodeType: data.barcodeType,
          isShowName: data.isShowName,
          isShowPrice: data.isShowPrice,
          isShowCode: data?.isShowCode,
        };
        setStampType(formValue.stampType);
        setShowName(formValue.isShowName);
        setShowPrice(formValue.isShowPrice);
        setShowCode(formValue.isShowCode);

        form.setFieldsValue(formValue);
      } else {
        let formValue = {
          barcodeType: BarcodeType.barcode,
          stampType: StampType.mm50x30,
          isShowName: true,
          isShowPrice: true,
          isShowCode: true,
        };

        form.setFieldsValue(formValue);
      }
    });
  };

  const onBarcodeTypeChange = (value) => {
    setBarcodeType(value);
  };

  const onStampTypeChange = (value) => {
    setStampType(value);
  };

  const onFinish = (values) => {
    barcodeDataService.updateBarcodeConfigByStoreIdAsync(values).then((res) => {
      if (res) {
        message.success(`${pageData.barcode} ${pageData.isUpdatedSuccessfully}`);
      }
    });
  };

  return (
    <>
      <Card className="fnb-card-full">
        <Form
          name="basic"
          onFinish={onFinish}
          onFieldsChange={() => {
            if (!isChangeForm) setIsChangeForm(true);
          }}
          form={form}
          autoComplete="off"
          gutter={12}
        >
          <Row>
            <Col span={24}>
              <Space className="float-right">
                <Button htmlType="submit" type="primary">
                  {pageData.save}
                </Button>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col span={12} className="border-div">
              <h3>{pageData.type}</h3>
              <Form.Item name="barcodeType">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  size="large"
                  className="item-input"
                  onChange={onBarcodeTypeChange}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {barcodeTypeList?.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <h3>{pageData.model}</h3>
              <Form.Item name="stampType">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  size="large"
                  className="item-input"
                  onChange={onStampTypeChange}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {stampTypeList?.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="isShowName" valuePropName="checked">
                <Checkbox noStyle onChange={(e) => setShowName(e.target.checked)}>
                  <Text>{pageData.showItemName}</Text>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isShowPrice" valuePropName="checked">
                <Checkbox noStyle onChange={(e) => setShowPrice(e.target.checked)}>
                  <Text>{pageData.showPrice}</Text>
                </Checkbox>
              </Form.Item>
              <Form.Item name="isShowCode" valuePropName="checked">
                <Checkbox noStyle onChange={(e) => setShowCode(e.target.checked)}>
                  <Text>{pageData.showCode}</Text>
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} className="div-vertically">
              <BarcodeConfigComponent
                barcodeType={barcodeType}
                stampType={stampType}
                showName={showName}
                showPrice={showPrice}
                showCode={showCode}
                nameValue={printExampleData.nameValue}
                priceValue={printExampleData.priceValue}
                codeValue={printExampleData.codeValue}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
