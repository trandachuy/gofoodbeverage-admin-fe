import materialDataService from "data-services/material/material-data.service";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import languageService from "services/language/language.service";
import ImportMaterial from "./import-material.page";

const mapStateToProps = (state) => {
  return {
    storeId: state.session?.auth?.user?.storeId,
  };
};

const mapDispatchToProps = () => {
  return {
    languageService: languageService,
    materialDataService: materialDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(ImportMaterial);
