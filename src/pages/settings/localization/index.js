import { Tabs } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageConfig from "./language-config";

const { TabPane } = Tabs;
export default function Localization(props) {
  const [t] = useTranslation();
  const screens = {
    languageConfig: 1,
  };

  const tabs = [
    {
      key: screens.languageConfig,
      title: t("languageConfig.title"),
      component: <LanguageConfig />,
    },
  ];

  const [activeScreen, setActiveScreen] = useState(screens.languageConfig);

  return (
    <div>
      <Tabs defaultActiveKey={`${activeScreen}`}>
        {tabs.map((screen) => {
          return (
            <TabPane key={screen.key} tab={screen.title}>
              {screen.component}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
