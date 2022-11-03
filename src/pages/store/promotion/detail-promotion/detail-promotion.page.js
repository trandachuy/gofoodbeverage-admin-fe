import { Button, Card, Checkbox, Col, message, Row, Tooltip, Typography } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import PageTitle from "components/page-title";
import { InfoCircleIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { ListPromotionType, PromotionStatus, PromotionType } from "constants/promotion.constants";
import { DateFormat, Percent } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/helpers";
import "./index.scss";
const { Text } = Typography;

export default function DetailPromotionManagement(props) {
  const { t, promotionDataService, match, history } = props;
  const promotionDetailLink = "/store/promotion";

  const pageData = {
    btnIgnore: t("button.ignore"),
    btnLeave: t("button.leave"),
    btnStop: t("button.stop"),
    btnDelete: t("button.delete"),
    btnCancel: t("button.cancel"),
    edit: t("button.edit"),
    backTo: t("button.backTo"),
    title: t("promotion.title"),
    promotionType: t("promotion.form.promotionType"),
    general: t("material.generalInformation"),
    product: t("promotion.form.product"),
    productCategory: t("promotion.form.productCategory"),
    discountValue: t("promotion.form.discountValue"),
    maxDiscount: t("promotion.form.maxDiscount"),
    startDate: t("promotion.form.startDate"),
    endDate: t("promotion.form.endDate"),
    termsAndConditions: t("promotion.form.termsAndConditions"),
    couponConditions: t("promotion.form.condition.title"),
    checkboxPurchaseAmount: t("promotion.form.condition.checkboxPurchaseAmount"),
    checkboxSpecificBranches: t("promotion.form.condition.checkboxSpecificBranches"),
    includedTopping: t("promotion.form.condition.includedTopping"),
    specificBranchesTooltip: t("promotion.form.condition.specificBranchesTooltip"),
    percent: Percent,
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    confirmStopPromotion: t("messages.confirmStopPromotion"),
    deletePromotionSuccess: t("promotion.deletePromotionSuccess"),
    stopPromotionSuccess: t("promotion.stopPromotionSuccess"),
    promotionDeleteFail: t("promotion.promotionDeleteFail"),
    promotionStopFail: t("promotion.promotionStopFail"),
    guideline: {
      title: t("promotion.guideline.title"),
      content: t("promotion.guideline.content"),
    },
  };

  const [initData, setInitData] = useState([]);
  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [isMinimumPurchaseAmount, setIsMinimumPurchaseAmount] = useState(false);
  const [isSpecificBranch, setIsSpecificBranch] = useState(false);
  const [isIncludedTopping, setIsIncludedTopping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync(match?.params?.id);
    }
    fetchData();
  }, []);

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onDiscardDeleteModal = () => {
    setIsModalDeleteVisible(false);
  };

  const getInitDataAsync = async (id) => {
    await promotionDataService.getPromotionByIdAsync(id).then((res) => {
      if (res.isSuccess) {
        setInitData(res?.promotion);
        setIsPercentDiscount(res?.promotion?.isPercentDiscount);
        setIsMinimumPurchaseAmount(res?.promotion?.isMinimumPurchaseAmount);
        setIsSpecificBranch(res?.promotion?.isSpecificBranch);
        setIsIncludedTopping(res?.promotion?.isIncludedTopping);
      } else {
        history.push(`${promotionDetailLink}`);
      }
    });
  };

  const onStopPromotion = async (id) => {
    const res = await promotionDataService.stopPromotionByIdAsync(id);
    if (res) {
      await getInitDataAsync(match?.params?.id);
      message.success(pageData.stopPromotionSuccess);
      setShowConfirm(false);
    } else {
      message.error(pageData.promotionStopFail);
    }
  };

  const onDeletePromotion = async (id) => {
    const res = await promotionDataService.deletePromotionByIdAsync(id);
    if (res) {
      message.success(pageData.deletePromotionSuccess);
      history.push("/store/promotion");
    } else {
      message.error(pageData.promotionDeleteFail);
    }
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle className="promotion-guideline-page-title" content={initData?.name} />
          <FnbGuideline placement="leftTop" title={pageData.guideline.title} content={pageData.guideline.content} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action:
                  initData?.statusId === PromotionStatus.Schedule ? (
                    <Button type="primary" onClick={() => history.push(`/store/promotion/edit/${initData.id}`)}>
                      {pageData.edit}
                    </Button>
                  ) : initData?.statusId === PromotionStatus.Active ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        setShowConfirm(true);
                      }}
                    >
                      {pageData.btnStop}
                    </Button>
                  ) : null,
                permission:
                  initData?.statusId === PromotionStatus.Schedule
                    ? PermissionKeys.EDIT_PROMOTION
                    : initData?.statusId === PromotionStatus.Active
                    ? PermissionKeys.STOP_PROMOTION
                    : null,
              },
              {
                action: (
                  <a onClick={() => history.push(`/store/promotion`)} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null,
              },
              {
                action:
                  initData?.statusId === PromotionStatus.Schedule ? (
                    <a
                      className="action-delete"
                      onClick={() => {
                        setIsModalDeleteVisible(true);
                      }}
                    >
                      {pageData.btnDelete}
                    </a>
                  ) : null,
                permission: PermissionKeys.DELETE_PROMOTION,
              },
            ]}
          />
        </Col>
      </Row>
      <Card className="fnb-card card-promotion-detail">
        <div className="title-session">
          <span>{pageData.general}</span>
        </div>
        {initData?.promotionTypeId === PromotionType.DiscountProduct && (
          <Row>
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.product}</p>
                <p className="text-detail">{initData?.products?.map((item) => item?.name)?.join(" - ")}</p>
              </div>
            </Col>
          </Row>
        )}
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.promotionType}</p>
              <p className="text-detail">
                {ListPromotionType?.map((item) => {
                  if (item.key === initData?.promotionTypeId) {
                    return t(item.name);
                  }
                })}
              </p>
            </div>
          </Col>
        </Row>
        {initData?.promotionTypeId === PromotionType.DiscountProductCategory && (
          <Row>
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.productCategory}</p>
                <p className="text-detail">{initData?.productCategories?.map((item) => item?.name)?.join(" - ")}</p>
              </div>
            </Col>
          </Row>
        )}
        <Row>
          {isPercentDiscount ? (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.discountValue}</p>
                <p className="text-detail">
                  {initData?.percentNumber}
                  <span>{pageData.percent}</span>
                </p>
              </div>
            </Col>
          ) : (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.maxDiscount}</p>
                <p className="text-detail">{formatCurrency(initData?.maximumDiscountAmount)}</p>
              </div>
            </Col>
          )}
          {isPercentDiscount && (
            <Col xs={24} lg={12}>
              {initData?.maximumDiscountAmount > 0 && (
                <>
                  <div className="text-container">
                    <p className="text-label">{pageData.maxDiscount}</p>
                    <p className="text-detail">{formatCurrency(initData?.maximumDiscountAmount)}</p>
                  </div>
                </>
              )}
            </Col>
          )}
        </Row>
        <Row>
          <Col xs={24} lg={12}>
            <div className="text-container">
              <p className="text-label">{pageData.startDate}</p>
              <p className="text-detail">{moment(initData?.startDate).format(DateFormat.DD_MM_YYYY)}</p>
            </div>
          </Col>
          {initData?.endDate && (
            <Col xs={24} lg={12}>
              <div className="text-container">
                <p className="text-label">{pageData.endDate}</p>
                <p className="text-detail">{moment(initData?.endDate).format(DateFormat.DD_MM_YYYY)}</p>
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.termsAndConditions}</p>
              <p className="text-detail">{initData?.termsAndCondition}</p>
            </div>
          </Col>
        </Row>
      </Card>
      <Card className="card-promotion-detail mt-3">
        <div className="title-session">
          <span>{pageData.couponConditions}</span>
        </div>
        <Row>
          <div className="text-container">
            <p className="text-label">
              <Checkbox checked={isMinimumPurchaseAmount} disabled>
                <Text>{pageData.checkboxPurchaseAmount}</Text>
              </Checkbox>
            </p>
            <p className="text-detail-disable">{formatCurrency(initData?.minimumPurchaseAmount)}</p>
          </div>
        </Row>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">
                <Checkbox checked={isSpecificBranch} disabled>
                  <Text>{pageData.checkboxSpecificBranches}</Text>
                </Checkbox>
                <Tooltip placement="topLeft" title={pageData.specificBranchesTooltip}>
                  <InfoCircleIcon size={24} />
                </Tooltip>
              </p>
              <p className="text-detail-disable">{initData?.branches?.map((item) => item.name).join(" - ")}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Checkbox checked={isIncludedTopping} disabled>
              <Text>{pageData.includedTopping}</Text>
            </Checkbox>
          </Col>
        </Row>
      </Card>
      <DeleteConfirmComponent
        title={pageData.confirmStop}
        content={t(pageData.confirmStopPromotion, { name: initData?.name })}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnStop}
        onCancel={onDiscard}
        onOk={() => onStopPromotion(initData?.id)}
      />
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={t(pageData.confirmDeleteMessage, { name: initData?.name })}
        visible={isModalDeleteVisible}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnDelete}
        onCancel={onDiscardDeleteModal}
        onOk={() => onDeletePromotion(initData?.id)}
      />
    </>
  );
}
