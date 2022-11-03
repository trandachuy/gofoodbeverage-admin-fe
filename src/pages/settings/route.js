import MyAccountPage from "../my-account/my-account-page";
import { SettingFill } from "constants/icons.constants";
import i18n from "utils/i18n";
const { t } = i18n;

const route = {
  key: "app.settings",
  position: 100,
  path: "/settings",
  icon: <SettingFill />,
  name: t("menu.settings"),
  isMenu: false,
  exact: true,
  auth: true,
  component: MyAccountPage,
  child: [],
};
export default route;
