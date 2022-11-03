import { BranchPurchasePage } from "./branch-purchase/branch-purchase.page";
import EditBranchPage from "./edit-branch";
import CreateNewBranch from "./new-branch-management";

const route = [
  {
    key: "app.staff.create-new",
    position: 1,
    focus: "app.branch",
    path: "/branch/create-new",
    isMenu: false,
    exact: false,
    auth: true,
    component: CreateNewBranch,
    child: [],
  },
  {
    key: "app.staff.edit",
    position: 1,
    focus: "app.branch",
    path: "/branch/edit/:branchId",
    isMenu: false,
    exact: false,
    auth: true,
    component: EditBranchPage,
    child: [],
  },
  {
    key: "app.branch.branchPurchase",
    position: 1,
    focus: "app.branch",
    path: "/branch/branch-purchase",
    isMenu: false,
    exact: false,
    auth: true,
    component: BranchPurchasePage,
    child: [],
  },
];

export default route;
