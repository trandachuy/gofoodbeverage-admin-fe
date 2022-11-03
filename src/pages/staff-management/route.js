import CreateNewStaff from "./create-new-staff";
import EditStaff from "./edit-staff";
import EditGroupPermission from "./permission-group/components/edit-group-permission.component";
import NewPermissionGroup from "./permission-group/new-permission-group";

const route = [
  {
    key: "app.staff.create-new",
    position: 1,
    focus: "app.staff",
    path: "/staff/create-new",
    isMenu: false,
    exact: false,
    auth: true,
    component: CreateNewStaff,
    child: [],
  },
  {
    key: "app.staff.edit-new-staff",
    position: 2,
    focus: "app.staff",
    path: "/staff/edit/:id",
    isMenu: false,
    exact: false,
    auth: true,
    component: EditStaff,
    child: [],
  },

  {
    key: "app.permission.group.new",
    position: 2,
    focus: "app.staff",
    path: "/permission-group/create-new",
    isMenu: false,
    exact: false,
    auth: true,
    component: NewPermissionGroup,
    child: [],
  },
  {
    key: "app.permission.group.edit",
    position: 2,
    focus: "app.staff",
    path: "/permission-group/edit/:id",
    isMenu: false,
    exact: false,
    auth: true,
    component: EditGroupPermission,
    child: [],
  },
];
export default route;
