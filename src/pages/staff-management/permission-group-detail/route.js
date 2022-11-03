import PermissionGroupDetail from ".";
const route = {
  key: "app.settings.permission-group-detail",
  position: 100,
  focus: "app.settings",
  path: "/settings/permission-group/:id/detail",
  isMenu: false,
  exact: false,
  auth: true,
  component: PermissionGroupDetail,
  child: [],
};
export default route;
