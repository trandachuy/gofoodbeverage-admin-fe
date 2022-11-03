import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import OrderDetail from "./detail-order.page";
import orderDataService from "data-services/order/order-data.service";

const mapDispatchToProps = () => {
  return {
    orderDataService: orderDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(OrderDetail);