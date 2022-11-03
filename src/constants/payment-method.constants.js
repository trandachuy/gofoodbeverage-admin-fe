import {
  AmericanExpressCardIcon,
  AtmCardIcon,
  BankTransferIcon,
  DiscoverCardIcon,
  JcbCardIcon,
  MasterCardIcon,
  VisaCardIcon,
} from "./icons.constants";

export const paymentMethod = {
  MoMo: 0,
  ZaloPay: 1,
  CreditDebitCard: 2,
  Cash: 3,
  VNPay: 4,
};

export const orderPackagePaymentMethod = {
  vnPay: "VNPAY",
  atm: "ATM",
  transfer: "TRANSFER",
};

export const enumPackagePaymentMethod = {
  visa: 0,
  atm: 1,
  bankTransfer: 2,
};

export const orderPackagePaymentMethods = [
  {
    code: orderPackagePaymentMethod.vnPay,
    icon: [<MasterCardIcon />, <JcbCardIcon />, <VisaCardIcon />, <AmericanExpressCardIcon />, <DiscoverCardIcon />],
    name: "package.payment.creditCard",
    disable: true,
  },
  {
    code: orderPackagePaymentMethod.atm,
    icon: <AtmCardIcon />,
    name: "package.payment.atm",
    disable: true,
  },
  {
    code: orderPackagePaymentMethod.transfer,
    icon: <BankTransferIcon />,
    name: "package.payment.bankTransfer",
    disable: false,
  },
];
