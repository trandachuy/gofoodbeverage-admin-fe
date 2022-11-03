import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTrashFillIcon } from "components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import TextDanger from "components/text-danger";
import { MaximumNumber, MinimumNumber } from "constants/default.constants";
import { PlusOrangeIcon } from "constants/icons.constants";
import unitDataService from "data-services/unit/unit-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const { forwardRef, useImperativeHandle } = React;
export const UnitConversionComponent = forwardRef((props, ref) => {
  const initUnitConversion = {
    unitId: null,
    capacity: null,
  };

  const [t] = useTranslation();
  const { onComplete } = props;

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentData, setCurrentData] = useState({
    unitId: null,
    baseUnitName: "N/A",
    unitConversions: [],
  });
  const [units, setUnits] = useState([]);
  const [newUnitName, setNewUnitName] = useState(null);
  const [showUnitNameValidateMessage, setShowUnitNameValidateMessage] = useState(false);

  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAdd: t("button.add"),
    unitConversion: {
      title: t("productManagement.unitConversion.title"),
      importUnit: t("productManagement.unitConversion.importUnit"),
      importUnitValidateMessage: t("productManagement.unitConversion.importUnitValidateMessage"),
      capacity: t("productManagement.unitConversion.capacity"),
      enterCapacity: t("productManagement.unitConversion.enterCapacity"),
      capacityValidateMessage: t("productManagement.unitConversion.capacityValidateMessage"),
      createUnitConversionSuccess: t("productManagement.unitConversion.createUnitConversionSuccess"),
      unitConversionExisted: t("productManagement.unitConversion.unitConversionExisted"),
      btnAddNewImportUnit: t("productManagement.unitConversion.btnAddNewImportUnit"),
    },
    unit: {
      unitNamePlaceholder: t("productManagement.unit.unitNamePlaceholder"),
      unitSelectPlaceholder: t("productManagement.unit.unitSelectPlaceholder"),
      unitNameValidateMessage: t("productManagement.unit.unitNameValidateMessage"),
      btnAddNewUnit: t("productManagement.unit.btnAddNewUnit"),
      enterName: t("productManagement.unit.enterName"),
    },
  };

  useImperativeHandle(ref, () => ({
    open() {
      fetchUnits();
      setVisible(true);
    },
    close() {
      setVisible(false);
    },
    set(unitConversionComponentModel) {
      const { unitId, baseUnitName, unitConversions } = unitConversionComponentModel;
      setFormValues(unitConversions);
      setCurrentData({
        ...currentData,
        unitId,
        baseUnitName,
        unitConversions,
      });
    },
  }));

  useEffect(() => {
    fetchUnits();
  }, [currentData?.unitId]);

  const setFormValues = (unitConversions) => {
    /// Convert unitConversions to unitConversionsForm
    var unitConversionModels = unitConversions?.map((i) => {
      return {
        ...i,
        id: i.id,
        unitId: i.unitId,
        capacity: i.capacity,
      };
    });

    form.setFieldsValue({ unitConversions: unitConversionModels });
    setCurrentData({ ...currentData, unitConversions: unitConversionModels });
  };

  const onAddNewImportUnit = () => {
    form.validateFields().then((values) => {
      let listUnitConversions = [...currentData.unitConversions];
      if (values.unitConversions) {
        listUnitConversions = values.unitConversions;
      }
      listUnitConversions.push(initUnitConversion);
      setCurrentData({ ...currentData, unitConversions: listUnitConversions });
    });
  };

  const onRemoveImportUnit = (index) => {
    let listUnitConversions = [...currentData.unitConversions];
    listUnitConversions.splice(index, 1);
    updateUnitConversions(listUnitConversions);
  };

  const updateUnitConversions = (listUnitConversions) => {
    form.setFieldsValue({ unitConversions: listUnitConversions });
    setCurrentData({ ...currentData, unitConversions: listUnitConversions });
  };

  const onChangeImportUnit = () => {
    let values = form.getFieldValue();
    if (values.unitConversions) {
      updateUnitConversions(values.unitConversions);
    }
  };

  const fetchUnits = () => {
    unitDataService.getUnitsAsync().then((res) => {
      if (res.units) {
        let unitList = res.units?.filter((item) => item?.id !== currentData?.unitId);
        setUnits(unitList);
      }
    });
  };

  const onAddNewUnit = (index) => {
    if (!newUnitName) {
      setShowUnitNameValidateMessage(false);
      return;
    }
    unitDataService.createUnitAsync({ name: newUnitName }).then((unit) => {
      if (unit) {
        fetchUnits();
        let values = form.getFieldValue();
        if (values.unitConversions) {
          let record = values.unitConversions[index];
          record.unitId = unit.id;
          updateUnitConversions(values.unitConversions);
        }
        setNewUnitName(null);
      }
    });
  };

  const onSelectUnit = () => {
    let values = form.getFieldValue();
    let { unitConversions } = values;
    updateUnitConversions(unitConversions);
  };

  const renderSelectUnits = (units, index) => {
    return (
      <FnbSelectSingle
        fixed
        onSelect={(e) => onSelectUnit(e, index)}
        className="w-315"
        placeholder={pageData.unit.unitSelectPlaceholder}
        dropdownRender={(menu) => (
          <>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Input
                  className="fnb-input mt-12 ml-8 input-unit"
                  value={newUnitName}
                  allowClear="true"
                  onPressEnter={onAddNewUnit}
                  maxLength={50}
                  placeholder={pageData.unit.enterName}
                  onChange={(e) => {
                    setNewUnitName(e.target.value);
                    // setShowUnitNameValidateMessage(false);
                  }}
                />
                {/* <TextDanger
                  visible={showUnitNameValidateMessage}
                  text={pageData.unit.unitNameValidateMessage}
                /> */}
              </Col>
              <Col span={12}>
                <FnbAddNewButton
                  onClick={() => onAddNewUnit(index)}
                  className="mw-0 mt-12 mr-18 btn-add-unit"
                  type="primary"
                  text={pageData.unit.btnAddNewUnit}
                />
              </Col>
            </Row>
            <div className="mt-18">{menu}</div>
          </>
        )}
        option={units?.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
      />
    );
  };

  ///
  const onFinish = (values) => {
    setVisible(false);
    if (onComplete) {
      onComplete(values);
    }

    return;
    // const error = values?.unitConversions.find((item) => item.message !== undefined && item.message !== null);
    // if (error) return;

    // if (props.functions) {
    //   //Update
    //   let dataValue = [...values.unitConversions?.map((item) => ({ ...item, materialId: param?.id }))];
    //   unitConversionDataService.updateUnitConversionsAsync({ unitConversions: dataValue }).then((res) => {});
    // } else {
    //   //Create
    //   dataUnitConversion(values);
    // }
    // setHiddenUnitConversion(true);
    // onCancel();
  };

  return (
    <Modal
      className="modal-unit-conversion"
      width={800}
      title={pageData.unitConversion.title}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      closeIcon
    >
      <div className="form-import-unit">
        <div className="unit-conversion-badge">
          <p className="unit-conversion-text float-left">{pageData.unitConversion.title}</p>
          <Button
            icon={<PlusOrangeIcon className="icon-add-new-import-unit" />}
            onClick={() => onAddNewImportUnit()}
            className="btn-add-new-import-unit float-right"
          >
            {pageData.unitConversion.btnAddNewImportUnit}
          </Button>
        </div>
        <Form className="mt-4" name="basic" autoComplete="off" form={form} onFinish={onFinish}>
          <div className="import-unit-selector">
            {currentData?.unitConversions?.map((unitConversion, index) => {
              return (
                <Row key={index}>
                  <Col span={11} className="col-unit">
                    <h4 className="fnb-form-label mt-32">
                      {pageData.unitConversion.importUnit}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item noStyle name={["unitConversions", index, "id"]}>
                      <Input type="hidden"></Input>
                    </Form.Item>
                    <Form.Item noStyle name={["unitConversions", index, "materialId"]}>
                      <Input type="hidden"></Input>
                    </Form.Item>
                    <Form.Item
                      className="mb-0"
                      name={["unitConversions", index, "unitId"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.unitConversion.importUnitValidateMessage,
                        },
                      ]}
                    >
                      {renderSelectUnits(units, index)}
                    </Form.Item>
                    <Form.Item noStyle name={["unitConversions", index, "message"]}>
                      <Input type="hidden"></Input>
                    </Form.Item>
                    <TextDanger
                      visible={unitConversion?.message !== "" && unitConversion?.message !== undefined}
                      text={pageData.unitConversion.unitConversionExisted}
                    />
                    <div className="mb-2"></div>
                  </Col>
                  <Col span={13}>
                    <Row>
                      <Col span={19}>
                        <h4 className="fnb-form-label mt-32">
                          {pageData.unitConversion.capacity}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name={["unitConversions", index, "capacity"]}
                          rules={[
                            {
                              required: true,
                              message: pageData.unitConversion.capacityValidateMessage,
                            },
                          ]}
                        >
                          <InputNumber
                            className="fnb-input-number w-315"
                            onChange={onChangeImportUnit}
                            defaultValue={unitConversion.capacity}
                            placeholder={pageData.unitConversion.enterCapacity}
                            min={MinimumNumber}
                            max={MaximumNumber}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Row>
                          <Col span={15}>
                            <div className="base-unit-text text-center">
                              <span className="fnb-form-label">{currentData?.baseUnitName}</span>
                            </div>
                          </Col>
                          <Col span={9}>
                            <div
                              className="icon-delete-unit-conversion text-right"
                              onClick={() => onRemoveImportUnit(index)}
                            >
                              <FnbTrashFillIcon />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </div>
          <Row className="mt-24 mb-8 justify-content-center">
            <Button key="back" onClick={() => setVisible(false)} className="mr-3 fnb-cancel-button">
              {pageData.btnCancel}
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              disabled={!currentData?.unitConversions || currentData?.unitConversions?.length === 0}
            >
              {pageData.btnAdd}
            </Button>
          </Row>
        </Form>
      </div>
    </Modal>
  );
});
