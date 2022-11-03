import { Card, Col, Row } from "antd";
import { FnbTabs } from "components/fnb-tabs/fnb-tabs";
import PageTitle from "components/page-title";
import { ReceiptIcon } from "constants/icons.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { BranchPurchasePackage } from "./branch-purchase-package";
import "./branch-purchase.page.scss";

export function BranchPurchasePage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const screens = {
    branchSubscription: 1,
  };
  const initTabs = [
    {
      key: screens.branchSubscription,
      title: t("store.branchSubscription"),
      icon: <ReceiptIcon />,
      component: (
        <Card>
          <BranchPurchasePackage />
        </Card>
      ),
    },
  ];
  const [activeScreen, setActiveScreen] = React.useState(screens.branchSubscription);

  const pageData = {
    titlePage: t("store.branchPurchase.title"),
  };

  return (
    <>
      <Row className="mt-4" align="middle" gutter={[0, 0]}>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
          <PageTitle className="title-page-my-account" content={pageData.titlePage} />
        </Col>
      </Row>
      <div className="col-input-full-width">
        <Row className="w-100">
          <Col span={24}>
            <FnbTabs defaultActiveKey={activeScreen} panes={initTabs} />
          </Col>
        </Row>
      </div>
    </>
  );
}
