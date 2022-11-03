import React from "react";
import { Modal, Row, Col, Button } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./delete-material.component.scss";

export default function DeleteProductRecipes(props) {
  const [t] = useTranslation();
  const { infoMaterial, isModalVisible, titleModal, handleCancel, onDelete } =
    props;
  const linkProduct = "/product/details/";
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    deactivate: t("status.deactivate"),
    deleteProductPriceMaterialNotificationMessage: t(
      "messages.deleteProductPriceMaterialNotificationMessage"
    ),
    deleteMaterialMessage: t("messages.deleteMaterialMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
  };

  const onCancel = () => {
    handleCancel();
  };

  const renderRowByIndex = (products) => {
    let elements = [];
    for (var item = 0; item < products?.length; item++) {
      let element = (
        <div className="po-row">
          <div className="po-row-item w-100">
            <span>{item + 1}.</span>
            <Link to={`${linkProduct}${products[item]?.id}`} target="_blank">
              {products[item]?.name}
            </Link>
          </div>
        </div>
      );
      elements.push(element);
    }
    return elements;
  };

  const formatNotificationMessage = (name) => {
    let mess = t(pageData.deleteProductPriceMaterialNotificationMessage, { name: name });
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
            <div
              className="text-content-notification"
              dangerouslySetInnerHTML={{
                __html: formatNotificationMessage(
                  infoMaterial?.material?.name
                ),
              }}
            ></div>
            <div className="table-notification">
              {renderRowByIndex(infoMaterial?.products)}
            </div>
          </Col>
        </Row>

        <Row className="modal-footer">
          <Button className="mr-2" onClick={() => onCancel()}>
            {pageData.ignore}
          </Button>
          <Button
            type="primary"
            onClick={() =>
              onDelete()
            }
          >
            {pageData.deactivate}
          </Button>
        </Row>
      </Modal>
    </>
  );
}
