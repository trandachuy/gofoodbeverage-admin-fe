import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import PermissionGroup from "./permission-group.page";
import permissionDataService from "data-services/permission/permission-data.service";

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupPermissionsAsync: permissionDataService.getGroupPermissionsAsync,
    getPermissionGroupsAsync: permissionDataService.getPermissionGroupsAsync,
    createGroupPermissionAsync: permissionDataService.createGroupPermissionAsync,
    getGroupPermissionByIdAsync: permissionDataService.getGroupPermissionByIdAsync,
    updateGroupPermissionByIdAsync: permissionDataService.updateGroupPermissionByIdAsync,
  };
};

export default compose(withTranslation("translations"), connect(null, mapDispatchToProps), withRouter)(PermissionGroup);
