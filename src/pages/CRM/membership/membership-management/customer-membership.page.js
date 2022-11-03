import React from "react";
import { Card, Row, Col } from "antd";
import TableCustomerMemberShip from "./components/table-customer-membership.component";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";

/**
 * Page Membership Management
 * description: page manage customer primary template
 */
export default function CustomerMembershipManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    membershipManagement: t("membership.title"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
  };

  const gotoAddNewMembershipLevelPage = () => {
    history.push("/membership/create");
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.membershipManagement} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_MEMBERSHIP_LEVEL}
            onClick={() => gotoAddNewMembershipLevelPage()}
            text={pageData.btnAddNew}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card-full">
        <TableCustomerMemberShip />
      </Card>
    </>
  );
}
