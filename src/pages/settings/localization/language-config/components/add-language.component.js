import React from "react";
import { Form, Modal, Row, Col, Select, Button, message } from "antd";
import Flags from "country-flag-icons/react/3x2";
import languageDataService from "data-services/language/language-data.service";

const { Option } = Select;
export default function AddLanguage(props) {
  const { t, languageList, handleCancel, onLoadLanguage, initDataTable } = props;
  const [form] = Form.useForm();
  const pageData = {
    cancel: t("button.cancel"),
    addNew: t("button.addNew"),
    language: t("languageConfig.language"),
    addNewLanguage: t("languageConfig.addNewLanguage"),
    selectLanguage: t("languageConfig.selectLanguage"),
    createLanguageStoreSuccess: t("messages.createLanguageStoreSuccess"),
    required: t("messages.required"),
  };

  const onCancel = async () => {
    await form.resetFields();
    handleCancel();
  };

  const onFinish = async (values) => {
    let res = await languageDataService.createLanguageStoreAsync(values);
    if (res) {
      form.resetFields();
      message.success(`${t(res.languageName)} ${pageData.createLanguageStoreSuccess}`);
      handleCancel();
      await onLoadLanguage();
      initDataTable();
    }
  };

  return (
    <Modal
      className="modal-add-language"
      title={pageData.addNewLanguage}
      closeIcon
      visible={props.isModalVisible}
      footer={(null, null)}
    >
      <Form form={form} name="basic" onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <h3>{pageData.language}</h3>
          </Col>
          <Col span={24}>
            <Form.Item
              name="languageId"
              rules={[
                {
                  required: true,
                  message: pageData.required,
                },
              ]}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder={pageData.selectLanguage}
                size="large"
              >
                {languageList?.map((item) => {
                  var Flag = Flags[item.emoji];
                  return (
                    <Option value={item?.id}>
                      {<Flag className="flag-icon" />} {t(item?.name)}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className="float-center mt-3 bd-c-t">
          <Button className="mr-1 width-100" key="back" onClick={() => onCancel()}>
            {pageData.cancel}
          </Button>
          <Button className="width-100" type="primary" htmlType="submit">
            {pageData.addNew}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
