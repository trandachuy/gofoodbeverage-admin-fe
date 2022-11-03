import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";
import NewSupplier from "./components/new-supplier.component";
import TableSupplier from "./components/table-supplier.component";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { executeAfter } from "utils/helpers";
import { useTranslation } from "react-i18next";
import supplierDataService from "data-services/supplier/supplier-data.service";
import { tableSettings } from "constants/default.constants";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";

export default function Supplier(props) {
  const [t] = useTranslation();
  const [showAddNewSupplier, setShowAddNewSupplier] = useState(false);
  const [listSupplier, setListSupplier] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    supplierManagement: t("supplier.supplierManagement"),
    addNewSupplier: t("supplier.addNewSupplier"),
  };

  useEffect(() => {
    let fetchData = async () => {
      await initDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
    };
    fetchData();
  }, []);

  const initDataTable = async (pageNumber, pageSize, keySearch) => {
    let res = await supplierDataService.getListSupplierAsync(pageNumber, pageSize, keySearch);
    let suppliers = mappingToDataTable(res.suppliers);
    setListSupplier(suppliers);
    setTotalSupplier(res.total);
  };

  const mappingToDataTable = (suppliers) => {
    return suppliers?.map((item) => {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        phoneNumber: item.phoneNumber,
        email: item.email,
      };
    });
  };

  const onSearchSupplier = (keySearch) => {
    executeAfter(500, async () => {
      setKeySearch(keySearch);
      initDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    initDataTable(pageNumber, pageSize, keySearch);
  };

  const onCancel = () => {
    initDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
    setShowAddNewSupplier(false);
  };

  return (
    <>
      {showAddNewSupplier ? (
        <>
          <NewSupplier onCancel={() => onCancel()} />
        </>
      ) : (
        <>
          <Row className="fnb-row-page-header">
            <Col span={12}>
              <PageTitle content={pageData.supplierManagement} />
            </Col>
            <Col span={12}>
              <FnbAddNewButton
                className="float-right"
                permission={PermissionKeys.CREATE_SUPPLIER}
                onClick={() => setShowAddNewSupplier(true)}
                text={pageData.btnAddNew}
              />
            </Col>
          </Row>
          <div className="clearfix"></div>
          <Card className="fnb-card-full">
            <TableSupplier
              refreshDataTable={initDataTable}
              dataSource={listSupplier}
              pageSize={tableSettings.pageSize}
              onChangePage={onChangePage}
              onSearch={onSearchSupplier}
              total={totalSupplier}
              currentPageNumber={currentPageNumber}
            />
          </Card>
        </>
      )}
    </>
  );
}
