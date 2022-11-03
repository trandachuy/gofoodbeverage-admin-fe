import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ProductCategoryManagement from "./category.page";
import productDataService from "data-services/product/product-data.service";
import branchDataService from "data-services/branch/branch-data.service";

const mapDispatchToProps = () => {
  return {
    productDataService: productDataService,
    branchDataService: branchDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(ProductCategoryManagement);
