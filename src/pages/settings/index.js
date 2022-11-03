import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Settings from "./setting.page";

const mapStateToProps = (state) => {
  return {
    storeId: state.session?.auth?.user?.storeId,
  };
};

export default compose(withTranslation("translations"), connect(mapStateToProps, null), withRouter)(Settings);
