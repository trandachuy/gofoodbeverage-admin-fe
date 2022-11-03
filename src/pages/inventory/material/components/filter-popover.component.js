import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import "./filter-popover.component.scss";

export const FilterPopover = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { categories, branches, units } = props;

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const defaultValue = "";
  const filterTypes = {
    branch: 'branchId',
    category: 'materialCategoryId',
    unit: 'unitId',
    status: 'isActive'
  }

  useEffect(() => {
    let countBranch = selectedBranchId !== "" ? 1 : 0;
    let countCategory = selectedCategoryId !== "" ? 1 : 0;
    let countUnit = selectedUnitId !== "" ? 1 : 0;
    let countStatus = selectedStatus !== "" ? 1 : 0;

    const filterOptions = {
      unitId: selectedUnitId,
      branchId: selectedBranchId,
      materialCategoryId: selectedCategoryId,
      isActive: selectedStatus,
      count: countUnit + countBranch + countCategory + countStatus,
    };
    props.fetchDataMaterials(filterOptions);
  }, [selectedBranchId, selectedCategoryId, selectedUnitId, selectedStatus])

  //#region PageData
  const pageData = {
    filter: {
      buttonResetFilter: t("button.resetData"),
      branch: {
        title: t("material.filter.branch.title"),
        all: t("material.filter.branch.all"),
        placeholder: t("material.filter.branch.placeholder"),
        specialOptionKey: null,
      },
      category: {
        title: t("material.filter.category.title"),
        all: t("material.filter.category.all"),
        placeholder: t("material.filter.category.placeholder"),
        specialOptionKey: null,
      },
      unit: {
        title: t("material.filter.unit.title"),
        all: t("material.filter.unit.all"),
        placeholder: t("material.filter.unit.placeholder"),
        specialOptionKey: null,
      },
      status: {
        title: t("material.filter.status.title"),
        all: t("material.filter.status.all"),
        active: t("material.filter.status.active"),
        inactive: t("material.filter.status.inactive"),
        specialOptionKey: null,
      },
    },
  };
  //#endregion

  React.useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    clear() {
      clearFilter();
    },
  }));

  const clearFilter = () => {
    setSelectedBranchId(defaultValue);
    setSelectedCategoryId(defaultValue);
    setSelectedUnitId(defaultValue);
    setSelectedStatus(defaultValue);
  };

  const onFilterMaterial = (id, filterName) => {
    switch(filterName){
      case filterTypes.branch:
        setSelectedBranchId(id);
        break;
      case filterTypes.category:
        setSelectedCategoryId(id);
        break;
      case filterTypes.unit:
        setSelectedUnitId(id);
        break;
      default://status
        setSelectedStatus(id);
        break;
    }
  };

  return (
    <Card className="form-filter-popover">

      {/* BRANCH */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.branch.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
                className="form-select"
                showSearch
                onChange={(value) => onFilterMaterial(value, filterTypes.branch)}
                value={selectedBranchId}
                defaultValue={defaultValue}
                option={branches}
              />
        </Col>
      </Row>

      {/* CATEGORY */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.category.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
                className="form-select"
                showSearch
                onChange={(value) => onFilterMaterial(value, filterTypes.category)}
                value={selectedCategoryId}
                defaultValue={defaultValue}
                option={categories}
              />
        </Col>
      </Row>

      {/* UNIT */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.unit.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
                fixed
                className="form-select"
                showSearch
                onChange={(value) => onFilterMaterial(value, filterTypes.unit)}
                value={selectedUnitId}
                defaultValue={defaultValue}
                option={units}
              />
        </Col>
      </Row>

      {/* STATUS */}
      <Row className="mb-3 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.status.title}</span>
        </Col>
        <Col span={18}>
          <Radio.Group
            value={selectedStatus}
            defaultValue={defaultValue}
            buttonStyle="solid"
            onChange={(e) => onFilterMaterial(e.target.value, filterTypes.status)}
          >
            <Radio.Button value={defaultValue}>{selectedStatus==="" && <CheckOutlined className="check-icon"/>}{" "}{pageData.filter.status.all}</Radio.Button>
            <Radio.Button value={true}>{selectedStatus===true && <CheckOutlined className="check-icon" />}{" "}{pageData.filter.status.active}</Radio.Button>
            <Radio.Button value={false}>{selectedStatus===false && <CheckOutlined className="check-icon" />}{" "}{pageData.filter.status.inactive}</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* RESET BUTTON */}
      <Row className="row-reset-filter">
          <a onClick={clearFilter} className="reset-filter">
            {pageData.filter.buttonResetFilter}
          </a>
        </Row>
    </Card>
  );
});
