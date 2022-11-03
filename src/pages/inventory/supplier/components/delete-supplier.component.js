import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./delete-supplier.scss";

export default function DeleteSupplier(props) {
  const [t] = useTranslation();
  const { infoSupplier, isModalVisible, titleModal, handleCancel, onDelete } = props;
  const linkPO = "/inventory/detail-purchase-order/";
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    delete: t("button.delete"),
    deleteNotificationMessage: t("supplier.deleteNotificationMessage"),
    deleteSupplierMessage: t("supplier.deleteSupplierMessage"),
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
    let mess = t(pageData.deleteNotificationMessage, { name: name });
    return mess;
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteSupplierMessage, { name });
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
            {infoSupplier.isOpenPurchaseOrder ? (
              <>
                <div
                  className="text-content-notification"
                  dangerouslySetInnerHTML={{ __html: formatNotificationMessage(infoSupplier?.supplier?.name) }}
                ></div>
                <div className="table-notification">{renderRowByIndex(infoSupplier?.purchaseOrders)}</div>
              </>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: formatDeleteMessage(infoSupplier?.supplier?.name) }}></p>
            )}
          </Col>
        </Row>
        {infoSupplier.isOpenPurchaseOrder ? (
          <Row className="btn-i-got-it">
            <Button type="primary" key="back" onClick={() => onCancel()}>
              {pageData.buttonIGotIt}
            </Button>
          </Row>
        ) : (
          <Row className="modal-footer">
            <Button className="mr-2" key="back" onClick={() => onCancel()}>
              {pageData.ignore}
            </Button>
            <Button
              danger
              key="back"
              onClick={() => onDelete(infoSupplier?.supplier?.id, infoSupplier?.supplier?.name)}
            >
              {pageData.delete}
            </Button>
          </Row>
        )}
      </Modal>
    </>
  );
}
