import { Row, Space, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import PageTitle from "components/page-title";
import React from "react";
import "./index.scss";

import barcodeDataService from "data-services/barcode/barcode-data.service";
import billDataService from "data-services/bill-configuration/bill-data.service";
import stampDataService from "data-services/stamp/stamp-data.service";
import storeDataService from "data-services/store/store-data.service";

import BarcodeConfig from "./barcode";
import DeliveryProvider from "./delivery-provider/deliver-provider.component";
import General from "./general/general.component";
import Localization from "./localization";
import PaymentMethodPage from "./payment-method";
import ReceiptPage from "./receipt";
import StampConfig from "./stamp";

const { TabPane } = Tabs;

export default function Settings(props) {
  const { t, storeId } = props;

  const pageData = {
    settings: t("settings.settingsTitle"),
    general: t("store.general"),
    deliveryProvider: t("store.deliveryProvider"),
    paymentMethod: t("store.paymentMethod"),
    receipt: t("store.receipt"),
    stamp: t("stamp.stamp"),
    barcode: t("barcode.barcode"),
    localization: t("settings.localization"),
  };

  const screens = [
    {
      name: pageData.general,
      key: "1",
      component: <General t={t} storeDataService={storeDataService} storeId={storeId} />,
    },
    {
      name: pageData.deliveryProvider,
      key: "2",
      component: <DeliveryProvider />,
    },
    {
      name: pageData.paymentMethod,
      key: "3",
      component: <PaymentMethodPage />,
    },
    {
      name: pageData.receipt,
      key: "4",
      component: <ReceiptPage t={t} billDataService={billDataService} storeDataService={storeDataService} />,
    },
    {
      name: pageData.stamp,
      key: "5",
      component: <StampConfig t={t} stampDataService={stampDataService} />,
    },
    {
      name: pageData.barcode,
      key: "6",
      component: <BarcodeConfig t={t} barcodeDataService={barcodeDataService} />,
    },
    {
      name: pageData.localization,
      key: "7",
      component: <Localization />,
    },
  ];

  const defaultScreen = "1";

  const [activeScreen, setActiveScreen] = React.useState(defaultScreen);

  const renderScreenContent = () => {
    const screenActive = screens.find((item) => item.key === activeScreen);
    if (screenActive !== null) {
      return screenActive.component;
    }

    return defaultScreen;
  };

  return (
    <div>
      <Content style={{ overflow: "initial" }}>
        <Row className="fnb-row-page-header">
          <Space className="page-title">
            <PageTitle content={pageData.settings} />
          </Space>
          <Space className="page-action-group"></Space>
        </Row>

        <Tabs defaultActiveKey={1} className="transaction-report-tabs" onChange={(key) => setActiveScreen(key)}>
          {screens?.map((screen) => {
            return <TabPane tab={screen.name} key={screen.key}></TabPane>;
          })}
        </Tabs>
        <div>{renderScreenContent()}</div>
      </Content>
    </div>
  );
}
