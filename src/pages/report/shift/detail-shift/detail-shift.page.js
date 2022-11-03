import React, { useState, useEffect } from "react";
import { Card, Col, Tabs, Row } from "antd";
import TableSellingProduct from "./components/table-selling-product.component";
import TableShiftOrderDetail from "./components/table-order.component";
import ShiftInfoComponent from "./components/shift-info.component";
import PageTitle from "components/page-title";
/**
 * Page Shift Detail
 * description: page Shift Detail primary template
 */
export default function ShiftDetail(props) {
  const {
    t,
    shiftDataService,
    match,
  } = props;

  const pageData = {
    title: t("report.shiftDetail.title"),
    orderTabTitle: t("report.shift.order"),
    sellingProductTabTitle: t("report.shiftDetail.sellingProduct.title"),
  };

  const { TabPane } = Tabs;
  const [listOrder, setListOrder] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [listSellingProduct, setListSellingProduct] = useState([]);
  const [totalSellingProduct, setTotalSellingProduct] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [infoShift, setInfoShift] = useState({});

  const tableSettings = {
    page: 1,
    pageSize: 20,
  };

  useEffect(() => {
    let fetchData = () => {
      initOrderDataTable(tableSettings.page, tableSettings.pageSize);
      initSellingProductDataTable(tableSettings.page, tableSettings.pageSize);
      initGetShiftInfo();
    };
    fetchData();
  }, []);

  const initOrderDataTable = (pageNumber, pageSize) => {
    shiftDataService.getShiftDetailOrderAsync(match?.params?.shiftId, pageNumber, pageSize).then((res) => {
      let orders = mappingToOrderDataTable(res.orders);
      setListOrder(orders);
      setTotalOrder(res.total);
    });
  };

  const mappingToOrderDataTable = (orders) => {
    return orders?.map((item) => {
      return {
        id: item?.id,
        code: `${item?.orderTypeFirstCharacter}${item?.code}`,
        statusName: item?.statusName,
        orderTypeFirstCharacter: item?.orderTypeFirstCharacter,
        orderTypeName: item?.orderTypeName,
        grossTotal: item?.grossTotalAmount,
        discount: item?.discountAmount,
        totalAmount: item?.totalAmount,
        paymentMethod: item?.paymentMethodName,
        fullName: `${item?.customer?.firstName} ${item?.customer?.lastName}`,
        phoneNumber: item?.customer?.phoneNumber,
        accumulatedPoint: item?.customer?.accumulatedPoint
      };
    });
  };

  const onChangeOrderPage = async (pageNumber, pageSize) => {
    initOrderDataTable(match?.params?.shiftId, pageNumber, pageSize);
  };

  const initSellingProductDataTable = (pageNumber, pageSize) => {
    shiftDataService.getShiftDetailSellingProductAsync(match?.params?.shiftId, pageNumber, pageSize).then((res) => {
      let sellingProduct = mappingToSellingProductDataTable(res.sellingProducts.sellingProductTable);
      setListSellingProduct(res.sellingProducts.sellingProductTable);
      setTotalSellingProduct(res.total);
      setTotalQuantity(res.sellingProducts.totalQuantity);
    });
  };

  const mappingToSellingProductDataTable = (orders) => {
    return orders?.map((item) => {
      return {
        no: item?.no,
        productName: item?.productName,
        quantity: item?.quantity,
      };
    });
  };

  const onChangeSellingProductPage = async (pageNumber, pageSize) => {
    initSellingProductDataTable(match?.params?.shiftId, pageNumber, pageSize);
  };

  const initGetShiftInfo = () => {
    shiftDataService.getInfoShiftByIdRequesAsync(match?.params?.shiftId).then((res) => {
      setInfoShift(res);
    });
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ShiftInfoComponent
            t={t}
            infoShift={infoShift}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={pageData.orderTabTitle} key="1">
              <div className="clearfix"></div>
              <Card className="mt-3">
                <TableShiftOrderDetail
                  t={t}
                  dataSource={listOrder}
                  pageSize={tableSettings.pageSize}
                  onChangePage={onChangeOrderPage}
                  total={totalOrder}
                />
              </Card>
            </TabPane>
            <TabPane tab={pageData.sellingProductTabTitle} key="2">
              <div className="clearfix"></div>
              <Card className="mt-3">
                <TableSellingProduct
                  t={t}
                  dataSource={listSellingProduct}
                  pageSize={tableSettings.pageSize}
                  onChangePage={onChangeSellingProductPage}
                  total={totalSellingProduct}
                  totalQuantity={totalQuantity}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}

