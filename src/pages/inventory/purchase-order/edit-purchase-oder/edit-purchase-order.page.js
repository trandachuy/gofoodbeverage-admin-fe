import { Button, Card, Col, Form, Input, InputNumber, message, Row, Typography } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbDeleteIcon } from "components/fnb-delete-icon/fnb-delete-icon";
import FnbSelectMaterialComponent from "components/fnb-select-material/fnb-select-material";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency } from "constants/string.constants";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "utils/helpers";
const { TextArea } = Input;
const { Text } = Typography;

export default function UpdatePurchaseOrderComponent(props) {
  const {
    t,
    materialDataService,
    branchDataService,
    storeDataService,
    purchaseOrderDataService,
    supplierDataService,
    unitConversionDataService,
    match,
    history,
  } = props;

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
      pleaseEnterNameUnit: t("productManagement.unit.pleaseEnterNameUnit"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      importPrice: t("table.importPrice"),
      total: t("table.total"),
      totalCost: t("table.totalCost"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    generalInformation: t("purchaseOrder.generalInformation"),
    destination: t("purchaseOrder.destinationLabel"),
    btnUpdate: t("button.update"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  const [form] = Form.useForm();
  const [purchaseOrderId, setPurchaseOrderId] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [currencyCode, setCurrencyCode] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();

  useEffect(() => {
    fetchInitData();
    checkCurrencyVND();
    setPurchaseOrderId(match?.params?.id);
    if (match?.params?.id) {
      purchaseOrderDataService.getPurchaseOrderByIdAsync(match?.params?.id).then((res) => {
        if (res.purchaseOrder) {
          getMaterialsUpdate(res.purchaseOrder.purchaseOrderMaterials);
          mappingFormEditPurchaseOrder(res.purchaseOrder);
        }
      });
    }
  }, []);

  const fetchInitData = async () => {
    await getSuppliers();
    await getBranches();
  };

  const mappingFormEditPurchaseOrder = (data) => {
    let listData = [];
    let listDataUpdate = [];
    data?.purchaseOrderMaterials?.map((item, index) => {
      const restMaterials = materials.filter((o) => o.id !== item.materialId);
      const newRow = mappingToDataTableForEdit(item, index);
      listData.push(newRow);
      setMaterials(restMaterials);

      let test = {
        unit: newRow?.unitId,
      };
      listDataUpdate.push(test);
    });
    setDataSelectedMaterial(listData);

    let formValue = {
      purchaseOrder: {
        supplierId: data?.supplierId,
        branchId: data?.storeBranchId,
        note: data?.note,
        selectedMaterials: listDataUpdate,
      },
    };

    form.setFieldsValue(formValue);
  };

  const mappingToDataTableForEdit = (item, index) => {
    let units = [];
    item.unitConversionUnits?.map((uc) => {
      let unit = {
        id: uc?.unitId,
        name: uc?.unit?.name,
      };
      units.push(unit);
    });
    units.unshift(item.material.unit);
    return {
      id: item.materialId,
      no: index + 1,
      sku: item?.material?.sku,
      material: item?.material?.name,
      quantity: item?.quantity,
      unitId: item?.unitId,
      price: item?.price,
      total: item?.total,
      unitConversionUnits: units,
    };
  };

  const getSuppliers = async () => {
    let res = await supplierDataService.getAllSupplierAsync();
    if (res) {
      setSuppliers(res.suppliers);
    }
  };

  const getBranches = async () => {
    let res = await branchDataService.getAllBranchsAsync();
    if (res) {
      setBranches(res.branchs);
    }
  };

  const getMaterialsUpdate = async (purchaseOrderMaterials) => {
    let res = await materialDataService.getAllMaterialManagementsAsync();
    if (res) {
      setInitDataMaterials(res.materials);
      const materialsUpdate = res.materials.filter(
        (x) => purchaseOrderMaterials.filter((y) => y.materialId === x.id).length === 0
      );
      setMaterials(materialsUpdate);
    }
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
      quantity: item?.quantity,
      unitId: null,
      price: item?.costPerUnit,
      total: item?.quantity * item?.costPerUnit,
    };
  };

  const onFinish = async (values) => {
    if (dataSelectedMaterial.length > 0) {
      const createPurchaseOrderRequestModel = {
        ...values.purchaseOrder,
        materials: dataSelectedMaterial,
      };
      let req = {
        id: purchaseOrderId,
        purchaseOrderDto: createPurchaseOrderRequestModel,
      };
      const res = await purchaseOrderDataService.updatePurchaseOrderByIdAsync(req);
      if (res) {
        message.success(pageData.updatePurchaseOrderSuccess);
        onCompleted();
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
        width: "15%",
        align: "left",
        render: (_, record, index) => (
          <InputNumber
            onChange={(value) => onChangeRecord(index, "quantity", value)}
            style={{ width: "95%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            defaultValue={record.quantity}
            min={1}
            className="fnb-input quantity-material"
          />
        ),
      },
      {
        title: pageData.table.importUnit,
        dataIndex: "unitId",
        width: "15%",
        align: "left",
        render: (_, record, index) => (
          <Form.Item
            name={["purchaseOrder", "selectedMaterials", index, "unit"]}
            rules={[
              {
                required: true,
                message: pageData.table.pleaseEnterNameUnit,
              },
            ]}
            style={{ display: "contents" }}
          >
            <FnbSelectSingle
              showSearch
              placeholder={pageData.table.unitPlaceholder}
              option={record?.unitConversionUnits?.map((item) => ({
                id: item?.id,
                name: item?.name,
              }))}
              defaultValue={record?.unitId}
              onChange={(value) => onSelectUnit(value, index)}
            />
          </Form.Item>
        ),
      },
      {
        title: `${pageData.table.importPrice} (${currencyCode})`,
        dataIndex: "price",
        align: "right",
        width: "20%",
        render: (_, record, index) => (
          <Row align="middle" justify="start">
            <Col span={24}>
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
            </Col>
          </Row>
        ),
      },
      {
        title: pageData.table.total,
        dataIndex: "total",
        align: "right",
        width: "10%",
        render: (_, record) => {
          return (
            <p>
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

    var units = await getUnitConversionsByMaterialId(id, selectedMaterial);

    const newRow = mappingToDataTable(selectedMaterial, dataSelectedMaterial.length);
    newRow.unitConversionUnits = units;

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
  };

  const onChangeRecord = (index, column, value) => {
    let changeRecord = dataSelectedMaterial[index];

    let quantity = column === "quantity" ? value : changeRecord.quantity;
    let price = column === "price" ? value : changeRecord.price;
    dataSelectedMaterial.map((item, i) => {
      if (i === index) {
        item.total = quantity * price;
        item.quantity = quantity;
        item.price = price;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onSelectUnit = (value, index) => {
    dataSelectedMaterial.map((item, i) => {
      if (i === index) {
        item.unitId = value;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/inventory/purchase-orders");
    }, 100);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const getTotalMaterials = () => {
    let total = dataSelectedMaterial.reduce((n, { total }) => n + total, 0).toFixed(2);
    return formatCurrency(total);
  };

  return (
    <>
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Row className="fnb-row-page-header">
          <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
            <p className="card-header">
              <PageTitle content={pageData.updatePurchaseOrder} />
            </p>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: <FnbAddNewButton type="primary" text={pageData.btnUpdate} htmlType="submit" />,
                  permission: PermissionKeys.EDIT_PURCHASE,
                },
                {
                  action: (
                    <Button htmlType="button" onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </Button>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
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
                {dataSelectedMaterial.length === 0 && <Text type="danger">{pageData.pleaseSelectMaterial}</Text>}
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
                        <Text className="float-left">{pageData.table.quantity}: </Text>
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
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
