import { Card, Checkbox, Col, Form, Input, InputNumber, message, Row, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import PageTitle from "components/page-title";
import TextDanger from "components/text-danger";
import { MaximumNumber } from "constants/default.constants";
import { ExclamationIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import branchDataService from "data-services/branch/branch-data.service";
import materialCategoryDataService from "data-services/material-category/material-category-data.service";
import materialDataService from "data-services/material/material-data.service";
import unitDataService from "data-services/unit/unit-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrency, preventMultipleClick } from "utils/helpers";
import { UnitConversionComponent } from "./components/unit-conversion.component";

const { TextArea } = Input;

export default function NewMaterialPage(props) {
  const [t] = useTranslation();
  const unitConversionComponentRef = React.useRef();
  const [form] = Form.useForm();
  const [units, setUnits] = useState([]);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newUnitName, setNewUnitName] = useState(null);
  const [showUnitNameValidateMessage, setShowUnitNameValidateMessage] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [listMaterialCategory, setListMaterialCategory] = useState([]);
  const [listDataUnitConversion, setListDataUnitConversion] = useState([]);
  const [disableAllBranches, setDisableAllBranches] = useState(false);

  const pageData = {
    addSuccess: t("messages.isCreatedSuccessfully"),
    material: t("material.material"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnUpload: t("button.upload"),
    addMaterial: t("material.addMaterial"),
    generalInformation: t("material.generalInformation"),
    name: t("material.name"),
    pleaseEnterMaterialName: t("material.pleaseEnterMaterialName"),
    maxLengthMaterialName: 255,
    description: t("form.description"),
    maximum2000Characters: t("form.maximum2000Characters"),
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
    unitSelectPlaceholder: t("productManagement.unit.unitSelectPlaceholder"),
    unitNamePlaceholder: t("productManagement.unit.unitNamePlaceholder"),
    pleaseSelectUnit: t("productManagement.unit.pleaseSelectUnit"),
    pleaseSelectBaseUnit: t("productManagement.unit.pleaseSelectBaseUnit"),
    btnAddImportUnit: t("productManagement.unitConversion.btnAddImportUnit"),
    currentCostPerUnit: t("material.currentCostPerUnit"),
    tooltipCostPerUnit: t("material.tooltipCostPerUnit"),
    btnAddNewUnit: t("productManagement.unit.btnAddNewUnit"),
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
      cosPerUnitPlaceholder: t("material.inventory.cosPerUnitPlaceholder"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    allBranch: t("productCategory.branch.all"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    goBack: t("material.goBack"),
    addNew: t("material.addNew"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("material.addFromUrl"),
      uploadImage: t("material.addFile"),
    },
  };

  useEffect(() => {
    fetchUnits();
    setFormValues();
    fetchBranches();
    fetchMaterialCategory();
  }, []);

  const fetchBranches = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      if (res && res?.branchs?.length > 0) {
        setBranches(res.branchs);
      }
    });
  };

  const fetchUnits = () => {
    unitDataService.getUnitsAsync().then((res) => {
      if (res.units) {
        setUnits([...res.units]);
      }
    });
  };

  const fetchMaterialCategory = () => {
    materialCategoryDataService.getAllMaterialCategoriesAsync().then((res) => {
      if (res.materialCategories) {
        setListMaterialCategory(res.materialCategories);
      }
    });
  };

  /// Init form value
  const setFormValues = (material) => {
    form.setFieldsValue({
      name: material?.name,
      description: material?.description,
      category: material?.category,
      unitId: material?.unitId,
      hasExpiryDate: material?.hasExpiryDate ?? false,
    });
    if (material?.imageUrl) {
      setImageUrl(material?.imageUrl);
    }
  };

  const onGoBack = () => {
    props.history.push("/inventory/material");
  };

  const onChangeImage = (file) => {
    setSelectedImage(file);
  };

  const onAddNewMaterial = (e) => {
    const event = () => {
      form
        .validateFields()
        .then(async (values) => {
          const req = {
            ...values,
            unitConversions: listDataUnitConversion,
            logo: selectedImage?.url,
          };

          materialDataService.createMaterialManagementAsync(req).then((res) => {
            if (res) {
              onGoBack();
              message.success(`${pageData.material} ${pageData.addSuccess}`);
            }
          });
        })
        .catch((errors) => {
          if (!branches?.length > 0) {
            form.setFields([
              {
                name: ["tmpBranchIds"],
                errors: [pageData.inventory.branchValidateMessage],
              },
            ]);
          }
        });
    };
    preventMultipleClick(e, event);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      onGoBack();
    }, 100);
  };

  const onSelectAllBranches = (event) => {
    let isChecked = event.target.checked;
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
        setSelectedUnit(unit);
      }
    });
  };

  const onSelectBranchesInventory = (values) => {
    const listBranch = branches.filter((b) => values.find((v) => v === b.id));
    setSelectedBranches(listBranch);
    if (values && values.length > 0) {
      let formValues = form.getFieldsValue();
      let branches = [];
      listBranch.forEach((branch, index) => {
        branches.push({
          branchId: branch.id,
          position: index + 1,
        });
      });

      /// Update old values
      if (formValues?.branches && formValues.branches.length > 0) {
        formValues?.branches.forEach((item) => {
          let branch = branches.find((b) => b.branchId === item.branchId);
          if (branch) {
            branch.quantity = item.quantity;
          }
        });
      }
      form.setFieldsValue({ ...formValues, branches });
    }
  };

  const renderSelectBaseUnit = (units) => {
    return (
      <FnbSelectSingle
        onChange={(unitId) => {
          const unit = units.find((u) => u.id === unitId);
          setSelectedUnit(unit);
          setListDataUnitConversion([]);
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

  const renderBaseUnitLabel = () => {
    const text = selectedUnit ? `${getCurrency()}/${selectedUnit?.name}` : "--";
    return text;
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

  const renderPricing = () => {
    return (
      <>
        <Card className="fnb-card mt-32">
          <div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div className="d-flex">
                  <div className="label-pricing">
                    <h3 className="label-information">{pageData.pricing}</h3>
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div className="d-flex">
                  <h4 className="fnb-form-label mt-22">{pageData.currentCostPerUnit} </h4>
                  <Tooltip placement="topLeft" title={renderToolTipCostPerUnit()}>
                    <span className="ml-18 mt-22">
                      <ExclamationIcon />
                    </span>
                  </Tooltip>
                </div>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item name="costPerUnit">
                  <InputNumber
                    className="w-100 fnb-input-number"
                    placeholder={pageData.inventory.cosPerUnitPlaceholder}
                    min={1}
                    max={MaximumNumber}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter={renderBaseUnitLabel()}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="label-pricing">
              <h4 className="fnb-form-label mt-40">
                {pageData.baseUnit}
                <span className="text-danger">*</span>
              </h4>
            </div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name="unitId"
                  rules={[
                    {
                      required: true,
                      message: pageData.pleaseSelectBaseUnit,
                    },
                  ]}
                >
                  {renderSelectBaseUnit(units)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <FnbAddNewButton
                  className="btn-add-import-unit"
                  onClick={() => onShowFormUnitConversion()}
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
                <Input maxLength={20} className="fnb-input" placeholder={pageData.inventory.skuPlaceholder}></Input>
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
                  placeholder={pageData.inventory.minQuantityPlaceholder}
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
            <Checkbox onChange={(event) => onSelectAllBranches(event)}>{pageData.allBranch}</Checkbox>
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
              <Form.Item name="tmpBranchIds">
                <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
              </Form.Item>
            </Col>
          </Row>
          <div className="form-edit-material-inventory-scroll">
            {selectedBranches?.map((item, index) => renderBranchAndQuantity(item, index))}
          </div>
        </Card>
      </>
    );
  };

  const renderBranchAndQuantity = (branch, index) => {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
    );
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const onShowFormUnitConversion = () => {
    const formValues = form.getFieldsValue();
    const { unitId } = formValues;
    if (unitId && unitConversionComponentRef && unitConversionComponentRef.current) {
      const unitConversionComponentModel = {
        unitId: unitId,
        baseUnitName: selectedUnit?.name,
        unitConversions: listDataUnitConversion,
      };
      unitConversionComponentRef.current.set(unitConversionComponentModel);
      unitConversionComponentRef.current.open();
    } else {
      message.error(pageData.pleaseSelectBaseUnit);
    }
  };

  return (
    <>
      <Form form={form} onFieldsChange={() => setIsChangeForm(true)} autoComplete="off" className="material-form">
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.addMaterial} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <FnbAddNewButton
                      onClick={(e) => onAddNewMaterial(e)}
                      className="float-right"
                      type="primary"
                      text={pageData.addNew}
                    />
                  ),
                  permission: PermissionKeys.CREATE_MATERIAL,
                },
                {
                  action: (
                    <button className="action-cancel" onClick={() => onCancel()}>
                      {pageData.btnCancel}
                    </button>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>

        <Row>
          <div className="w-100">
            <Card className="fnb-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <h3 className="label-information mt-10">{pageData.generalInformation}</h3>
                    <h4 className="fnb-form-label mt-32">
                      {pageData.name}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: pageData.pleaseEnterMaterialName,
                        },
                        {
                          type: "string",
                          max: pageData.maxLengthMaterialName,
                        },
                      ]}
                    >
                      <Input className="fnb-input-with-count" showCount maxLength={255} />
                    </Form.Item>
                  </div>
                  <div className="mt-40">
                    <h4 className="fnb-form-label">{pageData.description}</h4>
                    <Form.Item name="description">
                      <TextArea
                        className="fnb-text-area-with-count no-resize material-description-box"
                        placeholder={pageData.maximum2000Characters}
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
                      <Row className={`non-image ml-24 mt-32 ${selectedImage !== null ? "have-image" : ""}`}>
                        <Col span={24} className={`image-product ${selectedImage !== null ? "justify-left" : ""}`}>
                          <div className="d-flex">
                            <FnbUploadImageComponent
                              buttonText={pageData.upload.uploadImage}
                              onChange={onChangeImage}
                            />
                            <a className="upload-image-url" hidden={selectedImage !== null ? true : false}>
                              {pageData.upload.addFromUrl}
                            </a>
                          </div>
                        </Col>
                        <Col span={24} className="text-non-image" hidden={selectedImage !== null ? true : false}>
                          <Text disabled>{pageData.media.textNonImage}</Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
            {renderPricing()}
            {renderInventory()}
          </div>
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
