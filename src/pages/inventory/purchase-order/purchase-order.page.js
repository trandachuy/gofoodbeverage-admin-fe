import React from "react";
import { Col, Row } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import TablePurchaseOrderComponent from "./components/table-purchase-order.component";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";

export default function PurchaseOrderManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const pageData = {
    addNew: t("purchaseOrder.addNew"),
    title: t("purchaseOrder.purchaseOrderManagement"),
  };

  const onClickAddNew = () => {
    history.push(`/inventory/purchase-order/create-new`);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton className="float-right" permission={PermissionKeys.CREATE_PURCHASE} onClick={onClickAddNew} text={pageData.addNew} />
        </Col>
      </Row>
      <TablePurchaseOrderComponent />
    </>
  );
}
