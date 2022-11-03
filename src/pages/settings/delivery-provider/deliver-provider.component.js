import { Card, Col, Image, Radio, Row, Switch, Typography } from "antd";
import { EnumDeliveryMethod } from "constants/delivery-method.constants";
import deliveryMethodService from "data-services/delivery-method/delivery-method.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { images } from "../../../constants/images.constants";
import AhaMoveConfiguration from "./component/ahamove-config.component";
import SelfDeliveryConfigComponent from "./component/self-delivery-config.component";
import "./index.scss";
const { Text } = Typography;

export default function DeliveryProvider(props) {
  const [t] = useTranslation();
  const pageData = {
    title: t("deliveryMethod.title"),
    textSelfDelivery: t("deliveryMethod.titleSelfDelivery"),
    textAhaMove: t("deliveryMethod.titleAhaMove"),
  };
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selfDelivery, setSelfDelivery] = useState(null);
  const [ahaMoveDelivery, setAhaMoveDelivery] = useState(null);
  const [isCheckedSelfDelivery, setIsCheckedSelfDelivery] = useState(false);
  const [keyDeliveryMethod, setKeyDeliveryMethod] = useState(null);

  useEffect(() => {
    getInitFormData(EnumDeliveryMethod.SelfDelivery);
  }, []);

  const getInitFormData = async (keyDelivery) => {
    let res = await deliveryMethodService.getDeliveryMethodsAsync();
    if (res && res?.deliveryMethods.length > 0) {
      let selfDelivery = res?.deliveryMethods.find((item) => item.enumId === EnumDeliveryMethod.SelfDelivery);
      let ahaMoveDelivery = res.deliveryMethods.find((item) => item.enumId === EnumDeliveryMethod.AhaMove);
      setSelfDelivery(selfDelivery);
      setAhaMoveDelivery(ahaMoveDelivery);
      const deliveryMethods = [
        {
          key: EnumDeliveryMethod.SelfDelivery,
          name: pageData.textSelfDelivery,
          checked: selfDelivery?.deliveryConfig != null ? selfDelivery?.deliveryConfig?.isActivated : false,
        },
        {
          key: EnumDeliveryMethod.AhaMove,
          name: pageData.textAhaMove,
          checked: ahaMoveDelivery?.deliveryConfig != null ? ahaMoveDelivery?.deliveryConfig?.isActivated : false,
        },
      ];
      setIsCheckedSelfDelivery(deliveryMethods[0]?.checked);
      setDeliveryMethods(deliveryMethods);
      setKeyDeliveryMethod(keyDelivery);
    }
  };

  const onChangeStatusDeliveryMethod = async (checked, key) => {
    let req = {
      id: key,
      isActivated: checked,
    };
    let res = await deliveryMethodService.updateStatusDeliveryMethodByIdAsync(req);
    if (res && key === EnumDeliveryMethod.SelfDelivery) {
      setIsCheckedSelfDelivery(checked);
    }
  };

  const renderDeliveryMethod = () => {
    return (
      <Radio.Group
        defaultValue={EnumDeliveryMethod.SelfDelivery}
        onChange={(e) => setKeyDeliveryMethod(e?.target?.value)}
        buttonStyle="solid"
        style={{ display: "inline-grid", width: "100%" }}
      >
        {deliveryMethods?.map((dvm) => {
          return (
            <Radio.Button value={dvm.key} className="mt-3 item-method">
              <Row>
                <Col span={4}>
                  <Image width={30} src={images.selfDelivery} className="ml-3" />
                </Col>
                <Col span={12}>
                  <Text strong>{dvm.name}</Text>
                </Col>
                <Col span={8} className="float-right">
                  <Switch
                    defaultChecked={dvm?.checked}
                    className="float-right mr-3"
                    onChange={(checked) => onChangeStatusDeliveryMethod(checked, dvm?.key)}
                  />
                </Col>
              </Row>
            </Radio.Button>
          );
        })}
      </Radio.Group>
    );
  };

  return (
    <Row>
      <Col span={8}>
        <Card className="delivery-method">
          <h3>{pageData.title}</h3>
          {renderDeliveryMethod()}
        </Card>
      </Col>
      <Col span={16}>
        {keyDeliveryMethod === deliveryMethods[0]?.key ? (
          <SelfDeliveryConfigComponent
            isCheckedSelfDelivery={isCheckedSelfDelivery}
            selfDelivery={selfDelivery}
            reLoadFormData={getInitFormData}
          />
        ) : (
          <AhaMoveConfiguration ahaMoveDelivery={ahaMoveDelivery} reLoadFormData={getInitFormData} />
        )}
      </Col>
    </Row>
  );
}
