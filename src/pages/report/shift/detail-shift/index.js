import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ShiftDetail from "./detail-shift.page";
import shiftDataService from "data-services/shift/shift-data.service";

const mapDispatchToProps = () => {
  return {
    shiftDataService: shiftDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(ShiftDetail);
