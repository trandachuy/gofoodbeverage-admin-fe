import React, { useEffect } from "react";
import { Card, Radio, Row, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import PageTitle from "components/page-title";

import SliderFullScreen from "./slider-full-screen";
import SliderLeft from "./slider-left";
import i18n from "utils/i18n";
import "./style.scss";

function SliderManagement(props) {

    const { t } = i18n;
    let screens = {
        full: {
          key: 1,
          component: <SliderFullScreen />,
        },
        left: {
          key: 2,
          component: <SliderLeft />,
        },
      };
    const [activeScreen, setActiveScreen] = React.useState(screens.full.key);

    useEffect(() => {}, []);
  
    const onChangeScreen = (e) => {
      const screen = e.target.value;
      setActiveScreen(screen);
    };
  
    const renderScreenContent = () => {
        switch (activeScreen) {
          case screens.left.key:
            return screens.left.component;
          default:
          case screens.full.key:
            return screens.full.component;
        }
      };


  return (
    <section className="c-slider-management">
      <Content style={{ overflow: "initial" }}>
        <Row className="fnb-row-page-header">
          <Space className="page-title">
            <PageTitle content={t("sliderManagement.sliderTitle")} />
          </Space>
          <Space className="page-action-group"></Space>
        </Row>

        <Radio.Group value={activeScreen} onChange={onChangeScreen}>
          <Radio.Button value={screens.full.key} className="mr-2">
            {t("sliderManagement.sliderFullScreenTitle")}
          </Radio.Button>
          <Radio.Button value={screens.left.key} className="mr-2">
            {t("sliderManagement.sliderLeftTitle")}
          </Radio.Button>
        </Radio.Group>

        <div>{renderScreenContent()}</div>
      </Content>
    </section>
  );
}
export default SliderManagement;
  