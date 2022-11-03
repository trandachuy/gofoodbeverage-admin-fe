import "./index.scss";
import {
  Card,
  Button,
  message,
  Steps,
  Row,
  Col,
  Menu,
  Dropdown,
  Typography,
  Table,
  Modal,
  Space,
} from "antd";
import { DownOutlined, ArrowLeftOutlined, FormOutlined, PrinterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PurchaseOrderStatus,
  PurchaseOrderAction,
} from "constants/purchase-order-status.constants";
import { TrackingSteps } from "constants/string.constants";
import { formatCurrency, hasPermission } from "utils/helpers";
import { PermissionKeys } from "constants/permission-key.constants";
import CancelConfirmComponent from "components/cancel-confirm/cancel-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { EditIcon, PrintIcon, CancelIcon } from "constants/icons.constants";
const { Step } = Steps;
const { Text } = Typography;

export default function DetailPurchaseOrder(props) {
  const { t, match, history, purchaseOrderDataService, storeDataService } = props;
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState(false);
  const [purchaseOrderMaterials, setPurchaseOrderMaterials] = useState(false);
  const [cancelStatus, setCancelStatus] = useState(false);
  const [isDraftStatus, setIsDraftStatus] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(false);
  const [currencyStep, setCurrencyStep] = useState(1);
  const [isShowModalCancelPurchaseOrder, setIsShowModalCancelPurchaseOrder] = useState(false);
  const purchaseOrderId = match?.params?.id;

  const pageData = {
    backTo: t("button.backTo"),
    purchaseOrderManagement: t("purchaseOrder.purchaseOrderManagement"),
    edit: t("button.edit"),
    print: t("button.print"),
    approve: t("button.approve"),
    complete: t("button.complete"),
    cancel: t("button.cancel"),
    option: t("button.option"),
    generalInfo: t("settings.createGroupPermission.titleGeneralInformation"),
    approvePurchaseOrderSuccess: t("messages.approvePurchaseOrderSuccess"),
    cancelPurchaseOrderSuccess: t("messages.cancelPurchaseOrderSuccess"),
    completePurchaseOrderSuccess: t("messages.completePurchaseOrderSuccess"),
    table: {
      no: t("table.no"),
      sku: t("table.sku"),
      materialName: t("table.materialName"),
      material: t("material.title"),
      quantity: t("table.quantity"),
      importUnit: t("table.importUnit"),
      pleaseEnterNameUnit: t("productManagement.unit.pleaseEnterNameUnit"),
      importPrice: t("table.importPrice"),
      total: t("table.total"),
      totalCost: t("table.totalCost"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    status: {
      draft: t("status.draft"),
      inProgress: t("status.inProgress"),
      complete: t("status.complete"),
      cancel: t("status.cancel"),
    },
    supplier: t("supplier.title"),
    note: t("form.note"),
    materialInformation: t("purchaseOrder.materialInformation"),
    confirmCancel: t("leaveDialog.confirmCancel"),
    ignore: t("button.ignore"),
    cancelPurchaseOrder: t("purchaseOrder.cancelPurchaseOrder"),
  };

  useEffect(() => {
    fetchData();
    checkCurrencyVND();
  }, []);

  const fetchData = async () => {
    await purchaseOrderDataService.getPurchaseOrderByIdAsync(purchaseOrderId).then((res) => {
      if (res) {
        const { purchaseOrder } = res;
        setPurchaseOrderDetail(purchaseOrder);
        let dataSource = mappingToDataTable(purchaseOrder.purchaseOrderMaterials);
        setPurchaseOrderMaterials(dataSource);
        if (purchaseOrder?.statusId === PurchaseOrderStatus.Draft) {
          setIsDraftStatus(true);
        } else {
          setIsDraftStatus(false);
        }
        if (
          purchaseOrder?.statusId === PurchaseOrderStatus.Draft ||
          purchaseOrder?.statusId === PurchaseOrderStatus.Approved
        ) {
          setCancelStatus(true);
        } else {
          setCancelStatus(false);
        }

        //handle check step...
        if (purchaseOrder?.statusId === PurchaseOrderStatus.Draft) {
          setCurrencyStep(0);
        } else if (
          purchaseOrder?.statusId === PurchaseOrderStatus.Completed ||
          purchaseOrder?.statusId === PurchaseOrderStatus.Canceled
        ) {
          setCurrencyStep(2);
        } else {
          setCurrencyStep(1);
        }
      }
    });
  };

  const onEditPurchaseOrder = () => {
    history.push(`/inventory/edit-purchase-order/${purchaseOrderId}`);
  };

  const onUpdatePurchaseOrderStatus = async (action) => {
    let req = {
      id: purchaseOrderId,
    };
    if (action === PurchaseOrderAction.Approve) {
      purchaseOrderDataService.approvePurchaseOrderStatusByIdAsync(req).then((res) => {
        if (res) {
          fetchData();
          message.success(pageData.approvePurchaseOrderSuccess);
        }
      });
    } else if (action === PurchaseOrderAction.Complete) {
      purchaseOrderDataService.completePurchaseOrderStatusByIdAsync(req).then((res) => {
        if (res) {
          fetchData();
          message.success(pageData.completePurchaseOrderSuccess);
        }
      });
    } else {
      purchaseOrderDataService.cancelPurchaseOrderStatusByIdAsync(req).then((res) => {
        if (res) {
          fetchData();
          message.success(pageData.cancelPurchaseOrderSuccess);
        }
      });
    }

    if (action === PurchaseOrderAction.Cancel) {
      setIsShowModalCancelPurchaseOrder(false);
    }
  };

  const mappingToDataTable = (data) => {
    let materials = [];
    data.map((item, index) => {
      let material = {
        no: index + 1,
        sku: item?.material?.sku,
        material: item?.material?.name,
        quantity: item?.quantity,
        unitId: item?.unit?.name,
        price: item?.price,
        total: item?.total,
      };
      materials.push(material);
    });
    return materials;
  };

  const columnsMaterial = () => {
    let columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        align: "center",
        width: "5%",
      },
      {
        title: pageData.table.sku,
        dataIndex: "sku",
        align: "center",
        width: "10%",
      },
      {
        title: pageData.table.materialName,
        dataIndex: "material",
        align: "center",
        width: "20%",
      },
      {
        title: pageData.table.quantity,
        dataIndex: "quantity",
        width: "15%",
        align: "center",
      },
      {
        title: pageData.table.importUnit,
        dataIndex: "unitId",
        width: "15%",
        align: "center",
      },
      {
        title: `${pageData.table.importPrice} (${currencyCode})`,
        dataIndex: "price",
        align: "center",
        width: "15%",
        render: (_, record) => {
          return <>{record?.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</>;
        },
      },
      {
        title: pageData.table.total,
        dataIndex: "total",
        align: "center",
        width: "15%",
        render: (_, record) => {
          return <>{record?.total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</>;
        },
      },
    ];
    return columns;
  };

  const checkCurrencyVND = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const renderDropdownLink = () => {
    const menu = (
      <Menu>
        {hasPermission(PermissionKeys.EDIT_PURCHASE) && cancelStatus && (
          <Menu.Item key={1}>
            <a onClick={onEditPurchaseOrder}>
              <Space>
                <EditIcon />
                {pageData.edit}
              </Space>
            </a>
          </Menu.Item>
        )}
        {hasPermission(PermissionKeys.CANCEL_PURCHASE) && cancelStatus && (
          <Menu.Item key={3}>
            <CancelConfirmComponent
              title={pageData.confirmCancel}
              content={pageData.cancelPurchaseOrder}
              okText={pageData.confirmCancel}
              cancelText={pageData.ignore}
              permission={PermissionKeys.CANCEL_PURCHASE}
              onOk={() => onUpdatePurchaseOrderStatus(PurchaseOrderAction.Cancel)}
            />
          </Menu.Item>
        )}
        <Menu.Item key={2}>
          <a>
            <Space>
              <PrintIcon />
              {pageData.print}
            </Space>
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link button-action" onClick={(e) => e.preventDefault()}>
          {pageData.option} <DownOutlined />
        </a>
      </Dropdown>
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Link to="/inventory/purchase-orders" className="back-to-list">
            <ArrowLeftOutlined /> {pageData.backTo} {pageData.purchaseOrderManagement}
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={8}>
          <Row>
            <Text className="purchase-order-code">{purchaseOrderDetail.code}</Text>
          </Row>
          <Row>{renderDropdownLink()}</Row>
        </Col>
        <Col xs={12} lg={8}>
          <Steps
            className="fnb-steps"
            size="small"
            progressDot
            current={currencyStep}
            status={
              purchaseOrderDetail.statusId === PurchaseOrderStatus.Canceled
                ? TrackingSteps.error
                : TrackingSteps.process
            }
          >
            <Step title={pageData.status.draft} />
            <Step title={pageData.status.inProgress} />
            <Step
              title={
                purchaseOrderDetail.statusId === PurchaseOrderStatus.Canceled
                  ? pageData.status.cancel
                  : pageData.status.complete
              }
            />
          </Steps>
        </Col>
        <Col xs={12} lg={8}>
          {hasPermission(PermissionKeys.APPROVE_PURCHASE) && isDraftStatus && (
            <Button
              className="float-right mr-3"
              type="primary"
              onClick={() => onUpdatePurchaseOrderStatus(PurchaseOrderAction.Approve)}
            >
              {pageData.approve}
            </Button>
          )}
          {hasPermission(PermissionKeys.IMPORT_GOODS) && currencyStep === 1 && (
            <Button
              className="float-right mr-3"
              type="primary"
              onClick={() => onUpdatePurchaseOrderStatus(PurchaseOrderAction.Complete)}
            >
              {pageData.complete}
            </Button>
          )}
        </Col>
      </Row>
      <div className="card-parent">
        <Card className="mt-3 mb-4 card-general-info" title={pageData.generalInfo}>
          <Row className="mb-3">
            <Col xs={24} lg={12}>
              <h3>{pageData.supplier}: </h3>
              <p className="mt-2">
                <Link to={`/inventory/supplier/${purchaseOrderDetail.supplier?.id}`}>
                  {purchaseOrderDetail.supplier?.name}
                </Link>
              </p>
            </Col>
            <Col xs={24} lg={12}>
              <h3>{pageData.table.branchName}: </h3>
              <p className="mt-2">
                <a className="ml-2">{purchaseOrderDetail.storeBranch?.name}</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={24} lg={12}>
              <h3>{pageData.note}: </h3>
              <p className="mt-2">{purchaseOrderDetail.note}</p>
            </Col>
          </Row>
        </Card>
        <Card className="mt-1 card-material-info" title={pageData.materialInformation}>
          <FnbTable
            className="mt-4"
            dataSource={purchaseOrderMaterials}
            columns={columnsMaterial()}
          />
          {purchaseOrderMaterials?.length > 0 && (
            <Row className="float-right total">
              <Col className="total-width">
                <Row>
                  <Text className="material-quantity-label">{pageData.table.quantity}: </Text>
                </Row>
                <Row>
                  <Text className="total-cost-label">{pageData.table.totalCost}: </Text>
                </Row>
              </Col>
              <Col className="total-width">
                <Row>
                  <Text strong className="material-quantity-label">
                    {purchaseOrderMaterials?.length}
                  </Text>
                  &nbsp;
                  {pageData.table.material}
                </Row>
                <Row>
                  <Text strong className="total-cost">
                    {formatCurrency(purchaseOrderMaterials?.reduce((n, { total }) => n + total, 0))}
                  </Text>
                </Row>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}
