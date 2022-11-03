import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Switch } from "antd";
import { TableName } from "constants/areaTable.constants";
import { useEffect, useState } from "react";
import { randomGuid } from "utils/helpers";
const { Option } = Select;

export default function EditAreaTable(props) {
  const { t, isModalVisible, listArea, storeBranchId, selectedArea, onCancel, areaTableDataService } = props;
  const [form] = Form.useForm();
  const [currentListTable, setCurrentListTable] = useState([]);

  const pageData = {
    active: t("status.active"),
    inActive: t("status.inactive"),
    titleUpdateTable: t("areaTable.tableForm.titleUpdateTable"),
    areaName: t("areaTable.areaForm.areaName"),
    selectArea: t("areaTable.areaForm.selectArea"),
    pleaseSelectArea: t("areaTable.areaForm.pleaseSelectArea"),
    updateTable: t("areaTable.tableForm.updateTable"),
    nameTable: t("areaTable.tableForm.nameTable"),
    namePlaceholder: t("areaTable.tableForm.namePlaceholder"),
    numberOfSeat: t("areaTable.tableForm.numberSeat"),
    validNumberSeat: t("areaTable.tableForm.validNumberSeat"),
    addNew: t("button.addNew"),
    update: t("button.update"),
    cancel: t("button.cancel"),
    updateTableSuccess: t("areaTable.updateTableSuccess"),
    updateTableFail: t("areaTable.updateTableFail"),
    max: 999999999,
  };

  const onFinish = (values) => {
    areaTableDataService.updateAreaTableByAreaIdAsync(values).then((res) => {
      if (res) {
        form.resetFields();
        message.success(pageData.updateTableSuccess);
        onCancel();
      } else {
        message.error(pageData.updateTableFail);
      }
    });
  };

  useEffect(() => {
    props.func.current = getEditData;
  }, []);

  const getEditData = (data) => {
    if (data) {
      setCurrentListTable(data.tables);
      form.setFieldsValue({
        id: data.id,
        storeBranchId: storeBranchId,
        areaId: data.areaId,
        isActive: data.isActive,
        tables: {
          0: {
            id: data.tables[0].id,
            name: data.tables[0].name,
            numberOfSeat: data.tables[0].numberOfSeat,
          },
        },
      });
    }
  };

  const addNewTableItem = () => {
    let table = {
      id: randomGuid(),
      name: `${TableName} 1`,
      numberOfSeat: 0,
    };
    setCurrentListTable([...currentListTable, table]);
  };

  const onRemoveTable = (index) => {
    const formValues = form.getFieldsValue();
    let newListTable = formValues.tables;
    newListTable.splice(index, 1);
    formValues.tables = newListTable;
    form.setFieldsValue(formValues);
    setCurrentListTable(newListTable)
  };

  const handleCancelAndResetForm = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      className="modal-add-language"
      title={pageData.titleUpdateTable}
      closeIcon
      visible={isModalVisible}
      footer={(null, null)}
    >
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
        <Row>
          <Col span={24}>
            <Form.Item name="isActive" valuePropName="checked" className="float-right">
              <Switch checkedChildren={pageData.active} unCheckedChildren={pageData.inActive} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h4>{pageData.areaName}</h4>
            <Form.Item
              name="areaId"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                className="w-100"
                placeholder={pageData.selectArea}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                defaultValue={selectedArea}
              >
                {listArea?.map((item) => (
                  <Option value={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className="mt-3">
          <h4>{pageData.nameTable}</h4>
          <Row className="w-100">
            {currentListTable?.map((table, index) => {
              return (
                <>
                  <Form.Item name={["tables", index, "id"]} hidden="true"></Form.Item>
                  <Col span={10}>
                    <Form.Item
                      name={["tables", index, "name"]}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input className="w-100" placeholder={pageData.namePlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name={["tables", index, "numberOfSeat"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.validNumberSeat,
                        },
                      ]}
                      className="ml-3 w-100"
                    >
                      <InputNumber min={1} className="w-100" placeholder={pageData.numberOfSeat} max={pageData.max} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    {currentListTable?.length > 1 && (
                      <a onClick={() => onRemoveTable(index)} className="float-right">
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
            {pageData.addNew}
          </Button>
        </Row>
        <Row className="float-center mt-3 bd-c-t">
          <Button className="mr-1 width-100" key="back" onClick={handleCancelAndResetForm}>
            {pageData.cancel}
          </Button>
          <Button className="width-100" type="primary" htmlType="submit">
            {pageData.update}
          </Button>
        </Row>
        <Form.Item name="id" hidden="true"></Form.Item>
        <Form.Item name="storeBranchId" hidden="true"></Form.Item>
      </Form>
    </Modal>
  );
}
