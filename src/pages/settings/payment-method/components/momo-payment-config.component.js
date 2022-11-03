import React, { useEffect, useState } from "react";
import { Col, Row, Form, Input, Button, message } from "antd";
import { paymentMethod } from "constants/payment-method.constants";
import paymentConfigDataService from "data-services/payment-config/payment-config-data.service";
import { useTranslation } from "react-i18next";

export function MoMoPaymentConfigComponent(props) {
  const { onCompleted, initData } = props;
  const [activeAuthenticateButton, setActiveAuthenticateButton] = useState(true);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const pageData = {
    partnerCode: t("payment.partnerCode"),
    partnerCodePlaceholder: t("payment.partnerCodePlaceholder"),
    partnerCodeValidationMessage: t("payment.partnerCodeValidationMessage"),
    accessKey: t("payment.accessKey"),
    accessKeyPlaceholder: t("payment.accessKeyPlaceholder"),
    accessKeyValidationMessage: t("payment.accessKeyValidationMessage"),
    secretKey: t("payment.secretKey"),
    secretKeyPlaceholder: t("payment.secretKeyPlaceholder"),
    secretKeyValidationMessage: t("payment.secretKeyValidationMessage"),
    btnAuthenticate: t("payment.authenticate"),
    updateSuccess: t("payment.updateSuccess"),
  };
  useEffect(() => {
    setInitData(initData);
  }, []);

  const setInitData = paymentMethod => {
    const { paymentConfigs } = paymentMethod;
    const config = {
      paymentMethodId: paymentMethod?.id,
      partnerCode: paymentConfigs[0]?.partnerCode,
      accessKey: paymentConfigs[0]?.accessKey,
      secretKey: paymentConfigs[0]?.secretKey,
      qrCode: paymentConfigs[0]?.qrCode,
    };
    if (paymentConfigs && config) {
      form.setFieldsValue(config);
      setActiveAuthenticateButton(false);
    }
  };

  const onClickAuthenticate = values => {
    paymentConfigDataService.updatePaymentConfigAsync(values).then(success => {
      if (success === true) {
        message.success(pageData.updateSuccess);
        onCompleted();
      }
    });
  };

  const onValidForm = () => {
    form
      .validateFields()
      .then(_ => {
        setActiveAuthenticateButton(false);
      })
      .catch(_ => {
        setActiveAuthenticateButton(true);
      });
  };

  return (
    <>
      <Form
        form={form}
        className="mt-3"
        layout="vertical"
        autoComplete="off"
        onFinish={onClickAuthenticate}
        onChange={onValidForm}
      >
        <Row gutter={[16, 16]}>
          <Form.Item name="enumId" initialValue={paymentMethod.MoMo}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="paymentMethodId">
            <Input type="hidden" />
          </Form.Item>
          <Col span={12}>
            <h4>{pageData.partnerCode}</h4>
            <Form.Item
              name="partnerCode"
              rules={[
                {
                  required: true,
                  message: pageData.partnerCodeValidationMessage,
                },
              ]}
            >
              <Input placeholder={pageData.partnerCodePlaceholder} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h4>{pageData.accessKey}</h4>
            <Form.Item
              name="accessKey"
              rules={[
                {
                  required: true,
                  message: pageData.accessKeyValidationMessage,
                },
              ]}
            >
              <Input.Password placeholder={pageData.accessKeyPlaceholder} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4>{pageData.secretKey}</h4>
            <Form.Item
              name="secretKey"
              rules={[
                {
                  required: true,
                  message: pageData.secretKeyValidationMessage,
                },
              ]}
            >
              <Input.Password placeholder={pageData.accessKeyPlaceholder} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <div className="pt-1">
              <Form.Item>
                <Button htmlType="submit" type="primary" className="w-100 mt-4" disabled={activeAuthenticateButton}>
                  {pageData.btnAuthenticate}
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}
