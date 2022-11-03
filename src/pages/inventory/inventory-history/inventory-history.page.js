import { Col, Row } from "antd";
import PageTitle from "components/page-title";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TableInventoryHistoryComponent from "./components/table-inventory-history.component";

export default function InventoryHistoryPage(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const pageData = {
    title: t("inventoryHistory.title"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={24}>
          <PageTitle content={pageData.title} />
        </Col>
      </Row>
      <TableInventoryHistoryComponent />
    </>
  );
}
