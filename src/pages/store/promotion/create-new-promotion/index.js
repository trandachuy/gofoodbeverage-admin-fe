import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import productDataService from "data-services/product/product-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import storeDataService from "data-services/store/store-data.service";
import promotionDataService from "data-services/promotion/promotion-data.service";
import branchDataService from "data-services/branch/branch-data.service";
import CreateNewPromotionManagement from "./create-new-promotion.page";

const mapDispatchToProps = () => {
  return {
    productDataService: productDataService,
    productCategoryDataService: productCategoryDataService,
    storeDataService: storeDataService,
    promotionDataService: promotionDataService,
    branchDataService: branchDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(CreateNewPromotionManagement);
