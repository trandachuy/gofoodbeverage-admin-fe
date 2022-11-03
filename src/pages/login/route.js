import LoginPage from "./login.page";

// Define the route
const route = {
  key: "app.login",
  position: 0,
  path: "/login",
  icon: "fa fa-plus-square",
  name: "Login",
  isMenu: false,
  exact: true,
  auth: false,
  component: LoginPage,
  child: [],
};
export default route;
