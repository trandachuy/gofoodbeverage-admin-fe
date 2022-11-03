import customerDataService from "data-services/customer/customer-data.service";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import OnlineStoreManagement from "./online-store-management.page";

const mapDispatchToProps = () => {
  return {
    customerDataService: customerDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(OnlineStoreManagement);
