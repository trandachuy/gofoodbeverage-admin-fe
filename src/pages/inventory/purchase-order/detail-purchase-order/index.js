import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import DetailPurchaseOrder from "./detail-purchase-order.page";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import storeDataService from "data-services/store/store-data.service";

const mapDispatchToProps = () => {
  return {
    purchaseOrderDataService: purchaseOrderDataService,
    storeDataService: storeDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(DetailPurchaseOrder);
