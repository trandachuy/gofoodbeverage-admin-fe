import React from "react";
import { Modal, Row, Input, Table, Space } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.scss";

const MemberModal = props => {
  const columnsMember = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: "staffCode",
      width: "45%",
      className: "th-center",
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      width: "45%",
      className: "th-center",
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      className: "th-td-center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => props.onRemoveMember(record)}>
            <DeleteOutlined className="icon-del" />
          </a>
        </Space>
      ),
    },
  ];

  const onSearch = event => {
    setTimeout(() => {
      if (event.target.value !== null) {
        /// TODO: Search staff
      }
    }, 500);
  };

  return (
    <>
      <Modal visible={props.isModalVisible} onCancel={props.closeModal} footer={null} className="form-modal">
        <Row>
          <h3>Group`s Member</h3>
        </Row>
        <Row>
          <Input
            allowClear
            onChange={onSearch}
            className="input-search"
            size="large"
            placeholder="Search by staff name or staff code"
            prefix={<SearchOutlined />}
          />
        </Row>
        <Row>
          <Table bordered className="tabel-member" columns={columnsMember} dataSource={props.listmember} />
        </Row>
      </Modal>
    </>
  );
};

export default MemberModal;
