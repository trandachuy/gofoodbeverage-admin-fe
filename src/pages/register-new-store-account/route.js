import RegisterNewStoreAccount from ".";

// Define the route
const route = {
  key: "app.register-account",
  path: "/register-account",
  icon: "fa fa-plus-square",
  name: "RegisterNewStoreAccount",
  isMenu: false,
  exact: true,
  auth: false,
  component: RegisterNewStoreAccount,
  child: [],
};
export default route;
