import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import RegisterPage from "./register.page";
import storeDataService from "../../data-services/store/store-data.service";

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.session?.auth?.token ? true : false,
  };
};

const mapDispatchToProps = () => {
  return {
    storeDataService: storeDataService,
  };
};

export default compose(withTranslation("translations"), connect(mapStateToProps, mapDispatchToProps), withRouter)(RegisterPage);
