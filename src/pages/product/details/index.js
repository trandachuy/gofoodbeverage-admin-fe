import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ProductDetailPage from "./details-product.page";
import productDataService from "data-services/product/product-data.service";

const mapDispatchToProps = () => {
  return {
    productDataService: productDataService
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(ProductDetailPage);
