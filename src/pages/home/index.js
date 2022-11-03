import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import HomePage from "./home.page";
import storeDataService from "../../data-services/store/store-data.service";
import orderDataService from "data-services/order/order-data.service";
import branchDataService from "data-services/branch/branch-data.service";

const mapStateToProps = (state) => {
  return {
    getPrepareRegisterNewStoreDataAsync: storeDataService.getPrepareRegisterNewStoreDataAsync,
  };
};

const mapDispatchToProps = () => {
  return {
    orderDataService: orderDataService,
    branchDataService: branchDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(HomePage);
