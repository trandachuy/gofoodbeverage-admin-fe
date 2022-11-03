import React, { useEffect, useState } from "react";
import { PermissionKeys } from "constants/permission-key.constants";
import { Card, Row, Col, message, Tooltip } from "antd";
import { StopOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import PageTitle from "components/page-title";
import { hasPermission, formatDate, formatCurrency } from "utils/helpers";
import { Percent } from "constants/string.constants";
import { PromotionStatus } from "constants/promotion.constants";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import promotionDataService from "data-services/promotion/promotion-data.service";
import { tableSettings } from "constants/default.constants";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import "../promotion.scss";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { StopFill } from "constants/icons.constants";

export default function PromotionManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [keySearch, setKeySearch] = useState("");
  const [listPromotion, setListPromotion] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const pageData = {
    title: t("promotion.title"),
    search: t("promotion.search"),
    linkAddNew: "/store/promotion/create-new",
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    confirmStopPromotion: t("messages.confirmStopPromotion"),
    deletePromotionSuccess: t("promotion.deletePromotionSuccess"),
    stopPromotionSuccess: t("promotion.stopPromotionSuccess"),
    promotionDeleteFail: t("promotion.promotionDeleteFail"),
    promotionStopFail: t("promotion.promotionStopFail"),
    button: {
      addNew: t("button.addNew"),
      filter: t("button.filter"),
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    amount: t("promotion.form.amount"),
    maximum: t("promotion.form.maximum"),
    start: t("promotion.form.start"),
    end: t("promotion.form.end"),
    table: {
      no: t("promotion.table.no"),
      name: t("promotion.table.name"),
      time: t("promotion.table.time"),
      discount: t("promotion.table.discount"),
      status: t("promotion.table.status"),
      action: t("promotion.table.action"),
    },
    stop: t("button.stop"),
  };

  useEffect(() => {
    getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
  }, []);

  const getInitComboDataTable = async (pageNumber, pageSize, keySearch) => {
    await promotionDataService.getPromotionsAsync(pageNumber, pageSize, keySearch).then((res) => {
      const { total, promotions } = res;
      let promotionDataTable = mappingToDataTablePromotions(promotions);
      setListPromotion(promotionDataTable);
      setCurrentPageNumber(pageNumber);
      setTotalRecords(total);
    });
  };

  const mappingToDataTablePromotions = (promotions) => {
    return promotions?.map((i, index) => {
      return {
        id: i.id,
        no: index + 1,
        name: i.name,
        isPercentDiscount: i.isPercentDiscount,
        percentNumber: i.percentNumber,
        maximumDiscountAmount: i.maximumDiscountAmount,
        startDate: i.startDate,
        endDate: i.endDate,
        statusId: i.statusId,
        isStopped: i.isStopped,
      };
    });
  };

  const onEditItem = (id) => {
    history.push(`/store/promotion/edit/${id}`);
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        className: "grid-no-column",
        width: "124px",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        className: "grid-name-column",
        width: "423px",
        render: (_, record) => {
          let href = `/store/promotion/detail/${record.id}`;
          return (
            <div className="text-overflow">
              <Paragraph
                style={{ maxWidth: "inherit" }}
                placement="top"
                ellipsis={{ tooltip: record?.name }}
                color="#50429B"
              >
                <Link to={href}>
                  <span className="text-name">{record.name}</span>
                </Link>
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: pageData.table.discount,
        dataIndex: "discount",
        className: "grid-discount-column",
        width: "343px",
        render: (_, record) => {
          return (
            <>
              {record.isPercentDiscount ? (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">{`${record.percentNumber} ${Percent}`}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p className="discount-max">{pageData.maximum}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-amount">
                        {formatCurrency(record.maximumDiscountAmount)}
                      </p>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col span={12}>
                      <p className="discount-text">{pageData.amount}: </p>
                    </Col>
                    <Col span={12}>
                      <p className="discount-percent">
                        {formatCurrency(record.maximumDiscountAmount)}
                      </p>
                    </Col>
                  </Row>
                </>
              )}
            </>
          );
        },
      },
      {
        title: pageData.table.time,
        dataIndex: "time",
        className: "grid-time-column",
        width: "295px",
        render: (_, record) => {
          return (
            <>
              <Row>
                <Col span={12}>
                  <p className="start-text">{pageData.start}: </p>
                </Col>
                <Col span={12}>
                  <p className="start-date">{formatDate(record.startDate)}</p>
                </Col>
              </Row>
              {record.endDate && (
                <Row>
                  <Col span={12}>
                    <p className="end-text"> {pageData.end}: </p>
                  </Col>
                  <Col span={12}>
                    <p className="end-date">{formatDate(record.endDate)}</p>
                  </Col>
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
        width: "183px",
        render: (_, record) => {
          switch (record?.statusId) {
            case PromotionStatus.Schedule:
              return <div className="status-scheduled">{t("promotion.status.scheduled")}</div>;
            case PromotionStatus.Active:
              return <div className="status-active">{t("promotion.status.active")}</div>;
            default:
              return <div className="status-finished">{t("promotion.status.finished")}</div>;
          }
        },
      },
    ];

    if (
      hasPermission(PermissionKeys.EDIT_PROMOTION) ||
      hasPermission(PermissionKeys.DELETE_PROMOTION)
    ) {
      const actionColumn = {
        title: pageData.table.action,
        dataIndex: "action",
        width: "95px",
        align: "center",
        render: (_, record) => {
          if (record.isStopped) {
            return <></>;
          }
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_PROMOTION) &&
                record.statusId === PromotionStatus.Schedule && (
                  <a onClick={() => onEditItem(record?.id)}>
                    <EditButtonComponent
                      className="action-button-space"
                      onClick={() => onEditItem(record)}
                      permission={PermissionKeys.EDIT_PROMOTION}
                    />
                  </a>
                )}

              {hasPermission(PermissionKeys.DELETE_PROMOTION) &&
                record.statusId === PromotionStatus.Schedule && (
                  <DeleteConfirmComponent
                    title={pageData.confirmDelete}
                    content={formatDeleteMessage(record?.name)}
                    okText={pageData.button.btnDelete}
                    cancelText={pageData.button.btnIgnore}
                    permission={PermissionKeys.DELETE_PROMOTION}
                    onOk={() => onDeletePromotion(record?.id)}
                  />
                )}

              {hasPermission(PermissionKeys.STOP_PROMOTION) &&
                record.statusId === PromotionStatus.Active && (
                  <DeleteConfirmComponent
                    icon={<StopOutlined />}
                    buttonIcon={<StopFill className="icon-del" />}
                    title={pageData.confirmStop}
                    content={t(pageData.confirmStopPromotion, { name: record?.name })}
                    okText={pageData.button.btnStop}
                    cancelText={pageData.button.btnIgnore}
                    permission={PermissionKeys.STOP_PROMOTION}
                    onOk={() => onStopPromotion(record?.id)}
                    tooltipTitle={pageData.stop}
                  />
                )}
            </div>
          );
        },
      };
      columns.push(actionColumn);
    }

    return columns;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onStopPromotion = async (id) => {
    await promotionDataService.stopPromotionByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopPromotionSuccess);
      } else {
        message.error(pageData.promotionStopFail);
      }
      getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
    });
  };

  const onDeletePromotion = async (id) => {
    await promotionDataService.deletePromotionByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopPromotionSuccess);
      } else {
        message.error(pageData.promotionDeleteFail);
      }
      getInitComboDataTable(tableSettings.page, tableSettings.pageSize, keySearch);
    });
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            className="float-right"
            permission={PermissionKeys.CREATE_PROMOTION}
            onClick={() => history.push(pageData.linkAddNew)}
            text={pageData.button.addNew}
          />
        </Col>
      </Row>
      <Row>
        <Card className="w-100 fnb-card-full">
          <Row>
            <Col span={24}>
              <FnbTable
                className="mt-3"
                columns={getColumns()}
                pageSize={tableSettings.pageSize}
                dataSource={listPromotion}
                currentPageNumber={currentPageNumber}
                total={totalRecords}
                onChangePage={tableSettings.onChangePage}
                search={{
                  placeholder: `${pageData.search}`,
                  onChange: handleSearchByName,
                }}
              />
            </Col>
          </Row>
        </Card>
      </Row>
    </>
  );
}
