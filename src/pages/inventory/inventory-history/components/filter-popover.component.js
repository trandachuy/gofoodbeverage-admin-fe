import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const FilterPopover = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { actions, branches, materials } = props;

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const defaultValue = "";
  const filterTypes = {
    branch: "branch",
    action: "action",
    material: "material",
    status: "isActive",
  };

  useEffect(() => {
    let countBranch = selectedBranchId !== "" ? 1 : 0;
    let countAction = selectedAction !== "" ? 1 : 0;
    let countMaterial = selectedMaterialId !== "" ? 1 : 0;
    let countStatus = selectedStatus !== "" ? 1 : 0;

    const filterOptions = {
      materialId: selectedMaterialId,
      branchId: selectedBranchId,
      action: selectedAction,
      isActive: selectedStatus,
      count: countMaterial + countBranch + countAction + countStatus,
    };
    props.fetchDataMaterials(filterOptions);
  }, [selectedBranchId, selectedAction, selectedMaterialId, selectedStatus]);

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
      action: {
        title: t("inventoryHistory.action"),
        all: t("inventoryHistory.allAction"),
        specialOptionKey: null,
      },
      material: {
        title: t("material.material"),
        all: t("inventoryHistory.allMaterials"),
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
    setSelectedAction(defaultValue);
    setSelectedMaterialId(defaultValue);
    setSelectedStatus(defaultValue);
  };

  const onFilterMaterial = (id, filterName) => {
    switch (filterName) {
      case filterTypes.branch:
        setSelectedBranchId(id);
        break;
      case filterTypes.action:
        setSelectedAction(id);
        break;
      case filterTypes.material:
        setSelectedMaterialId(id);
        break;
      default: //status
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

      {/* ACTION */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.action.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
            className="form-select"
            showSearch
            onChange={(value) => onFilterMaterial(value, filterTypes.action)}
            value={selectedAction}
            defaultValue={defaultValue}
            option={actions}
          />
        </Col>
      </Row>

      {/* MATERIAL */}
      <Row className="mb-2 popover-filter-row">
        <Col span={6}>
          <span>{pageData.filter.material.title}</span>
        </Col>
        <Col span={18}>
          <FnbSelectSingle
            fixed
            className="form-select"
            showSearch
            onChange={(value) => onFilterMaterial(value, filterTypes.material)}
            value={selectedMaterialId}
            defaultValue={defaultValue}
            option={materials}
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
            <Radio.Button value={defaultValue}>
              {selectedStatus === "" && <CheckOutlined className="check-icon" />} {pageData.filter.status.all}
            </Radio.Button>
            <Radio.Button value={true}>
              {selectedStatus === true && <CheckOutlined className="check-icon" />} {pageData.filter.status.active}
            </Radio.Button>
            <Radio.Button value={false}>
              {selectedStatus === false && <CheckOutlined className="check-icon" />} {pageData.filter.status.inactive}
            </Radio.Button>
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
