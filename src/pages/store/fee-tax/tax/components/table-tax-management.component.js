import React, { useEffect, useState } from "react";
import { Row, message, Col, Modal } from "antd";
import { hasPermission } from "utils/helpers";
import { PermissionKeys } from "constants/permission-key.constants";
import { Percent } from "constants/string.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import ViewTaxDetail from "./view-tax-detail.component";
import { FnbTable } from "components/fnb-table/fnb-table";

export default function TableTax(props) {
  const { t, taxDataService } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showTaxDetailModal, setShowTaxDetailModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [taxDetail, setTaxDetail] = useState();

  const pageData = {
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    action: t("table.action"),
    no: t("feeAndTax.table.no"),
    name: t("feeAndTax.tax.name"),
    type: t("feeAndTax.tax.type"),
    description: t("feeAndTax.tax.description"),
    value: t("feeAndTax.tax.value"),
    titleModal: t("feeAndTax.tax.taxDetail"),
    taxDeleteSuccess: t("feeAndTax.tax.taxDeleteSuccess"),
    taxDeleteFail: t("feeAndTax.tax.taxDeleteFail"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        width: "10%",
        align: "left",
      },
      {
        title: pageData.name,
        dataIndex: "name",
        key: "name",
        width: "20%",
        align: "left",
        render: (value, record) => {
          return (
            <span className="color-primary pointer" onClick={() => onViewDetailTax(record.id)}>
              {value}
            </span>
          );
        },
      },
      {
        title: pageData.type,
        dataIndex: "type",
        key: "name",
        width: "20%",
        align: "left",
        render: (value) => {
          return <>{t(value)}</>;
        },
      },
      {
        title: pageData.description,
        dataIndex: "description",
        key: "name",
        width: "20%",
        align: "left",
      },
      {
        title: pageData.value,
        dataIndex: "value",
        key: "name",
        width: "20%",
        align: "left",
      },
      {
        title: pageData.action,
        key: "action",
        width: "20%",
        align: "center",
        render: (_, record) => {
          if (record.id) {
            return (
              <>
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.DELETE_TAX}
                  onOk={() => onRemoveItem(record?.id)}
                />
              </>
            );
          }
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize);
    },
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  useEffect(() => {
    props.tableFuncs.current = onRefreshTable;
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize);
  }, []);

  const onViewDetailTax = (taxId) => {
    taxDataService.getTaxByIdAsync(taxId).then((res) => {
      if (res?.tax) {
        setTaxDetail(res?.tax);
        setShowTaxDetailModal(true);
      }
    });
  };

  const renderTaxDetailModal = () => {
    return (
      <Modal
        title={pageData.titleModal}
        visible={showTaxDetailModal}
        onCancel={onCloseModal}
        footer={(null, null)}
      >
        <ViewTaxDetail t={t} taxDetail={taxDetail} />
      </Modal>
    );
  };

  const onCloseModal = async () => {
    setShowTaxDetailModal(false);
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  };

  const onRefreshTable = async () => {
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  };

  const fetchDatableAsync = async (pageNumber, pageSize) => {
    const response = await taxDataService.getAllTaxAsync(pageNumber, pageSize);
    const data = mappingRecordToColumns(response?.taxes);
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const mappingRecordToColumns = (items) => {
    let taxs = [];
    items.map((item, index) => {
      let tax = {
        no: index + 1,
        id: item?.id,
        name: item?.name,
        type: item?.taxType,
        description: item?.description,
        value: item?.percentage + Percent,
      };
      taxs.push(tax);
    });
    return taxs;
  };

  /// Render table columns by permission
  const getTableColumns = () => {
    if (hasPermission(PermissionKeys.DELETE_TAX)) {
      return tableSettings.columns;
    } else {
      return tableSettings.columns.filter((c) => c.key !== "action");
    }
  };

  const onRemoveItem = async (id) => {
    var res = await taxDataService.deleteTaxByIdAsync(id);
    if (res) {
      message.success(pageData.taxDeleteSuccess);
    } else {
      message.error(pageData.taxDeleteFail);
    }
    await fetchDatableAsync(1, tableSettings.pageSize);
  };

  return (
    <>
      {renderTaxDetailModal()}
      <Row>
        <Col span={24}>
          <FnbTable
            dataSource={dataSource}
            columns={getTableColumns()}
            pageSize={tableSettings.pageSize}
            pageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableSettings.onChangePage}
          />
        </Col>
      </Row>
    </>
  );
}
