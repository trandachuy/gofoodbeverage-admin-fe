import { OnlineStoreIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import OnlineStoreManagement from "pages/online-store/online-store-management";
import i18n from "utils/i18n";
const { t } = i18n;

const route = {
  key: "app.onlineStore",
  position: 6,
  icon: <OnlineStoreIcon />,
  name: t("onlineStore.title"),
  isMenu: true,
  exact: true,
  auth: true,
  path: "/online-store/management",
  permission: PermissionKeys.VIEW_THEME_STORE,
  component: OnlineStoreManagement,
  child: [],
};
export default route;
