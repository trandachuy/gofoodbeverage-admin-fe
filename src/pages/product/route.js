import { Product } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import CompoPage from "pages/combo/combo.page";
import CreateCompoPage from "pages/combo/create-combo/create-combo.page";
import DetailComboPage from "pages/combo/detail-combo/detail-combo.page";
import EditComboPage from "pages/combo/edit-combo";
import ProductCategoryManagement from "pages/product/category";
import EditProductCategoryPage from "pages/product/category/edit-category/edit-category.page";
import ProductDetailPage from "pages/product/details";
import ProductEdit from "pages/product/edit-product/edit-product.page";
import ImportProductPage from "pages/product/import-product/import-product.page";
import OptionManagement from "pages/product/option/option.page";
import ProductManagementPage from "pages/product/product-management/product-management.page";
import { sortChildRoute } from "utils/helpers";
import i18n from "utils/i18n";
import CreateProductPage from "./product-management/create-product.page";

const { t } = i18n;

const route = {
  key: "app.product",
  position: 1,
  path: "#",
  icon: <Product />,
  name: t("menu.product"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.product.management",
      position: 1,
      path: "/product-management",
      name: t("menu.productManagement.management"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PRODUCT,
      component: ProductManagementPage,
      child: [],
    },
    {
      key: "app.product.create",
      position: 1,
      path: "/product/create-new",
      name: "edit",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_PRODUCT,
      component: CreateProductPage,
      child: [],
    },
    {
      key: "app.product.edit",
      position: 1,
      path: "/product/edit/:id",
      name: "edit",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_PRODUCT,
      component: ProductEdit,
      child: [],
    },
    {
      key: "app.product.option",
      position: 1,
      path: "/product/options",
      name: t("menu.productManagement.options"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_OPTION,
      component: OptionManagement,
      child: [],
    },
    {
      key: "app.product.category",
      position: 1,
      path: "/product/product-category",
      name: t("menu.productManagement.category"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PRODUCT_CATEGORY,
      component: ProductCategoryManagement,
      child: [],
    },
    {
      key: "app.product.details",
      position: 1,
      path: "/product/details/:id",
      name: "Details",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PRODUCT,
      component: ProductDetailPage,
      child: [],
    },
    {
      key: "app.product.category.edit",
      position: 1,
      path: "/product/product-category/edit/:productCategoryId",
      name: "Category",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PRODUCT_CATEGORY,
      component: EditProductCategoryPage,
      child: [],
    },

    {
      key: "app.product.combo",
      position: 1,
      path: "/combo",
      name: t("menu.productManagement.combo"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_COMBO,
      component: CompoPage,
      child: [],
    },
    {
      key: "app.product.combo.create",
      focus: "app.product.combo",
      position: 1,
      path: "/combo/create-new",
      name: "Combo",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_COMBO,
      component: CreateCompoPage,
      child: [],
    },
    {
      key: "app.product.combo.edit",
      position: 1,
      path: "/combo/edit/:comboId",
      name: "edit",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_COMBO,
      component: EditComboPage,
      child: [],
    },
    {
      key: "app.product.combo.detail",
      position: 1,
      path: "/combo/detail/:comboId",
      name: "detail",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_COMBO,
      component: DetailComboPage,
      child: [],
    },
    {
      key: "app.importProduct",
      focus: "app.product.management",
      position: 2,
      path: "/product/import",
      icon: <ImportProductPage />,
      name: t("menu.importProduct"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.IMPORT_PRODUCT,
      component: ImportProductPage,
      child: [],
    },
  ],
};

sortChildRoute(route.child, PermissionKeys.CREATE_COMBO, PermissionKeys.EDIT_COMBO);

export default route;
