import { EllipsisOutlined, StopOutlined } from "@ant-design/icons";
import { Card, Col, message, Popover, Row, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { ComboStatus, ComboType } from "constants/combo.constants";
import { StopFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { formatDate, formatTextNumber, getCurrency, hasPermission } from "utils/helpers";
const { Text } = Typography;
const maxNumberToShowProduct = 5;

export default function ListCompoComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { listCombo, pageSize, totalCombos, onChangePage, comboDataService, currentPageNumber } = props;

  const pageData = {
    no: t("table.no"),
    name: t("combo.generalInformation.name"),
    product: t("combo.product.title"),
    time: t("promotion.table.time"),
    status: t("promotion.table.status"),
    start: t("promotion.form.start"),
    end: t("promotion.form.end"),
    price: t("combo.price.title"),
    branch: t("combo.generalInformation.branch"),
    action: t("table.action"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    comboDeleteSuccess: t("combo.comboDeleteSuccess"),
    comboDeleteFail: t("combo.comboDeleteFail"),
    table: {
      status: t("promotion.table.status"),
    },
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopCombo: t("combo.confirmStop"),
    button: {
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    stop: t("button.stop"),
    stopComboSuccess: t("combo.stopComboSuccess"),
    stopComboFail: t("combo.stopComboFail"),
  };

  const handleDeleteItem = async (id) => {
    var res = await comboDataService.deleteComboByIdAsync(id);
    if (res) {
      message.success(pageData.comboDeleteSuccess);
      onChangePage(1, pageSize);
    } else {
      message.error(pageData.comboDeleteFail);
    }
  };

  const onStopCombo = async (id) => {
    await comboDataService.stopComboByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopComboSuccess);
      } else {
        message.error(pageData.stopComboFail);
      }
      onChangePage(1, pageSize);
    });
  };

  const PopoverContentComponent = (props) => {
    return (
      <div className="popover-container-custom">
        <div className="popover-container-custom-header">
          <span className="popover-container-custom-header-title">{props?.title}</span>
        </div>
        <div className="popover-container-custom-body">{props?.children}</div>
      </div>
    );
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no,
        dataIndex: "no",
        width: "5%",
        align: "left",
        className: "grid-product-no-column",
      },
      {
        title: pageData.name,
        ellipsis: "true",
        dataIndex: "name",
        width: "15%",
        className: "grid-product-combo-name-column",
        render: (_, record) => {
          return (
            <Row align="middle">
              <Paragraph placement="top" ellipsis={{ tooltip: record?.name }} color="#50429B">
                <Thumbnail src={record?.thumbnail} />
                <Link to={`/combo/detail/${record?.id}`} className="combo-name">
                  {record?.name}
                </Link>
              </Paragraph>
            </Row>
          );
        },
      },
      {
        title: () => {
          return (
            <Row>
              <Col xs={19} sm={18} md={18} lg={20}>
                {pageData.product}
              </Col>
              <Col xs={5} sm={6} md={6} lg={4} className="specific-combo-price">
                {`${pageData.price} (${getCurrency()})`}
              </Col>
            </Row>
          );
        },
        dataIndex: "product",
        ellipsis: "true",
        width: "38%",
        align: "left",
        className: "grid-product-product-name-column",
        render: (_, record) => {
          if (record?.comboTypeId === ComboType.Specific) {
            return (
              <>
                <Row className="specific-product-and-price">
                  <Col xs={18} sm={18} md={18} lg={18}>
                    {record?.product.map((p, index) => {
                      if (index < maxNumberToShowProduct) {
                        return (
                          <Row className="mt-2">
                            <Col span={24} align="left">
                              <div className="product-price-item">
                                <Paragraph
                                  style={{ maxWidth: "inherit" }}
                                  placement="top"
                                  ellipsis={{
                                    tooltip: p?.productPrice?.priceName
                                      ? `${p?.productPrice?.product?.name} (${p?.productPrice?.priceName})`
                                      : p?.productPrice?.product?.name,
                                  }}
                                  color="#50429B"
                                >
                                  <span>
                                    {p?.productPrice?.priceName
                                      ? `${p?.productPrice?.product?.name} (${p?.productPrice?.priceName})`
                                      : p?.productPrice?.product?.name}
                                  </span>
                                </Paragraph>
                              </div>
                            </Col>
                          </Row>
                        );
                      }
                    })}
                    {record.product?.length > maxNumberToShowProduct &&
                      showPopoverProducts(record.id, record.product, record.comboTypeId)}
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} className="specific-combo-price">
                    <Text strong>{formatTextNumber(record.price)}</Text>
                  </Col>
                </Row>
              </>
            );
          } else {
            return (
              <>
                {record.comboPricings.map((cp, index) => {
                  if (index < maxNumberToShowProduct) {
                    let comboNameArray = cp.comboName.split(" | ");
                    return (
                      <Row className="flexible-product-and-price mb-2">
                        <Col span={19}>
                          <div className="flexible-combo-wrapper">
                            {comboNameArray.map((item) => (
                              <div className="product-price-item">
                                <Paragraph
                                  style={{ maxWidth: "inherit" }}
                                  placement="top"
                                  ellipsis={{ tooltip: item }}
                                  color="#50429B"
                                >
                                  <span>{item}</span>
                                </Paragraph>
                              </div>
                            ))}
                          </div>
                        </Col>
                        <Col span={5} className="flexible-combo-price">
                          <Text strong>{formatTextNumber(cp.sellingPrice)}</Text>
                        </Col>
                      </Row>
                    );
                  }
                })}
                {record.comboPricings?.length > maxNumberToShowProduct &&
                  showPopoverProducts(record.id, record.comboPricings, record.comboTypeId)}
              </>
            );
          }
        },
      },
      {
        title: pageData.branch,
        dataIndex: "totalBranch",
        align: "right",
        className: "grid-product-branch-column",
        render: (_, record) => <a>{record.totalBranch}</a>,
      },
      {
        title: pageData.time,
        dataIndex: "time",
        className: "grid-time-column",
        width: "16%",
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
        render: (_, record) => {
          switch (record?.statusId) {
            case ComboStatus.Schedule:
              return <div className="status-scheduled">{t("combo.status.scheduled")}</div>;
            case ComboStatus.Active:
              return <div className="status-active">{t("combo.status.active")}</div>;
            default:
              return <div className="status-finished">{t("combo.status.finished")}</div>;
          }
        },
      },
    ];

    if (hasPermission(PermissionKeys.EDIT_COMBO) || hasPermission(PermissionKeys.DELETE_COMBO)) {
      const actionColumn = {
        title: pageData.action,
        dataIndex: "action",
        align: "center",
        className: "grid-product-action-column",
        render: (_, record) => {
          return (
            <div className="action-column">
              {hasPermission(PermissionKeys.EDIT_COMBO) && record.statusId === ComboStatus.Schedule && (
                <EditButtonComponent
                  className="mr-3"
                  onClick={() => history.push(`/combo/edit/${record?.id}`)}
                  permission={PermissionKeys.EDIT_COMBO}
                />
              )}
              {hasPermission(PermissionKeys.DELETE_COMBO) && record.statusId === ComboStatus.Schedule && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.DELETE_COMBO}
                  onOk={() => handleDeleteItem(record.id)}
                />
              )}

              {hasPermission(PermissionKeys.STOP_COMBO) && record.statusId === ComboStatus.Active && (
                <DeleteConfirmComponent
                  icon={<StopOutlined />}
                  buttonIcon={<StopFill className="icon-del" />}
                  title={pageData.confirmStop}
                  content={pageData.confirmStopCombo + `${record.name}?`}
                  okText={pageData.button.btnStop}
                  cancelText={pageData.button.btnIgnore}
                  permission={PermissionKeys.STOP_PROMOTION}
                  onOk={() => onStopCombo(record?.id)}
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

  const popoverColumn = [
    {
      title: pageData.no,
      dataIndex: "index",
      key: "index",
      width: "10%",
    },
    {
      title: pageData.product,
      dataIndex: "name",
      key: "name",
      ellipsis: "true",
      width: "70%",
      render: (_, record) => {
        if (record?.comboTypeId === ComboType.Specific) {
          return <div className="product-price-item">{record?.name}</div>;
        } else {
          let comboNameArray = record?.name.split(" | ");
          return (
            <div className="popover-flexible-wrapper">
              {comboNameArray.map((item) => (
                <div className="product-price-item">{item}</div>
              ))}
            </div>
          );
        }
      },
    },
    {
      title: `${pageData.price} (${getCurrency()})`,
      dataIndex: "price",
      key: "price",
      width: "20%",
      align: "right",
    },
  ];

  const showPopoverProducts = (recordId, data, comboTypeId) => {
    return (
      <Row>
        <Col>
          <Popover
            content={
              <PopoverContentComponent title={`${pageData.product} (${data?.length})`}>
                {renderContentPopver(data, comboTypeId)}
              </PopoverContentComponent>
            }
            trigger="click"
          >
            <button id={`btn-show-more-${recordId}`} className="btn-show-more">
              <EllipsisOutlined />
            </button>
          </Popover>
        </Col>
      </Row>
    );
  };

  const renderContentPopver = (data, comboTypeId) => {
    let dataSource = [];
    if (comboTypeId === ComboType.Specific) {
      data?.map((item, index) => {
        let data = {
          index: index + 1,
          name: item?.productPrice?.product?.name,
          price: formatTextNumber(item?.priceValue),
          comboTypeId: comboTypeId,
        };
        dataSource.push(data);
      });
    } else {
      data?.map((item, index) => {
        let data = {
          index: index + 1,
          name: item?.comboName,
          price: formatTextNumber(item?.sellingPrice),
          comboTypeId: comboTypeId,
        };
        dataSource.push(data);
      });
    }
    return <FnbTable className="popover-table" dataSource={dataSource} columns={popoverColumn} pagination={false} />;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  return (
    <>
      <Card className="w-100 fnb-card-full">
        <FnbTable
          className="table-striped-rows product-in-combo-table"
          columns={getColumns()}
          pageSize={pageSize}
          dataSource={listCombo}
          currentPageNumber={currentPageNumber}
          total={totalCombos}
          onChangePage={onChangePage}
          editPermission={PermissionKeys.EDIT_COMBO}
          deletePermission={PermissionKeys.DELETE_COMBO}
        />
      </Card>
    </>
  );
}
