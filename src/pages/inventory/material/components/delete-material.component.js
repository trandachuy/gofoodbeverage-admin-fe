import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./delete-material.component.scss";

export default function DeleteMaterial(props) {
  const [t] = useTranslation();
  const { infoMaterial, isModalVisible, titleModal, handleCancel, onDelete } = props;
  const linkPO = "/inventory/detail-purchase-order/";
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    delete: t("button.delete"),
    deleteMaterialNotificationMessage: t("messages.deleteMaterialNotificationMessage"),
    deleteMaterialMessage: t("messages.deleteMaterialMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
  };

  const onCancel = () => {
    handleCancel();
  };

  const renderRowByIndex = (purchaseOrders) => {
    let elements = [];
    for (var item = 0; item < purchaseOrders?.length; item += 2) {
      let element = (
        <div className="po-row">
          <div className="po-row-item">
            <span>{item + 1}.</span>
            <Link to={`${linkPO}${purchaseOrders[item]?.id}`} target="_blank">
              {purchaseOrders[item]?.code}
            </Link>
          </div>
          <div className="po-row-item">
            {purchaseOrders[item + 1]?.id === null || <span>{item + 2}.</span>}
            <Link to={`${linkPO}${purchaseOrders[item + 1]?.id}`} target="_blank">
              {purchaseOrders[item + 1]?.code}
            </Link>
          </div>
        </div>
      );
      elements.push(element);
    }
    return elements;
  };

  const formatNotificationMessage = (name) => {
    let mess = t(pageData.deleteMaterialNotificationMessage, { name: name });
    return mess;
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteMaterialMessage, { name });
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
            {infoMaterial.isOpenPurchaseOrder ? (
              <>
                <div
                  className="text-content-notification"
                  dangerouslySetInnerHTML={{
                    __html: formatNotificationMessage(infoMaterial?.material?.name),
                  }}
                ></div>
                <div className="table-notification">
                  {renderRowByIndex(infoMaterial?.purchaseOrders)}
                </div>
              </>
            ) : (
              <p
                dangerouslySetInnerHTML={{
                  __html: formatDeleteMessage(infoMaterial?.material?.name),
                }}
              ></p>
            )}
          </Col>
        </Row>
        {infoMaterial.isOpenPurchaseOrder ? (
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
            <Button
              danger
              onClick={() => onDelete(infoMaterial?.material?.id, infoMaterial?.material?.name)}
            >
              {pageData.delete}
            </Button>
          </Row>
        )}
      </Modal>
    </>
  );
}
