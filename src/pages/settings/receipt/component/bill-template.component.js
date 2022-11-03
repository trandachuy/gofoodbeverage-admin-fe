import { DefaultQRCode, StoreLogoDefault } from "constants/icons.constants";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { formatCurrencyWithSymbol } from "utils/helpers";
import "./bill-template.component.scss";
const { forwardRef, useImperativeHandle } = React;

const billFrameSizeKey = {
  small: 0,
  medium: 1,
};
export const BillTemplate = forwardRef((props, ref) => {
  const { t, className, orderData, qrImage } = props;
  const [templateSetting, setTemplateSetting] = useState(null);
  const componentRef = useRef();
  const pageData = {
    paymentInvoice: t("invoice.paymentInvoice"),
    orderCode: t("invoice.orderCode"),
    orderTime: t("invoice.orderTime"),
    cashierName: t("invoice.cashierName"),
    customerName: t("invoice.customerName"),
    no: t("invoice.no"),
    product: t("invoice.product"),
    quantity: t("invoice.quantity"),
    price: t("invoice.price"),
    total: t("invoice.total"),
    tempTotal: t("invoice.tempTotal"),
    discount: t("invoice.discount"),
    feeAndTax: t("invoice.feeAndTax"),
    receivedAmount: t("invoice.receivedAmount"),
    change: t("invoice.change"),
    paymentMethod: t("invoice.paymentMethod"),
    wifi: t("invoice.wifi"),
    password: t("invoice.password"),
    cash: t("invoice.cash"),
  };

  useImperativeHandle(ref, () => ({
    renderTemplate(billConfiguration) {
      renderTemplate(billConfiguration);
    },
    printTemplate() {
      printTemplate();
    },
  }));

  const printTemplate = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });

  const renderTemplate = (billConfiguration) => {
    if (billConfiguration) {
      setTemplateSetting(billConfiguration);
    }
  };

  const renderMediumTemplate = (templateSetting) => {
    return (
      <div ref={componentRef} className="medium-template" bordered={true}>
        <div className="template-header">
          <table>
            <tr>
              {templateSetting?.isShowLogo && (
                <td rowSpan={2}>
                  {/* Logo will be replaced by img tag in future */}
                  <div>
                    {templateSetting.logo ? (
                      <img src={templateSetting.logo} />
                    ) : (
                      <StoreLogoDefault width={66} height={66} />
                    )}
                  </div>
                </td>
              )}
              <th className="store-name">{orderData?.storeName}</th>
            </tr>
            {templateSetting?.isShowAddress && (
              <tr>
                <td className="branch-address">{orderData?.branchAddress}</td>
              </tr>
            )}
          </table>
        </div>
        <hr className="bill-line" />
        <div className="template-invoice">
          <table>
            <tr>
              <th className="invoice-title" colSpan={2}>
                {pageData.paymentInvoice}
              </th>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  width: "50%",
                }}
              >
                {pageData.orderCode}
              </td>
              <td
                className="order-code"
                style={{
                  textAlign: "right",
                  width: "50%",
                }}
              >
                {orderData?.orderCode}
              </td>
            </tr>
            {templateSetting?.isShowOrderTime && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    width: "50%",
                  }}
                >
                  {pageData.orderTime}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  {orderData?.orderTime}
                </td>
              </tr>
            )}
            {templateSetting?.isShowCashierName && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    width: "50%",
                  }}
                >
                  {pageData.cashierName}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  {orderData?.cashierName}
                </td>
              </tr>
            )}
            {templateSetting?.isShowCustomerName && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    width: "50%",
                  }}
                >
                  {pageData.customerName}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  {orderData?.customerName}
                </td>
              </tr>
            )}
          </table>
        </div>

        <table className="template-table-product">
          <tr className="tr-header-table">
            <th
              style={{
                width: "40%",
                textAlign: "left",
                paddingLeft: "9px",
              }}
            >
              {pageData.product}
            </th>
            <th
              style={{
                width: "25%",
                textAlign: "right",
                paddingRight: "5%",
              }}
            >
              {pageData.price}
            </th>
            <th
              style={{
                width: "10%",
                textAlign: "center",
              }}
            >
              {pageData.quantity}
            </th>
            <th
              style={{
                width: "25%",
                textAlign: "right",
                paddingRight: "9px",
              }}
            >
              {pageData.total}
            </th>
          </tr>
          <div style={{ height: "7px" }}></div>
          {orderData?.productList.map((item, index) => {
            return (
              <>
                <tr>
                  <td
                    style={{
                      width: "40%",
                      textAlign: "left",
                      paddingLeft: "9px",
                    }}
                  >
                    {`${index + 1}.  ${item?.productName}`}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      textAlign: "right",
                      paddingRight: "5%",
                    }}
                  >
                    {formatCurrencyWithSymbol(item?.price)}
                  </td>
                  <td
                    style={{
                      width: "10%",
                      textAlign: "center",
                    }}
                  >
                    {item?.quantity}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      textAlign: "right",
                      paddingRight: "9px",
                    }}
                  >
                    {formatCurrencyWithSymbol(item?.totalPrice)}
                  </td>
                </tr>
                <div style={{ height: "7px" }}></div>
                {templateSetting?.isShowToping && (
                  <>
                    {item?.toppings?.map((tItem) => {
                      return (
                        <tr>
                          <td
                            style={{
                              width: "40%",
                              textAlign: "left",
                              paddingLeft: "20px",
                            }}
                          >
                            {tItem?.toppingName}
                          </td>
                          <td
                            style={{
                              width: "25%",
                              textAlign: "right",
                              paddingRight: "5%",
                            }}
                          >
                            {formatCurrencyWithSymbol(tItem?.price)}
                          </td>
                          <td
                            style={{
                              width: "10%",
                              textAlign: "center",
                            }}
                          >
                            {tItem?.quantity}
                          </td>
                          <td
                            style={{
                              width: "25%",
                              textAlign: "right",
                              paddingRight: "20px",
                            }}
                          ></td>
                        </tr>
                      );
                    })}
                  </>
                )}
                {templateSetting?.isShowOption && (
                  <>
                    {item?.options?.map((tItem) => {
                      return (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              width: "30%",
                              textAlign: "left",
                              paddingLeft: "20px",
                            }}
                          >
                            {tItem?.optionName}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </>
            );
          })}
        </table>
        <div className="template-temporary">
          <hr className="bill-line" />
          <div style={{ height: "7px" }}></div>
          <table>
            <tr>
              <td
                style={{
                  width: "60%",
                  textAlign: "left",
                }}
              >
                {pageData.tempTotal}
              </td>
              <td
                style={{
                  width: "40%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.originalTotalPrice)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: "60%",
                  textAlign: "left",
                }}
              >
                {pageData.discount}
              </td>
              <td
                style={{
                  width: "40%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.discount)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: "60%",
                  textAlign: "left",
                }}
              >
                {pageData.feeAndTax}
              </td>
              <td
                style={{
                  width: "40%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.feeAndTax)}
              </td>
            </tr>
          </table>
        </div>

        <table className="template-final-price">
          <tr className="tr-header-table">
            <th
              style={{
                width: "50%",
                textAlign: "left",
                fontWeight: 600,
                paddingLeft: "9px",
              }}
            >
              {pageData.total}
            </th>
            <th
              style={{
                width: "50%",
                textAlign: "right",
                fontWeight: 600,
                paddingRight: "9px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.totalAmount)}
            </th>
          </tr>
          <div style={{ height: "7px" }}></div>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "9px",
              }}
            >
              {pageData.receivedAmount}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "9px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.receivedAmount)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "9px",
              }}
            >
              {pageData.change}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "9px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.change)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "9px",
              }}
            >
              {pageData.paymentMethod}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "9px",
              }}
            >
              {pageData.cash}
            </td>
          </tr>
        </table>

        <div className="template-footer">
          <table>
            {templateSetting?.isShowThanksMessage && (
              <>
                <tr>
                  <th className="thanks-message" colSpan={2}>
                    {templateSetting?.thanksMessageData}
                  </th>
                </tr>
                <div style={{ height: "7px" }}></div>
              </>
            )}

            {templateSetting?.isShowWifiAndPassword && (
              <>
                <tr>
                  <td
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                    colSpan={2}
                  >
                    {pageData.wifi}: {templateSetting?.wifiData}
                  </td>
                </tr>
                {templateSetting?.passwordData && (
                  <tr>
                    <td
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                      colSpan={2}
                    >
                      {pageData.password}: {templateSetting?.passwordData}
                    </td>
                  </tr>
                )}
              </>
            )}

            {templateSetting?.isShowQRCode && (
              <>
                <div style={{ height: "7px" }}></div>
                <tr>
                  <td colSpan={2} align={"center"}>
                    {qrImage === null ? <DefaultQRCode width={80} height={80} /> : <img src={qrImage} />}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {templateSetting?.qrCodeData}
                  </td>
                </tr>
                <div style={{ height: "7px" }}></div>
              </>
            )}
          </table>
        </div>
      </div>
    );
  };

  const renderSmallTemplate = (templateSetting) => {
    return (
      <div ref={componentRef} className="small-template" bordered={true}>
        <div className="template-header">
          <table>
            <tr>
              {templateSetting?.isShowLogo && (
                <td rowSpan={2}>
                  {/* Logo will be replaced by img tag in future */}
                  <div>
                    {templateSetting.logo ? (
                      <img src={templateSetting.logo} />
                    ) : (
                      <StoreLogoDefault width={40} height={40} />
                    )}
                  </div>
                </td>
              )}
              <th
                className="store-name"
                style={{
                  textAlign: "center",
                }}
              >
                {orderData?.storeName}
              </th>
            </tr>
            {templateSetting?.isShowAddress && (
              <tr>
                <td>
                  <div
                    className="branch-address"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {orderData?.branchAddress}
                  </div>
                </td>
              </tr>
            )}
          </table>
        </div>
        <hr className="bill-line" />
        <div className="template-invoice">
          <table>
            <tr>
              <th
                style={{
                  textAlign: "center",
                }}
                colSpan={2}
              >
                {pageData.paymentInvoice}
              </th>
            </tr>
            <div style={{ height: "7px" }}></div>
            <tr>
              <td
                style={{
                  textAlign: "left",
                }}
              >
                {pageData.orderCode}
              </td>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                {orderData?.orderCode}
              </td>
            </tr>
            {templateSetting?.isShowOrderTime && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  {pageData.orderTime}
                </td>
                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  {orderData?.orderTime}
                </td>
              </tr>
            )}
            {templateSetting?.isShowCashierName && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  {pageData.cashierName}
                </td>
                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  {orderData?.cashierName}
                </td>
              </tr>
            )}
            {templateSetting?.isShowCustomerName && (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  {pageData.customerName}
                </td>
                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  {orderData?.customerName}
                </td>
              </tr>
            )}
          </table>
        </div>

        <table className="template-table-product">
          <tr className="tr-header-table">
            <th
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {pageData.product}
            </th>
            <th
              style={{
                width: "10%",
                textAlign: "center",
              }}
            >
              {pageData.quantity}
            </th>
            <th
              style={{
                width: "30%",
                textAlign: "right",
                paddingRight: "5px",
              }}
            >
              {pageData.total}
            </th>
          </tr>
          <div style={{ height: "7px" }}></div>
          {orderData?.productList.map((item, index) => {
            return (
              <>
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      width: "60%",
                      textAlign: "left",
                      paddingLeft: "5px",
                    }}
                  >
                    {`${index + 1}.  ${item?.productName}`}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "60%",
                      textAlign: "left",
                      paddingLeft: "16px",
                    }}
                  >
                    {formatCurrencyWithSymbol(item?.price)}
                  </td>
                  <td
                    style={{
                      width: "10%",
                      textAlign: "center",
                    }}
                  >
                    {item?.quantity}
                  </td>
                  <td
                    style={{
                      width: "30%",
                      textAlign: "right",
                      paddingRight: "5px",
                    }}
                  >
                    {formatCurrencyWithSymbol(item?.totalPrice)}
                  </td>
                </tr>
                <div style={{ height: "7px" }}></div>
                {templateSetting?.isShowToping && (
                  <>
                    {item?.toppings?.map((tItem) => {
                      return (
                        <tr className="tr-topping-option">
                          <td
                            style={{
                              width: "60%",
                              textAlign: "left",
                              paddingLeft: "16px",
                            }}
                          >
                            {tItem?.toppingName}
                          </td>
                          <td
                            style={{
                              width: "10%",
                              textAlign: "center",
                            }}
                          >
                            {tItem?.quantity}
                          </td>
                          <td
                            style={{
                              width: "30%",
                              textAlign: "right",
                              paddingRight: "5px",
                            }}
                          >
                            {formatCurrencyWithSymbol(tItem?.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
                {templateSetting?.isShowOption && (
                  <>
                    {item?.options?.map((tItem) => {
                      return (
                        <tr className="tr-topping-option">
                          <td
                            colSpan={3}
                            style={{
                              width: "60%",
                              textAlign: "left",
                              paddingLeft: "16px",
                            }}
                          >
                            {tItem?.optionName}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </>
            );
          })}
        </table>

        <div className="template-temporary">
          <hr className="bill-line" />
          <div style={{ height: "12px" }}></div>
          <table>
            <tr>
              <td
                style={{
                  width: "70%",
                  textAlign: "left",
                }}
              >
                {pageData.tempTotal}
              </td>
              <td
                style={{
                  width: "30%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.originalTotalPrice)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: "60%",
                  textAlign: "left",
                }}
              >
                {pageData.discount}
              </td>
              <td
                style={{
                  width: "40%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.discount)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  width: "60%",
                  textAlign: "left",
                }}
              >
                {pageData.feeAndTax}
              </td>
              <td
                style={{
                  width: "40%",
                  textAlign: "right",
                }}
              >
                {formatCurrencyWithSymbol(orderData?.feeAndTax)}
              </td>
            </tr>
          </table>
        </div>

        <div style={{ height: "7px" }}></div>
        <table className="template-final-price">
          <tr
            style={{
              height: "24px",
              background: "#B3B3B3",
            }}
          >
            <th
              style={{
                width: "50%",
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {pageData.total}
            </th>
            <th
              style={{
                width: "50%",
                textAlign: "right",
                paddingRight: "5px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.totalAmount)}
            </th>
          </tr>
          <div style={{ height: "12px" }}></div>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {pageData.receivedAmount}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "5px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.receivedAmount)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {pageData.change}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "5px",
              }}
            >
              {formatCurrencyWithSymbol(orderData?.change)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "60%",
                textAlign: "left",
                paddingLeft: "5px",
              }}
            >
              {pageData.paymentMethod}
            </td>
            <td
              style={{
                width: "40%",
                textAlign: "right",
                paddingRight: "5px",
              }}
            >
              {pageData.cash}
            </td>
          </tr>
        </table>

        <div style={{ height: "7px" }}></div>
        <div className="template-footer">
          <table>
            {templateSetting?.isShowThanksMessage && (
              <>
                <tr>
                  <th className="thanks-message" colSpan={2}>
                    {templateSetting?.thanksMessageData}
                  </th>
                </tr>
                <div style={{ height: "7px" }}></div>
              </>
            )}

            {templateSetting?.isShowWifiAndPassword && (
              <>
                <tr>
                  <td
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                    colSpan={2}
                  >
                    {pageData.wifi}: {templateSetting?.wifiData}
                  </td>
                </tr>
                {templateSetting?.passwordData && (
                  <tr>
                    <td
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                      colSpan={2}
                    >
                      {pageData.password}: {templateSetting?.passwordData}
                    </td>
                  </tr>
                )}
                <div style={{ height: "7px" }}></div>
              </>
            )}

            {templateSetting?.isShowQRCode && (
              <>
                <div style={{ height: "7px" }}></div>
                <tr>
                  <td colSpan={2} align={"center"}>
                    {qrImage === null ? (
                      <DefaultQRCode width={80} height={80} />
                    ) : (
                      <img
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                        src={qrImage}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {templateSetting?.qrCodeData}
                  </td>
                </tr>
                <div style={{ height: "7px" }}></div>
              </>
            )}
          </table>
        </div>
      </div>
    );
  };

  const renderBillTemplate = () => {
    let template = <></>;
    if (!templateSetting) return template;

    const { billFrameSize } = templateSetting;
    switch (billFrameSize) {
      case billFrameSizeKey.small:
        template = renderSmallTemplate(templateSetting);
        break;
      case billFrameSizeKey.medium:
      default:
        template = renderMediumTemplate(templateSetting);
        break;
    }
    return template;
  };

  return <>{renderBillTemplate()}</>;
});
