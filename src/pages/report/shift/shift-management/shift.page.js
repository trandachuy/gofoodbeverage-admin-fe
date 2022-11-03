import React from "react";
import { Card, Col, Row, Space, Tabs } from "antd";
import TableShift from "./components/table-shift.component";
import PageTitle from "components/page-title";
import { useTranslation } from "react-i18next";
const { TabPane } = Tabs;
/**
 * Page Shift Management
 * description: page manage Shift primary template
 */
export default function ShiftManagement(props) {
  const [t] = useTranslation();
  const pageData = {
    reportTitle: t("report.title"),
    shiftTitle: t("report.summary"),
    summary: t("report.shiftTab"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Space className="page-title">
          <PageTitle content={pageData.reportTitle} />
        </Space>
        <Space className="page-action-group"></Space>
      </Row>

      <Tabs defaultActiveKey="2">
        <TabPane tab={pageData.shiftTitle} key="1"></TabPane>
        <TabPane tab={pageData.summary} key="2">
          <div className="clearfix"></div>
          <Card className="mt-3 fnb-card">
            <TableShift />
          </Card>
        </TabPane>
      </Tabs>
    </>
  );
}
