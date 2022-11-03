import React, { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Row, Col, Input, Button, message, Select, InputNumber } from "antd";
const { Option } = Select;

export default function AddNewAreaTable(props) {
  const {
    t,
    isModalVisible,
    listArea,
    selectedArea,
    onCancel,
    listTable,
    onAddTableItem,
    onRemoveTableItem,
    onChangeArea,
    onChangeNumberSeat,
    onChangeTableName,
    areaTableDataService,
  } = props;
  const [form] = Form.useForm();
  const pageData = {
    titleAddNewTable: t("areaTable.tableForm.titleAddNewTable"),
    areaName: t("areaTable.areaForm.areaName"),
    selectArea: t("areaTable.areaForm.selectArea"),
    pleaseSelectArea: t("areaTable.areaForm.pleaseSelectArea"),
    addtable: t("areaTable.tableForm.addtable"),
    nameTable: t("areaTable.tableForm.nameTable"),
    namePlaceholder: t("areaTable.tableForm.namePlaceholder"),
    numberOfSeat: t("areaTable.tableForm.numberSeat"),
    validNumberSeat: t("areaTable.tableForm.validNumberSeat"),
    addNew: t("button.addNew"),
    cancel: t("button.cancel"),
    createTableSuccess: t("messages.createTableSuccess"),
    max: 999999999,
  };

  useEffect(() => {
    props.func.current = getData;
  }, []);

  const getData = (data) => {
    if (data) {
      const { table } = data;
      form.setFieldsValue({
        table: {
          0: {
            name: table.name,
            numberOfSeat: null,
          },
        },
      });
    }
  };

  const onFinish = async () => {
    let req = {
      areaId: selectedArea,
      areaTables: listTable,
    };
    await areaTableDataService.createAreaTableByAreaIdAsync(req).then((res) => {
      if (res) {
        message.success(pageData.createTableSuccess);
        form.resetFields();
        onCancel();
      }
    });
  };

  const addNewTableItem = () => {
    form.validateFields().then(() => {
      let newTable = onAddTableItem();
      form.setFieldsValue({
        table: newTable,
      });
    });
  };

  const onChange = (id) => {
    form.resetFields();
    onChangeArea(id);
  };

  const handleCancelAndResetForm = () => {
    form.resetFields();
    onCancel();
  };

  const removeTableItem = (id) => {
    let newTable = onRemoveTableItem(id);
    form.setFieldsValue({
      table: newTable,
    });
  }

  return (
    <Modal
      className="modal-add-language"
      title={pageData.titleAddNewTable}
      closeIcon
      visible={isModalVisible}
      footer={(null, null)}
    >
      <Form form={form} name="basic" onFinish={onFinish}>
        <Row>
          <h4>{pageData.areaName}</h4>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            className="w-100"
            onChange={onChange}
            placeholder={pageData.selectArea}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            defaultValue={selectedArea}
          >
            {listArea?.map((item, index) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Row>
        <Row className="mt-3">
          <h4>{pageData.nameTable}</h4>
          <Row className="w-100">
            {listTable?.map((table, index) => {
              return (
                <>
                  <Col span={10}>
                    <Form.Item
                      name={["table", index, "name"]}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        className="w-100"
                        placeholder={pageData.namePlaceholder}
                        defaultValue={table.name}
                        onChange={(value) => onChangeTableName(table.id, value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name={["table", index, "numberOfSeat"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.validNumberSeat,
                        },
                      ]}
                      className="ml-3 w-100"
                    >
                      <InputNumber
                        min={1}
                        max={pageData.max}
                        className="w-100"
                        placeholder={pageData.numberOfSeat}
                        defaultValue={table.numberOfSeat}
                        onChange={(value) => onChangeNumberSeat(table.id, value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    {listTable?.length > 1 && (
                      <a onClick={() => removeTableItem(table.id)} className="float-right">
                        <DeleteOutlined className="icon-del" />
                      </a>
                    )}
                  </Col>
                </>
              );
            })}
          </Row>
        </Row>
        <Row className="mt-3">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addNewTableItem()}>
            {pageData.addtable}
          </Button>
        </Row>
        <Row className="float-center mt-3 bd-c-t">
          <Button className="mr-1 width-100" key="back" onClick={handleCancelAndResetForm}>
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
