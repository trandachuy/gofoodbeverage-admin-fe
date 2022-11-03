import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./delete-product.component.scss";

export default function DeleteProductComponent(props) {
  const [t] = useTranslation();
  const linkCombo = "/combo/detail/";
  const linkPromotion = "/store/promotion/detail/";
  const linkOrderDetail = "/report/order/detail/";
  const { preventDeleteProduct, isModalVisible, titleModal, handleCancel, onDelete } = props;
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    delete: t("button.delete"),
    deleteProductNotificationMessage: t("messages.deleteProductNotificationMessage"),
    deleteProductRelatedComboNotificationMessage: t(
      "messages.deleteProductRelatedComboNotificationMessage"
    ),
    deleteProductRelatedPromotionNotificationMessage: t(
      "messages.deleteProductRelatedPromotionNotificationMessage"
    ),
    deleteProductMessage: t("messages.deleteProductMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
  };

  const onCancel = () => {
    handleCancel();
  };

  const renderRowByIndex = (reasonType, reasons) => {
    let elements = [];
    console.log(reasons);
    for (var item = 0; item < reasons?.length; item += 2) {
      let element = (
        <div className="po-row">
          <div className={reasons[item]?.reasonName ? "po-row-item" : "po-row-item-full"}>
            <span>{item + 1}.</span>
            {reasonType === 0 && (
              <Link to={`${linkOrderDetail}${reasons[item]?.reasonId}`} target="_blank">
                {reasons[item]?.reasonName}
              </Link>
            )}
            {reasonType === 1 && (
              <Link to={`${linkCombo}${reasons[item]?.reasonId}`} target="_blank">
                {reasons[item]?.reasonName}
              </Link>
            )}
            {reasonType === 2 && (
              <Link to={`${linkPromotion}${reasons[item]?.reasonId}`} target="_blank">
                {reasons[item]?.reasonName}
              </Link>
            )}
          </div>
          {reasons[item + 1]?.reasonName && (
            <div className="po-row-item">
              <span>{item + 1}.</span>
              {reasonType === 0 && (
                <Link to={`${linkOrderDetail}${reasons[item + 1]?.reasonId}`} target="_blank">
                  {reasons[item + 1]?.reasonName}
                </Link>
              )}
              {reasonType === 1 && (
                <Link to={`${linkCombo}${reasons[item + 1]?.reasonId}`} target="_blank">
                  {reasons[item + 1]?.reasonName}
                </Link>
              )}
              {reasonType === 2 && (
                <Link to={`${linkPromotion}${reasons[item + 1]?.reasonId}`} target="_blank">
                  {reasons[item + 1]?.reasonName}
                </Link>
              )}
            </div>
          )}
        </div>
      );
      elements.push(element);
    }
    return elements;
  };

  const formatNotificationMessage = (name) => {
    let mess;
    if (preventDeleteProduct?.isPreventDelete) {
      if (preventDeleteProduct?.reasonType === 0) {
        mess = t(pageData.deleteProductNotificationMessage, { name: name });
      }
      if (preventDeleteProduct?.reasonType === 1) {
        mess = t(pageData.deleteProductRelatedComboNotificationMessage, {
          name: name,
        });
      }
      if (preventDeleteProduct?.reasonType === 2) {
        mess = t(pageData.deleteProductRelatedPromotionNotificationMessage, {
          name: name,
        });
      }
    }

    return mess;
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteProductMessage, { name });
    return mess;
  };

  return (
    <>
      <Modal
        width={600}
        className="delete-confirm-modal"
        title={titleModal}
        closeIcon
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row>
          <Col span={24}>
            {preventDeleteProduct?.isPreventDelete === true ? (
              <>
                <div
                  className="text-content-notification"
                  dangerouslySetInnerHTML={{
                    __html: formatNotificationMessage(preventDeleteProduct?.productName),
                  }}
                ></div>
                <div className="table-notification">
                  {renderRowByIndex(
                    preventDeleteProduct?.reasonType,
                    preventDeleteProduct?.reasons
                  )}
                </div>
              </>
            ) : (
              <p
                dangerouslySetInnerHTML={{
                  __html: formatDeleteMessage(preventDeleteProduct?.productName),
                }}
              ></p>
            )}
          </Col>
        </Row>
        {preventDeleteProduct?.isPreventDelete === true ? (
          <Row className="btn-i-got-it">
            <Button type="primary" onClick={() => onCancel()}>
              {pageData.buttonIGotIt}
            </Button>
          </Row>
        ) : (
          <Row className="modal-footer">
            <Button className="mr-2" onClick={() => onCancel()}>
              {pageData.ignore}
            </Button>
            <Button danger onClick={() => onDelete(preventDeleteProduct?.productId)}>
              {pageData.delete}
            </Button>
          </Row>
        )}
      </Modal>
    </>
  );
}
