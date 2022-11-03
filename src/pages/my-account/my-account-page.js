import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PageTitle from "components/page-title";
import { FnbTabs } from "components/fnb-tabs/fnb-tabs";
import UserInformationComponent from "./components/user-information.component";
import { SubscriptionComponent } from "./components/subscription.component";
import "./my-account.scss";
import { ReceiptIcon, UserIcon } from "constants/icons.constants";

export default function MyAccountPage(props) {
  const [t] = useTranslation();
  const state = useSelector((state) => state);
  const [userInformation, setUserInformation] = useState(null);
  const pageData = {
    titlePage: t("myAccount.title"),
    tabNameAccount: t("myAccount.tabName.account"),
    subscription: t("myAccount.tabName.subscription"),
  };
  const screens = {
    userInformation: 1,
    orderPackage: 2,
  };
  const initTabs = [
    {
      key: screens.userInformation,
      title: pageData.tabNameAccount,
      icon: <UserIcon />,
      component: (
        <Card className="my-account-card">
          <UserInformationComponent />
        </Card>
      ),
    },
    {
      key: screens.orderPackage,
      title: pageData.subscription,
      icon: <ReceiptIcon />,
      component: (
        <Card className="my-account-card">
          <SubscriptionComponent userInformation={userInformation} />
        </Card>
      ),
    },
  ];
  const [activeScreen, setActiveScreen] = React.useState(screens.userInformation);

  useEffect(() => {
    let userInfo = state.session?.auth?.user;
    setUserInformation(userInfo);
  }, []);

  const onChangeTab = (key) => {
    setActiveScreen(key);
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
            <FnbTabs defaultActiveKey={activeScreen} panes={initTabs} onChangeTab={onChangeTab} />
          </Col>
        </Row>
      </div>
    </>
  );
}
