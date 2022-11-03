import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../../inventory/material/components/delete-material.component.scss";

export default function EditProductInCombo(props) {
  const [t] = useTranslation();
  const { combos, isModalVisible, titleModal, handleCancel } = props;
  const linkProduct = "/combo/detail/";
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    deactivate: t("status.deactivate"),
    productComboValidate: t("combo.product.productComboValidate"),
    deleteMaterialMessage: t("messages.deleteMaterialMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
  };

  const onCancel = () => {
    handleCancel();
  };

  const renderRowByIndex = (combos) => {
    let elements = [];
    for (var item = 0; item < combos?.length; item++) {
      let element = (
        <div className="po-row">
          <div className="po-row-item w-100">
            <span>{item + 1}.</span>
            <Link to={`${linkProduct}${combos[item]?.id}`} target="_blank">
              {combos[item]?.name}
            </Link>
          </div>
        </div>
      );
      elements.push(element);
    }
    return elements;
  };

  const formatNotificationMessage = () => {
    let mess = t(pageData.productComboValidate);
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
                __html: formatNotificationMessage(),
              }}
            ></div>
            <div className="table-notification">{renderRowByIndex(combos)}</div>
          </Col>
        </Row>

        <Row className="btn-i-got-it">
          <Button type="primary" onClick={() => onCancel()}>
            {pageData.buttonIGotIt}
          </Button>
        </Row>
      </Modal>
    </>
  );
}
