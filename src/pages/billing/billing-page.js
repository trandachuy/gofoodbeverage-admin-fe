import { Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BillingComponent from "./components/billing.component";
import "./billing-page.scss";
import { images } from "constants/images.constants";
import { FnbLogo } from "constants/icons.constants";

export default function BillingPage(props) {
  const [t] = useTranslation();

  const state = useSelector((state) => state);
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    let userInfo = state.session?.auth?.userInfo;
    setUserInformation(userInfo);
  }, []);

  return (
    <Row className="billing-package">
      <Col span={24} className="logo-container">
        <FnbLogo className="fnb-logo" />
      </Col>
      <Col span={24} className="wrapper-package">
        <div className="package-container">
          <BillingComponent userInfo={userInformation} />
        </div>
      </Col>
    </Row>
  );
}
