import { Card, Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import taxDataService from "data-services/tax/tax-data.service";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CreateNewTax from "./components/create-tax.component";
import TableTax from "./components/table-tax-management.component";

export default function TaxManagement(props) {
  const [t] = useTranslation();
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    taxManagement: t("feeAndTax.tax.taxManagement"),
  };

  const tableFuncs = React.useRef(null);
  const [showAddTax, setShowAddTax] = useState(false);

  const openAddNewTaxModal = () => {
    setShowAddTax(true);
  };

  const onCompletedAddNewTax = () => {
    setShowAddTax(false);
    tableFuncs.current();
  };

  const onCancelAddNewTax = () => {
    setShowAddTax(false);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={pageData.taxManagement} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    onClick={() => openAddNewTaxModal(true)}
                    text={pageData.btnAddNew}
                  />
                ),
                permission: PermissionKeys.CREATE_TAX,
              },
            ]}
          />
        </Col>
      </Row>
      <Card className="fnb-card-full">
        <TableTax t={t} taxDataService={taxDataService} tableFuncs={tableFuncs} />
      </Card>
      <CreateNewTax
        t={t}
        isModalVisible={showAddTax}
        handleCompleted={onCompletedAddNewTax}
        handleCancel={onCancelAddNewTax}
      />
    </>
  );
}
