import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, message } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import AddNewArea from "./create-new-area.component";
import EditArea from "./edit-area.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { useTranslation } from "react-i18next";
import areaDataService from "data-services/area/area-data.service";
import { tableSettings } from "constants/default.constants";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";

export default function AreaManagement(props) {
  const [t] = useTranslation();
  const { storeBranchId } = props;

  const pageData = {
    no: t("table.no"),
    name: t("table.name"),
    description: t("form.description"),
    status: t("table.status"),
    action: t("table.action"),
    addNew: t("button.addNew"),
    active: t("status.active"),
    inactive: t("status.inactive"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    areaDeleteSuccess: t("area.areaDeleteSuccess"),
    areaDeleteFail: t("area.areaDeleteFail"),
  };

  const [listAreaManagement, setListAreaManagement] = useState([]);
  const [totalAreaManagement, setTotalAreaManagement] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showAddArea, setShowAddArea] = useState(false);
  const [showEditArea, setShowEditArea] = useState(false);
  const editComponentRef = React.useRef(null);

  useEffect(() => {
    async function fetchData() {
      await initDataTableAreaManagement(storeBranchId);
    }
    fetchData();
  }, [props.storeBranchId]);

  const initDataTableAreaManagement = async storeBranchId => {
    if (storeBranchId) {
      let res = await areaDataService.getAreaManagementByBranchIdAsync(
        storeBranchId,
        tableSettings.page,
        tableSettings.pageSize
      );
      let areas = mappingToDataTableAreaManagements(res.areas);
      setListAreaManagement(areas);
      setTotalAreaManagement(res.total);
    }
  };

  const mappingToDataTableAreaManagements = areaManagements => {
    return areaManagements?.map((i, index) => {
      return {
        id: i.id,
        no: index + 1,
        name: i.name,
        description: i?.description,
        isActive: i.isActive,
      };
    });
  };

  const showArea = async value => {
    setShowAddArea(value);
  };

  const onEditItem = record => {
    const { id } = record;
    editComponentRef.current(id);

    setShowEditArea(true);
  };

  const onChangePage = async () => {
    initDataTableAreaManagement(storeBranchId);
  };

  const onCancelAddNewArea = storeBranchId => {
    setShowAddArea(false);
    initDataTableAreaManagement(storeBranchId);
  };

  const onCancelEditItem = storeBranchId => {
    setShowEditArea(false);
    initDataTableAreaManagement(storeBranchId);
  };

  const getColumnAreas = () => {
    const columnAreas = [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        width: "10%",
        align: "center",
      },
      {
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "30%",
      },
      {
        title: pageData.description,
        dataIndex: "description",
        key: "description",
        width: "40%",
      },
      {
        title: pageData.status,
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (_, record) => {
          if (record.isActive) {
            return <Badge status="success" size="small" text={pageData.active} />;
          } else {
            return <Badge status="default" size="large" text={pageData.inactive} />;
          }
        },
      },
      {
        title: pageData.action,
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record) => (
          <div className="action-column">
            <EditButtonComponent
              className="action-button-space"
              onClick={() => onEditItem(record)}
              permission={PermissionKeys.EDIT_AREA_TABLE}
            />
            <DeleteConfirmComponent
              title={pageData.confirmDelete}
              content={formatDeleteMessage(record?.name)}
              okText={pageData.btnDelete}
              cancelText={pageData.btnIgnore}
              permission={PermissionKeys.DELETE_AREA_TABLE}
              onOk={() => handleDeleteItem(record.id)}
            />
          </div>
        ),
      },
    ];

    return columnAreas;
  };

  const handleDeleteItem = async id => {
    await areaDataService.deleteAreaByIdAsync(id).then(res => {
      if (res) {
        message.success(pageData.areaDeleteSuccess);
      } else {
        message.error(pageData.areaDeleteFail);
      }
    });
    await initDataTableAreaManagement(storeBranchId);
  };

  // Insert the name into the message
  const formatDeleteMessage = name => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  return (
    <>
      <Card className="mt-3 fnb-card-full">
        <>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_AREA_TABLE}
            onClick={() => showArea(true)}
            text={pageData.addNew}
          />

          <div className="clearfix"></div>
          <div className="mt-4">
            <Row>
              <Col span={24}>
                <FnbTable
                  className="mt-4"
                  columns={getColumnAreas()}
                  pageSize={tableSettings.pageSize}
                  dataSource={listAreaManagement}
                  currentPageNumber={currentPageNumber}
                  total={totalAreaManagement}
                  onChangePage={onChangePage}
                  editPermission={PermissionKeys.EDIT_AREA_TABLE}
                  deletePermission={PermissionKeys.DELETE_AREA_TABLE}
                />
              </Col>
            </Row>
          </div>
        </>
      </Card>
      <AddNewArea isModalVisible={showAddArea} handleCancel={onCancelAddNewArea} storeBranchId={storeBranchId} />
      <EditArea
        isModalVisible={showEditArea}
        handleCancel={onCancelEditItem}
        storeBranchId={storeBranchId}
        func={editComponentRef}
      />
    </>
  );
}
