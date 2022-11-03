import { Row, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { hasPermission } from "utils/helpers";
import ListFeeComponent from "./components/list-fee.component";
import "./fee-tax.component.scss";
import TaxManagement from "./tax/tax.page";

const { TabPane } = Tabs;
export function FeeAndTaxManagement(props) {
  const [t] = useTranslation();

  const pageData = {
    titleFeeAndTax: t("feeAndTax.title"),
    feeManagement: t("feeAndTax.feeManagement"),
    taxManagement: t("feeAndTax.tax.taxManagement"),
    fee: t("feeAndTax.feeTabTitle"),
    tax: t("feeAndTax.tax.taxTabTitle"),
  };

  function renderTabButtons() {
    return (
      <Tabs defaultActiveKey={1} className="fee-tax-setting-tabs">
        {hasPermission(PermissionKeys.VIEW_FEE) && (
          <TabPane tab={pageData.fee} key="1">
            <div className="clearfix"></div>
            <ListFeeComponent />
          </TabPane>
        )}
        {hasPermission(PermissionKeys.VIEW_TAX) && (
          <TabPane tab={pageData.tax} key="2">
            <div className="clearfix"></div>
            <TaxManagement />
          </TabPane>
        )}
      </Tabs>
    );
  }

  return (
    <>
      <Row>
        <Content style={{ overflow: "initial" }}>{renderTabButtons()}</Content>
      </Row>
    </>
  );
}
