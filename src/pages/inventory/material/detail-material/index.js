import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import MaterialDetail from "./detail-material.page";
import materialDataService from "data-services/material/material-data.service";
import storeDataService from "data-services/store/store-data.service";

const mapDispatchToProps = () => {
  return {
    materialDataService: materialDataService,
    storeDataService: storeDataService
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(MaterialDetail);