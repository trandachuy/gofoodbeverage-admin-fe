import { ChromeOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, message, Row, Space } from "antd";
import { EnumDeliveryMethod } from "constants/delivery-method.constants";
import deliveryConfigService from "data-services/delivery-config/delivery-config.service";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../index.scss";

export default function AhaMoveConfiguration(props) {
  const { ahaMoveDelivery, reLoadFormData } = props;
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const pageData = {
    textConnectionString: t("deliveryMethod.titleConnectionString"),
    apiKey: {
      title: t("deliveryMethod.apiKey.title"),
      validateMessage: t("deliveryMethod.apiKey.validateMessage"),
      placeholder: t("deliveryMethod.apiKey.placeholder"),
    },
    storePhone: {
      title: t("deliveryMethod.storePhone.title"),
      validateMessage: t("deliveryMethod.storePhone.validateMessage"),
      placeholder: t("deliveryMethod.storePhone.placeholder"),
    },
    storeName: {
      title: t("deliveryMethod.storeName.title"),
      placeholder: t("deliveryMethod.storeName.placeholder"),
    },
    storeAddress: {
      title: t("deliveryMethod.storeAddress.title"),
      placeholder: t("deliveryMethod.storeAddress.placeholder"),
    },
    connect: t("deliveryMethod.connect"),
    updateAhaMoveConfigSuccess: t("deliveryMethod.updateAhaMoveConfigSuccess"),
    updateAhaMoveConfigError: t("deliveryMethod.updateAhaMoveConfigError"),
    website: "https://www.ahamove.com/",
    email: "support@ahamove.com",
    hotline: "1900 545 411",
  };

  useEffect(() => {
    getInitFormData();
  }, []);

  const getInitFormData = () => {
    let formValues = form.getFieldsValue();
    const { ahaMoveConfig } = formValues;
    ahaMoveConfig.deliveryMethodId = ahaMoveDelivery?.id;
    form.setFieldsValue(formValues);

    if (ahaMoveDelivery && ahaMoveDelivery?.deliveryConfig) {
      ahaMoveConfig.apiKey = ahaMoveDelivery?.deliveryConfig?.apiKey;
      ahaMoveConfig.phoneNumber = ahaMoveDelivery?.deliveryConfig?.phoneNumber;
      ahaMoveConfig.name = ahaMoveDelivery?.deliveryConfig?.name;
      ahaMoveConfig.address = ahaMoveDelivery?.deliveryConfig?.address;
      form.setFieldsValue(formValues);
    }
  };

  const onClickConnect = () => {
    form.validateFields().then(async (values) => {
      deliveryConfigService.updateAhaMoveConfigAsync(values).then((res) => {
        if (res) {
          message.success(pageData.updateAhaMoveConfigSuccess);
          reLoadFormData(EnumDeliveryMethod.AhaMove);
        } else {
          message.error(pageData.updateAhaMoveConfigError);
        }
      });
    });
  };

  return (
    <Card className="ahamove-card">
      <Form form={form} autoComplete="off" onFinish={onClickConnect}>
        <h3>{pageData.textConnectionString}</h3>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4 className="mt-3">{pageData.apiKey.title}</h4>
            <Form.Item hidden="true" name={["ahaMoveConfig", "deliveryMethodId"]}></Form.Item>
            <Form.Item
              name={["ahaMoveConfig", "apiKey"]}
              rules={[
                {
                  required: true,
                  message: pageData.apiKey.validateMessage,
                },
              ]}
            >
              <Input.Password placeholder={pageData.apiKey.placeholder} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h4 className="mt-3">{pageData.storePhone.title}</h4>
            <Form.Item
              name={["ahaMoveConfig", "phoneNumber"]}
              rules={[
                {
                  required: true,
                  message: pageData.storePhone.validateMessage,
                },
              ]}
            >
              <Input placeholder={pageData.storePhone.placeholder} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4 className="mt-3">{pageData.storeName.title}</h4>
            <Form.Item name={["ahaMoveConfig", "name"]}>
              <Input placeholder={pageData.storeName.placeholder} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h4 className="mt-3">{pageData.storeAddress.title}</h4>
            <Form.Item name={["ahaMoveConfig", "address"]}>
              <Input placeholder={pageData.storeAddress.placeholder} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mt-2">
          <Button htmlType="submit" type="primary">
            <LinkOutlined />
            <span className="ml-1">{pageData.connect}</span>
          </Button>
        </Row>
        <Row className="w-100 mt-5">
          <Col span={8} className="text-center">
            <Space direction="vertical">
              <ChromeOutlined className="icon-bottom" />
              <a href={pageData.website} target="_blank">
                {pageData.website}
              </a>
            </Space>
          </Col>
          <Col span={8} className="text-center">
            <Space direction="vertical">
              <MailOutlined className="icon-bottom" />
              <a>{pageData.email}</a>
            </Space>
          </Col>
          <Col span={8} className="text-center">
            <Space direction="vertical">
              <PhoneOutlined className="icon-bottom" />
              <a>{pageData.hotline}</a>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
