import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import PurchaseOrderPage from "./purchase-order.page";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";

const mapDispatchToProps = () => {
  return {
    purchaseOrderDataService: purchaseOrderDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(PurchaseOrderPage);
