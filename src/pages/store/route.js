import { ShopBranchStoreFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { BranchManagement } from "pages/branch-management/branch-management.page";
import Settings from "pages/settings";
import StaffPage from "pages/staff-management";
import i18n from "utils/i18n";
import AreaTableManagement from "./area-table/area-table.page";
import { FeeAndTaxManagement } from "./fee-tax/fee-tax.page";
import CreateNewPromotion from "./promotion/create-new-promotion";
import DetailPromotionManagement from "./promotion/detail-promotion";
import EditPromotion from "./promotion/edit-promotion";
import PromotionManagement from "./promotion/list-promotion/list-promotion.page";
import SliderManagement from "./slider-management/index";
const { t } = i18n;

const route = {
  key: "app.store",
  position: 4,
  path: "#",
  icon: <ShopBranchStoreFill />,
  name: t("menu.store"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.store.area-table",
      position: 4,
      path: "/store/area-table",
      name: t("menu.storeManagement.areaTable"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_AREA_TABLE,
      component: AreaTableManagement,
      child: [],
    },
    {
      key: "app.store.promotion",
      position: 4,
      path: "/store/promotion",
      name: t("menu.storeManagement.promotion"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PROMOTION,
      component: PromotionManagement,
      child: [],
    },
    {
      key: "app.store.promotion",
      position: 4,
      path: "/store/promotion/create-new",
      name: "Create New Promotion",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_PROMOTION,
      component: CreateNewPromotion,
      child: [],
    },
    {
      key: "app.store.promotion",
      position: 4,
      path: "/store/promotion/edit/:id",
      name: "Edit Promotion",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_PROMOTION,
      component: EditPromotion,
      child: [],
    },
    {
      key: "app.store.promotion",
      position: 4,
      path: "/store/promotion/detail/:id",
      name: "Detail Promotion Management",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PROMOTION,
      component: DetailPromotionManagement,
      child: [],
    },

    /// Branch
    {
      key: "app.branch",
      position: 4,
      path: "/branch",
      name: t("menu.storeManagement.branch"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.ADMIN,
      component: BranchManagement,
      child: [],
    },
    /// Staff
    {
      key: "app.staff",
      position: 4,
      path: "/staff",
      name: t("menu.storeManagement.staff"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.ADMIN,
      component: StaffPage,
      child: [],
    },
    ///FEE
    {
      key: "app.store.fee-tax",
      position: 4,
      path: "/store/fee-tax",
      name: t("menu.storeManagement.feeAndTax"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: [PermissionKeys.VIEW_FEE, PermissionKeys.VIEW_TAX],
      component: FeeAndTaxManagement,
      child: [],
    },
    /// Configure Slider
    {
      key: "app.config.slider",
      position: 9,
      path: "/config-slider",
      name: t("menu.storeManagement.configSlider"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_FEE,
      component: SliderManagement,
      child: [],
    },
    /// Configure
    {
      key: "app.config",
      position: 4,
      path: "/config",
      name: t("menu.storeManagement.config"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.ADMIN,
      component: Settings,
      child: [],
    },
  ],
};
export default route;
