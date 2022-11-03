import React, { useEffect, useState } from "react";
import { Row, Col, Card, Modal, message } from "antd";
import PageTitle from "components/page-title";
import { executeAfter } from "utils/helpers";
import { PermissionKeys } from "constants/permission-key.constants";
import materialCategoryDataService from "data-services/material-category/material-category-data.service";
import materialDataService from "data-services/material/material-data.service";
import TableMaterialByCategoryComponent from "./table-material-by-category.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { useTranslation } from "react-i18next";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import "../index.scss";
import Paragraph from "antd/lib/typography/Paragraph";

export default function TableMaterialCategoryComponent(props) {
  const [t] = useTranslation();
  const { onShowNewCategoryManagementComponent, onEditMaterialCategory } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showMaterialModel, setShowMaterialModel] = useState(false);
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState(null);
  const tableMaterialsFuncs = React.useRef(null);

  const pageData = {
    addNew: t("button.addNew"),
    title: t("materialCategory.title"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    materialCategoryDeleteSuccess: t("materialCategory.materialCategoryDeleteSuccess"),
    materialCategoryDeleteFail: t("materialCategory.materialCategoryDeleteFail"),
    table: {
      searchPlaceholder: t("materialCategory.table.searchPlaceholder"),
      no: t("materialCategory.table.no"),
      name: t("materialCategory.table.name"),
      description: t("materialCategory.table.description"),
      material: t("materialCategory.table.material"),
      action: t("materialCategory.table.action"),
    },
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "index",
        className: "grid-no-column",
        key: "index",
        width: "10%",
        align: "left",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        className: "grid-name-column",
        key: "name",
        width: "40%",
        align: "left",
        render: (_, record) => {
          return (
            <div className="text-overflow">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.name }}
                color="#50429B"
              >
                <span className="text-name">{record.name}</span>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.table.material,
        dataIndex: "totalMaterial",
        className: "grid-total-column",
        key: "totalMaterial",
        width: "40%",
        align: "left",
        render: (value, record) => {
          return (
            <span
              className={`number-total ${record.totalMaterial > 0 ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (record.totalMaterial > 0) {
                  setShowMaterialModel(true);
                  setSelectedMaterialCategory(record);
                }
                initDataMaterial(record);
              }}
            >
              {value}
            </span>
          );
        },
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "10%",
        align: "left",
        render: (_, record) => (
          <div className="action-column">
            <EditButtonComponent
              className="mr-3"
              onClick={() => onEditMaterialCategory(record.id)}
              permission={PermissionKeys.EDIT_MATERIAL}
            />
            <DeleteConfirmComponent
              title={pageData.confirmDelete}
              content={formatDeleteMessage(record?.name)}
              okText={pageData.btnDelete}
              cancelText={pageData.btnIgnore}
              permission={PermissionKeys.DELETE_PRODUCT}
              onOk={() => handleDeleteItem(record.id)}
            />
          </div>
        ),
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
      });
    },
  };

  useEffect(() => {
    props.tableFuncs.current = onRefreshTable;
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const handleDeleteItem = async (id) => {
    var res = await materialCategoryDataService.deleteMaterialCategoryByIdAsync(id);
    if (res) {
      message.success(pageData.materialCategoryDeleteSuccess);
    } else {
      message.error(pageData.materialCategoryDeleteFail);
    }
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const onRefreshTable = async () => {
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  };

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await materialCategoryDataService.getMaterialCategoriesAsync(
      pageNumber,
      pageSize,
      keySearch
    );
    const data = response?.materialCategories.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      id: item?.id,
      name: item?.name,
      totalMaterial: item?.totalMaterial,
    };
  };

  const initDataMaterial = async (record) => {
    let dataMaterials = await materialDataService.getMaterialsByFilterAsync(
      1,
      10,
      "",
      "",
      "",
      record?.id,
      ""
    );
    if (tableMaterialsFuncs.current) {
      tableMaterialsFuncs.current({
        dataMaterials: dataMaterials,
        materialCategoryId: record?.id,
      });
    }
  };

  const renderMaterialModal = () => {
    const materialCategory = dataSource?.find((s) => s.id === selectedMaterialCategory?.id);
    return (
      <Modal
        width={"800px"}
        className="modal-detail-material-category"
        title={materialCategory?.name}
        visible={showMaterialModel}
        onCancel={() => setShowMaterialModel(false)}
        footer={(null, null)}
        closeIcon
      >
        <TableMaterialByCategoryComponent
          materialCategory={materialCategory}
          tableFuncs={tableMaterialsFuncs}
        />
      </Modal>
    );
  };
  return (
    <>
      {renderMaterialModal()}
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            permission={PermissionKeys.CREATE_MATERIAL_CATEGORY}
            onClick={onShowNewCategoryManagementComponent}
            text={pageData.addNew}
            className="float-right"
          />
        </Col>
      </Row>
      <Card className="fnb-card-full">
        <FnbTable
          className="mt-3"
          columns={tableSettings.columns}
          pageSize={tableSettings.pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={totalRecords}
          onChangePage={tableSettings.onChangePage}
          editPermission={PermissionKeys.EDIT_MATERIAL_CATEGORY}
          deletePermission={PermissionKeys.DELETE_MATERIAL_CATEGORY}
          search={{
            placeholder: pageData.table.searchPlaceholder,
            onChange: tableSettings.onSearch,
          }}
        />
      </Card>
    </>
  );
}
