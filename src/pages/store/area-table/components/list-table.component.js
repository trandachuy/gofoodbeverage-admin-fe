import { Badge, Card, Col, message, Row } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbTable } from "components/fnb-table/fnb-table";
import { TableName } from "constants/areaTable.constants";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import areaTableDataService from "data-services/area-table/area-table-data.service";
import areaDataService from "data-services/area/area-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { randomGuid } from "utils/helpers";
import AddNewAreaTable from "./create-new-table.component";
import EditAreaTable from "./edit-table.component";

export default function TableManagement(props) {
  const [t] = useTranslation();
  const { storeBranchId } = props;
  const [listAreaTableManagement, setListAreaTableManagement] = useState([]);
  const [showAddAreaTable, setShowAddAreaTable] = useState(false);
  const [showUpdateAreaTable, setShowUpdateAreaTable] = useState(false);
  const [listArea, setListArea] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [listTable, setListTable] = useState([]);
  const editComponentRef = React.useRef(null);
  const addComponentRef = React.useRef(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const pageData = {
    areaName: t("areaTable.areaName"),
    tableName: t("areaTable.tableName"),
    slot: t("areaTable.slot"),
    status: t("areaTable.status"),
    action: t("table.action"),
    addNew: t("button.addNew"),
    active: t("areaTable.active"),
    inactive: t("areaTable.inactive"),
    btnFilter: t("button.filter"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    areaTableDeleteSuccess: t("areaTable.areaTableDeleteSuccess"),
    areaTableDeleteFail: t("areaTable.areaTableDeleteFail"),
  };

  useEffect(() => {
    async function fetchData() {
      await initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    }
    fetchData();
  }, [props.storeBranchId]);

  const initDataTableAreaTableManagement = async (pageNumber, pageSize, storeBranchId) => {
    if (storeBranchId && pageNumber && pageSize) {
      let res = await areaTableDataService.getAreaTableByBranchAsync(pageNumber, pageSize, storeBranchId, "");
      let areaTableManagements = mappingToDataTableAreaTableManagements(res.areaTables);
      setListAreaTableManagement(areaTableManagements);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingToDataTableAreaTableManagements = (areaTableManagements) => {
    return areaTableManagements?.map((item) => {
      return {
        id: item.id,
        areaName: item?.area?.name,
        tableName: item?.name,
        slot: item?.numberOfSeat,
        status: item?.isActive,
      };
    });
  };

  const onEditItem = (id) => {
    areaDataService.getAreasByBranchIdAsync(storeBranchId).then((res) => {
      setListArea(res.areas);
    });

    let request = {
      id: id,
      storeBranchId: storeBranchId,
    };

    areaTableDataService.getAreaTableByIdAsync(request).then((response) => {
      if (response) {
        const { areaTable } = response;
        editComponentRef.current({ ...areaTable });
        setShowUpdateAreaTable(true);
      }
    });
  };

  const getColumnAreaTables = () => {
    const columns = [
      {
        title: pageData.areaName,
        dataIndex: "areaName",
        key: "areaName",
        width: "30%",
      },
      {
        title: pageData.tableName,
        dataIndex: "tableName",
        key: "tableName",
        width: "30%",
      },
      {
        title: pageData.slot,
        dataIndex: "slot",
        key: "slot",
        width: "15%",
        align: "center",
      },
      {
        title: pageData.status,
        dataIndex: "status",
        key: "status",
        width: "15%",
        align: "center",
        render: (_, record) => (
          <>
            {record?.status ? (
              <Badge status="success" size="small" text={pageData.active} />
            ) : (
              <Badge status="default" size="small" text={pageData.inactive} />
            )}
          </>
        ),
      },
      {
        title: pageData.action,
        key: "action",
        align: "center",
        render: (_, record) => (
          <div className="action-column">
            <EditButtonComponent
              className="action-button-space"
              onClick={() => onEditItem(record?.id)}
              permission={PermissionKeys.EDIT_AREA_TABLE}
            />
            <DeleteConfirmComponent
              title={pageData.confirmDelete}
              content={formatDeleteMessage(record?.tableName)}
              okText={pageData.btnDelete}
              cancelText={pageData.btnIgnore}
              permission={PermissionKeys.DELETE_AREA_TABLE}
              onOk={() => handleDeleteItem(record.id)}
            />
          </div>
        ),
      },
    ];

    return columns;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const showAddAreaTableForm = async () => {
    await areaDataService.getAreasByBranchIdAsync(storeBranchId).then((res) => {
      setListArea(res.areas);
      let count = res.areas[0]?.areaTables?.length ?? 0;
      let table = {
        id: randomGuid(),
        name: `${TableName} ${count + 1}`,
        numberOfSeat: 0,
      };
      setSelectedArea(res.areas[0]?.id);
      setListTable([table]);
      setShowAddAreaTable(true);
      addComponentRef.current({ table });
      return table;
    });
  };

  const handleAddTableItem = () => {
    let area = listArea.find((area) => area.id === selectedArea);
    let count = listTable?.length + area?.areaTables?.length;
    let table = {
      id: randomGuid(),
      name: `${TableName} ${count + 1}`,
      numberOfSeat: null,
    };

    let newTable = [...listTable, table];
    setListTable(newTable);
    return newTable;
  };

  const onRemoveTableItem = (id) => {
    let listTableNew = listTable.filter((table) => table.id !== id);
    setListTable(listTableNew);
    return listTableNew;
  };

  const handleChangeArea = (areaId) => {
    let area = listArea.find((area) => area.id === areaId);
    let count = area?.areaTables?.length ?? 0;
    let table = {
      id: randomGuid(),
      name: `${TableName} ${count + 1}`,
      numberOfSeat: 0,
    };
    setSelectedArea(area.id);
    setListTable([table]);
    addComponentRef.current({ table });
  };

  const handleChangeNumberSeat = (tableId, value) => {
    listTable.map((table) => {
      if (table.id === tableId) {
        table.numberOfSeat = value;
      }
    });
  };

  const handleChangeTableName = (tableId, e) => {
    listTable.map((table) => {
      if (table.id === tableId) {
        table.name = e.target.value;
      }
    });
  };

  const onCancel = () => {
    initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    setShowAddAreaTable(false);
  };

  const onCancelUpdateForm = () => {
    initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
    setShowUpdateAreaTable(false);
  };

  const handleDeleteItem = async (id) => {
    var res = await areaTableDataService.deleteAreaTableByIdAsync(id);
    if (res) {
      message.success(pageData.areaTableDeleteSuccess);
    } else {
      message.error(pageData.areaTableDeleteFail);
    }
    await initDataTableAreaTableManagement(tableSettings.page, tableSettings.pageSize, storeBranchId);
  };

  return (
    <>
      <Card className="mt-3">
        <>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_AREA_TABLE}
            onClick={() => showAddAreaTableForm()}
            text={pageData.addNew}
          />

          <AddNewAreaTable
            t={t}
            areaTableDataService={areaTableDataService}
            isModalVisible={showAddAreaTable}
            onChangeArea={handleChangeArea}
            listArea={listArea}
            selectedArea={selectedArea}
            listTable={listTable}
            onCancel={onCancel}
            onRemoveTableItem={onRemoveTableItem}
            onAddTableItem={handleAddTableItem}
            onChangeNumberSeat={handleChangeNumberSeat}
            onChangeTableName={handleChangeTableName}
            func={addComponentRef}
          />
          <EditAreaTable
            t={t}
            areaTableDataService={areaTableDataService}
            isModalVisible={showUpdateAreaTable}
            listArea={listArea}
            listTable={listTable}
            storeBranchId={storeBranchId}
            onCancel={onCancelUpdateForm}
            func={editComponentRef}
          ></EditAreaTable>

          <div className="clearfix"></div>
          <div className="mt-4">
            <Row>
              <Col span={24}>
                <FnbTable
                  className="mt-4"
                  columns={getColumnAreaTables()}
                  pageSize={props.pageSize}
                  dataSource={listAreaTableManagement}
                  currentPageNumber={currentPageNumber}
                  total={props.total}
                  onChangePage={props.onChangePage}
                  editPermission={PermissionKeys.EDIT_PRODUCT}
                  deletePermission={PermissionKeys.DELETE_PRODUCT}
                />
              </Col>
            </Row>
          </div>
        </>
      </Card>
    </>
  );
}
