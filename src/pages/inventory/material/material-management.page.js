import { Col, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { TableMaterial } from "./components/table-material.component";

export function MaterialManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { storeId } = props;
  const tableMaterialRef = React.useRef();
  const pageData = {
    materialManagement: t("material.materialManagement"),
    addNew: t("button.addNew"),
    import: t("button.import"),
    export: t("button.export"),
    filter: t("button.filter"),
    nameMaterial: t("material.name"),
    quantity: t("table.quantity"),
    unit: t("table.unit"),
    cost: t("table.cost"),
    sku: t("table.sku"),
    action: t("table.action"),
  };

  const handleExportMaterial = () => {
    if (tableMaterialRef && tableMaterialRef.current) {
      tableMaterialRef.current.exportFilter(storeId);
    }
  };

  return (
    <>
      <>
        <Row className="fnb-row-page-header">
          <Col span={12}>
            <PageTitle content={pageData.materialManagement} />
          </Col>
          <Col span={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <FnbAddNewButton
                      permission={PermissionKeys.CREATE_MATERIAL}
                      onClick={() => history.push("/material/add-new")}
                      text={pageData.addNew}
                    />
                  ),
                  permission: PermissionKeys.CREATE_MATERIAL,
                },
                {
                  action: (
                    <a href="javascript:void(0)" className="second-button" onClick={handleExportMaterial}>
                      {pageData.export}
                    </a>
                  ),
                  permission: PermissionKeys.EXPORT_MATERIAL,
                },
                {
                  action: (
                    <a
                      href="javascript:void(0)"
                      className="second-button"
                      onClick={() => history.push("/inventory/material/import")}
                    >
                      {pageData.import}
                    </a>
                  ),
                  permission: PermissionKeys.EXPORT_MATERIAL,
                },
              ]}
            />
          </Col>
        </Row>
        <TableMaterial ref={tableMaterialRef} />
      </>
    </>
  );
}
