import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Image, message, Radio, Row, Tooltip } from "antd";
import adminBroadCast from "broadcast-channels/admin-broadcast-channel";
import { FnbSteps, Step } from "components/fnb-step/fnb-step";
import { claimTypesConstants } from "constants/claim-types.constants";
import {
  ArrowLeftCircleIcon,
  CardTickIcon,
  ChoosePackageStepIcon,
  CompletedIcon,
  CompletedStepIcon,
  ExclamationIcon,
  PaymentStepIcon,
  PaymentSuccessIcon,
} from "constants/icons.constants";
import { images } from "constants/images.constants";
import { Package } from "constants/package.constants";
import { orderPackagePaymentMethod, orderPackagePaymentMethods } from "constants/payment-method.constants";
import { currency } from "constants/string.constants";
import { BroadcastActions, VnPayResponseCodes } from "constants/vnpay-response-codes.constants";
import loginDataService from "data-services/login/login-data.service";
import packageDataService from "data-services/package/package-data.service";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setWorkspace } from "store/modules/session/session.actions";
import { formatCurrencyWithSymbol, formatTextNumber } from "utils/helpers";
import { BankTransferInfoComponent } from "./bank-transfer-info.component";

import "./billing-component.scss";

export default function BillingComponent(props) {
  const { userInfo } = props;
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [paymentDurations, setPaymentDurations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [valueCheckPackage, setValueCheckPackage] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState(Package.POS);
  const [selectedPackageDurationId, setSelectedPackageDurationId] = useState(0);
  const [allFunctionGroups, setAllFunctionGroups] = useState([]);
  const [bankTransferData, setBankTransferData] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [packageOrderCode, setPackageOrderCode] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [stepStatus, setStepStatus] = useState(false);

  /// The package data bought has been updated after the user create payment.
  const [packageBought, setPackageBought] = useState({});

  const pageData = {
    paymentDuration: t("package.paymentDuration"),
    comingSoon: t("package.comingSoon"),
    titleImportData: t("package.titleImportData"),
    selectPackage: t("package.selectPackage"),
    payment: t("package.paymentPackage"),
    complete: t("package.completePackage"),
    month: t("package.payment.month"),
    months: t("package.payment.months"),
    vat: "VAT",
    percent: "%",
    summary: t("package.payment.summary"),
    package: t("package.payment.package"),
    duration: t("package.payment.duration"),
    packagePrice: t("package.payment.packagePrice"),
    total: t("package.payment.total"),
    choosePaymentMethod: t("package.payment.choosePaymentMethod"),
    visa: t("package.payment.visa"),
    atm: t("package.payment.atm"),
    bankTransfer: t("package.payment.bankTransfer"),
    paymentMethod: t("package.payment.paymentMethod"),
    pleaseCheckPayment: t("package.text.pleaseCheckPayment"),
    accountOwner: t("package.text.accountOwner"),
    accountNumber: t("package.text.accountNumber"),
    bankName: t("package.text.bankName"),
    branch: t("package.text.branch"),
    content: t("package.text.content"),
    backToDashboard: t("package.backDashBoard"),
    signInSuccess: t("signIn.youHaveBeenLoggedInSuccessfully"),
    signInHasPermissions: t("signIn.youHaveNoPermissions"),
    buySuccess: t("package.text.buySuccess"),
    registerSuccess: t("package.text.registerSuccess"),
    processPayment: t("package.text.processPayment"),
    backToPackageDetail: t("package.text.backToPackageDetail"),
    orderCode: t("package.text.orderCode"),
    contactInfo: t("package.text.contactInfo"),
    vat: t("package.vat"),
  };

  const packagePricingStep = {
    selectPackage: 0,
    payment: 1,
    complete: 2,
    completeByBankTransfer: 3,
  };

  const packagePricingStatus = [
    {
      key: packagePricingStep.selectPackage,
      title: pageData.selectPackage,
      icon: <ChoosePackageStepIcon />,
    },
    {
      key: packagePricingStep.payment,
      title: pageData.payment,
      icon: <PaymentStepIcon />,
    },
    {
      key: packagePricingStep.complete,
      title: pageData.complete,
      icon: <CompletedStepIcon />,
    },
  ];

  useEffect(() => {
    getAllOrderPackages();
  }, []);

  adminBroadCast.onmessage = async (event) => {
    let { action, data } = event.data;
    switch (action) {
      case BroadcastActions:
        let flag = data.vnp_ResponseCode === VnPayResponseCodes.paymentWasSuccessful;
        if (flag) {
          let formData = {
            orderInfo: data.vnp_OrderInfo,
            txnRef: data.vnp_TxnRef,
            vnPayCreateDate: currentOrder.vnPayCreateDate,
            code: packageOrderCode,
          };

          // Call the server to check this order.
          const response = await packageDataService.updateVNPayAsync(formData);
          if (response) {
            if (response.isSuccess) {
              // show step 3 (Completed)
              setCurrentStep(currentStep + 1);
            } else {
              message.warn(t(response.message));
            }
          }
        }
        break;
      default:
        break;
    }
  };

  const getAllOrderPackages = () => {
    packageDataService.getPackagesPricingAsync().then((data) => {
      const { periodPackageDurations, packages, allFunctionGroups } = data;
      const packageData = packages.map((p, index) => {
        /// Set package default selected
        if (p.isActive === true) {
          return { ...p, isChoose: true };
        }

        return { ...p, isChoose: false };
      });

      setPackages(packageData);
      setPaymentDurations(periodPackageDurations);
      setAllFunctionGroups(allFunctionGroups);
    });
  };

  const onCheckBoxPackageChange = (e) => {
    setValueCheckPackage(e.target.value);
    setSelectedPackageDurationId(e.target.value);
  };

  const handleTransferPayment = async (method) => {
    setPaymentMethod(orderPackagePaymentMethod.vnPay);
    const createBankTransferModel = {
      packageId: selectedPackageId,
      packageDurationByMonth: paymentDurations[selectedPackageDurationId],
      PaymentMethod: method,
      RedirectUrl: `${process.env.REACT_APP_URL}transfer-payment`,
      Amount: calPackagePayment() + calPackagePercentPayment(),
    };
    const response = await packageDataService.createVNPayRequestAsync(createBankTransferModel);
    if (response) {
      setPackageOrderCode(response.code);
      var win = window.open(response.paymentUrl, "_blank");
      setCurrentOrder(response.orderInfo);
      win.focus();
    }
  };

  const calPackagePercentPayment = () => {
    let packageSelect = packages?.find(
      (item) => item?.id?.toString().toUpperCase() === selectedPackageId?.toString().toUpperCase()
    );
    if (packageSelect) {
      var packageCost = paymentDurations[selectedPackageDurationId] * packageSelect?.costPerMonth;
      return (packageCost * packageSelect.tax) / 100;
    }
    return 0;
  };

  const calPackagePayment = () => {
    return (
      paymentDurations[selectedPackageDurationId] *
      packages?.find((item) => item?.id?.toString().toUpperCase() === selectedPackageId?.toString().toUpperCase())
        ?.costPerMonth
    );
  };

  const createBankTransferPayment = () => {
    setPaymentMethod(orderPackagePaymentMethod.transfer);
    const createBankTransferModel = {
      packageId: selectedPackageId,
      packageDurationByMonth: paymentDurations[selectedPackageDurationId],
    };

    packageDataService.createBankTransferPaymentAsync(createBankTransferModel).then((response) => {
      if (response) {
        const { packageBankTransfer } = response;
        const {
          packageCode,
          packageName,
          duration,
          totalAmount,
          packagePaymentMethodId,
          accountTransfer,
          paymentMethod,
        } = packageBankTransfer;
        const { accountNumber, accountOwner, bankName, branch, content } = accountTransfer;
        const bankTransferResponseData = {
          packageCode: packageCode,
          packageName: packageName,
          duration: duration,
          paymentMethod: paymentMethod,
          totalAmount: totalAmount,
          packagePaymentMethodId: packagePaymentMethodId,
        };
        const bankTransferInfo = {
          bankName: bankName,
          bankBranchName: branch,
          accountHolderName: accountOwner,
          accountNumber: accountNumber,
          content: content,
        };

        setBankTransferData(bankTransferInfo);
        setPackageBought(bankTransferResponseData);
        setCurrentStep(packagePricingStep.completeByBankTransfer);
        setStepStatus(true);
      }
    });
  };

  const getUserInfo = (token) => {
    let claims = jwt_decode(token);
    let user = {
      userId: claims[claimTypesConstants.id],
      accountId: claims[claimTypesConstants.accountId],
      fullName: claims[claimTypesConstants.fullName],
      emailAddress: claims[claimTypesConstants.email],
      accountType: claims[claimTypesConstants.accountType],
      currencyCode: claims[claimTypesConstants.currencyCode],
      storeId: claims[claimTypesConstants.storeId],
    };

    return user;
  };

  const gotoDashBoard = () => {
    loginDataService.refreshTokenAndPermissionsAsync().then((res) => {
      const { token, permissions } = res;
      const userInfo = getUserInfo(token);
      let auth = { token: token, user: userInfo };
      if (permissions.length > 0) {
        const workspaceData = {
          auth: auth,
          token: token,
          permissions: permissions,
        };
        dispatch(setWorkspace(workspaceData));
        message.success(pageData.signInSuccess);
        history.push("/home");
      } else {
        message.error(pageData.signInHasPermissions);
      }
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onProcessPayment = () => {
    switch (paymentMethod) {
      case orderPackagePaymentMethod.vnPay:
        handleTransferPayment(orderPackagePaymentMethod.vnPay);
        break;
      case orderPackagePaymentMethod.atm:
        handleTransferPayment(orderPackagePaymentMethod.atm);
        break;
      case orderPackagePaymentMethod.transfer:
        createBankTransferPayment();
        break;
      default:
    }
  };

  const renderPackagePayment = () => {
    const renderPaymentMethods = orderPackagePaymentMethods.map((method) => {
      const { name, icon, disable } = method;
      const singleIcon = method.icon && method.icon?.length > 0;
      const renderMethod = (
        <Row
          className={`payment-method-wrapper${singleIcon === true ? " multiple" : ""}${
            disable === true ? " disabled" : ""
          }`}
        >
          <Col span={24}>
            <div>
              <Radio value={method.code} disabled={disable}>
                {singleIcon === true ? (
                  <div className="payment-method-icons">
                    <div className="name">{t(name)}</div>
                    <div className="icons">
                      {method.icon?.map((icon, index) => {
                        return <div key={index}>{icon}</div>;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="payment-method">
                    <div className="icon">{icon}</div>
                    <div className="name">{t(name)}</div>
                  </div>
                )}
              </Radio>
            </div>
          </Col>
        </Row>
      );

      return renderMethod;
    });

    return (
      <div className="payment-step">
        <div className="payment-method-options">
          <div>
            <p className="payment-method-area-label">{pageData.choosePaymentMethod}</p>
          </div>
          <Radio.Group
            className="payment-group"
            onChange={(e) => {
              const selectedValue = e.target.value;
              setPaymentMethod(selectedValue);
            }}
            value={paymentMethod}
          >
            {renderPaymentMethods}
          </Radio.Group>

          <div className="back-link">
            <ArrowLeftCircleIcon onClick={prevStep} />
            <span onClick={prevStep}>{pageData.backToPackageDetail}</span>
          </div>
        </div>
        <div className="summary">
          <div className="header">
            <h2 className="title">{pageData.summary}</h2>
            <div className="package-name">
              <div className="tab">
                <div>
                  <p>{pageData.package}</p>
                </div>
                <div>
                  <p>
                    {
                      packages?.find(
                        (item) => item?.id?.toString().toUpperCase() === selectedPackageId?.toString().toUpperCase()
                      )?.name
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="label">
              <p>{pageData.duration}</p>
              <p className="material-view-text">{pageData.packagePrice}</p>
              <p>
                {pageData.vat +
                  "(" +
                  packages?.find(
                    (item) => item?.id?.toString().toUpperCase() === selectedPackageId?.toString().toUpperCase()
                  )?.tax +
                  pageData.percent +
                  ")"}
              </p>
              <h3 className="total">{pageData.total}</h3>
            </div>
            <div className="info">
              <p>
                {paymentDurations[selectedPackageDurationId]} {pageData.months}
              </p>
              <p className="material-view-text">{formatTextNumber(calPackagePayment()) + " " + currency.vnd}</p>
              <p className="material-view-text">{formatTextNumber(calPackagePercentPayment()) + " " + currency.vnd}</p>
              <h3 className="total">
                {formatTextNumber(calPackagePayment() + calPackagePercentPayment()) + " " + currency.vnd}
              </h3>
            </div>
          </div>
          <div className="footer">
            <Button
              icon={<CardTickIcon />}
              className="process-payment-btn"
              onClick={onProcessPayment}
              disabled={paymentMethod === ""}
            >
              {pageData.processPayment}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPackageDetail = () => {
    return (
      <div className="package-detail">
        <Row>
          <Col span={4}>
            <div className="duration-time">
              <h3 className="label label-color">
                <strong>{pageData.paymentDuration}</strong>
              </h3>
              <div className="duration-wrapper">
                {paymentDurations?.map((payMentDuration, index) => {
                  const timeOptionLabel = `${payMentDuration} ${pageData.months}`;
                  return (
                    <div className="duration-option">
                      <Radio.Group onChange={(e) => onCheckBoxPackageChange(e)} value={valueCheckPackage}>
                        <Radio value={index}>
                          <p className="time-option-label">{timeOptionLabel}</p>
                        </Radio>
                      </Radio.Group>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col span={20} className="package">
            <div className="package-option-wrapper">
              <div className="package-option-container">
                {packages?.map((p, index) => {
                  const { id, name, costPerMonth, tax, isActive, functionGroups, isChoose } = p;

                  const currency = "VNĐ";
                  const price = `${costPerMonth}`;
                  const first = price.slice(0, price.length - 3);
                  const last = price.slice(price.length - 3);
                  const end = `,${last} ${currency}/${pageData.month}`;
                  const packageSelectedStyle = isChoose === true ? "package-selected" : "";
                  return (
                    <div className={`package-option-card ${packageSelectedStyle}`}>
                      <div className="package-option">
                        <p className="platform-name label-color">
                          <strong>{name}</strong>
                        </p>
                        {isActive === true ? (
                          paymentDurations?.map((_, indexDuration) => {
                            const pricingSelectedStyle = indexDuration === valueCheckPackage ? "pricing-selected" : "";
                            return (
                              <div
                                className={`pricing-detail ${pricingSelectedStyle}`}
                                onClick={() => {
                                  if (indexDuration === valueCheckPackage) {
                                    setSelectedPackageId(id);
                                    nextStep();
                                  }
                                }}
                              >
                                <p>
                                  <span className="price">{first}</span>
                                  <span className="end-price">{end}</span>
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <Image className="coming-soon" preview={false} src={images.comingSoon} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
        <Row className="float-right row-vat">
          <Col span={24}>
            <span className="label-vat">{pageData.vat}</span>
          </Col>
        </Row>
        <div className="package-permission-wrapper">
          {allFunctionGroups?.map((functionGroup) => {
            const { id, name, functions } = functionGroup;
            return (
              <div>
                <div className="package-function">
                  <p>{name}</p>
                </div>
                <div className="package-permission">
                  {functions?.map((f) => {
                    const { id, name } = f;
                    const isCheckedPOS = packages
                      .find((p) => p.id === Package.POS?.toLowerCase())
                      ?.functions?.find((item) => item?.id === id);
                    const isCheckedWEB = packages
                      .find((p) => p.id === Package.WEB?.toLowerCase())
                      ?.functions?.find((item) => item?.id === id);
                    return (
                      <Row className="row-permission row-permission-border">
                        <Col span={7} className="permission-name">
                          {name}
                          {id === 2 && (
                            <Tooltip placement="topLeft" title={pageData.titleImportData}>
                              <span className="ml-18 mt-22">
                                <ExclamationIcon />
                              </span>
                            </Tooltip>
                          )}
                        </Col>
                        <Col span={5} className="permission-status">
                          <Row className="justify-content-center">
                            {isCheckedPOS ? <CheckOutlined style={{ color: "#32CD32" }} /> : <></>}
                          </Row>
                        </Col>
                        <Col span={7} className="permission-status">
                          <Row className="justify-content-center">
                            {isCheckedWEB ? <CheckOutlined style={{ color: "#32CD32" }} /> : <></>}
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCompleteStep = () => {
    return (
      <div className="complete-step">
        <div className="image">
          <CompletedIcon />
        </div>
        <div className="message">
          <p
            dangerouslySetInnerHTML={{
              __html: <p>{t(pageData.buySuccess, { packageName: packageBought?.packageName })}</p>,
            }}
          ></p>
        </div>

        <div className="footer">
          <Button
            onClick={() => {
              history.push("/");
            }}
            className="back-btn"
          >
            {pageData.backToDashboard}
          </Button>
        </div>
      </div>
    );
  };

  const renderCompleteBankTransferStep = () => {
    return (
      <div className="bank-transfer-complete-step">
        <div className="image">
          <PaymentSuccessIcon />
        </div>
        <div className="message">
          <p>{t(pageData.registerSuccess, { packageName: packageBought?.packageName })}</p>
        </div>
        <div className="order-package-info">
          <div className="order-package-info-card">
            <ul className="border-right">
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.orderCode}:</p>
                </div>
                <div>
                  <p className="value">{packageBought?.packageCode}</p>
                </div>
              </li>
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.package}:</p>
                </div>
                <div>
                  <p className="value">{packageBought?.packageName}</p>
                </div>
              </li>
            </ul>
            <ul>
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.duration}:</p>
                </div>
                <div>
                  <p className="value">
                    {packageBought?.duration} {pageData.months}
                  </p>
                </div>
              </li>
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.paymentMethod}:</p>
                </div>
                <div>
                  <p className="value">{packageBought?.paymentMethod}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="body">
          <div>
            <p className="total-price">
              <span>{pageData.total}: </span>
              <span className="price">{formatCurrencyWithSymbol(packageBought?.totalAmount)}</span>
            </p>
          </div>
          <div className="message detail">
            <p>{pageData.pleaseCheckPayment}:</p>
          </div>

          <div className="bank-info">
            <BankTransferInfoComponent data={bankTransferData} />
          </div>
          <div
            className="contact"
            dangerouslySetInnerHTML={{
              __html: pageData.contactInfo,
            }}
          ></div>
        </div>

        <div className="footer">
          <Button
            onClick={() => {
              history.push("/");
            }}
            className="back-btn"
          >
            {pageData.backToDashboard}
          </Button>
        </div>
      </div>
    );
  };

  const renderBody = () => {
    switch (currentStep) {
      case packagePricingStep.selectPackage:
      default:
        return renderPackageDetail();
      case packagePricingStep.payment:
        return renderPackagePayment();
      case packagePricingStep.complete:
        return renderCompleteStep();
      case packagePricingStep.completeByBankTransfer:
        return renderCompleteBankTransferStep();
      // switch (paymentMethod) {
      //   case "TRANSFER":
      //     return bankTransfer();
      //   case "VNPAY":
      //     return bankTransferByVNPay();
      //   default:
      //     return bankTransfer();
      // }
    }
  };

  /// Main render
  return (
    <>
      <Row className="buy-package-steps">
        <Col span={24}>
          <FnbSteps current={currentStep}>
            {packagePricingStatus.map((item) => (
              <Step isProcessing={stepStatus} key={item.title} title={item.title} icon={item.icon} />
            ))}
          </FnbSteps>
        </Col>
      </Row>
      <Row className="package-info">
        <Col span={24}>{renderBody()}</Col>
      </Row>
    </>
  );
}
