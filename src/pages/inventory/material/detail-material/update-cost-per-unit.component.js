import { Button, Col, Form, InputNumber, message, Modal, Row } from "antd";
import { MaximumNumber } from "constants/default.constants";
import materialDataService from "data-services/material/material-data.service";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./update-cost-per-unit.component.scss";

export default function UpdateCostPerUnitComponent(props) {
  const [t] = useTranslation();
  const { isModalVisible, handleCancel, materialId, setCostPerUnit, renderBaseUnitLabel } = props;
  const [form] = Form.useForm();
  const pageData = {
    buttonIGotIt: t("form.buttonIGotIt"),
    ignore: t("button.ignore"),
    update: t("button.update"),
    deleteMaterialNotificationMessage: t("messages.deleteMaterialNotificationMessage"),
    deleteMaterialMessage: t("messages.deleteMaterialMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    currentCostPerUnit: t("material.currentCostPerUnit"),
    updateMaterialCost: t("material.updateMaterialCost"),
    cosPerUnitEmpty: t("material.cosPerUnitEmpty"),
    updateMaterialCostSuccessfully: t("material.updateMaterialCostSuccessfully"),
    cosPerUnitPlaceholder: t("material.inventory.cosPerUnitPlaceholder"),
  };

  useEffect(() => {
    props.tableFuncs.current = onInitData;
  }, []);

  const onCancel = () => {
    handleCancel();
  };

  const onInitData = (cosPerUnit) => {
    let formValue = {
      cosPerUnit: cosPerUnit,
    };
    form.setFieldsValue(formValue);
  };

  const onEditMaterial = (values) => {
    if (!values.cosPerUnit) {
      form.setFields([
        {
          name: ["cosPerUnit"],
          errors: [pageData.cosPerUnitEmpty],
        },
      ]);
    } else {
      var req = { id: materialId, costPerUnit: values.cosPerUnit };
      materialDataService.updateCostPerUnitByMaterialIdAsync(req).then((res) => {
        if (res) {
          message.success(pageData.updateMaterialCostSuccessfully);
          onCancel();
          setCostPerUnit(values.cosPerUnit);
          let formValue = {
            cosPerUnit: values.cosPerUnit,
          };
          form.setFieldsValue(formValue);
        }
      });
    }
  };

  return (
    <>
      <Modal
        width={640}
        className="delete-confirm-modal"
        title={pageData.updateMaterialCost}
        closeIcon
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Form form={form} name="basic" onFinish={onEditMaterial} autoComplete="off" id="formCosPerUnit">
          <div className="text-content-notification">
            <div className="w-100">
              <Row>
                <Col span={12}>
                  <h4 className="fnb-form-label float-left">
                    {pageData.currentCostPerUnit}
                    <span className="text-danger">*</span>
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="cosPerUnit"
                    rules={[
                      {
                        required: true,
                        message: pageData.cosPerUnitEmpty,
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-100 fnb-input-number"
                      placeholder={pageData.cosPerUnitPlaceholder}
                      min={1}
                      max={MaximumNumber}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      addonAfter={renderBaseUnitLabel()}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
        <Row className="modal-footer">
          <Button className="mr-2" onClick={() => onCancel()}>
            {pageData.ignore}
          </Button>
          <Button type="primary" htmlType="submit" form="formCosPerUnit">
            {pageData.update}
          </Button>
        </Row>
      </Modal>
    </>
  );
}
