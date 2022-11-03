import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Col, Collapse, Row, Tooltip } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { OrderStatus } from "constants/order-status.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { capitalize, formatCurrency } from "utils/helpers";
import "./detail-order.scss";

const { Panel } = Collapse;

export default function OrderDetail(props) {
  const { t, orderDataService, history, match } = props;
  const orderDetailLink = "/report/order";
  const customerDetailLink = "/customer/detail/";
  const orderStatusColor = {
    0: "new-order-color",
    1: "returned-order-color",
    2: "canceled-order-color",
    3: "to-confirm-order-color",
    4: "processing-order-color",
    5: "delivering-order-color",
    6: "completed-order-color",
    7: "draft-order-color",
  };

  const pageData = {
    backTo: t("button.backTo"),
    orderManagement: t("order.orderManagement"),
    general: t("material.generalInformation"),
    customer: t("table.customer"),
    information: t("order.information"),
    orderStatus: t("order.orderStatus"),
    reason: t("order.reason"),
    type: t("table.type"),
    paymentMethod: t("payment.paymentMethod"),
    deliveryMethod: t("deliveryMethod.title"),
    time: t("order.time"),
    branch: t("material.filter.branch.title"),
    staff: t("report.shift.staff"),
    note: t("form.note"),
    customerName: t("order.customerName"),
    shippingAddress: t("order.shippingAddress"),
    phone: t("form.phone"),
    accumulatedPoint: t("membership.accumulatedPoint"),
    points: t("order.points"),
    no: t("customer.no"),
    item: t("order.items"),
    option: t("option.title"),
    topping: t("productManagement.topping"),
    detail: t("table.detail"),
    price: t("combo.price.title"),
    discount: t("report.shift.discount"),
    orderItems: t("order.orderItems"),
    grossTotal: t("table.grossTotal"),
    shippingFee: t("order.shippingFee"),
    feeAndTax: t("order.feeAndTax"),
    revenue: t("order.revenue"),
    total: t("table.total"),

    tax: t("order.tax"),
    cost: t("order.cost"),
    orderDelivery: t("order.orderDelivery"),
    receiverName: t("order.receiver.name"),
    receiverAddress: t("order.receiver.address"),
    receiverPhone: t("order.receiver.phone"),
    subtotal: t("order.subtotal"),
    profit: t("order.profit"),
  };

  const [initDataOrder, setInitDataOrder] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = () => {
    orderDataService.getOrderByIdAsync(match?.params?.id).then((res) => {
      if (res?.order) {
        setInitDataOrder(res?.order);
        let orderItems = mappingToDataTable(res?.order?.orderItems);
        setOrderItems(orderItems);
      } else {
        history.push(`${orderDetailLink}`);
      }
    });
  };

  const mappingToDataTable = (orderItems) => {
    let gross_Total = 0;
    return orderItems?.map((item, index) => {
      return {
        no: (index += 1),
        productName: item?.productPrice?.product?.name,
        productPriceName: item?.productPrice?.priceName,
        price: item?.productPrice?.priceValue,
        amount: item?.quantity,
        orderItemOptions: item?.orderItemOptions,
        orderItemToppings: item?.orderItemToppings,
        orderComboItem: item?.orderComboItem,
        discount: item?.promotionDiscountValue,
        cost: item?.cost,
        grossTotal: (gross_Total += item?.quantity * item?.productPrice?.priceValue),
        taxName: item?.tax?.name,
        taxValue: item?.tax?.value,
        taxAmount: item?.taxValue,
        isCombo: item.isCombo,
        originalPrice: item?.originalPrice,
        discountPrice: item?.originalPrice - item?.priceAfterDiscount,
      };
    });
  };

  const getColumnOrderItems = [
    {
      title: pageData.no,
      dataIndex: "no",
      key: "no",
      width: "5%",
    },
    {
      title: pageData.item.toUpperCase(),
      dataIndex: "item",
      key: "item",
      width: "25%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              <Row className="mb-2">
                <Col span={24}>
                  <p className="item-name">{record?.orderComboItem?.comboName}</p>
                </Col>
              </Row>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item) => {
                return (
                  <Row>
                    <Col span={12}>
                      <p className="item-name">{item?.productPrice?.product?.name}</p>
                      {item?.productPrice?.priceName && (
                        <>
                          <p className="item-price-name">({item?.productPrice?.priceName})</p>
                        </>
                      )}
                    </Col>
                    <Col span={12} className="text-right">
                      <b>x{record?.amount}</b>
                    </Col>
                  </Row>
                );
              })}
            </>
          ) : (
            <Row>
              <Col span={12}>
                <p className="item-name">{record?.productName}</p>
                {record?.productPriceName && (
                  <>
                    <p className="item-price-name">({record?.productPriceName})</p>
                  </>
                )}
              </Col>
              <Col span={12} className="text-right">
                <b>x{record?.amount}</b>
              </Col>
            </Row>
          )}
        </>
      ),
    },
    {
      title: pageData.option.toUpperCase(),
      dataIndex: "orderItemOptions",
      key: "orderItemOptions",
      width: "25%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item) =>
                item?.orderItemOptions?.map((itemOption) => (
                  <Row className="mt-2 mb-2">
                    <Col span={12}>{itemOption?.optionName}:</Col>
                    <Col span={12} className="text-right">
                      <b>{itemOption?.optionLevelName}</b>
                    </Col>
                  </Row>
                ))
              )}
            </>
          ) : (
            <>
              {record?.orderItemOptions?.map((item) => (
                <Row className="mt-2 mb-2">
                  <Col span={12}>{item?.optionName}:</Col>
                  <Col span={12} className="text-right">
                    <b>{item?.optionLevelName}</b>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </>
      ),
    },
    {
      title: pageData.topping.toUpperCase(),
      dataIndex: "orderItemToppings",
      key: "orderItemToppings",
      width: "25%",
      render: (_, record) => (
        <>
          {record?.isCombo ? (
            <>
              {record?.orderComboItem?.orderComboProductPriceItems?.map((item) =>
                item?.orderItemToppings?.map((itemTopping) => (
                  <Row className="mt-2 mb-2">
                    <Col span={12}>{itemTopping?.toppingName}:</Col>
                    <Col span={12} className="text-right">
                      <b>x{itemTopping?.quantity}</b>
                    </Col>
                  </Row>
                ))
              )}
            </>
          ) : (
            <>
              {record?.orderItemToppings?.map((item) => (
                <Row className="mt-2 mb-2">
                  <Col span={12}>{item?.toppingName}:</Col>
                  <Col span={12} className="text-right">
                    <b>x{item?.quantity}</b>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </>
      ),
    },
    {
      title: pageData.detail.toUpperCase(),
      dataIndex: "detail",
      key: "detail",
      width: "20%",
      render: (_, record) => (
        <>
          <Row className="mt-2 mb-2">
            <Col span={12} className="detail-price">
              {pageData.price}:
            </Col>
            <Col span={12} className="text-right detail-price">
              {formatCurrency(record?.originalPrice)}
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.tax}:</Col>
            <Col span={12} className="text-right">
              -
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.discount}:</Col>
            <Col span={12} className="text-right">
              -{formatCurrency(record?.discountPrice)}
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col span={12}>{pageData.cost}:</Col>
            <Col span={12} className="text-right">
              -
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={`#${initDataOrder?.stringCode}`} />
          </p>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="order-detail-basic">
        <Col xs={12} sm={12} md={12} lg={12}>
          <Card className="w-100 fnb-card h-auto detail-general-card">
            <h4 className="order-detail-card-title">{pageData.general.toUpperCase()}</h4>
            <div className="h-100">
              <Row className="row-order-status">
                <Col span={12} className="label-left">
                  <h3>{pageData.orderStatus}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <span className={`order-status ${orderStatusColor[initDataOrder?.statusId]}`}>
                    {initDataOrder?.statusName}
                  </span>
                </Col>
              </Row>
              {initDataOrder?.statusId == OrderStatus.Canceled && (
                <Row className="row-order-status">
                  <Col span={6} className="label-left">
                    <h3>{pageData.reason}:</h3>
                  </Col>
                  <Col span={18} className="label-right">
                    <p>{initDataOrder?.reason}</p>
                  </Col>
                </Row>
              )}
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.type}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{initDataOrder?.orderTypeName}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{capitalize(pageData.paymentMethod)}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{initDataOrder?.paymentMethodName}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{capitalize(pageData.deliveryMethod)}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>-</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.time}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{moment(initDataOrder?.createdTime).format(DateFormat.DD_MM_YYYY_HH_MM_SS)}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.branch}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{initDataOrder?.branchName}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.staff}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{initDataOrder?.cashierName}</p>
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.note}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>{initDataOrder?.note ? initDataOrder?.note : "-"}</p>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card className="w-100 fnb-card h-auto detail-customer-card">
            <h4 className="order-detail-card-title">{pageData.customer.toUpperCase()}</h4>
            <div className="h-100">
              <Row className="mt-4">
                <Col span={12} className="label-left">
                  <h3>{pageData.customerName}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  <p>
                    {initDataOrder?.customer?.fullName ? (
                      <Link to={`${customerDetailLink}${initDataOrder?.customer?.id}`} className="link-customer-detail">
                        {initDataOrder?.customer?.fullName}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </p>
                </Col>
              </Row>
              <Row className="row-customer-rank">
                <Col span={12} className="label-left">
                  <h3>Rank:</h3>
                </Col>
                <Col span={12} className="label-right">
                  {initDataOrder?.customer?.rank ? (
                    <div className="order-report-customer-rank-wrapper">
                      <span className="order-report-customer-rank">{initDataOrder?.customer?.rank}</span>
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.shippingAddress}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  {initDataOrder?.customer?.address ? (
                    <p>
                      {initDataOrder?.customer?.address?.address1},&nbsp;
                      {initDataOrder?.customer?.address?.ward?.prefix}&nbsp;
                      {initDataOrder?.customer?.address?.ward?.name},&nbsp;
                      {initDataOrder?.customer?.address?.district?.prefix}&nbsp;
                      {initDataOrder?.customer?.address?.district?.name},&nbsp;
                      {initDataOrder?.customer?.address?.city?.name}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left">
                  <h3>{pageData.phone}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  {initDataOrder?.customer?.phoneNumber ? <p>{initDataOrder?.customer?.phoneNumber}</p> : <p>-</p>}
                </Col>
              </Row>
              <Row className="mt-1 mb-1">
                <Col span={12} className="label-left accumulatedPoint">
                  <h3>{pageData.accumulatedPoint}:</h3>
                </Col>
                <Col span={12} className="label-right">
                  {initDataOrder?.customer?.accumulatedPoint ? (
                    <p className="accumulatedPoint">
                      {initDataOrder?.customer?.accumulatedPoint} {pageData.points}
                    </p>
                  ) : (
                    <p>-</p>
                  )}
                </Col>
              </Row>
            </div>
            {initDataOrder?.orderDelivery && (
              <Row>
                <Card className="w-100 h-auto order-delivery-card">
                  <h4 className="order-detail-card-title">{pageData.orderDelivery}</h4>
                  <Row className="mt-1 mb-1">
                    <Col span={12} className="label-left">
                      <h3>{pageData.receiverName}:</h3>
                    </Col>
                    <Col span={12} className="label-right">
                      <p>{initDataOrder?.orderDelivery?.receiverName}</p>
                    </Col>
                  </Row>
                  <Row className="mt-1 mb-1">
                    <Col span={12} className="label-left">
                      <h3>{pageData.receiverAddress}:</h3>
                    </Col>
                    <Col span={12} className="label-right">
                      <p>{initDataOrder?.orderDelivery?.receiverAddress}</p>
                    </Col>
                  </Row>
                  <Row className="mt-1 mb-1">
                    <Col span={12} className="label-left">
                      <h3>{pageData.receiverPhone}:</h3>
                    </Col>
                    <Col span={12} className="label-right">
                      <p>{initDataOrder?.orderDelivery?.receiverPhone}</p>
                    </Col>
                  </Row>
                </Card>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="order-detail-items">
        <Card className="w-100 fnb-card h-auto mt-3">
          <h4 className="order-detail-card-title">{pageData.orderItems.toUpperCase()}</h4>

          <FnbTable dataSource={orderItems} columns={getColumnOrderItems} pagination={false} />
          <Row className="w-100 sub-total mt-3">
            <Col span={16}></Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <p className="gross-total-label">{pageData.subtotal}:</p>
                </Col>
                <Col span={12} className="text-right gross-total-data">
                  <p>{formatCurrency(initDataOrder?.originalPrice)}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>{pageData.discount}:</Col>
                <Col span={12} className="text-right">
                  {initDataOrder?.totalDiscountAmount > 0 ? (
                    <>-{formatCurrency(initDataOrder?.totalDiscountAmount)}</>
                  ) : (
                    <>{formatCurrency(initDataOrder?.totalDiscountAmount)}</>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Collapse ghost>
                    <Panel
                      header={pageData.feeAndTax}
                      className="shipping-panel"
                      extra={<>{formatCurrency(initDataOrder?.totalFee)}</>}
                    >
                      <Row>
                        <Col span={12} className="shipping-fee">
                          {pageData.shippingFee}
                        </Col>
                        <Col span={12} className="text-right shipping-fee">
                          {formatCurrency(initDataOrder?.deliveryFee)}
                        </Col>
                      </Row>
                      {initDataOrder?.orderFees?.map((item) => (
                        <Row className="mt-2">
                          <Col span={12} className="shipping-fee">
                            {item?.feeName}
                          </Col>
                          <Col span={12} className="text-right shipping-fee">
                            {formatCurrency(item?.feeValue)}
                          </Col>
                        </Row>
                      ))}
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
              <hr className="hr-dashed" />
              <Row className="mt-2 mb-2">
                <Col span={12} className="total-amount">
                  <b>{pageData.total}:</b>
                </Col>
                <Col span={12} className="text-right total-amount">
                  <b>{formatCurrency(initDataOrder?.totalAmount)}</b>
                </Col>
              </Row>
              <Row className="mt-3 mb-3">
                <Col span={12}>{pageData.cost}:</Col>
                <Col span={12} className="text-right">
                  {formatCurrency(initDataOrder?.totalCost)}
                </Col>
              </Row>
              <hr className="hr-dashed" />
              <Row>
                <Col span={12}>
                  <b className="profit-amount">{pageData.profit}:</b>
                  <Tooltip placement="topLeft" title="Profit = Subtotal - Discount - Cost">
                    <span className="ml-2 pointer">
                      <InfoCircleOutlined className="tooltip-info" />
                    </span>
                  </Tooltip>
                </Col>
                <Col span={12} className="text-right profit-amount">
                  <b>{formatCurrency(initDataOrder?.profit)}</b>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Row>
    </>
  );
}
