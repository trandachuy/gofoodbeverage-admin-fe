import React, { useEffect } from "react";
import {
  Form,
  Modal,
  Row,
  Col,
  Input,
  Button,
  Radio,
  Space,
  message,
} from "antd";
import { getValidationMessages } from "utils/helpers";
import enumTaxType from "constants/taxType.constants";
import taxDataService from "data-services/tax/tax-data.service";

const { TextArea } = Input;
export default function CreateNewTax(props) {
  const { t, handleCompleted, handleCancel } = props;
  const [form] = Form.useForm();
  const pageData = {
    addNew: t("button.addNew"),
    cancel: t("button.cancel"),
    addNewTax: t("feeAndTax.tax.addNewTax"),
    name: t("feeAndTax.tax.name"),
    value: t("feeAndTax.tax.value"),
    type: t("feeAndTax.tax.type"),
    description: t("feeAndTax.tax.description"),
    taxAddedSuccessfully: t("feeAndTax.tax.taxAddedSuccessfully"),
    pleaseEnterTaxName: t("feeAndTax.tax.pleaseEnterTaxName"),
    enterTaxName: t("feeAndTax.tax.enterTaxName"),
    pleaseEnterValue: t("feeAndTax.tax.pleaseEnterValue"),
    enterValue: t("feeAndTax.tax.enterValue"),
    sellingTax: t("feeAndTax.tax.sellingTax"),
    importTax: t("feeAndTax.tax.importTax"),
    percentValidation: t("feeAndTax.tax.percentValidation"),
    enterOnlyNumbers: t("feeAndTax.tax.pleaseEnterOnlyNumbers"),
  };

  useEffect(() => {
    form.setFieldsValue({
      tax: {
        taxTypeId: 0,
      },
    });
  }, []);

  useEffect(() => {
    if (!props.isModalVisible) {
      setTimeout(() => {
        form.resetFields();

        form.setFieldsValue({
          tax: {
            taxTypeId: 0,
          },
        });
      }, 1000);
    }
  }, [props.isModalVisible]);

  const onCancel = async () => {
    await form.resetFields();
    handleCancel();
  };

  const onFinish = async (values) => {
    await taxDataService
      .createTaxAsync({ ...values.tax })
      .then((res) => {
        if (res) {
          message.success(pageData.taxAddedSuccessfully);
          handleCompleted();
        }
      })
      .catch((errs) => {
        form.setFields(getValidationMessages(errs));
      });
  };

  /** This function is used to check the string is numeric.
   * @param  {string} value The value for example, '1234'
   */
  const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
  };

  return (
    <Modal
      className="modal-add-language"
      title={pageData.addNewTax}
      closeIcon
      visible={props.isModalVisible}
      footer={(null, null)}
    >
      <Form autoComplete="off" form={form} name="basic" onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <h3>{pageData.name}</h3>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["tax", "name"]}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseEnterTaxName,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={pageData.enterTaxName}
                autoComplete="none"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h3>{pageData.value}</h3>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["tax", "percentage"]}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseEnterValue,
                },
                {
                  validator: (_, value) => {
                    if (
                      value === undefined ||
                      (value !== undefined && value <= 100)
                    ) {
                      return Promise.resolve();
                    } else {
                      if (value?.length > 0 && !isNumeric(value)) {
                        return Promise.reject(
                          new Error(pageData.enterOnlyNumbers)
                        );
                      } else {
                        return Promise.reject(
                          new Error(pageData.percentValidation)
                        );
                      }
                    }
                  },
                },
              ]}
            >
              <Input
                className="w-100"
                prefix="%"
                min={1}
                max={100}
                maxLength={3}
                placeholder={pageData.pleaseEnterValue}
                autoComplete="none"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={pageData.type} name={["tax", "taxTypeId"]}>
              <Radio.Group>
                <Space direction="horizontal">
                  <Radio value={enumTaxType.SellingTax}>
                    {pageData.sellingTax}
                  </Radio>
                  <Radio value={enumTaxType.ImportedTax}>
                    {pageData.importTax}
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h3>{pageData.description}</h3>
          </Col>
          <Col span={24}>
            <Form.Item name={["tax", "description"]}>
              <TextArea
                size="large"
                rows={4}
                placeholder={pageData.description}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="float-center mt-3 bd-c-t">
          <Button
            className="mr-1 width-100"
            key="back"
            onClick={() => onCancel()}
          >
            {pageData.cancel}
          </Button>
          <Button className="width-100" type="primary" htmlType="submit">
            {pageData.addNew}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
