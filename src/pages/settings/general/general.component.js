import { Tabs } from "antd";
import storeDataService from "data-services/store/store-data.service";
import { useTranslation } from "react-i18next";
import Display from "./components/display/display.component";
import StoreBankAccount from "./components/general-info/store-bank-account.component";
import "./general.component.scss";

export default function General(props) {
  const { storeId } = props;
  const [t] = useTranslation();

  const pageData = {
    storeInfo: t("settings.storeInfo"),
    display: t("settings.display"),
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" className="general-setting-tabs">
        <Tabs.TabPane tab={pageData.storeInfo} key="1">
          <StoreBankAccount t={t} storeDataService={storeDataService} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={pageData.display} key="4">
          <Display t={t} storeId={storeId} />
        </Tabs.TabPane>
      </Tabs>
      {/* TODO: Button Save */}
    </div>
  );
}
