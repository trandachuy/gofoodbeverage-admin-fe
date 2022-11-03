import { Button, Col, InputNumber, Radio, Row, Table, Tooltip } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbSteps, Step } from "components/fnb-step/fnb-step";
import {
  CalendarNewIcon,
  CardTickIcon,
  ChoosePackageStepIcon,
  CompletedIcon,
  CompletedStepIcon,
  InfoOutLineIcon,
  PaymentStepIcon,
  PaymentSuccessIcon,
} from "constants/icons.constants";
import {
  enumPackagePaymentMethod,
  orderPackagePaymentMethod,
  orderPackagePaymentMethods,
} from "constants/payment-method.constants";
import { DateFormat } from "constants/string.constants";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { formatCurrency, formatCurrencyWithSymbol, roundNumber } from "utils/helpers";
import { BankTransferInfoComponent } from "../../billing/components/bank-transfer-info.component";
import "./branch-purchase-package.scss";

export function BranchPurchasePackage(props) {
  const { userInfo } = props;
  const [t] = useTranslation();
  const history = useHistory();

  const packagePricingStep = {
    selectPackage: 0,
    payment: 1,
    complete: 2,
    completeByBankTransfer: 3,
  };

  const [bankTransferData, setBankTransferData] = useState(null);
  const [currentStep, setCurrentStep] = useState(packagePricingStep.payment);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [stepStatus, setStepStatus] = useState(false);

  /// The package data bought has been updated after the user create payment.
  const [packageBought, setPackageBought] = useState(null); /// The current package info
  const [lastPackageBought, setLastPackageBought] = useState(null); /// The current package info
  const [packagePaymentResult, setPackagePaymentResult] = useState(null);
  const [dateTimeRange, setDateTimeRange] = useState(100);
  const [expiryDateSelected, setExpiryDateSelected] = useState();

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
    remainingAmount: t("store.branchPurchase.remainingAmount"),
    packageName: t("store.branchPurchase.packageName"),
    quantity: t("store.branchPurchase.quantity"),
    unitPrice: t("store.branchPurchase.unitPrice"),
    expiryDate: t("store.branchPurchase.expiryDate"),
    totalPrice: t("store.branchPurchase.totalPrice"),
    unitPriceTooltip: t("store.branchPurchase.unitPriceTooltip"),
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
    getCurrentPackageInfo();
  }, []);

  function getCurrentPackageInfo() {
    storeDataService.getCurrentOrderPackageInfoAsync().then((res) => {
      const { orderPackageInfo, lastOrderPackage } = res;
      const expiryDate = moment.utc(orderPackageInfo?.expiredDate).local(); /// Convert utc time to local time
      const activatedDate = moment.utc(orderPackageInfo?.activatedDate).local(); /// Convert utc time to local time
      const packageInfo = {
        ...orderPackageInfo,
        quantity: orderPackageInfo?.availableBranchNumber,
        activatedDate: activatedDate,
        packageName: t(orderPackageInfo?.packageName),
        quantity: lastOrderPackage?.branchQuantity ?? 1,
        unitPrice: orderPackageInfo?.costPerMonth,
        expiredDate: expiryDate,
        newExpiredDate: expiryDate,
      };

      /// Set default expiry date
      const expiryDateSelected = {
        id: 0,
        name: expiryDate.year(),
        expiryDate: expiryDate,
        expiryDateLabel: expiryDate.format(DateFormat.DD_MM_YYYY),
      };
      setExpiryDateSelected(expiryDateSelected);

      const { remainAmount, totalPrice, taxAmount } = calculateBranchPackagePrice(
        packageInfo,
        lastOrderPackage,
        expiryDateSelected
      );

      /// Set package info and package table detail
      setLastPackageBought({ ...lastOrderPackage });
      setPackageBought({
        ...packageInfo,
        remainAmount: remainAmount,
        totalPrice: totalPrice,
        taxAmount: taxAmount,
      });
    });
  }

  const calculateTaxAmount = (amount, tax) => {
    if (amount && tax) {
      const taxAmount = (amount * tax) / 100;
      return roundNumber(taxAmount);
    }

    return amount;
  };

  const createBankTransferPayment = () => {
    setPaymentMethod(orderPackagePaymentMethod.transfer);
    const { orderPackageId, unitPrice, totalPrice, taxAmount, remainAmount, packageName, newExpiredDate, quantity } =
      packageBought;
    const createBankTransferModel = {
      paymentMethod: enumPackagePaymentMethod.bankTransfer,
      activateStorePackageId: orderPackageId,
      packageName: packageName,
      quantity: quantity,
      unitPrice: unitPrice,
      branchExpiredDate: newExpiredDate,
      branchPurchaseTotalPrice: totalPrice,
      remainAmount: remainAmount,
      taxAmount: taxAmount,
    };

    storeDataService.createBranchPurchaseOrderPackageAsync(createBankTransferModel).then((response) => {
      if (response) {
        const { accountBankTransfer, packageInfo } = response;
        const { packageCode, packageName, duration, totalAmount, packagePaymentMethod, paymentMethodName } =
          packageInfo;
        const { accountNumber, accountOwner, bankName, branch, content } = accountBankTransfer;
        const bankTransferResponseData = {
          packageCode: packageCode,
          packageName: packageName,
          duration: duration,
          totalAmount: totalAmount,
          packagePaymentMethodId: packagePaymentMethod,
          paymentMethodName: paymentMethodName,
        };
        const bankTransferInfo = {
          bankName: bankName,
          bankBranchName: branch,
          accountHolderName: accountOwner,
          accountNumber: accountNumber,
          content: content,
        };

        setPackagePaymentResult(bankTransferResponseData);
        setBankTransferData(bankTransferInfo);
        setCurrentStep(packagePricingStep.completeByBankTransfer);
        setStepStatus(true);
      }
    });
  };

  const onProcessPayment = () => {
    switch (paymentMethod) {
      case orderPackagePaymentMethod.vnPay:
        break;
      case orderPackagePaymentMethod.atm:
        break;
      case orderPackagePaymentMethod.transfer:
        createBankTransferPayment();
        break;
      default:
    }
  };

  const getYearOptions = () => {
    let yearOptions = [];
    if (packageBought?.expiredDate) {
      for (var i = 0; i <= dateTimeRange; i++) {
        const expiryDate = moment(packageBought?.expiredDate); /// Convert utc time to local time
        const newExpiryDate = expiryDate.add(i, "Y"); /// Next year
        const newExpiryDateLabel = newExpiryDate.format(DateFormat.DD_MM_YYYY); /// Display date format DD/MM/YYYY
        const yearOption = {
          id: i,
          name: newExpiryDate.year(),
          expiryDate: newExpiryDate,
          expiryDateLabel: newExpiryDateLabel,
        };

        yearOptions.push(yearOption);
      }
    }

    return yearOptions;
  };

  const onChangeExpiryDate = (e) => {
    const yearOptions = getYearOptions();
    const expiryDateSelected = yearOptions?.find((item) => item.id === e);
    setExpiryDateSelected(expiryDateSelected);

    if (packageBought) {
      const { remainAmount, totalPrice, taxAmount } = calculateBranchPackagePrice(
        packageBought,
        lastPackageBought,
        expiryDateSelected
      );
      setPackageBought({
        ...packageBought,
        newExpiredDate: expiryDateSelected?.expiryDate,
        remainAmount: remainAmount,
        totalPrice: totalPrice,
        taxAmount: taxAmount,
      });
    }
  };

  const onChangeBranchQuantity = (quantity) => {
    const newPackageInfo = {
      ...packageBought,
      quantity: quantity,
    };

    const { remainAmount, totalPrice, taxAmount } = calculateBranchPackagePrice(
      newPackageInfo,
      lastPackageBought,
      expiryDateSelected
    );
    setPackageBought({
      ...newPackageInfo,
      remainAmount: remainAmount,
      totalPrice: totalPrice,
      taxAmount: taxAmount,
    });
  };

  const calculateBranchPackagePrice = (packageBought, lastPackageBought, expiryDateSelected) => {
    const today = moment();

    if (packageBought && lastPackageBought) {
      let remainAmount = lastPackageBought?.remainAmount;
      remainAmount = roundNumber(remainAmount);

      /// Calculate total price of package from today to expiry date selected
      const { costPerMonth, quantity } = packageBought;
      const numberMonths = expiryDateSelected.expiryDate.diff(today, "months") + 1;
      const totalPrice = costPerMonth * numberMonths * quantity;
      const taxAmount = calculateTaxAmount(totalPrice, packageBought.tax);

      return {
        remainAmount: remainAmount,
        totalPrice,
        taxAmount,
      };
    }

    return {
      remainAmount: 0,
      totalPrice: 0,
      taxAmount: 0,
    };
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

    const columns = [
      {
        title: pageData.packageName,
        dataIndex: "packageName",
        width: "27%",
        render: (value) => {
          return <>{t(value)}</>;
        },
      },
      {
        title: pageData.quantity,
        dataIndex: "quantity",
        width: "20%",
        render: () => {
          return (
            <InputNumber
              className="fnb-input-number w-100"
              value={packageBought?.quantity}
              onChange={onChangeBranchQuantity}
              min={lastPackageBought?.branchQuantity ?? 1}
            />
          );
        },
      },
      {
        title: () => {
          return (
            <div className="unit-price-column-title">
              <span>{pageData.unitPrice}</span>
              <Tooltip placement="top" title={pageData.unitPriceTooltip} color="#50429B">
                <InfoOutLineIcon className="pointer" />
              </Tooltip>
            </div>
          );
        },
        dataIndex: "unitPrice",
        width: "15%",
        align: "center",
        render: (value) => {
          return <>{formatCurrency(value)}</>;
        },
      },
      {
        title: pageData.expiryDate,
        dataIndex: "expiredDate",
        width: "20%",
        align: "left",
        render: (value) => {
          const yearOptions = getYearOptions();
          return (
            <div className="date-year-picker-wrapper">
              <CalendarNewIcon className="calendar-icon" />
              <FnbSelectSingle
                className="date-year-picker"
                value={expiryDateSelected?.expiryDateLabel}
                option={yearOptions?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                onChange={onChangeExpiryDate}
              />
            </div>
          );
        },
      },
      {
        title: pageData.totalPrice,
        dataIndex: "totalPrice",
        align: "right",
        render: (value) => {
          return <>{formatCurrency(value)}</>;
        },
      },
    ];

    return (
      <>
        <div className="mt-3">
          <Table className="branch-package-table" columns={columns} dataSource={[packageBought]} pagination={false} />
        </div>
        <div className="payment-step mt-5">
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
                    <p>{packageBought?.packageName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="label">
                <p className="material-view-text">{pageData.remainingAmount}</p>
                <p>{pageData.vat + "(" + packageBought?.tax + pageData.percent + ")"}</p>
                <h3 className="total">{pageData.total}</h3>
              </div>
              <div className="info">
                <p className="material-view-text">{formatCurrency(packageBought?.remainAmount)}</p>
                <p className="material-view-text">{formatCurrency(packageBought?.taxAmount)}</p>
                <h3 className="total">
                  {formatCurrency(packageBought?.totalPrice - packageBought?.remainAmount + packageBought?.taxAmount)}
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
      </>
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
          <p>{t(pageData.registerSuccess, { packageName: packagePaymentResult?.packageName })}</p>
        </div>
        <div className="order-package-info">
          <div className="order-package-info-card">
            <ul className="border-right">
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.orderCode}:</p>
                </div>
                <div>
                  <p className="value">{packagePaymentResult?.packageCode}</p>
                </div>
              </li>
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.package}:</p>
                </div>
                <div>
                  <p className="value">{packagePaymentResult?.packageName}</p>
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
                    {packagePaymentResult?.duration} {pageData.months}
                  </p>
                </div>
              </li>
              <li className="order-package-detail">
                <div className="w-60">
                  <p className="label">{pageData.paymentMethod}:</p>
                </div>
                <div>
                  <p className="value">{packagePaymentResult?.paymentMethodName}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="body">
          <div>
            <p className="total-price">
              <span>{pageData.total}: </span>
              <span className="price">{formatCurrencyWithSymbol(packagePaymentResult?.totalAmount)}</span>
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
      case packagePricingStep.payment:
        return renderPackagePayment();
      case packagePricingStep.complete:
        return renderCompleteStep();
      case packagePricingStep.completeByBankTransfer:
        return renderCompleteBankTransferStep();
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
