import React, { useEffect, useState } from "react";
import { Form, Modal, Row, Col, Input, Button, message, Switch } from "antd";
import { useTranslation } from "react-i18next";
import areaDataService from "data-services/area/area-data.service";

const { TextArea } = Input;
export default function EditAreaComponent(props) {
  const [t] = useTranslation();
  const { handleCancel, storeBranchId } = props;
  const [form] = Form.useForm();
  const pageData = {
    active: t("status.active"),
    inActive: t("status.inactive"),
    area: t("area.area"),
    updateArea: t("area.updateArea"),
    areaName: t("area.areaName"),
    areaNameMaxLength: 100,
    description: t("form.description"),
    descriptionMaxLength: 2000,
    cancel: t("button.cancel"),
    save: t("button.save"),
    enterAreaName: t("area.enterAreaName"),
    pleaseEnterAreaName: t("area.pleaseEnterAreaName"),
    areaUpdatedSuccessfully: t("area.areaUpdatedSuccessfully"),
  };

  useEffect(() => {
    form.setFieldsValue({
      storeBranchId: storeBranchId,
    });
    props.func.current = setInitData;
  });

  const setInitData = recordId => {
    let request = {
      id: recordId,
      storeBranchId: storeBranchId,
    };
    areaDataService.getAreaByIdAsync(request).then(res => {
      if (res.area) {
        const { id, description, name, isActive } = res.area;
        const formValues = {
          id: id,
          name: name,
          description: description,
          isActive: isActive,
        };
        form.setFieldsValue(formValues);
      }
    });
  };

  const onCancel = async () => {
    await form.resetFields();
    handleCancel();
  };

  const onFinish = async values => {
    let res = await areaDataService.updateAreaAsync(values);
    if (res) {
      form.resetFields();
      message.success(pageData.areaUpdatedSuccessfully);
      handleCancel(storeBranchId);
    }
  };

  return (
    <Modal
      className="modal-add-language"
      title={pageData.updateArea}
      closeIcon
      visible={props.isModalVisible}
      footer={(null, null)}
    >
      <Form autoComplete="off" form={form} name="basic" onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item name="isActive" valuePropName="checked" className="float-right">
              <Switch checkedChildren={pageData.active} unCheckedChildren={pageData.inActive} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h3>{pageData.areaName}</h3>
          </Col>
          <Col span={24}>
            <Form.Item name="id" className="d-none">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="storeBranchId" className="d-none">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: pageData.pleaseEnterAreaName,
                },
              ]}
            >
              <Input size="large" placeholder={pageData.enterAreaName} autoComplete="none" maxLength={pageData.areaNameMaxLength} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h3>{pageData.description}</h3>
          </Col>
          <Col span={24}>
            <Form.Item name="description">
              <TextArea size="large" rows={4} placeholder={`${pageData.description} ${pageData.area}`} maxLength={pageData.descriptionMaxLength} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="float-center mt-3 bd-c-t">
          <Button className="mr-1 width-100" key="back" onClick={() => onCancel()}>
            {pageData.cancel}
          </Button>
          <Button className="width-100" type="primary" htmlType="submit">
            {pageData.save}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
