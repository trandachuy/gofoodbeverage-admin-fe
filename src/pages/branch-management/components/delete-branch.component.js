import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./delete-branch.component.scss";

export default function DeleteBranch(props) {
  const [t] = useTranslation();
  const { infoPurchaseOrder, isModalVisible, titleModal, handleCancel, onDelete } = props;
  const linkPO = "/inventory/detail-purchase-order/";
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    delete: t("button.delete"),
    deleteBranchNotificationMessage: t("messages.deleteBranchNotificationMessage"),
    deleteBranchMessage: t("messages.deleteBranchMessage"),
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
    let mess = t(pageData.deleteBranchNotificationMessage, { name: name });
    return mess;
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.deleteBranchMessage, { name });
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
            {infoPurchaseOrder.isOpenPurchaseOrder ? (
              <>
                <div
                  className="text-content-notification"
                  dangerouslySetInnerHTML={{
                    __html: formatNotificationMessage(infoPurchaseOrder?.branch?.name),
                  }}
                ></div>
                <div className="table-notification">
                  {renderRowByIndex(infoPurchaseOrder?.purchaseOrders)}
                </div>
              </>
            ) : (
              <p
                dangerouslySetInnerHTML={{
                  __html: formatDeleteMessage(infoPurchaseOrder?.branch?.name),
                }}
              ></p>
            )}
          </Col>
        </Row>
        {infoPurchaseOrder.isOpenPurchaseOrder ? (
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
              onClick={() =>
                onDelete(infoPurchaseOrder?.branch?.id, infoPurchaseOrder?.branch?.name)
              }
            >
              {pageData.delete}
            </Button>
          </Row>
        )}
      </Modal>
    </>
  );
}
