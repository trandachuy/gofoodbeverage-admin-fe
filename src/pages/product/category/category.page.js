import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import PageTitle from "components/page-title";
import TableProductCategory from "./components/table-product-category.component";
import FormNewProductCategory from "./components/form-new-product-category.component";
import { PermissionKeys } from "constants/permission-key.constants";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import "./index.scss";

/**
 * Page Product Management
 * description: page manage product primary template
 */
export default function ProductCategoryManagement(props) {
  const { t, productDataService, branchDataService } = props;
  const [showAddNewProductCategoryForm, setShowAddNewProductCategoryForm] = useState(false);

  const pageData = {
    title: t("productCategory.title"),
    button: {
      addNew: t("button.addNew"),
    },
  };

  useEffect(() => {});

  return (
    <>
      {!showAddNewProductCategoryForm && (
        <>
          <Row className="fnb-row-page-header">
            <Col className="category-title-box" xs={24} sm={12}>
              <PageTitle content={pageData.title} />
            </Col>
            <Col className="category-button-box" xs={24} sm={12}>
              <FnbAddNewButton
                className="float-right"
                permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                onClick={() => setShowAddNewProductCategoryForm(true)}
                text={pageData.button.addNew}
              />
            </Col>
          </Row>
        </>
      )}

      <div className="clearfix"></div>
      {showAddNewProductCategoryForm ? (
        <>
          <FormNewProductCategory
            t={t}
            onCompleted={() => setShowAddNewProductCategoryForm(false)}
            productCategoryDataService={productCategoryDataService}
            productDataService={productDataService}
            branchDataService={branchDataService}
          />
        </>
      ) : (
        <Card className="fnb-card-full">
          <TableProductCategory />
        </Card>
      )}
    </>
  );
}
