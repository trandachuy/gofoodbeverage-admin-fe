import { Card, Col, Form, Popover, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import { ArrowDropDownIcon } from "constants/icons.constants";
import { ListInventoryHistoryAction } from "constants/inventory-history-action.constants";
import { OptionDateTime } from "constants/option-date.constants";
import { DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import inventoryHistoryDataService from "data-services/inventory/inventory-data.service";
import materialDataService from "data-services/material/material-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { executeAfter } from "utils/helpers";
import { FilterPopover } from "./filter-popover.component";
import "./index.scss";

export default function TableInventoryHistoryComponent(props) {
  const [t] = useTranslation();
  const pageData = {
    btnFilter: t("button.filter"),
    table: {
      searchPlaceholder: t("inventoryHistory.searchPlaceHolder"),
      time: t("order.time"),
      material: t("material.material"),
      branch: t("purchaseOrder.branch"),
      unit: t("table.unit"),
      change: t("inventoryHistory.change"),
      remain: t("inventoryHistory.remain"),
      action: t("inventoryHistory.action"),
      note: t("form.note"),
      reference: t("inventoryHistory.reference"),
    },
    date: {
      yesterday: "dashboard.compareDate.yesterday",
      previousDay: "dashboard.compareDate.previousDay",
      lastWeek: "dashboard.compareDate.lastWeek",
      previousWeek: "dashboard.compareDate.previousWeek",
      lastMonth: "dashboard.compareDate.lastMonth",
      previousMonth: "dashboard.compareDate.previousMonth",
      lastYear: "dashboard.compareDate.lastYear",
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    today: t("optionDatetime.today"),
    yesterday: "dashboard.compareDate.yesterday",
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPopover, setShowPopover] = useState(true);
  const [countFilter, setCountFilter] = useState(0);
  const [branches, setBranches] = useState([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().toDate().toLocaleDateString("en-US"),
    endDate: moment().toDate().toLocaleDateString("en-US"),
  });
  const [dataFilter, setDataFilter] = useState({});
  const [keySearchFilter, setKeySearchFilter] = useState("");
  const filterPopoverRef = React.useRef();
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.yesterday);

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.time,
        dataIndex: "time",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  <span className="inventory-history-time">{record?.time?.format(DateFormat.HH_MM)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={24}>{record?.time?.format(DateFormat.DD_MM_YYYY)}</Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.table.material,
        dataIndex: "materialName",
        width: "20%",
        className: "table-text-supplier-overflow",
        render: (_, record) => {
          return (
            <div>
              <Link to={`/inventory/material/detail/${record?.materialId}`}>
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: record.materialName }}
                  color="#50429B"
                >
                  <a> {record.materialName}</a>
                </Paragraph>
              </Link>
            </div>
          );
        },
      },
      {
        title: pageData.table.branch,
        dataIndex: "branchName",
        width: "20%",
        className: "table-text-branch-overflow",
      },
      {
        title: pageData.table.unit,
        dataIndex: "baseUnitName",
        width: "15%",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={24}>
                  {record?.baseUnitName}
                  <Popover
                    placement="bottomLeft"
                    content={record?.unitConversion?.map((unit, index) => {
                      return (
                        <>
                          <Row
                            className="inventory-history-tooltip"
                            style={index % 2 === 0 ? { background: "#F9F8FF" } : { background: "#FFFFFF" }}
                          >
                            <Col span={24}>
                              <div className="unit"> {unit?.unitName}</div>
                              <div className="quantity"> {unit?.quantity}</div>
                            </Col>
                          </Row>
                        </>
                      );
                    })}
                    overlayClassName="inventory-history-tooltip"
                    trigger={["click"]}
                  >
                    <ArrowDropDownIcon width={14} height={14} className="inventory-history-tooltip-arrow-icon" />
                  </Popover>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.table.change,
        dataIndex: "change",
        width: "10%",
      },
      {
        title: pageData.table.remain,
        dataIndex: "newQuantity",
        width: "10%",
        className: "table-text-createdBy-overflow",
      },
      {
        title: pageData.table.action,
        dataIndex: "action",
        width: "15%",
        render: (_, record) => {
          return (
            <Row>
              <div
                className="inventory-history-action"
                style={{ color: record?.actionColor, backgroundColor: record?.actionBackgroundColor }}
              >
                {record?.action}
              </div>
            </Row>
          );
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(
        page,
        pageSize,
        keySearchFilter,
        dataFilter?.branchId,
        dataFilter?.action,
        dataFilter?.materialId,
        dataFilter?.isActive,
        selectedDate?.startDate,
        selectedDate?.endDate
      );
    },
    onSearch: async (keySearch) => {
      setKeySearchFilter(keySearch);
      executeAfter(500, async () => {
        await fetchDatableAsync(
          1,
          tableSettings.pageSize,
          keySearch,
          dataFilter?.branchId,
          dataFilter?.action,
          dataFilter?.materialId,
          dataFilter?.isActive,
          selectedDate?.startDate,
          selectedDate?.endDate
        );
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (
    pageNumber,
    pageSize,
    keySearch,
    branchId,
    materialCategoryId,
    unitId,
    isActive,
    startDate,
    endDate
  ) => {
    const response = await inventoryHistoryDataService.getInventoryHistoryManagementsAsync(
      pageNumber,
      pageSize,
      keySearch,
      branchId ?? "",
      materialCategoryId ?? "",
      unitId ?? "",
      isActive ?? "",
      startDate ?? "",
      endDate ?? ""
    );
    const data = response?.materialInventoryHistories.map((s) => mappingRecordToColumns(s));
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    setDataSource(data);
  };

  const mappingRecordToColumns = (item) => {
    return {
      oldQuantity: item?.oldQuantity,
      newQuantity: item?.newQuantity,
      reference: item?.reference,
      action: item?.action,
      note: item?.note,
      createdBy: item?.createdBy,
      time: moment.utc(item?.time).local(),
      materialName: item?.materialName,
      baseUnitName: item?.baseUnitName,
      branchName: item?.branchName,
      change:
        item?.newQuantity - item?.oldQuantity > 0
          ? `+${item?.newQuantity - item?.oldQuantity}`
          : item?.newQuantity - item?.oldQuantity,
      unitConversion: item?.unitConversion,
      materialId: item?.materialId,
      actionColor: item?.actionColor,
      actionBackgroundColor: item?.actionBackgroundColor,
    };
  };

  const getTableColumns = () => {
    return tableSettings.columns;
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterPopover
          fetchDataMaterials={handleFilter}
          actions={materialCategories}
          branches={branches}
          materials={units}
          ref={filterPopoverRef}
        />
      )
    );
  };

  const onClearFilter = (e) => {
    if (filterPopoverRef && filterPopoverRef.current) {
      filterPopoverRef.current.clear();
    }
    setCountFilter(0);
    setShowPopover(false);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      "",
      "",
      "",
      "",
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
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

    const allAction = {
      id: "",
      name: t("inventoryHistory.allAction"),
    };
    const allActionOptions = [allAction, ...ListInventoryHistoryAction];
    setMaterialCategories(allActionOptions);

    var resMaterial = await materialDataService.getAllMaterialsFilterAsync();
    if (resMaterial) {
      const allUnitOption = {
        id: "",
        name: t("inventoryHistory.allMaterials"),
      };
      const unitOptions = [allUnitOption, ...resMaterial.materials];
      setUnits(unitOptions);
    }
  };

  const handleFilter = (data) => {
    setCountFilter(data?.count);
    setDataFilter(data);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      data?.branchId,
      data?.action,
      data?.materialId,
      data?.isActive,
      selectedDate?.startDate,
      selectedDate?.endDate
    );
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    fetchDatableAsync(
      1,
      tableSettings.pageSize,
      keySearchFilter,
      dataFilter?.branchId,
      dataFilter?.action,
      dataFilter?.materialId,
      dataFilter?.isActive,
      date?.startDate,
      date?.endDate
    );
  };

  const onConditionCompare = (key) => {
    let titleConditionCompare = "";
    switch (key) {
      case OptionDateTime.today:
        titleConditionCompare = pageData.date.yesterday;
        break;
      case OptionDateTime.yesterday:
        titleConditionCompare = pageData.date.previousDay;
        break;
      case OptionDateTime.thisWeek:
        titleConditionCompare = pageData.date.lastWeek;
        break;
      case OptionDateTime.lastWeek:
        titleConditionCompare = pageData.date.previousWeek;
        break;
      case OptionDateTime.thisMonth:
        titleConditionCompare = pageData.date.lastMonth;
        break;
      case OptionDateTime.lastMonth:
        titleConditionCompare = pageData.date.previousMonth;
        break;
      case OptionDateTime.thisYear:
        titleConditionCompare = pageData.date.lastYear;
        break;
      default:
        break;
    }

    setTitleConditionCompare(titleConditionCompare);
  };

  return (
    <>
      <Form className="form-staff">
        <Card className="fnb-card-full">
          <Row className="form-staff inventory-history">
            <FnbTable
              className="mt-4 table-striped-rows"
              dataSource={dataSource}
              columns={getTableColumns()}
              pageSize={tableSettings.pageSize}
              pageNumber={currentPageNumber}
              total={totalRecords}
              onChangePage={tableSettings.onChangePage}
              numberRecordCurrent={numberRecordCurrent}
              search={{
                placeholder: pageData.table.searchPlaceholder,
                onChange: tableSettings.onSearch,
              }}
              filter={{
                onClickFilterButton: onClickFilterButton,
                totalFilterSelected: countFilter,
                onClearFilter: onClearFilter,
                buttonTitle: pageData.filter,
                component: filterComponent(),
              }}
              calendarComponent={{
                onSelectedDatePicker: onSelectedDatePicker,
                selectedDate: selectedDate,
                onConditionCompare: onConditionCompare,
              }}
            />
          </Row>
        </Card>
      </Form>
    </>
  );
}
