import Home from ".";
import { HomeFill } from "constants/icons.constants";
import i18n from "utils/i18n";
const { t } = i18n;

// Define the route
const route = [
  {
    key: "app.home",
    position: 0,
    path: "/",
    icon: <HomeFill />,
    name: t("menu.home"),
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: Home,
    child: [],
  },
  {
    key: "app.home.hide",
    focus: "app.home",
    position: 0,
    path: "/home",
    icon: <HomeFill />,
    name: "Home",
    isMenu: false,
    exact: true,
    auth: true,
    permission: "public",
    component: Home,
    child: [],
  },
];
export default route;
