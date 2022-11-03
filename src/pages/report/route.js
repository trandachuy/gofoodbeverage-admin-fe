import { ReportFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import OrderManagement from "pages/report/order/order.page";
import ReportTransaction from "pages/report/report-transaction/report-transaction.page";
import Revenue from "pages/report/revenue/revenue.page";
import ShiftDetail from "pages/report/shift/detail-shift";
import ShiftManagement from "pages/report/shift/shift-management";
import i18n from "utils/i18n";
import CustomerReport from "./customer/customer.page";
import OrderDetail from "./order/detail";
const { t } = i18n;

const route = {
  key: "app.report",
  position: 5,
  path: "#",
  icon: <ReportFill />,
  name: t("menu.report"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.report.revenue",
      position: 5,
      path: "/report/revenue",
      name: t("menu.reportManagement.revenue"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER,
      component: Revenue,
      child: [],
    },
    {
      key: "app.report.transaction",
      position: 5,
      path: "/report/transaction/:index?",
      name: t("menu.reportManagement.transaction"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER,
      component: ReportTransaction,
      child: [],
    },
    {
      key: "app.report.shift",
      position: 5,
      path: "/shift/management",
      name: "Shift",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_SHIFT,
      component: ShiftManagement,
      child: [],
    },
    {
      key: "app.report.shiftDetail",
      position: 5,
      path: "/shift/detail/:shiftId",
      name: "ShiftDetail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_SHIFT,
      component: ShiftDetail,
      child: [],
    },
    {
      key: "app.report.order",
      position: 5,
      path: "/report/order",
      name: "Order",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER,
      component: OrderManagement,
      child: [],
    },
    {
      key: "app.report.order",
      position: 5,
      path: "/report/order/detail/:id",
      name: "OrderDetail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_ORDER,
      component: OrderDetail,
      child: [],
    },
    {
      key: "app.report.customer",
      position: 5,
      path: "/report/customer",
      name: t("menu.reportManagement.customer"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_CUSTOMER_REPORT,
      component: CustomerReport,
      child: [],
    },
  ],
};

export default route;
