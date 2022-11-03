import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditPurchaseOrder from "./edit-purchase-order.page";
import materialDataService from "data-services/material/material-data.service";
import branchDataService from "data-services/branch/branch-data.service";
import storeDataService from "data-services/store/store-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import supplierDataService from "data-services/supplier/supplier-data.service";
import unitConversionDataService from "data-services/unit-conversion/unit-conversion-data.service";

const mapDispatchToProps = () => {
  return {
    materialDataService: materialDataService,
    branchDataService: branchDataService,
    storeDataService: storeDataService,
    purchaseOrderDataService: purchaseOrderDataService,
    supplierDataService: supplierDataService,
    unitConversionDataService: unitConversionDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(EditPurchaseOrder);
