import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, InputNumber, message, Radio, Row } from "antd";
import { MaximumNumber } from "constants/default.constants";
import { EnumDeliveryMethod } from "constants/delivery-method.constants";
import deliveryConfigService from "data-services/delivery-config/delivery-config.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrency, randomGuid } from "utils/helpers";
import "../index.scss";

export default function SelfDeliveryConfigComponent(props) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { isCheckedSelfDelivery, selfDelivery, reLoadFormData } = props;
  const newFeeByDistance = {
    id: randomGuid(),
    fromDistance: 0,
    toDistance: 0,
    feeValue: 0,
  };
  const shippingCost = {
    fixedFee: {
      name: t("deliveryMethod.titleFixedFee"),
      value: true,
    },
    byDistance: {
      name: t("deliveryMethod.titleFeeDyDistance"),
      value: false,
    },
  };
  const [listFeeByDistance, setListFeeByDistance] = useState([newFeeByDistance]);
  const [typeShippingCost, setTypeShippingCost] = useState(shippingCost.fixedFee.value);

  const pageData = {
    save: t("button.save"),
    btnAddNewFee: t("deliveryMethod.byDistance.btnAddNewFee"),
    textShippingCost: t("deliveryMethod.titleShippingCost"),
    byDistance: {
      fromDistance: t("deliveryMethod.byDistance.fromDistance"),
      toDistance: t("deliveryMethod.byDistance.toDistance"),
      validToDistance: t("deliveryMethod.byDistance.validToDistance"),
      feeDistance: t("deliveryMethod.byDistance.feeDistance"),
      validFeeDistance: t("deliveryMethod.byDistance.validFeeDistance"),
    },
    updateSelfDeliveryConfigSuccess: t("deliveryMethod.updateSelfDeliveryConfigSuccess"),
    feeValueValidation: t("deliveryMethod.feeValueValidation"),
  };

  useEffect(() => {
    getInitFormData();
  }, [isCheckedSelfDelivery]);

  const getInitFormData = async () => {
    let formValues = form.getFieldsValue();
    const { deliveryConfig } = formValues;
    if (selfDelivery && selfDelivery?.deliveryConfig) {
      deliveryConfig.isFixedFee = selfDelivery?.deliveryConfig?.isFixedFee;
      if (selfDelivery?.deliveryConfig?.isFixedFee) {
        setTypeShippingCost(shippingCost.fixedFee.value);
        deliveryConfig.feeValue = selfDelivery?.deliveryConfig?.feeValue;
      } else {
        setTypeShippingCost(shippingCost.byDistance.value);
        let deliveryConfigPricings = selfDelivery?.deliveryConfig?.deliveryConfigPricings;
        deliveryConfigPricings.sort((a, b) => {
          return a.position - b.position;
        });
        setListFeeByDistance(deliveryConfigPricings);
        deliveryConfig.deliveryConfigPricings = deliveryConfigPricings;
      }
      form.setFieldsValue(formValues);
    } else {
      deliveryConfig.isFixedFee = shippingCost.fixedFee.value;
      deliveryConfig.deliveryConfigPricings = [newFeeByDistance];
      form.setFieldsValue(formValues);
    }
  };

  const renderListFeeByDistance = () => {
    return (
      <>
        {listFeeByDistance.map((item, index) => {
          return (
            <>
              <Form.Item hidden={true} name={["deliveryConfig", "deliveryConfigPricings", index, "id"]}>
                <InputNumber disabled defaultValue={item?.id} />
              </Form.Item>
              <Col span={6}>
                <h4>{pageData.byDistance.fromDistance}</h4>
                <Form.Item name={["deliveryConfig", "deliveryConfigPricings", index, "fromDistance"]}>
                  <InputNumber disabled defaultValue={item?.fromDistance} addonAfter="km" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <h4>{pageData.byDistance.toDistance}</h4>
                <Form.Item
                  name={["deliveryConfig", "deliveryConfigPricings", index, "toDistance"]}
                  rules={[{ required: true, message: pageData.byDistance.validToDistance }]}
                >
                  <InputNumber
                    disabled={!isCheckedSelfDelivery}
                    defaultValue={item?.toDistance}
                    addonAfter="km"
                    min={item?.fromDistance}
                    onChange={(value) => onChangeValue(index, value, 1)}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <h4>{pageData.byDistance.feeDistance}</h4>
                <Form.Item
                  name={["deliveryConfig", "deliveryConfigPricings", index, "feeValue"]}
                  rules={[{ required: true, message: pageData.byDistance.validFeeDistance }]}
                >
                  <InputNumber
                    disabled={!isCheckedSelfDelivery}
                    defaultValue={item?.feeValue}
                    addonAfter={getCurrency()}
                    min={1}
                    max={MaximumNumber}
                    onChange={(value) => onChangeValue(index, value, 2)}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              {listFeeByDistance.length > 1 && (
                <Col span={3} className="center-icon-del">
                  <a onClick={() => deleteItemFeeByDistance(index, item.fromDistance)}>
                    <DeleteOutlined disabled={!isCheckedSelfDelivery} className="icon-del" />
                  </a>
                </Col>
              )}
            </>
          );
        })}
      </>
    );
  };

  const onChangeValue = (index, value, key) => {
    listFeeByDistance?.map((item, i) => {
      if (i === index) {
        if (key === 1) {
          item.toDistance = value;
        } else {
          item.feeValue = value;
        }
      }
    });
  };

  const AddNewFeeByDistance = () => {
    let formValues = form.getFieldsValue();
    const { deliveryConfig } = formValues;
    form.validateFields().then(() => {
      let listNumber = deliveryConfig.deliveryConfigPricings.map((i) => i.toDistance);
      let numberKmNext = Math.max(...listNumber);
      const newFeeByDistance = {
        id: randomGuid(),
        fromDistance: numberKmNext,
        toDistance: numberKmNext,
        feeValue: 1,
      };
      setListFeeByDistance([...listFeeByDistance, newFeeByDistance]);
      deliveryConfig.deliveryConfigPricings = [...listFeeByDistance, newFeeByDistance];
      form.setFieldsValue(formValues);
    });
  };

  const deleteItemFeeByDistance = (index, fromDistance) => {
    let formValues = form.getFieldsValue();
    const { deliveryConfig } = formValues;
    listFeeByDistance.map((item, i) => {
      if (index === 0 && index === i - 1) {
        item.fromDistance = 0;
      }
      if (index !== 0 && index !== listFeeByDistance.length - 1 && index === i - 1) {
        item.fromDistance = fromDistance;
      }
    });
    let feeByDistances = [...listFeeByDistance];
    feeByDistances.splice(index, 1);
    setListFeeByDistance(feeByDistances);
    deliveryConfig.deliveryConfigPricings = feeByDistances;
    form.setFieldsValue(formValues);
  };

  const onFinishSelfDelivery = async (values) => {
    let { deliveryConfig } = values;
    deliveryConfig.deliveryMethodId = selfDelivery.id;
    const response = await deliveryConfigService.updateDeliveryConfigAsync(values);
    if (response) {
      message.success(pageData.updateSelfDeliveryConfigSuccess);
      reLoadFormData(EnumDeliveryMethod.SelfDelivery);
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 22,
      }}
      autoComplete="off"
      onFinish={onFinishSelfDelivery}
    >
      <Card className={`shipping-cost ${!isCheckedSelfDelivery && "disable-form"}`}>
        <h3>{pageData.textShippingCost}</h3>
        <Row className="radio-fee">
          <Form.Item name={["deliveryConfig", "isFixedFee"]}>
            <Radio.Group
              disabled={!isCheckedSelfDelivery}
              onChange={(e) => setTypeShippingCost(e.target.value)}
              value={typeShippingCost}
            >
              <Radio value={shippingCost.fixedFee.value}>{shippingCost.fixedFee.name}</Radio>
              <Radio value={shippingCost.byDistance.value}>{shippingCost.byDistance.name}</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>

        {typeShippingCost === shippingCost.fixedFee.value ? (
          <>
            <h4 className="mt-3">{pageData.byDistance.feeDistance}</h4>
            <Form.Item
              name={["deliveryConfig", "feeValue"]}
              rules={[
                {
                  type: "number",
                  max: MaximumNumber,
                  min: 1,
                  message: pageData.feeValueValidation,
                },
              ]}
            >
              <InputNumber
                disabled={!isCheckedSelfDelivery}
                addonAfter={getCurrency()}
                min={1}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Row className="mt-3">{renderListFeeByDistance()}</Row>

            <Row className="mb-5">
              <Button disabled={!isCheckedSelfDelivery} type="primary" ghost onClick={AddNewFeeByDistance}>
                <PlusOutlined /> {pageData.btnAddNewFee}
              </Button>
            </Row>
          </>
        )}
        <Row className="mt-2">
          <Button disabled={!isCheckedSelfDelivery} type="primary" htmlType="submit">
            {pageData.save}
          </Button>
        </Row>
      </Card>
    </Form>
  );
}
