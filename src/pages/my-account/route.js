import MyAccountPage from "./my-account-page";
import TransferPayment from "./transfer-payment";


// Define the route
const route = [
  {
    key: "app.myAccount",
    position: 0,
    path: "/my-account",
    name: "MyAccount",
    isMenu: false,
    exact: false,
    auth: true,
    permission: "public",
    component: MyAccountPage,
    child: [],
  },
  {
    key: "app.transferPayment",
    position: 1,
    path: "/transfer-payment",
    name: "transfer payment",
    isMenu: false,
    exact: true,
    auth: false,
    permission: "public",
    component: TransferPayment,
    child: [],
  }
];
export default route;
