import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {CreateNewStaff} from "./create-new-staff.page";
import staffDataService from "data-services/staff/staff-data.service";

const mapDispatchToProps = () => {
  return {
    staffDataService: staffDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(CreateNewStaff);
