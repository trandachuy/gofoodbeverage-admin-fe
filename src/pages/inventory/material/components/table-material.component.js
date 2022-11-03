import { Card, Col, Form, Input, message, Row, Space, Tooltip } from "antd";
import { BadgeStatus } from "components/badge-status";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { tableSettings } from "constants/default.constants";
import { GoodsIcon, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import branchDataService from "data-services/branch/branch-data.service";
import materialCategoryDataService from "data-services/material-category/material-category-data.service";
import materialDataService from "data-services/material/material-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import unitDataService from "data-services/unit/unit-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import languageService from "services/language/language.service";
import { formatNumber, formatTextNumber, getCurrency, hasPermission } from "utils/helpers";
import "../index.scss";
import DeleteMaterial from "./delete-material.component";
import { FilterPopover } from "./filter-popover.component";

const { forwardRef, useImperativeHandle } = React;
export const TableMaterial = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    /// Export this function to props with name exportFilter and param: data
    exportFilter(data) {
      exportMaterial(data);
    },
  }));
  const [t] = useTranslation();
  const history = useHistory();
  const pageData = {
    materialManagement: t("material.materialManagement"),
    searchPlaceholder: t("material.searchPlaceholder"),
    addNew: t("button.addNew"),
    import: t("button.import"),
    export: t("button.export"),
    filter: t("button.filter"),
    nameMaterial: t("material.name"),
    quantity: t("table.quantity"),
    unit: t("table.unit"),
    cost: t("table.cost"),
    sku: t("table.sku"),
    action: t("table.action"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteContent: t("messages.confirmDeleteContent"),
    notificationTitle: t("form.notificationTitle"),
    isDeletedSuccessfully: t("messages.isDeletedSuccessfully"),
    active: t("status.active"),
    inactive: t("status.inactive"),
    status: t("table.status"),
    tableShowingRecordMessage: t("material.tableShowingRecordMessage"),
    total: t("material.total"),
  };

  const filterPopoverRef = React.useRef();
  const [totalMaterial, setTotalMaterial] = useState(0);
  const [listMaterial, setListMaterial] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [selectedItems, setSelectedItems] = useState(0);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [countFilter, setCountFilter] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoMaterial, setInfoMaterial] = useState({});
  const [titleModal, setTitleModal] = useState({});
  const [exportFilter, setExportFilter] = useState({});
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showPopover, setShowPopover] = useState(true);
  const [totalCostMaterials, setTotalCostMaterials] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    initDataTableMaterials(tableSettings.page, tableSettings.pageSize, keySearch);
  }, []);

  const initDataTableMaterials = (pageNumber, pageSize, keySearch) => {
    /// get list material
    materialDataService.getMaterialManagementsAsync(pageNumber, pageSize, keySearch).then((res) => {
      let materials = mappingToDataTableMaterials(res.materials);
      setListMaterial(materials);
      setTotalMaterial(res.total);
      setTotalCostMaterials(res.totalCostAllMaterial);
      setCurrentPageNumber(pageNumber);
    });
  };

  const onChangePage = (page, pageSize) => {
    initDataTableMaterials(page, pageSize, "");
  };

  const mappingToDataTableMaterials = (materials) => {
    return materials?.map((i, index) => {
      return {
        ...i,
        id: i.id,
        key: i.id,
        name: i.name,
        description: i.description,
        sku: i.sku,
        quantity: i.quantity ? i.quantity : 0,
        unit: i.unitName,
        cost: i.costPerUnit ? i.costPerUnit : 0,
        isActive: i.isActive,
      };
    });
  };

  const onEditItem = (id) => {
    history.push(`/inventory/material/edit-material/${id}`);
  };

  const onDeleteItem = async (materialId) => {
    await purchaseOrderDataService.getPurchaseOrderByMaterialIdAsync(materialId).then((res) => {
      if (res.isOpenPurchaseOrder) {
        setTitleModal(pageData.notificationTitle);
      } else {
        setTitleModal(pageData.confirmDelete);
      }
      setInfoMaterial(res);
      setIsModalVisible(true);
    });
  };

  const onDelete = async (id, name) => {
    await materialDataService.deleteMaterialManagementAsync(id).then((res) => {
      if (res) {
        setIsModalVisible(false);
        initDataTableMaterials(tableSettings.page, tableSettings.pageSize, keySearch);
        message.success(`${name} ${pageData.isDeletedSuccessfully}`);

        // Recount selected items after delete
        const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id);
        if (newSelectedRowKeys) {
          setSelectedRowKeys(newSelectedRowKeys);
        }
      }
    });
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.nameMaterial,
        dataIndex: "name",
        width: "40%",
        render: (_, record) => {
          let href = `/inventory/material/detail/${record.id}`;
          return (
            <>
              <Row className="table-img-box">
                <div>
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="product-name text-line-clamp-1">
                  <Link to={href}>{record.name}</Link>
                </div>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.sku,
        dataIndex: "sku",
        width: "10%",
      },
      {
        title: pageData.quantity,
        dataIndex: "quantity",
        width: "15%",
        align: "right",
        render: (value) => {
          return <span>{formatNumber(value)}</span>;
        },
      },
      {
        title: `${pageData.cost} (${getCurrency()})`,
        dataIndex: "cost",
        width: "15%",
        align: "right",
        render: (value) => {
          return <span>{formatNumber(value)}</span>;
        },
      },
      {
        title: pageData.unit,
        dataIndex: "unit",
        width: "10%",
        align: "center",
      },
      {
        title: pageData.status,
        dataIndex: "isActive",
        key: "isActive",
        width: "15%",
        align: "center",
        render: (_, record) => {
          return (
            <div className="material-status">
              <BadgeStatus isActive={record?.isActive} />
            </div>
          );
        },
      },

      {
        title: pageData.action,
        dataIndex: "action",
        align: "center",
        render: (_, record) => {
          return (
            <div className="action-column">
              <EditButtonComponent
                className="action-button-space"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_MATERIAL}
              />
              {hasPermission(PermissionKeys.DELETE_MATERIAL) && (
                <Space wrap>
                  <div className="fnb-table-action-icon">
                    <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                      <TrashFill className="icon-svg-hover" onClick={() => onDeleteItem(record?.id)} />
                    </Tooltip>
                  </div>
                </Space>
              )}
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const onSearch = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        initDataTableMaterials(tableSettings.page, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }

    var resCategory = await materialCategoryDataService.getAllMaterialCategoriesAsync();
    if (resCategory) {
      const allCategoryOption = {
        id: "",
        name: t("material.filter.category.all"),
      };
      const categoryOptions = [allCategoryOption, ...resCategory.materialCategories];
      setMaterialCategories(categoryOptions);
    }

    var resBranch = await branchDataService.getAllBranchsAsync();
    if (resBranch) {
      const allBranchOption = {
        id: "",
        name: t("material.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...resBranch.branchs];
      setBranches(branchOptions);
    }

    var resUnit = await unitDataService.getUnitsAsync();
    if (resUnit) {
      const allUnitOption = {
        id: "",
        name: t("material.filter.unit.all"),
      };
      const unitOptions = [allUnitOption, ...resUnit.units];
      setUnits(unitOptions);
    }
  };

  const handleFilterMaterial = (data) => {
    let filter = {
      unitId: data?.unitId,
      branchId: data?.branchId,
      materialCategoryId: data?.materialCategoryId,
      isActive: data?.isActive,
    };
    setExportFilter(filter);

    materialDataService
      .getMaterialsByFilterAsync(
        tableSettings.page,
        tableSettings.pageSize,
        keySearch,
        data?.unitId,
        data?.branchId,
        data?.materialCategoryId,
        data?.isActive
      )
      .then((res) => {
        let materials = mappingToDataTableMaterials(res.materials);
        setListMaterial(materials);
        setTotalMaterial(res.total);
        setCountFilter(data?.count);
      });
  };

  const exportMaterial = (storeId) => {
    let languageCode = languageService.getLang();
    const link = document.createElement("a");
    link.href = `/${
      process.env.REACT_APP_API
    }material/export-material?languageCode=${languageCode}&&storeId=${storeId}&keySearch=${keySearch}
    &unitId=${exportFilter?.unitId ? exportFilter?.unitId : ""}&branchId=${
      exportFilter?.branchId ? exportFilter?.branchId : ""
    }&materialCategoryId=${exportFilter?.materialCategoryId ? exportFilter?.materialCategoryId : ""}&isActive=${
      exportFilter?.isActive ? exportFilter?.isActive : ""
    }`;
    link.click();
  };

  const onClearFilter = (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setCountFilter(0);
    setShowPopover(false);
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterPopover
          fetchDataMaterials={handleFilterMaterial}
          categories={materialCategories}
          branches={branches}
          units={units}
        />
      )
    );
  };

  return (
    <>
      <Form>
        <Card className="w-100 fnb-card-full">
          <Row className="total-cost-amount-row">
            <div className="total-cost-amount-div">
              <Input
                maxLength={10}
                className="fnb-search-input total-cost-amount"
                allowClear
                readOnly
                size="large"
                prefix={
                  <Space>
                    <GoodsIcon />
                    <span className="total-text">{pageData.total}</span>
                  </Space>
                }
                value={`${formatTextNumber(totalCostMaterials)} (${getCurrency()})`}
              />
            </div>
            <Col span={24}>
              <FnbTable
                className="mt-4"
                columns={getColumns()}
                pageSize={tableSettings.pageSize}
                dataSource={listMaterial}
                currentPageNumber={currentPageNumber}
                total={totalMaterial}
                onChangePage={onChangePage}
                editPermission={PermissionKeys.EDIT_MATERIAL}
                deletePermission={PermissionKeys.DELETE_MATERIAL}
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectedRowKeysChange,
                  columnWidth: 40,
                }}
                search={{
                  placeholder: pageData.searchPlaceholder,
                  onChange: onSearch,
                }}
                filter={{
                  onClickFilterButton: onClickFilterButton,
                  totalFilterSelected: countFilter,
                  onClearFilter: onClearFilter,
                  buttonTitle: pageData.filter,
                  component: filterComponent(),
                }}
                footerMessage={pageData.tableShowingRecordMessage}
              />

              <DeleteMaterial
                isModalVisible={isModalVisible}
                infoMaterial={infoMaterial}
                titleModal={titleModal}
                handleCancel={() => setIsModalVisible(false)}
                onDelete={onDelete}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
});
