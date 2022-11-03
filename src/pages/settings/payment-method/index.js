import { Card, Col, Image, Row, Switch, message } from "antd";
import { icons } from "constants/icons.constants";
import { paymentMethod } from "constants/payment-method.constants";
import paymentConfigDataService from "data-services/payment-config/payment-config-data.service";
import React, { useEffect, useState } from "react";
import { MoMoPaymentConfigComponent } from "./components/momo-payment-config.component";
import { useTranslation } from "react-i18next";
import "./payment-method.scss";
import { VisaMasterPaymentConfigComponent } from "./components/visa-master-payment-config.component";
import { VNPayPaymentConfigComponent } from "./components/vnpay-payment-config.component";

export default function PaymentMethodPage(props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { t } = useTranslation();
  const pageData = {
    paymentMethod: t("payment.paymentMethod"),
    settings: t("payment.settings"),
    activated: t("payment.activated"),
    notIntegrated: t("payment.notIntegrated"),
    updateSuccess: t("payment.updateSuccess"),
    updateFailed: t("payment.updateFailed"),
  };

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = () => {
    paymentConfigDataService.getAllStorePaymentConfigAsync().then(resData => {
      if (resData) {
        const { paymentMethods } = resData;
        setPaymentMethods(paymentMethods);
      }
    });
  };

  const onActivePaymentMethod = (paymentMethod, isActive) => {
    const enablePaymentConfigRequest = {
      enumId: paymentMethod.enumId,
      isActive: isActive,
    };
    paymentConfigDataService.enablePaymentConfigAsync(enablePaymentConfigRequest).then(success => {
      if (success === true) {
        message.success(pageData.updateSuccess);
      } else {
        message.error(pageData.updateFailed);
      }

      getInitData();
    });
  };

  const renderPaymentMethods = () => {
    const renderMethods = paymentMethods?.map(method => {
      const config = method?.paymentConfigs[0];
      const statusName = config?.isActivated === true ? pageData.activated : pageData.notIntegrated;
      const currentSelected = selectedPaymentMethod?.id === method?.id ? "active" : "";
      const switchOn = config?.isActivated === true ? true : false;
      return (
        <Row className={`p-3 m-2 pointer ${currentSelected}`} onClick={() => setSelectedPaymentMethod(method)}>
          <Col span={6}>
            <Image preview={false} width={70} height={60} src={method?.icon} fallback={icons.paymentDefaultIcon} />
          </Col>
          <Col span={14}>
            <h4 className="mb-0">{method?.name}</h4>
            <span className="color-gray">{statusName}</span>
          </Col>
          <Col span={4}>
            <Switch
              className="float-right"
              size="small"
              checked={switchOn}
              onChange={value => {
                onActivePaymentMethod(method, value);
              }}
            />
          </Col>
        </Row>
      );
    });
    return (
      <div>
        <h3>{pageData.paymentMethod}</h3>
        <div className="mt-4">{renderMethods}</div>
      </div>
    );
  };

  const renderPaymentConfig = () => {
    let paymentConfigComponent = <></>;
    switch (selectedPaymentMethod?.enumId) {
      case paymentMethod.MoMo:
        paymentConfigComponent = (
          <MoMoPaymentConfigComponent
            onCompleted={() => {
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.ZaloPay:
        /// TODO: Implement ZaloPay payment config component
        break;
      case paymentMethod.CreditDebitCard:
        paymentConfigComponent = (
          <VisaMasterPaymentConfigComponent
            onCompleted={() => {
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      case paymentMethod.Cash:
        /// TODO: Implement cash payment config component
        break;
      case paymentMethod.VNPay:
        paymentConfigComponent = (
          <VNPayPaymentConfigComponent
            onCompleted={() => {
              getInitData();
            }}
            initData={selectedPaymentMethod}
          />
        );
        break;
      default:
        paymentConfigComponent = <></>;
    }

    return (
      <div>
        <h3>{pageData.settings}</h3>
        <Row gutter={[16, 16]} className="mt-3 mb-4">
          <Col>
            {selectedPaymentMethod?.icon && (
              <Image
                preview={false}
                width={70}
                height={60}
                src={selectedPaymentMethod?.icon}
                fallback={icons.paymentDefaultIcon}
              />
            )}
          </Col>
          <Col>
            <h1 className="mb-0">{selectedPaymentMethod?.name}</h1>
          </Col>
        </Row>

        {paymentConfigComponent}
      </div>
    );
  };

  return (
    <>
      <Card className="fnb-card-full">
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col md={12} xxl={8} className="payment-method">
            {renderPaymentMethods()}
          </Col>
          <Col md={12} xxl={16}>
            {renderPaymentConfig()}
          </Col>
        </Row>
      </Card>
    </>
  );
}
