import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Checkbox, Col, Row, Tooltip, Typography } from "antd";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { useTranslation } from "react-i18next";
import { formatDate, formatTextNumber, getCurrency } from "utils/helpers";
import "./detail-fee.component.scss";

const { Text } = Typography;

export default function FeeDetailComponent(props) {
  const [t] = useTranslation();
  const { isModalVisible, closeFeeDetailModal, feeDetail, actionButtons } = props;

  const pageData = {
    titleDetailFee: t("feeAndTax.titleViewDetail"),
    feeName: t("feeAndTax.createFee.feeName"),
    feeValue: t("feeAndTax.table.value"),
    enterFeeName: t("feeAndTax.createFee.enterFeeName"),
    percentIcon: "%",
    autoApplied: t("feeAndTax.autoApplied"),
    servingTypes: t("feeAndTax.createFee.servingTypes"),
    branchName: t("feeAndTax.createFee.branchName"),
    allBranches: t("feeAndTax.createFee.allBranches"),
    description: t("feeAndTax.createFee.description"),
    percent: t("feeAndTax.percent"),
    table: {
      no: t("feeAndTax.table.no"),
      codeBranch: t("feeAndTax.table.codeBranch"),
      nameBranch: t("feeAndTax.table.nameBranch"),
      listBranch: t("feeAndTax.table.listBranch"),
    },
    start: t("feeAndTax.table.start"),
    end: t("feeAndTax.table.end"),
    orderTypeNames: Object.keys(OrderTypeConstants),
    cancelButton: t("button.cancel"),
    btnStop: t("button.stop"),
    btnDelete: t("button.delete"),

    instore: t("feeAndTax.servingType.instore"),
    takeAway: t("feeAndTax.servingType.takeAway"),
    delivery: t("feeAndTax.servingType.delivery"),
    online: t("feeAndTax.servingType.online"),
  };

  const mapServingTypeI18n = {
    // OrderTypeStatus:
    //    Instore: 0
    //    Delivery: 1
    //    TakeAway: 2
    //    Online: 3
    0: pageData.instore,
    1: pageData.delivery,
    2: pageData.takeAway,
    3: pageData.online,
  };

  const columnFees = [
    {
      title: pageData.table.no,
      dataIndex: "no",
      key: "no",
      width: "10%",
      align: "center",
      render: (_, record, index) => <p>{index + 1}</p>,
    },
    {
      title: pageData.table.codeBranch,
      dataIndex: "code",
      key: "code",
      width: "30%",
      align: "center",
    },
    {
      title: pageData.table.nameBranch,
      dataIndex: "name",
      key: "name",
      width: "60%",
      align: "center",
    },
  ];

  const servingTypeOptions = pageData.orderTypeNames.map((name) => {
    let index = OrderTypeConstants[name];
    let displayName = mapServingTypeI18n[index];
    return { label: displayName, value: index };
  });

  const renderContent = () => {
    return (
      <>
        {/* NAME */}
        <div className="row">
          <Row className="pb-1">
            <Text className="row__title">{pageData.feeName}</Text>
          </Row>
          <Row>
            <Text className="row__detail">{feeDetail?.name}</Text>
          </Row>
        </div>

        {/* VALUE */}
        {feeDetail?.isPercentage ? (
          <div className="row">
            <Row className="pb-1">
              <Text className="row__title">{pageData.feeValue}</Text>
            </Row>
            <Row>
              <Text className="row__detail">
                {feeDetail?.value} {pageData.percentIcon}
              </Text>
            </Row>
          </div>
        ) : (
          <div className="row">
            <Row className="pb-1">
              <Text className="row__title">{pageData.feeValue}</Text>
            </Row>
            <Row>
              <Text className="row__detail">{formatTextNumber(feeDetail?.value) + getCurrency()}</Text>
            </Row>
          </div>
        )}

        {/* START/END DATE */}
        <Row>
          <Col span={12}>
            {feeDetail?.startDate && (
              <div className="row">
                <Row className="pb-1">
                  <Text className="row__title">{pageData.start}</Text>
                </Row>
                <Row>
                  <Text className="row__detail">{formatDate(feeDetail?.startDate)}</Text>
                </Row>
              </div>
            )}
          </Col>
          <Col span={12}>
            <div className="row">
              <Row className="pb-1">
                <Text className="row__title">{pageData.end}</Text>
              </Row>
              <Row>
                <Text className="row__detail">
                  {feeDetail?.endDate === undefined ? "-" : formatDate(feeDetail?.endDate)}
                </Text>
              </Row>
            </div>
          </Col>
        </Row>

        {/* AUTO APPLIED */}
        <div className="row">
          <Row>
            <Checkbox className="w-100" checked={feeDetail?.isAutoApplied} disabled>
              {pageData.autoApplied}
              <Tooltip
                placement="topLeft"
                title={
                  <div>
                    <p>This fee will be applied automatically when created the order.</p>
                    <p>Otherwise, staff must select manually</p>
                  </div>
                }
              >
                <span className="ml-3">
                  <ExclamationCircleOutlined />
                </span>
              </Tooltip>
            </Checkbox>
          </Row>
        </div>

        {/* SERVING TYPES */}
        <div className="row">
          <Row className="pb-1">
            <Text className="row__title">{pageData.servingTypes}</Text>
          </Row>
          <Row>
            <Checkbox.Group
              options={servingTypeOptions}
              className="servingTypes__container"
              disabled
              value={feeDetail?.servingTypes.map((type) => {
                return type.code;
              })}
            />
          </Row>
        </div>

        {/* BRANCHES */}
        <div className="row">
          <Row className="pb-1">
            <Text className="row__title">{pageData.branchName}</Text>
          </Row>
          <Row>
            {feeDetail?.isShowAllBranches === true ? (
              <Text className="row__detail">{pageData.allBranches}</Text>
            ) : (
              <ul className="feeBranches__container">
                {feeDetail?.feeBranches.map((branch) => {
                  return <li className="feeBranches__item">{branch.name}</li>;
                })}
              </ul>
            )}
          </Row>
        </div>

        {/* DESCRIPTION */}
        <div className="row">
          <Row className="pb-1">
            <Text className="row__title">{pageData.description}</Text>
          </Row>
          <Row>
            {feeDetail?.description !== "" && feeDetail?.description !== undefined ? (
              <p className="row__detail">{feeDetail?.description}</p>
            ) : (
              "-"
            )}
          </Row>
        </div>
      </>
    );
  };

  const renderActionButtons = () => {
    return (
      <>
        <a onClick={closeFeeDetailModal} className="fee-detail__cancel__button">
          {pageData.cancelButton}
        </a>
        {actionButtons?.delete.hasPermission && (
          <button className="ant-btn ant-btn-primary " onClick={actionButtons?.delete.onDeleteFee}>
            Delete
          </button>
        )}
        {actionButtons?.stop.hasPermission && (
          <button className="ant-btn ant-btn-primary " onClick={actionButtons?.stop.onStopFee}>
            {pageData.btnStop}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <FnbModal
        width={"778px"}
        visible={isModalVisible}
        title={pageData.titleDetailFee}
        cancelText={pageData.cancel}
        handleCancel={closeFeeDetailModal}
        content={renderContent()}
        okText={pageData.titleDetailFee}
        onOk={() => {}}
        footer={renderActionButtons()}
      />
    </>
  );
}
