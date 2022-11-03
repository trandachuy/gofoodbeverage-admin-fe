import React from "react";
import { Input, Space, Select, Divider, Typography, Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./select-add-new-item.scss";

const { Text } = Typography;

export default function SelectAddNewComponent(props) {
  const {
    placeholder,
    pleaseEnterName,
    nameExisted,
    btnAddNew,
    listOption,
    onChangeOption,
    onNameChange,
    addNewItem,
    isNameExisted,
    name,
    className,
  } = props;

  return (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      autoBlur={false}
      className={`w-100 fnb-select-single ${className}`}
      onChange={onChangeOption}
      placeholder={placeholder}
      dropdownClassName="fnb-select-single-dropdown"
      dropdownRender={(menu) => (
        <>
          <Row align="middle" justify="center">
            <Col span={24}>
              <Row align="middle" justify="center">
                <Col xs={24} sm={24} md={24} lg={14} style={{ padding: 8 }}>
                  <Input
                    maxLength={50}
                    placeholder={pleaseEnterName}
                    value={name}
                    onChange={onNameChange}
                    className="fnb-input input-add-new-select"
                  />
                  {isNameExisted && (
                    <>
                      <Text type="danger">{nameExisted}</Text>
                    </>
                  )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} style={{ paddingLeft: 8 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined className="icon-btn-add-new-select" />}
                    onClick={addNewItem}
                  >
                    {btnAddNew}
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Divider style={{ margin: "8px 0" }} />
              {menu}
            </Col>
          </Row>
        </>
      )}
    >
      {listOption?.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
}
