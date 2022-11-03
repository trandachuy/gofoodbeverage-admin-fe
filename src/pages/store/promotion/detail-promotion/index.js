import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import promotionDataService from "data-services/promotion/promotion-data.service";
import DetailPromotionManagement from "./detail-promotion.page";

const mapDispatchToProps = () => {
  return {
    promotionDataService: promotionDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(DetailPromotionManagement);
