import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditCompoPage from "./edit-combo.page";
import comboDataService from "data-services/combo/combo-data.service";
import branchDataService from "data-services/branch/branch-data.service";
import productDataService from "data-services/product/product-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";

const mapDispatchToProps = () => {
  return {
    comboDataService: comboDataService,
    branchDataService: branchDataService,
    productDataService: productDataService,
    productCategoryDataService: productCategoryDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(EditCompoPage);
