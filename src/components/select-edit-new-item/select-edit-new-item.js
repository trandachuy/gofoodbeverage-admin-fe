import React, { useEffect, useState } from "react";
import { Input, Select, Divider, Typography, Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

export default function SelectEditComponent(props) {
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
    isEditProduct,
    className,
  } = props;

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (isEditProduct) {
      props.functions.current = setValue;
    }
  }, []);

  return (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      value={value}
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
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
}
