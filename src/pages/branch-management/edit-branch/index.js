import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EditBranchPage from "./edit-branch.page";
import branchDataService from "data-services/branch/branch-data.service";

const mapDispatchToProps = () => {
  return {
    branchDataService: branchDataService
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(EditBranchPage);
