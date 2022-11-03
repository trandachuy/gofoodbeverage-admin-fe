import { Card, Tabs } from "antd";
import OrderManagement from "pages/report/order/order.page";
import TableShift from "pages/report/shift/shift-management/components/table-shift.component";
import { useTranslation } from "react-i18next";
import ReportProductTransaction from "../components/product-report/product-report.component";
import "./report-transaction.page.scss";

const { TabPane } = Tabs;

export default function ReportTransaction(props) {
  const [t] = useTranslation();
  const pageData = {
    orderTitle: t("dashboard.order"),
    shiftTitle: t("report.shift.title"),
    productTitle: t("menu.product"),
    comboTitle: "Combo",
  };

  return (
    <>
      <Tabs defaultActiveKey={props?.match?.params?.index ?? 1} className="transaction-report-tabs">
        <TabPane tab={pageData.orderTitle} key="1">
          <div className="clearfix"></div>
          <OrderManagement />
        </TabPane>
        <TabPane tab={pageData.shiftTitle} key="2">
          <div className="clearfix"></div>
          <Card className="mt-3 fnb-card">
            <TableShift />
          </Card>
        </TabPane>
        <TabPane tab={pageData.productTitle} key="3">
          <ReportProductTransaction />
        </TabPane>
        <TabPane tab={pageData.comboTitle} key="4">
          <div className="clearfix"></div>
          <>Combo component here</>
        </TabPane>
      </Tabs>
    </>
  );
}
