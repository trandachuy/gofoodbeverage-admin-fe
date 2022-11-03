import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditCustomerMembershipPage from "./update-membership.page";
import membershipDataService from "data-services/membership/membership-data.service";

const mapDispatchToProps = () => {
  return {
    membershipDataService: membershipDataService,
  };
};

export default compose(withTranslation("translations"), connect(null, mapDispatchToProps), withRouter)(EditCustomerMembershipPage);
