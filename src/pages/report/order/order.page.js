import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import TableOrder from "./components/table-order.component";
import { tableSettings } from "constants/default.constants";
import { useTranslation } from "react-i18next";
import orderDataService from "data-services/order/order-data.service";

export default function OrderManagement(props) {
  const [t] = useTranslation();

  const [keySearch, setKeySearch] = useState("");
  const [orderDate, setOrderDate] = useState(moment().format(DateFormat.MM_DD_YYYY));
  const [listOrder, setListOrder] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [orderTransactionReport, setOrderTransactionReport] = useState({});
  const [pageSize, setPageSize] = useState(tableSettings.pageSize);
  const [orderReportFilters, setOrderReportFilters] = useState({});

  useEffect(() => {
    let fetchData = () => {
      initDataTable(orderDate, tableSettings.page, tableSettings.pageSize, keySearch);
    };
    fetchData();
  }, []);

  const initDataTable = (orderDate, pageNumber, pageSize, keySearch) => {
    let req = {
      startDate: orderDate,
      endDate: orderDate,
      pageNumber: currentPageNumber,
      pageSize: pageSize,
      keySearch: keySearch,
      typeOptionDate: 0,
      branchId: "",
    };
    orderDataService.getOrderManagementAsync(req).then((res) => {
      let orders = mappingToDataTable(res.orders);
      setListOrder(orders);
      setTotalOrder(res.total);
      setCurrentPageNumber(pageNumber);
      setOrderTransactionReport(res.orderTransactionReport);
      setOrderReportFilters(res.orderReportFilters);
    });
  };

  const mappingToDataTable = (orders) => {
    return orders?.map((item) => {
      return {
        id: item?.id,
        code: `${item?.orderTypeFirstCharacter}${item?.code}`,
        statusId: item?.statusId,
        statusName: item?.statusName,
        orderTypeFirstCharacter: item?.orderTypeFirstCharacter,
        orderTypeId: item?.orderTypeId,
        orderTypeName: item?.orderTypeName,
        grossTotal: item?.originalPrice,
        discount: item?.totalDiscountAmount,
        totalFee: item?.totalFee,
        deliveryFee: item?.deliveryFee,
        totalAmount: item?.totalAmount,
        paymentMethod: item?.paymentMethodName,
        customerId: item?.customer?.id,
        fullName: item?.customer?.fullName,
        phoneNumber: item?.customer?.phoneNumber,
        rank: item?.customer?.rank,
        accumulatedPoint: item?.customer?.accumulatedPoint,
      };
    });
  };

  return (
    <>
      <div className="clearfix"></div>
      <Row className="mt-4">
        <Col span={24}>
          <TableOrder
            dataSource={listOrder}
            pageSize={pageSize}
            total={totalOrder}
            currentPageNumber={currentPageNumber}
            setOrderTransactionReport={setOrderTransactionReport}
            orderTransactionReport={orderTransactionReport}
            setListOrder={setListOrder}
            setTotalOrder={setTotalOrder}
            mappingToDataTable={mappingToDataTable}
            setKeySearch={setKeySearch}
            setCurrentPageNumber={setCurrentPageNumber}
            setPageSize={setPageSize}
            orderManagementReportFilters={orderReportFilters}
          />
        </Col>
      </Row>
    </>
  );
}
