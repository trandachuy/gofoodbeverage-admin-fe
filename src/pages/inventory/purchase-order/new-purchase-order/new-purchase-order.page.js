import { Button, Card, Col, Form, Input, InputNumber, message, Row, Typography } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbDeleteIcon } from "components/fnb-delete-icon/fnb-delete-icon";
import FnbSelectMaterialComponent from "components/fnb-select-material/fnb-select-material";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { tableSettings } from "constants/default.constants";
import { IconBtnAdd } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency } from "constants/string.constants";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import storeDataService from "data-services/store/store-data.service";
import unitConversionDataService from "data-services/unit-conversion/unit-conversion-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { formatCurrency } from "utils/helpers";
import "../index.scss";
const { TextArea } = Input;
const { Text } = Typography;

export default function NewPurchaseOrderComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [currencyCode, setCurrencyCode] = useState(false);
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    createPurchaseOrderSuccess: t("messages.createPurchaseOrderSuccess"),
    updatePurchaseOrderSuccess: t("messages.updatePurchaseOrderSuccess"),
    createPurchaseOrder: t("purchaseOrder.createPurchaseOrder"),
    updatePurchaseOrder: t("purchaseOrder.updatePurchaseOrder"),
    materialInformation: t("purchaseOrder.materialInformation"),
    searchMaterial: t("purchaseOrder.searchMaterial"),
    pleaseSelectMaterial: t("material.pleaseSelectMaterial"),
    note: t("form.note"),
    selectBranch: t("staffManagement.permission.selectBranch"),
    pleaseSelectBranch: t("staffManagement.permission.pleaseSelectBranch"),
    supplier: {
      title: t("supplier.title"),
      selectSupplier: t("supplier.selectSupplier"),
      pleaseSelectSupplier: t("supplier.pleaseSelectSupplier"),
    },
    table: {
      no: t("table.no"),
      sku: t("table.sku"),
      materialName: t("table.materialName"),
      material: t("material.title"),
      quantity: t("table.quantity"),
      importUnit: t("table.importUnit"),
      pleaseEnterNameUnit: t("productManagement.unit.pleaseSelectUnitMaterial"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      importPrice: t("table.importPrice"),
      total: t("table.total"),
      totalCost: t("table.totalCost"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    btnCreate: t("button.create"),
    generalInformation: t("purchaseOrder.generalInformation"),
    goBackToPurchaseOrder: t("purchaseOrder.goBackTo"),
    pleaseEnterQuantity: t("purchaseOrder.pleaseEnterQuantity"),
    pleaseImportPrice: t("purchaseOrder.pleaseImportPrice"),
    confirmation: t("leaveDialog.confirmation"),
    confirmationOkText: t("button.confirmationOkText"),
    confirmationCancelText: t("button.confirmationCancelText"),
    confirmMessage: t("messages.confirmLeave"),
    freeTextArea: t("purchaseOrder.freeTextArea"),
    destination: t("purchaseOrder.destinationLabel"),
  };

  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [visibleModalLeaveConfirm, setVisibleModelLeaveConfirm] = useState(false);

  useEffect(() => {
    fetchInitData();
    checkCurrencyVND();
  }, []);

  const fetchInitData = async () => {
    const response = await purchaseOrderDataService.getPurchaseOrderPrepareDataAsync();
    const { suppliers, branches, materials } = response;
    setSuppliers(suppliers);
    setBranches(branches);
    setMaterials(materials);
    setInitDataMaterials(materials);
  };

  const checkCurrencyVND = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const getUnitConversionsByMaterialId = async (id, material) => {
    let res = await unitConversionDataService.getUnitConversionsByMaterialIdAsync(id);
    let units = [];
    if (res) {
      res.unitConversions?.map((uc) => {
        let unit = {
          id: uc?.unitId,
          name: uc?.unit?.name,
        };
        units.push(unit);
      });
      units.push(material.unit);
    }
    return units;
  };

  const mappingToDataTable = (item, index) => {
    return {
      id: item?.id,
      no: index + 1,
      sku: item?.sku,
      material: item?.name,
      quantity: 0,
      unitId: null,
      price: 0,
      total: 0,
    };
  };

  const onFinish = async (values) => {
    if (dataSelectedMaterial.length > 0) {
      const createPurchaseOrderRequestModel = {
        ...values.purchaseOrder,
        materials: dataSelectedMaterial,
      };

      /// Add purchase Order
      const res = await purchaseOrderDataService.createPurchaseOrderAsync(createPurchaseOrderRequestModel);
      if (res) {
        message.success(pageData.createPurchaseOrderSuccess);
        setIsChangeForm(false);
        history.push("/inventory/purchase-orders");
      }
    }
  };

  const columnsMaterial = () => {
    let columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        align: "left",
        width: "5%",
      },
      {
        title: pageData.table.sku,
        dataIndex: "sku",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.table.materialName,
        dataIndex: "material",
        align: "left",
        width: "20%",
        render: (record, index) => {
          return (
            <Link to={`/inventory/material/detail/${index.id}`} target="_blank">
              {record}
            </Link>
          );
        },
      },
      {
        title: pageData.table.quantity,
        dataIndex: "quantity",
        align: "left",
        width: "15%",
        render: (_, record, index) => (
          <Row align="middle" justify="start">
            <Col span={24}>
              <Form.Item
                name={["purchaseOrder", "materials", index, "quantity"]}
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseEnterQuantity,
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => onChangeRecord(index, "quantity", value)}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  defaultValue={record.quantity}
                  min={1}
                  className="fnb-input quantity-material w-100"
                />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
      {
        title: pageData.table.importUnit,
        dataIndex: "unitId",
        align: "left",
        width: "15%",
        render: (_, record, index) => {
          const units = record?.units?.filter((a) => a?.id !== undefined);
          return (
            <Row align="middle" justify="start">
              <Col span={24}>
                <Form.Item
                  name={["purchaseOrder", "selectedMaterials", index, "unit"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.table.pleaseEnterNameUnit,
                    },
                  ]}
                >
                  <FnbSelectSingle
                    showSearch
                    placeholder={pageData.unitPlaceholder}
                    option={units?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    onChange={(value) => onSelectUnit(value, index)}
                  />
                </Form.Item>
              </Col>
            </Row>
          );
        },
      },
      {
        title: `${pageData.table.importPrice} (${currencyCode})`,
        dataIndex: "price",
        align: "left",
        width: "15%",
        render: (_, record, index) => (
          <Row align="middle" justify="start">
            <Col span={24}>
              <Form.Item
                name={["purchaseOrder", "materials", index, "price"]}
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseImportPrice,
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => onChangeRecord(index, "price", value)}
                  style={{ width: "80%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  defaultValue={record.price}
                  min={1}
                  precision={currencyCode === currency.vnd ? 0 : 2}
                  className="fnb-input input-material-price"
                />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
      {
        title: `${pageData.table.total} (${currencyCode})`,
        dataIndex: "total",
        align: "right",
        width: "10%",
        render: (_, record) => {
          return (
            <p style={{ textAlign: "right" }}>
              {record?.total?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          );
        },
      },
      {
        title: pageData.table.action,
        dataIndex: "action",
        align: "right",
        justify: "middle",
        width: "10%",
        render: (_, record) => (
          <a onClick={() => onRemoveItemMaterial(record.id)}>
            <FnbDeleteIcon />
          </a>
        ),
      },
    ];
    return columns;
  };

  const onSelectMaterial = async (id, pageNumber, pageSize) => {
    setPageNumber(pageNumber);
    let formValue = form.getFieldsValue();
    let { purchaseOrder } = formValue;

    const restMaterials = materials.filter((o) => o.id !== id);
    const selectedMaterial = materials.find((o) => o.id === id);
    const newRow = mappingToDataTable(selectedMaterial, dataSelectedMaterial.length);

    var units = await getUnitConversionsByMaterialId(id, selectedMaterial);
    newRow.units = units;
    setMaterials(restMaterials);
    setDataSelectedMaterial([...dataSelectedMaterial, newRow]);
    purchaseOrder.material = null;
    form.setFieldsValue(formValue);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > dataSelectedMaterial.length) {
      numberRecordCurrent = dataSelectedMaterial.length + 1;
    }
    setNumberRecordCurrent(numberRecordCurrent);
  };

  const onRemoveItemMaterial = (id) => {
    let restMaterials = dataSelectedMaterial.filter((o) => o.id !== id);
    setDataSelectedMaterial(restMaterials);

    let initDataMaterial = initDataMaterials.find((o) => o.id === id);
    materials.push(initDataMaterial);
    setNumberRecordCurrent(numberRecordCurrent - 1);
  };

  const onChangeRecord = (index, column, value) => {
    let changeRecord = dataSelectedMaterial[index];
    let quantity = column === "quantity" ? value : changeRecord.quantity;
    let price = column === "price" ? value : changeRecord.price;
    dataSelectedMaterial?.map((item, i) => {
      if (i === index) {
        item.total = quantity * price;
        item.quantity = quantity;
        item.price = price;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onSelectUnit = (value, index) => {
    dataSelectedMaterial?.map((item, i) => {
      if (i === index) {
        item.unitId = value;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setVisibleModelLeaveConfirm(true);
    } else {
      setVisibleModelLeaveConfirm(false);
      leaveOnOk();
    }
  };

  const changeForm = () => {
    setIsChangeForm(true);
    setDisableCreateButton(false);
  };

  const leaveOnOk = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/inventory/purchase-orders");
    }, 100);
  };

  const leaveOnCancel = () => {
    setVisibleModelLeaveConfirm(false);
  };

  const getTotalMaterials = () => {
    let total = dataSelectedMaterial.reduce((n, { total }) => n + total, 0).toFixed(2);
    return formatCurrency(total);
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 22,
        }}
        className="create-new-purchase-order-form"
      >
        <Row className="fnb-row-page-header">
          <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
            <p className="card-header">
              <PageTitle content={pageData.createPurchaseOrder} />
            </p>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disableCreateButton}
                      icon={<IconBtnAdd className="icon-btn-add-purchase-order" />}
                      className="btn-add-purchase-order"
                    >
                      {pageData.btnCreate}
                    </Button>
                  ),
                  permission: PermissionKeys.CREATE_PURCHASE,
                },
                {
                  action: (
                    <Button htmlType="button" onClick={(props) => onCancel(props)} className="action-cancel">
                      {pageData.btnCancel}
                    </Button>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>

        <div className="col-input-full-width">
          <Row align="middle">
            <Card className="w-100 mb-3 fnb-card h-auto">
              <Row gutter={16} align="middle">
                <Col span={24}>
                  <h4 className="title-group">{pageData.generalInformation}</h4>
                </Col>
                <Col className="gutter-row" span={12} md={12} sm={24} xs={24}>
                  <h4 className="fnb-form-label">
                    {pageData.supplier.title}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["purchaseOrder", "supplierId"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.supplier.pleaseSelectSupplier,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      placeholder={pageData.supplier.selectSupplier}
                      showSearch
                      option={suppliers?.map((b) => ({
                        id: b.id,
                        name: b.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12} md={12} sm={24} xl={12} xs={24}>
                  <h4 className="fnb-form-label">
                    {pageData.destination}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["purchaseOrder", "branchId"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseSelectBranch,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      showSearch
                      placeholder={pageData.selectBranch}
                      option={branches?.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={24}>
                  <h4 className="fnb-form-label">
                    {pageData.note}
                    <span className="text-danger"></span>
                  </h4>
                  <Form.Item name={["purchaseOrder", "note"]}>
                    <TextArea
                      className="fnb-input-with-count note-purchase-order"
                      showCount
                      maxLength={255}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      placeholder={pageData.freeTextArea}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Row>

          <Row className="display-contents">
            <Card className="mt-1 fnb-card h-auto">
              <Row>
                <Col span={24}>
                  <h4 className="title-group">{pageData.materialInformation}</h4>
                  <Form.Item className="w-100">
                    <FnbSelectMaterialComponent materialList={materials} t={t} onChangeEvent={onSelectMaterial} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FnbTable
                    tableId="material-list"
                    className="mt-4 material-list"
                    columns={columnsMaterial()}
                    pageSize={tableSettings.pageSize}
                    dataSource={dataSelectedMaterial}
                    currentPageNumber={pageNumber}
                    total={dataSelectedMaterial.length}
                    scrollY={116 * 5}
                  />
                </Col>
              </Row>
              <br />
              <Row justify="end" align="middle" className="h-bg-brad-class">
                <Col xs={0} sm={0} md={0} lg={14}></Col>
                <Col xs={24} sm={24} md={24} lg={10}>
                  <Row align="middle">
                    <Col span={24} className="pl20">
                      <Row gutter={16}>
                        <Col span={24} className="fz20 text-center">
                          <Text className="float-left">{pageData.table.quantity}</Text>
                          <span className="float-right pr10">
                            <span className="fwb mr10">{dataSelectedMaterial.length}</span>
                            {pageData.table.material}
                          </span>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col span={24} className="fz26 text-center">
                          <Text className="float-left" strong>
                            {pageData.table.totalCost}:
                          </Text>
                          <span className="float-right pr10">{getTotalMaterials()}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveForm}
        visible={visibleModalLeaveConfirm}
        skipPermission={true}
        cancelText={pageData.confirmationCancelText}
        okText={pageData.confirmationOkText}
        onCancel={leaveOnCancel}
        onOk={leaveOnOk}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
