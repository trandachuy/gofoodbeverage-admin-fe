import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import UpdateCustomerSegment from "./update-customer-segment.page";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";

const mapDispatchToProps = () => {
  return {
    customerSegmentDataService: customerSegmentDataService,
  };
};

export default compose(withTranslation("translations"), connect(null, mapDispatchToProps), withRouter)(UpdateCustomerSegment);
