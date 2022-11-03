import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import MaterialCategoryManagement from "./material-category-management.page";
import "./index.scss";

export default compose(withTranslation("translations"), withRouter)(MaterialCategoryManagement);
