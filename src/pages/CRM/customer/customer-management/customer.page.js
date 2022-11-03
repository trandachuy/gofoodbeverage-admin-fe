import React from "react";
import { Card, Row, Col } from "antd";
import TableCustomer from "./components/table-customer.component";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";

/**
 * Page Customer Management
 * description: page manage customer primary template
 */
export default function CustomerManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    customerManagement: t("customer.title"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
  };
  const createCustomerPage = "/customer/create-new";

  const gotoAddNewCustomerPage = () => {
    history.push(createCustomerPage);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.customerManagement} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_CUSTOMER}
            onClick={() => gotoAddNewCustomerPage(true)}
            text={pageData.btnAddNew}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card-full">
        <TableCustomer />
      </Card>
    </>
  );
}
