import BillingPage from "./billing-page";
import TransferPayment from "./transfer-payment";

const route = [
  {
    key: "app.billing",
    position: 0,
    path: "/billing",
    name: "Billing",
    isMenu: false,
    exact: true,
    auth: false,
    //permission: "public",
    component: BillingPage,
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
  },
];
export default route;
