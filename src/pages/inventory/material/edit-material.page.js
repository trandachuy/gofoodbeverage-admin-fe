import { Card, Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Tooltip } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import PageTitle from "components/page-title";
import TextDanger from "components/text-danger";
import { MaximumNumber } from "constants/default.constants";
import { EditFill, ExclamationIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import materialDataService from "data-services/material/material-data.service";
import unitDataService from "data-services/unit/unit-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { formatTextNumber, getCurrency } from "utils/helpers";
import DeleteMaterial from "./components/delete-material.component";
import DeleteProductRecipes from "./components/delete-product-recipes.component";
import { UnitConversionComponent } from "./components/unit-conversion.component";
import UpdateCostPerUnitComponent from "./detail-material/update-cost-per-unit.component";
import "./index.scss";

const { TextArea } = Input;
export default function EditMaterialPage(props) {
  const { t } = useTranslation();
  const { history } = props;
  const unitConversionComponentRef = React.useRef();
  const fnbImageSelectRef = React.useRef();
  const param = useParams();
  const [form] = Form.useForm();
  const [listDataUnitConversion, setListDataUnitConversion] = useState([]);
  const [currentData, setCurrentData] = useState(null); /// current material data
  const [materialId, setMaterialId] = useState(null);
  const [units, setUnits] = useState([]);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUnitName, setNewUnitName] = useState(null);
  const [showUnitNameValidateMessage, setShowUnitNameValidateMessage] = useState(false);
  const [branches, setBranches] = useState([]);
  const [currentMaterialInventoryBranches, setCurrentMaterialInventoryBranches] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [listMaterialCategory, setListMaterialCategory] = useState([]);
  const [activateMaterial, setActivateMaterial] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [textBaseUnit, setTextBaseUnit] = useState("--");
  const [disableAllBranches, setDisableAllBranches] = useState(false);
  const [cosPerUnit, setCosPerUnit] = useState("");
  const [isMaterialInventoryAlBranches, setIsMaterialInventoryAlBranches] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleModal, setTitleModal] = useState({});
  const [infoMaterial, setInfoMaterial] = useState({});
  const [isModalProductVisible, setIsModalProductVisible] = useState(false);
  const [isModalPOVisible, setIsModalPOVisible] = useState(false);
  const [changeBaseUnit, setChangeBaseUnit] = useState(false);
  const [costPerUnitNumber, setCostPerUnitNumber] = useState(0);
  const [isModalCostUnitVisible, setIsModalCostUnitVisible] = useState(false);
  const tableFuncs = React.useRef(null);

  const pageData = {
    activate: t("status.activate"),
    deactivate: t("status.deactivate"),
    btnEdit: t("button.edit"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnUpload: t("button.upload"),
    addMaterial: t("material.addMaterial"),
    generalInformation: t("material.generalInformation"),
    material: t("material.material"),
    name: t("material.name"),
    pleaseEnterMaterialName: t("material.pleaseEnterMaterialName"),
    maxLengthMaterialName: 255,
    description: t("form.description"),
    maximum1000Characters: t("form.maximum1000Characters"),
    category: t("form.category"),
    selectCategory: t("form.selectCategory"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("messages.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    addedSuccessfully: t("material.addedSuccessfully"),
    unitNameValidateMessage: t("productManagement.unit.unitNameValidateMessage"),
    pricing: t("material.pricing"),
    baseUnit: t("material.baseUnit"),
    tooltipCostPerUnit: t("material.tooltipCostPerUnit"),
    unitSelectPlaceholder: t("productManagement.unit.unitSelectPlaceholder"),
    unitNamePlaceholder: t("productManagement.unit.unitNamePlaceholder"),
    pleaseSelectUnit: t("productManagement.unit.pleaseSelectUnit"),
    btnAddImportUnit: t("productManagement.unitConversion.btnAddImportUnit"),
    currentCostPerUnit: t("material.currentCostPerUnit"),
    btnAddNewUnit: t("productManagement.unit.btnAddNewUnit"),
    isUpdatedSuccessfully: t("messages.isUpdatedSuccessfully"),
    inventory: {
      title: t("material.inventory.title"),
      sku: t("material.inventory.sku"),
      skuPlaceholder: t("material.inventory.skuPlaceholder"),
      minQuantity: t("material.inventory.minQuantity"),
      minQuantityPlaceholder: t("material.inventory.minQuantityPlaceholder"),
      minQuantityTooltip: t("material.inventory.minQuantityTooltip"),
      branch: t("material.inventory.branch"),
      branchSelectPlaceholder: t("material.inventory.branchSelectPlaceholder"),
      branchValidateMessage: t("material.inventory.branchValidateMessage"),
      quantityPlaceholder: t("material.inventory.quantityPlaceholder"),
      quantityValidateMessage: t("material.inventory.quantityValidateMessage"),
      productHasExpiryDate: t("material.inventory.productHasExpiryDate"),
    },
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("material.addFromUrl"),
      uploadImage: t("material.addFile"),
    },
    backTo: t("material.back"),
    btnDelete: t("button.delete"),
    btnUpdate: t("button.update"),
    allBranch: t("staffManagement.permission.allBranch"),

    confirmDelete: t("leaveDialog.confirmDelete"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    notificationTitle: t("form.notificationTitle"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    updateMaterialCost: t("material.updateMaterialCost"),
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = () => {
    const { id } = param;
    materialDataService.getPrepareMaterialEditDataAsync(id).then((responseData) => {
      const { units, materialCategories, branches, material, unitConversions } = responseData;
      const { name, isActive, materialInventoryBranches, unit } = material;

      setUnits(units);
      setListMaterialCategory(materialCategories);

      setBranches(branches); // all branches used for dropdown list
      setMaterialId(id);
      setActivateMaterial(isActive);
      setCurrentData(material);
      setListDataUnitConversion(unitConversions);

      const listMaterialInventoryBranches = materialInventoryBranches?.map((materialBranch) => {
        return {
          id: materialBranch.id,
          name: materialBranch.branch.name,
          position: materialBranch.position,
          quantity: materialBranch.quantity,
          branchId: materialBranch.branch.id,
        };
      });

      const branchIds = materialInventoryBranches?.map((materialInventoryBranch) => {
        return materialInventoryBranch.branch.id;
      });

      let formValue = {
        id: param?.id,
        name: material?.name,
        description: material?.description,
        materialCategoryId: material?.materialCategory?.id,
        unitId: material?.unit?.id,
        sku: material?.sku,
        minQuantity: material?.minQuantity,
        hasExpiryDate: material?.hasExpiryDate,
        branchIds: branchIds,
        branches: listMaterialInventoryBranches,
      };

      setSelectedUnit(unit);
      setCosPerUnit(`${formatTextNumber(material?.costPerUnit)} ${getCurrency()} /`);
      setCostPerUnitNumber(material?.costPerUnit);
      setTextBaseUnit(`${formatTextNumber(material?.costPerUnit)} ${getCurrency()} /` + unit?.name);
      setMaterialName(name);
      setCurrentMaterialInventoryBranches(listMaterialInventoryBranches);

      const isAppliedForAllBranches = branchIds.length === branches.length;
      if (isAppliedForAllBranches === true) {
        setDisableAllBranches(true);
        setIsMaterialInventoryAlBranches(true);
      } else {
        onChangeSelectAllBranches(false);
      }

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        fnbImageSelectRef.current.setImageUrl(material?.thumbnail);
        setSelectedImage(material?.thumbnail);
      }

      form.setFieldsValue(formValue);
    });
  };

  const fetchUnits = () => {
    unitDataService.getUnitsAsync().then((res) => {
      if (res.units) {
        setUnits([...res.units]);
      }
    });
  };

  const getMaterial = (id) => {
    setMaterialId(id);
    materialDataService.getMaterialByIdAsync(id).then((res) => {
      if (res) {
        const { isActive } = res.material;
        const data = res.material;
        setActivateMaterial(isActive);
        let listBranch = [];
        data?.materialInventoryBranches?.map((i) => {
          let item = {
            id: i.id,
            name: i.branch.name,
            position: i.position,
            quantity: i.quantity,
            branchId: i.branch.id,
          };
          listBranch.push(item);
        });
        setCurrentMaterialInventoryBranches(listBranch);

        let branchIds = [];
        data?.materialInventoryBranches?.map((item) => {
          branchIds.push(item.branch.id);
        });
        setSelectedUnit(data?.unit);
        let formValue = {
          id: param?.id,
          name: data?.name,
          description: data?.description,
          materialCategoryId: data?.materialCategory?.id,
          unitId: data?.unit?.id,
          sku: data?.sku,
          minQuantity: data?.minQuantity,
          hasExpiryDate: data?.hasExpiryDate,
          branchIds: branchIds,
          branches: listBranch,
        };

        setCosPerUnit(`${formatTextNumber(data?.costPerUnit)} ${getCurrency()} /`);
        setTextBaseUnit(`${formatTextNumber(data?.costPerUnit)} ${getCurrency()} /` + data?.unit?.name);
        form.setFieldsValue(formValue);
        setMaterialName(data?.name);
      }
    });
  };

  const onEditMaterial = (values) => {
    let req = { ...values, unitConversions: listDataUnitConversion };
    if (fnbImageSelectRef && fnbImageSelectRef.current) {
      const imageUrl = fnbImageSelectRef.current.getImageUrl();
      if (imageUrl) {
        req = {
          ...req,
          logo: imageUrl,
        };
      }
    }

    materialDataService.updateMaterialManagementAsync(req).then((res) => {
      if (res) {
        setIsChangeForm(false);
        message.success(`${pageData.material} ${req.name} ${pageData.isUpdatedSuccessfully}`);
        onCancelEditMaterialForm();
      }
    });
  };

  const onAddNewUnit = () => {
    if (!newUnitName) {
      setShowUnitNameValidateMessage(true);
      return;
    }
    /// Handle add new unit
    unitDataService.createUnitAsync({ name: newUnitName }).then((unit) => {
      if (unit) {
        fetchUnits();

        /// Set unit selected is new unit
        form.setFieldsValue({
          unitId: unit.id,
        });

        setNewUnitName(null);
      }
    });
  };

  async function onActivateMaterialAsync() {
    const response = await materialDataService.activateMaterialByIdAsync(param.id);
    if (response?.isSuccess === true) {
      message.success(`${materialName} ${t(pageData.isUpdatedSuccessfully)}`);
    }

    getMaterial(param.id);
  }

  async function onDeActiveMaterialAsync() {
    const response = await materialDataService.deactivateMaterialByIdAsync(param.id);
    const { isSuccess, data } = response;
    if (isSuccess === false) {
      const { isOpenPurchaseOrder, isOpenProduct } = data;
      if (isOpenPurchaseOrder) {
        setTitleModal(pageData.notificationTitle);
        setInfoMaterial(data);
        setIsModalPOVisible(true);
      } else if (isOpenProduct) {
        setTitleModal(pageData.notificationTitle);
        setInfoMaterial(data);
        setIsModalProductVisible(true);
      }
    } else {
      message.success(`${materialName} ${t(pageData.isUpdatedSuccessfully)}`);
      getMaterial(param.id);
    }
  }

  const onSelectBranchesInventory = (branchIds) => {
    const listBranch = branches.filter((b) => branchIds.find((v) => v === b.id));
    setCurrentMaterialInventoryBranches(listBranch);
    if (branchIds && branchIds.length > 0) {
      let branches = [];
      listBranch.forEach((branch, index) => {
        branches.push({
          branchId: branch.id,
          position: index + 1,
        });
      });

      /// Update old values
      let formValues = form.getFieldsValue();
      if (formValues?.branches && formValues.branches.length > 0) {
        formValues?.branches.forEach((item) => {
          let branch = branches.find((b) => b.branchId === item.branchId);
          if (branch) {
            branch.id = item.id;
            branch.quantity = item.quantity;
          }
        });
      }

      form.setFieldsValue({ ...formValues, branches });
    }
  };

  const onCancelEditMaterialForm = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/inventory/material");
    }, 100);
  };

  const onChangeSelectAllBranches = (isChecked) => {
    onSelectAllBranches(isChecked);
    setIsMaterialInventoryAlBranches(isChecked);
  };

  const renderSelectBaseUnit = (units) => {
    return (
      <FnbSelectSingle
        onChange={(unitId) => {
          const unit = units.find((u) => u.id === unitId);
          setSelectedUnit(unit);
          setTextBaseUnit(cosPerUnit + unit.name);
          setListDataUnitConversion([]);
          setChangeBaseUnit(true);
        }}
        className="unit-selector"
        placeholder={pageData.unitSelectPlaceholder}
        dropdownRender={(menu) => (
          <>
            <Row gutter={[16, 16]}>
              <Col span={18}>
                <Input
                  className="fnb-input unit-dropdown-input"
                  value={newUnitName}
                  allowClear="true"
                  onPressEnter={onAddNewUnit}
                  maxLength={50}
                  placeholder={pageData.unitNamePlaceholder}
                  onChange={(e) => {
                    setNewUnitName(e.target.value);
                    setShowUnitNameValidateMessage(false);
                  }}
                />
                <TextDanger
                  className="text-error-add-unit"
                  visible={showUnitNameValidateMessage}
                  text={pageData.unitNameValidateMessage}
                />
              </Col>
              <Col span={6}>
                <FnbAddNewButton
                  onClick={() => onAddNewUnit()}
                  className="mt-16 ml-24 mw-0"
                  type="primary"
                  text={pageData.btnAddNewUnit}
                ></FnbAddNewButton>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className={showUnitNameValidateMessage ? "mt-10" : "mt-32"}>{menu}</div>
              </Col>
            </Row>
          </>
        )}
        option={units?.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
      ></FnbSelectSingle>
    );
  };

  const onClickAddImportUnit = async () => {
    if (unitConversionComponentRef && unitConversionComponentRef.current) {
      const unitConversionComponentModel = {
        unitId: changeBaseUnit === true ? selectedUnit?.id : currentData?.unit?.id,
        baseUnitName: changeBaseUnit === true ? selectedUnit?.name : currentData?.unit?.name,
        unitConversions: listDataUnitConversion,
      };
      unitConversionComponentRef.current.set(unitConversionComponentModel);
      unitConversionComponentRef.current.open();
    }
  };

  const renderGeneralInfo = () => {
    return (
      <Card className="fnb-card">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div>
              <h3 className="label-information mt-10">{pageData.generalInformation}</h3>
              <h4 className="fnb-form-label mt-32">
                {pageData.name}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item name="id" className="d-none">
                <Input type="hidden" value={param.id} />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseEnterMaterialName,
                  },
                  { type: "string", max: pageData.maxLengthMaterialName },
                ]}
              >
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={100}
                  onChange={(e) => onChangeMaterialName(e)}
                />
              </Form.Item>
            </div>
            <div className="mt-40">
              <h4 className="fnb-form-label">{pageData.description}</h4>
              <Form.Item name="description">
                <TextArea
                  className="fnb-text-area-with-count no-resize material-description-box"
                  placeholder={pageData.maximum1000Characters}
                  maxLength={2000}
                  showCount
                />
              </Form.Item>
            </div>
            <div className="mt-40">
              <h4 className="fnb-form-label">{pageData.category}</h4>
              <Form.Item name="materialCategoryId">
                <FnbSelectSingle
                  placeholder={pageData.selectCategory}
                  option={listMaterialCategory?.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                  showSearch
                />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <Row className="justify-content-center">
              <Col span={15}>
                <h3 className="label-information mt-10 ml-24">{pageData.media.title}</h3>
                <FnbImageSelectComponent ref={fnbImageSelectRef} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderToolTipCostPerUnit = () => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: pageData.tooltipCostPerUnit,
        }}
      ></span>
    );
  };

  const updateCostPerUnit = () => {
    if (tableFuncs && tableFuncs.current) {
      tableFuncs.current(costPerUnitNumber);
    }
    setIsModalCostUnitVisible(true);
  };

  const renderBaseUnitLabel = () => {
    const text = selectedUnit ? `${getCurrency()}/${selectedUnit?.name}` : "--";
    return text;
  };

  const renderPricing = () => {
    return (
      <>
        <Card className="fnb-card mt-32">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <div className="label-pricing">
                <h3 className="label-information">{pageData.pricing}</h3>
                <h4 className="fnb-form-label mt-32">
                  {pageData.currentCostPerUnit}
                  <Tooltip
                    placement="topLeft"
                    title={renderToolTipCostPerUnit()}
                    className=" material-edit-cost-per-unit-tool-tip"
                  >
                    <span>
                      <ExclamationIcon />
                    </span>
                  </Tooltip>
                </h4>
                <div className="d-flex">
                  <p className="material-view-cost-per-unit-text material-edit-cost-per-unit-text">
                    <b>{`${formatTextNumber(costPerUnitNumber)} ${getCurrency()} /` + selectedUnit?.name}</b>
                  </p>
                  <a onClick={() => updateCostPerUnit()}>
                    <Tooltip placement="top" title={pageData.updateMaterialCost} color="#50429B">
                      <EditFill className="ml-18 icon-svg-hover" />
                    </Tooltip>
                  </a>
                </div>
                <h4 className="fnb-form-label mt-40">
                  {pageData.baseUnit}
                  <span className="text-danger">*</span>
                </h4>
              </div>
            </Col>
          </Row>
          <div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name="unitId"
                  rules={[
                    {
                      required: true,
                      message: pageData.pleaseSelectUnit,
                    },
                  ]}
                >
                  {renderSelectBaseUnit(units)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <FnbAddNewButton
                  className="btn-add-import-unit"
                  onClick={() => onClickAddImportUnit()}
                  text={pageData.btnAddImportUnit}
                />
              </Col>
            </Row>
          </div>
        </Card>
        <UnitConversionComponent
          ref={unitConversionComponentRef}
          onComplete={(data) => {
            const { unitConversions } = data;
            setListDataUnitConversion(unitConversions);
          }}
        />
      </>
    );
  };

  const renderInventory = () => {
    return (
      <>
        <Card className="fnb-card mt-32">
          <h3 className="label-information">{pageData.inventory.title}</h3>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <h4 className="fnb-form-label mt-22">{pageData.inventory.sku}</h4>
              <Form.Item name="sku">
                <Input className="fnb-input" maxLength={20}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className="d-flex">
                <h4 className="fnb-form-label mt-22">{pageData.inventory.minQuantity} </h4>
                <Tooltip placement="topLeft" title={pageData.inventory.minQuantityTooltip}>
                  <span className="ml-18 mt-22">
                    <ExclamationIcon />
                  </span>
                </Tooltip>
              </div>

              <Form.Item name="minQuantity">
                <InputNumber
                  className="w-100 fnb-input-number"
                  min={1}
                  max={MaximumNumber}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item name="hasExpiryDate" valuePropName="checked">
              <Checkbox>{pageData.inventory.productHasExpiryDate}</Checkbox>
            </Form.Item>
          </Row>

          <h3 className="fnb-form-label mt-16">
            {pageData.inventory.branch}
            <span className="text-danger">*</span>
          </h3>
          <div className="material-check-box-select-all-branch">
            <Checkbox
              checked={isMaterialInventoryAlBranches}
              onChange={(event) => {
                const isChecked = event.target.checked;
                onChangeSelectAllBranches(isChecked);
              }}
            >
              {pageData.allBranch}
            </Checkbox>
          </div>
          <Row>
            <Col span={24} hidden={disableAllBranches}>
              <Form.Item
                name="branchIds"
                rules={[
                  {
                    required: true,
                    message: pageData.inventory.branchValidateMessage,
                  },
                ]}
              >
                <FnbSelectMultiple
                  onChange={(values) => onSelectBranchesInventory(values)}
                  placeholder={pageData.inventory.branchSelectPlaceholder}
                  className="w-100"
                  allowClear
                  option={branches?.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                ></FnbSelectMultiple>
              </Form.Item>
            </Col>
            <Col span={24} hidden={!disableAllBranches}>
              <Form.Item>
                <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
              </Form.Item>
            </Col>
          </Row>
          <div className="form-edit-material-inventory-scroll">
            {currentMaterialInventoryBranches?.map((branch, index) => renderBranchAndQuantity(branch, index))}
          </div>
        </Card>
      </>
    );
  };

  const renderBranchAndQuantity = (branch, index) => {
    return (
      <>
        <Row gutter={[16, 16]} key={index}>
          <Col span={24}>
            <Form.Item name={["branches", index, "id"]} className="d-none">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name={["branches", index, "branchId"]} className="d-none">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name={["branches", index, "position"]} className="d-none">
              <Input type="hidden" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <h4 className={`fnb-form-label ml-16 ${index === 0 ? "mt-16" : "branch-option"}`}>{branch?.name}</h4>
                <Form.Item name={["branches", index, "quantity"]}>
                  <InputNumber
                    defaultValue={0}
                    placeholder={pageData.inventory.quantityPlaceholder}
                    className="w-100 fnb-input-number ml-16"
                    min={0}
                    max={MaximumNumber}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={`unit-name ${index === 0 ? "mt-16" : ""}`}>
                  <span className="fnb-form-label ml-20">{selectedUnit?.name}</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const handleOpenDeletePopup = () => {
    setIsModalVisible(true);
  };

  const onSelectAllBranches = (isChecked) => {
    setDisableAllBranches(isChecked);
    let branchIds = [];
    if (isChecked) {
      branches?.map((item) => {
        branchIds.push(item.id);
      });
      onSelectBranchesInventory(branchIds);
      let formValue = {
        branchIds: branchIds,
      };

      form.setFieldsValue(formValue);
    }
  };

  const renderModalDelete = () => {
    return (
      <Modal
        className="delete-confirm-modal"
        title={pageData.confirmDelete}
        visible={isModalVisible}
        okText={pageData.btnDelete}
        okType="danger"
        cancelText={pageData.btnIgnore}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {formatDeleteMessage(materialName)}
      </Modal>
    );
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleDeleteItem(param.id, "initData?.material?.name");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return <span dangerouslySetInnerHTML={{ __html: mess }}></span>;
  };

  const handleDeleteItem = async (id, name) => {
    await materialDataService.deleteMaterialManagementAsync(id).then((res) => {
      if (res) {
        history.push("/inventory/material");
        message.success(`${name} ${pageData.isDeletedSuccessfully}`);
      }
    });
  };

  const onChangeMaterialName = (event) => {
    setMaterialName(event.target.value);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCancelEditMaterialForm();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onDeleteProductPriceMaterial = async (id) => {
    await materialDataService.deleteProductPriceMaterialByMaterialIdAsync(id);

    setIsModalProductVisible(false);

    await onDeActiveMaterialAsync();
  };

  const getActionButtons = () => {
    if (activateMaterial === true) {
      return [
        {
          action: (
            <FnbAddNewButton className="float-right" type="primary" text={pageData.btnUpdate} htmlType="submit" />
          ),
          permission: PermissionKeys.EDIT_MATERIAL,
        },
        {
          action: (
            <a onClick={() => onCancel()} className="action-cancel">
              {pageData.btnCancel}
            </a>
          ),
        },
        {
          action: (
            <a onClick={onDeActiveMaterialAsync} className="action-deactivate">
              {pageData.deactivate}
            </a>
          ),
          permission: PermissionKeys.DEACTIVATE_MATERIAL,
        },
        {
          action: (
            <a onClick={() => handleOpenDeletePopup()} className="action-delete">
              {pageData.btnDelete}
            </a>
          ),
          permission: PermissionKeys.DELETE_MATERIAL,
        },
      ];
    } else {
      return [
        {
          action: (
            <FnbAddNewButton className="float-right" type="primary" text={pageData.btnUpdate} htmlType="submit" />
          ),
          permission: PermissionKeys.EDIT_MATERIAL,
        },
        {
          action: (
            <a onClick={() => onCancel()} className="action-cancel">
              {pageData.btnCancel}
            </a>
          ),
        },
        {
          action: (
            <a onClick={onActivateMaterialAsync} className="action-activate">
              {pageData.activate}
            </a>
          ),
          permission: PermissionKeys.ACTIVATE_MATERIAL,
        },
        {
          action: (
            <a onClick={() => handleOpenDeletePopup()} className="action-delete">
              {pageData.btnDelete}
            </a>
          ),
          permission: PermissionKeys.DELETE_MATERIAL,
        },
      ];
    }
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        onFinish={onEditMaterial}
        onFieldsChange={() => setIsChangeForm(true)}
        autoComplete="off"
        className="material-form"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={materialName} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
            <ActionButtonGroup arrayButton={getActionButtons()} />
            {renderModalDelete()}
          </Col>
        </Row>
        <div className="clearfix"></div>
        <Row>
          <div className="w-100">
            <Card className="fnb-card">
              <Row>
                <div className="w-100">
                  {renderGeneralInfo()}
                  {renderPricing()}
                  {renderInventory()}
                </div>
              </Row>
            </Card>
          </div>
        </Row>
      </Form>
      <DeleteMaterial
        isModalVisible={isModalPOVisible}
        infoMaterial={infoMaterial}
        titleModal={titleModal}
        handleCancel={() => setIsModalPOVisible(false)}
        onDelete={() => {}}
      />

      <DeleteProductRecipes
        isModalVisible={isModalProductVisible}
        infoMaterial={infoMaterial}
        titleModal={titleModal}
        handleCancel={() => setIsModalProductVisible(false)}
        onDelete={() => onDeleteProductPriceMaterial(param.id)}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCancelEditMaterialForm}
        isChangeForm={isChangeForm}
      />
      <UpdateCostPerUnitComponent
        isModalVisible={isModalCostUnitVisible}
        handleCancel={() => setIsModalCostUnitVisible(false)}
        materialId={param?.id}
        setCostPerUnit={setCostPerUnitNumber}
        tableFuncs={tableFuncs}
        renderBaseUnitLabel={renderBaseUnitLabel}
      />
    </>
  );
}
