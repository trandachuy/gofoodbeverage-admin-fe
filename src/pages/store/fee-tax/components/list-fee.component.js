import { StopOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Space, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { FeeStatus } from "constants/fee.constants";
import { StopFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import branchDataService from "data-services/branch/branch-data.service";
import feeDataService from "data-services/fee/fee-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate, formatTextNumber, getCurrency, hasPermission } from "utils/helpers";
import AddNewFeeComponent from "./create-new-fee.component";
import FeeDetailComponent from "./detail-fee.component";

const feeDetailActions = {
  none: 0,
  delete: 1,
  stop: 2,
};

export default function ListFeeComponent(props) {
  const [t] = useTranslation();
  const [listFee, setListFee] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [showModalAddFee, setShowModalAddFee] = useState(false);
  const [listBranch, setListBranch] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [showFeeDetailModal, setShowFeeDetailModal] = useState(false);
  const [feeDetail, setFeeDetail] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTitle, setConfirmTittle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [confirmActionButton, setConfirmActionButton] = useState("");
  const [currentFeeDetailAction, setCurrentFeeDetailAction] = useState(feeDetailActions.none);

  const pageData = {
    addNew: t("button.addNew"),
    percent: "%",
    table: {
      no: t("feeAndTax.table.no"),
      feeName: t("feeAndTax.table.feeName"),
      description: t("feeAndTax.table.description"),
      value: t("feeAndTax.table.value"),
      action: t("feeAndTax.table.action"),
      time: t("feeAndTax.table.time"),
      start: t("feeAndTax.table.start"),
      end: t("feeAndTax.table.end"),
      status: t("promotion.table.status"),
      type: t("table.type"),
    },
    btnStop: t("button.stop"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopFeeMessage: t("messages.confirmStopFeeMessage"),
    feeDeleteSuccess: t("feeAndTax.feeDeleteSuccess"),
    feeDeleteFail: t("feeAndTax.feeDeleteFail"),
    stopFeeSuccess: t("feeAndTax.stopFeeSuccess"),
    feeStopFail: t("feeAndTax.feeStopFail"),
    feeManagement: t("feeAndTax.feeManagement"),
    autoApplied: t("feeAndTax.autoApplied"),
    manual: t("feeAndTax.manual"),
  };

  const tableSettings = {
    page: 1,
    pageSize: 20,
  };

  useEffect(() => {
    getInitDataTableFee(tableSettings.page, tableSettings.pageSize);
  }, []);

  const getInitDataTableFee = (pageNumber, pageSize) => {
    feeDataService.getAllFeeInStoreAsync(pageNumber, pageSize).then((res) => {
      let fees = mappingToDataTableFees(res.fees);
      setTotalFee(res.total);
      setListFee(fees);
    });
  };

  const mappingToDataTableFees = (data) => {
    let fees = [];
    data.map((item, index) => {
      let fee = {
        no: index + 1,
        id: item.id,
        name: item.name,
        description: item.description,
        value: `${formatTextNumber(item.value)} ${item.isPercentage ? pageData.percent : getCurrency()}`,
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.statusId,
        isAutoApplied: item.isAutoApplied,
      };
      fees.push(fee);
    });
    return fees;
  };

  const getColumnsFee = () => {
    const columnFees = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        key: "no",
        width: "7%",
      },
      {
        title: pageData.table.feeName,
        dataIndex: "name",
        key: "name",
        width: "14%",
        ellipsis: {
          showTitle: false,
        },
        render: (_, record) => (
          <Tooltip placement="topLeft" title={record?.name}>
            <a onClick={() => showDetailFeeModal(record.id)}>{record.name}</a>
          </Tooltip>
        ),
      },
      {
        title: pageData.table.description,
        dataIndex: "description",
        key: "description",
        width: "16%",
        ellipsis: {
          showTitle: false,
        },
        render: (_, record) => (
          <Tooltip placement="topLeft" title={record?.description}>
            {record?.description}
          </Tooltip>
        ),
      },
      {
        title: pageData.table.value,
        dataIndex: "value",
        key: "value",
        width: "14%",
        align: "right",
      },
      {
        title: pageData.table.type,
        dataIndex: "isAutoApplied",
        key: "isAutoApplied",
        width: "14%",
        render: (_, record) => {
          return record.isAutoApplied ? pageData.autoApplied : pageData.manual;
        },
      },
      {
        title: pageData.table.time,
        dataIndex: "time",
        width: "14%",
        render: (_, record) => {
          return (
            <>
              <Row>
                {record.startDate && (
                  <>
                    <Col span={8}>
                      <p>{pageData.table.start}: </p>
                    </Col>
                    <Col span={16}>{formatDate(record.startDate)}</Col>
                  </>
                )}
              </Row>
              {record.endDate && (
                <Row>
                  <Col span={8}>
                    <p>{pageData.table.end}: </p>
                  </Col>
                  <Col span={16}>{formatDate(record.endDate)}</Col>
                </Row>
              )}
            </>
          );
        },
      },
      {
        title: pageData.table.status,
        dataIndex: "status",
        className: "grid-status-column",
        width: "13%",
        render: (_, record) => {
          switch (record?.status) {
            case FeeStatus.Schedule:
              return <div className="status-scheduled">{t("promotion.status.scheduled")}</div>;
            case FeeStatus.Active:
              return <div className="status-active">{t("promotion.status.active")}</div>;
            default:
              return <div className="status-finished">{t("promotion.status.finished")}</div>;
          }
        },
      },
    ];
    if (hasPermission(PermissionKeys.DELETE_FEE) || hasPermission(PermissionKeys.STOP_FEE)) {
      const actionColumn = {
        title: pageData.table.action,
        key: "action",
        width: "7%",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            {hasPermission(PermissionKeys.DELETE_FEE) && record.status === FeeStatus.Schedule && (
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_FEE}
                onOk={() => handleDeleteItem(record.id)}
              />
            )}
            {hasPermission(PermissionKeys.STOP_FEE) && record.status === FeeStatus.Active && (
              <DeleteConfirmComponent
                icon={<StopOutlined />}
                buttonIcon={<StopFill className="icon-del" />}
                title={pageData.confirmStop}
                content={formatStopMessage(record?.name)}
                okText={pageData.btnStop}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.STOP_FEE}
                onOk={() => onStopFee(record?.id)}
                tooltipTitle={pageData.btnStop}
              />
            )}
          </Space>
        ),
      };
      columnFees.push(actionColumn);
    }
    return columnFees;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  // Insert the name into the message
  const formatStopMessage = (name) => {
    let mess = t(pageData.confirmStopFeeMessage, { name: name });
    return mess;
  };

  const handleDeleteItem = (id) => {
    feeDataService.deleteFeeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.feeDeleteSuccess);
      } else {
        message.error(pageData.feeDeleteFail);
      }
      getInitDataTableFee(tableSettings.page, tableSettings.pageSize);
    });
  };

  const onChangePage = async (page, pageSize) => {
    setCurrentPageNumber(page);
    getInitDataTableFee(page, pageSize);
  };

  const handleAddNewFee = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      setListBranch(res.branchs);
    });
    setShowModalAddFee(true);
  };

  const getListBranch = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      setListBranch(res.branchs);
    });
  };

  const loadListFee = () => {
    getInitDataTableFee(tableSettings.page, tableSettings.pageSize);
    setShowModalAddFee(false);
  };

  const showDetailFeeModal = async (id) => {
    let res = await feeDataService.getFeeDetailByIdAsync(id);
    let feeStatus = listFee.find((x) => x.id === res.feeDetail.id).status;
    let feeDetail = res.feeDetail;
    feeDetail.statusId = feeStatus;
    setFeeDetail(feeDetail);
    setShowFeeDetailModal(true);
  };

  const onStopFee = async (id) => {
    const res = await feeDataService.stopFeeByIdAsync(id);
    if (res) {
      message.success(pageData.stopFeeSuccess);
    } else {
      message.error(pageData.feeStopFail);
    }
    getInitDataTableFee(tableSettings.page, tableSettings.pageSize);
  };

  const onDeleteFeeDetail = () => {
    setConfirmTittle(pageData.confirmDelete);
    let mess = t(pageData.confirmDeleteMessage, { name: feeDetail?.name });
    setConfirmContent(mess);
    setConfirmActionButton(pageData.btnDelete);
    setShowConfirm(true);
    setCurrentFeeDetailAction(feeDetailActions.delete);
  };

  const onStopFeeDetail = () => {
    setConfirmTittle(pageData.confirmStop);
    let mess = t(pageData.confirmStopFeeMessage, { name: feeDetail?.name });
    setConfirmContent(mess);
    setConfirmActionButton(pageData.btnStop);
    setShowConfirm(true);
    setCurrentFeeDetailAction(feeDetailActions.stop);
  };

  const onConfirmFeeDetailAction = () => {
    if (currentFeeDetailAction === feeDetailActions.delete) {
      handleDeleteItem(feeDetail?.id);
    }

    if (currentFeeDetailAction === feeDetailActions.stop) {
      onStopFee(feeDetail?.id);
    }

    setShowConfirm(false);
    setShowFeeDetailModal(false);
  };

  const feeDetailActionButtons = (feeDetail) => {
    return {
      delete: {
        hasPermission: hasPermission(PermissionKeys.DELETE_FEE) && feeDetail?.statusId === FeeStatus.Schedule,
        onDeleteFee: () => onDeleteFeeDetail(),
      },
      stop: {
        hasPermission: hasPermission(PermissionKeys.STOP_FEE) && feeDetail?.statusId === FeeStatus.Active,
        onStopFee: () => onStopFeeDetail(),
      },
    };
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={pageData.feeManagement} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_FEE}
            onClick={handleAddNewFee}
            text={pageData.addNew}
          />
        </Col>
      </Row>
      <Card className="mt-3 fnb-card-full">
        <AddNewFeeComponent
          isModalVisible={showModalAddFee}
          listBranch={listBranch}
          getListBranch={getListBranch}
          onCancel={loadListFee}
        />
        <FeeDetailComponent
          isModalVisible={showFeeDetailModal}
          feeDetail={feeDetail}
          closeFeeDetailModal={() => setShowFeeDetailModal(false)}
          actionButtons={feeDetailActionButtons(feeDetail)}
        />
        <Row>
          <Col span={24}>
            <FnbTable
              className="mt-4"
              columns={getColumnsFee()}
              pageSize={tableSettings.pageSize}
              dataSource={listFee}
              currentPageNumber={currentPageNumber}
              total={totalFee}
              onChangePage={onChangePage}
            />
          </Col>
        </Row>
      </Card>
      <DeleteConfirmComponent
        title={confirmTitle}
        content={confirmContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={confirmActionButton}
        onCancel={() => setShowConfirm(false)}
        onOk={onConfirmFeeDetailAction}
        className="opTop"
      />
    </>
  );
}
