import { StopOutlined } from "@ant-design/icons";
import { Col, message, Row, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { CloneIcon, EditFill, StopFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { QRCodeStatus } from "constants/qr-code.constants";
import { Percent } from "constants/string.constants";
import qrCodeDataService from "data-services/qr-code/qr-code-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setQrCodeData } from "store/modules/qr-code/qr-code.actions";
import { formatCurrency, formatDate, hasPermission } from "utils/helpers";
import "../qr-code.page.scss";
import FilterQRCode from "./filter-qr-code.component";

export default function TableQRCode(props) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [countFilter, setCountFilter] = useState(0);
  const [branches, setBranches] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [targets, setTargets] = useState([]);
  const [status, setStatus] = useState([]);
  const [initialFilter, setInitialFilter] = useState([]);
  const [showPopover, setShowPopover] = useState(true);
  const [pageNumberFilter, setPageNumberFilter] = useState(null);
  const clearFilterFunc = useRef(null);

  const pageData = {
    no: t("table.no"),
    eventName: t("marketing.qrCode.eventName"),
    serviceType: t("reportRevenue.serviceType"),
    target: t("marketing.qrCode.target"),
    discount: t("promotion.table.discount"),
    time: t("promotion.table.time"),
    status: t("promotion.table.status"),
    action: t("promotion.table.action"),
    amount: t("promotion.form.amount"),
    maximum: t("promotion.form.maximum"),
    start: t("promotion.form.start"),
    end: t("promotion.form.end"),
    search: t("promotion.search"),
    btnFilter: t("button.filter"),
    allBranches: t("material.filter.branch.all"),
    allTypes: t("order.allTypes"),
    allTargets: t("marketing.qrCode.allTargets"),
    all: t("order.all"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopQrCode: t("marketing.qrCode.confirmStop"),
    button: {
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
      btnDelete: t("button.delete"),
    },
    stop: t("button.stop"),
    stopQrCodeSuccess: t("marketing.qrCode.stopQrCodeSuccess"),
    stopQrCodeFail: t("marketing.qrCode.stopQrCodeFail"),
    confirmDeleteMessage: t("marketing.qrCode.confirmDeleteMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    deleteQrCodeSuccess: t("marketing.qrCode.deleteQrCodeSuccess"),
    deleteQrCodeFail: t("marketing.qrCode.deleteQrCodeFail"),
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no.toUpperCase(),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "3%",
      },
      {
        title: pageData.eventName.toUpperCase(),
        dataIndex: "eventName",
        key: "eventName",
        align: "left",
        width: "15%",
        render: (_, record) => {
          return (
            <div className="text-line-clamp-2">
              <Tooltip title={record.eventName}>
                <Link to={`/marketing/qrcode/detail/${record?.id}`}>{record.eventName}</Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: pageData.serviceType.toUpperCase(),
        dataIndex: "serviceType",
        key: "serviceType",
        width: "10%",
      },
      {
        title: pageData.target.toUpperCase(),
        dataIndex: "target",
        key: "target",
        width: "10%",
      },
      {
        title: pageData.discount.toUpperCase(),
        dataIndex: "discount",
        key: "discount",
        className: "grid-discount-column",
        width: "15%",
        render: (_, record) => {
          return (
            <>
              {record.isPercentDiscount ? (
                <>
                  <Row>
                    <Col span={10}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={14}>
                      <p className="discount-percent">{`${record?.percentNumber} ${Percent}`}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}>
                      <p className="discount-max">{pageData.maximum}: </p>
                    </Col>
                    <Col span={14}>
                      <p className="discount-amount">{formatCurrency(record?.maximumDiscountAmount)}</p>
                    </Col>
                  </Row>
                </>
              ) : (
                <Row>
                  <Col span={10}>
                    <p className="discount-text">{pageData.amount}: </p>
                  </Col>
                  <Col span={14}>
                    <p className="discount-percent">{formatCurrency(record?.maximumDiscountAmount)}</p>
                  </Col>
                </Row>
              )}
            </>
          );
        },
      },
      {
        title: pageData.time.toUpperCase(),
        dataIndex: "time",
        key: "time",
        className: "grid-time-column",
        width: "15%",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={10}>
                  <p className="start-text">{pageData.start}: </p>
                </Col>
                <Col span={14}>
                  <p className="start-date">{formatDate(record?.startDate)}</p>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <p className="end-text"> {pageData.end}: </p>
                </Col>
                <Col span={14}>
                  <p className="end-date">
                    {record?.endDate ? <p className="end-date">{formatDate(record?.endDate)}</p> : "-"}
                  </p>
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: pageData.status.toUpperCase(),
        dataIndex: "status",
        key: "status",
        className: "grid-status-column",
        width: "12%",
        render: (_, record) => {
          switch (record?.statusId) {
            case QRCodeStatus.Schedule:
              return <div className="status-scheduled">{t("promotion.status.scheduled")}</div>;
            case QRCodeStatus.Active:
              return <div className="status-active">{t("promotion.status.active")}</div>;
            default:
              return <div className="status-finished">{t("promotion.status.finished")}</div>;
          }
        },
      },
    ];

    if (
      hasPermission(PermissionKeys.EDIT_QR_CODE) ||
      hasPermission(PermissionKeys.DELETE_QR_CODE) ||
      hasPermission(PermissionKeys.STOP_QR_CODE) ||
      hasPermission(PermissionKeys.CREATE_QR_CODE)
    ) {
      const actionColumn = {
        title: pageData.action.toUpperCase(),
        dataIndex: "action",
        key: "action",
        width: "10%",
        align: "center",
        render: (_, qrCode) => {
          const { id, statusId, isStopped, eventName } = qrCode;
          if (isStopped === true) {
            return <></>;
          }

          return (
            <div className="qr-action-column">
              {hasPermission(PermissionKeys.EDIT_QR_CODE) && statusId === QRCodeStatus.Schedule && (
                <EditFill
                  className="icon-svg-hover pointer"
                  onClick={() => {
                    history.push(`/qrcode/edit/${id}`);
                  }}
                />
              )}

              {hasPermission(PermissionKeys.DELETE_QR_CODE) && statusId === QRCodeStatus.Schedule && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={t(pageData.confirmDeleteMessage, { name: eventName })}
                  okText={pageData.button.btnDelete}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.DELETE_QR_CODE}
                  onOk={() => onDeleteQrCode(id)}
                />
              )}

              {hasPermission(PermissionKeys.STOP_QR_CODE) && statusId === QRCodeStatus.Active && (
                <DeleteConfirmComponent
                  icon={<StopOutlined />}
                  buttonIcon={<StopFill className="icon-svg-hover pointer" />}
                  title={pageData.confirmStop}
                  content={t(pageData.confirmStopQrCode, { name: eventName })}
                  okText={pageData.button.btnStop}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.STOP_QR_CODE}
                  onOk={() => onStopQrCode(id)}
                  tooltipTitle={pageData.stop}
                />
              )}

              {hasPermission(PermissionKeys.CREATE_QR_CODE) && (
                <CloneIcon onClick={() => onCloneQrCode(id)} className="icon-svg-hover pointer" />
              )}
            </div>
          );
        },
      };
      columns.push(actionColumn);
    }
    return columns;
  };

  useEffect(() => {
    setPageNumberFilter(currentPageNumber);
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await qrCodeDataService.getAllQrCodeAsync(pageNumber, pageSize, keySearch, "", "", "", "");
    const data = response?.qrCodes.map((s, index) => mappingRecordToColumns(s, index));
    setDataSource(data);
    setTotalRecords(response.total);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
    //Get initial data filter
    setInitialFilter(response?.qrCodeFilters);
  };

  const mappingRecordToColumns = (qrCode, index) => {
    return {
      ...qrCode,
      no: index + 1,
      id: qrCode?.id,
      eventName: qrCode?.name,
      serviceType: qrCode?.serviceTypeName,
      target: t(qrCode?.targetName),
    };
  };

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onChangePage = async (pageNumber, pageSize) => {
    setCurrentPageNumber(pageNumber);
    fetchDatableAsync(currentPageNumber, pageSize, keySearch);
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }
    if (initialFilter.branches) {
      const allBranchOption = {
        id: "",
        name: pageData.allBranches,
      };
      const branchOptions = [allBranchOption, ...initialFilter.branches];
      setBranches(branchOptions);
    }

    if (initialFilter.serviceTypes) {
      const allServiceType = {
        id: "",
        name: pageData.allTypes,
      };
      const serviceTypes = [allServiceType, ...initialFilter.serviceTypes];
      setServiceTypes(serviceTypes);
    }

    if (initialFilter.targets) {
      const allTarget = {
        id: "",
        name: pageData.allTargets,
      };
      const targets = [allTarget, ...initialFilter.targets];
      setTargets(targets);
    }

    if (initialFilter.status) {
      const status = [...initialFilter.status];
      setStatus(status);
    }
  };

  const onClearFilter = (e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current();
      setShowPopover(false);
    } else {
      setCountFilter(0);
      setShowPopover(false);
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
    }
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterQRCode
          handleFilterQRCode={handleFilterQRCode}
          branches={branches}
          serviceTypes={serviceTypes}
          targets={targets}
          status={status}
          tableFuncs={clearFilterFunc}
        />
      )
    );
  };

  const handleFilterQRCode = async (data) => {
    let req = {
      pageNumber: pageNumberFilter,
      pageSize: tableSettings.pageSize,
      keySearch: keySearch,
      branchId: data?.branchId ?? "",
      serviceTypeId: data?.serviceTypeId ?? "",
      targetId: data?.targetId ?? "",
      statusId: data?.statusId ?? "",
    };
    const response = await qrCodeDataService.getAllQrCodeAsync(
      req.pageNumber,
      req.pageSize,
      req.keySearch,
      req.branchId,
      req.serviceTypeId,
      req.targetId,
      req.statusId
    );
    const result = response?.qrCodes.map((s, index) => mappingRecordToColumns(s, index));
    setDataSource(result);
    setTotalRecords(response.total);
    setCountFilter(data.count);
  };

  const onCloneQrCode = async (qrCodeId) => {
    const response = await qrCodeDataService.getQrCodeByIdAsync(qrCodeId);
    const { qrCodeDetail } = response;
    dispatch(setQrCodeData(qrCodeDetail));

    history.push("/qrcode/clone");
  };

  const onStopQrCode = async (id) => {
    await qrCodeDataService.stopQrCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopQrCodeSuccess);
      } else {
        message.error(pageData.stopQrCodeFail);
      }
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
    });
  };

  const onDeleteQrCode = async (id) => {
    await qrCodeDataService.deleteQrCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.deleteQrCodeSuccess);
      } else {
        message.error(pageData.deleteQrCodeFail);
      }
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
    });
  };

  return (
    <Row className="form-staff mt-4">
      <FnbTable
        className="mt-4 table-striped-rows qr-code-table"
        columns={getColumns()}
        pageSize={tableSettings.pageSize}
        dataSource={dataSource}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        onChangePage={onChangePage}
        search={{
          placeholder: pageData.search,
          onChange: handleSearchByName,
        }}
        filter={{
          onClickFilterButton: onClickFilterButton,
          totalFilterSelected: countFilter,
          onClearFilter: onClearFilter,
          buttonTitle: pageData.btnFilter,
          component: filterComponent(),
        }}
      />
    </Row>
  );
}
