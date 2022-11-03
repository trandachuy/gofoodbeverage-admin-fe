import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Supplier from "./supplier.page";
import supplierDataService from "data-services/supplier/supplier-data.service";
import storeDataService from "data-services/store/store-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";

const mapDispatchToProps = () => {
  return {
    supplierDataService: supplierDataService,
    storeDataService: storeDataService,
    purchaseOrderDataService: purchaseOrderDataService,
  };
};

export default compose(withTranslation("translations"), connect(null, mapDispatchToProps), withRouter)(Supplier);
