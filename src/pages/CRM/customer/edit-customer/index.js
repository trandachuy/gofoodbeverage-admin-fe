import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditCustomerPage from "./edit-customer.page";
import customerDataService from "data-services/customer/customer-data.service";

const mapDispatchToProps = () => {
  return {
    customerDataService: customerDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(EditCustomerPage);
