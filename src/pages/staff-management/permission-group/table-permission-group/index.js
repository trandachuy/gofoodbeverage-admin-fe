import { Col, Form, Row, Space } from "antd";
import { FnbEditFillIcon } from "components/fnb-edit-fill-icon/fnb-edit-fill-icon";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbTooltip } from "components/fnb-tooltip/fnb-tooltip";
import { FnbTrashFillIcon } from "components/fnb-trash-fill-icon/fnb-trash-fill-icon";
import { useState } from "react";
import "../index.scss";
import MemberModal from "../member-modal";

export default function TablePermissionGroup(props) {
  const { t, onEditPermissionGroup } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listmember, setListMember] = useState([]);

  //name columns Permission Group
  const columnsPermissionGroup = [
    {
      title: t("settings.groupPermissionTable.no").toUpperCase(),
      dataIndex: "no",
      key: "no",
      width: "5%",
      render: (value, record) => {
        return (
          <a className="link-member" onClick={() => {}}>
            {"#" + value}
          </a>
        );
      },
      responsive: ["xl"],
    },
    {
      title: t("settings.groupPermissionTable.groupName").toUpperCase(),
      dataIndex: "groupName",
      key: "groupName",
      width: "35%",
      render: (value, record) => {
        return (
          <>
            <div className="d-none d-block-xl">
              <a className="link-member" onClick={() => {}}>
                {"#" + record?.no}
              </a>
              <div className="clearfix mt-2 mb-2">
                <FnbTooltip className="fnb-text-nowrap" text={value} />
              </div>
              <a className="link-member" onClick={() => handleClickGroupMember(record)}>
                {record.member}
              </a>
            </div>
            <FnbTooltip className="fnb-text-nowrap d-none-xl" text={value} />
          </>
        );
      },
    },
    {
      title: t("settings.groupPermissionTable.member").toUpperCase(),
      dataIndex: "member",
      key: "member",
      width: "20%",
      render: (_, record) => {
        return <a onClick={() => handleClickGroupMember(record)}>{record.member}</a>;
      },
      responsive: ["xl"],
    },
    {
      title: t("settings.groupPermissionTable.createdBy").toUpperCase(),
      dataIndex: "createdBy",
      key: "createdBy",
      width: "25%",
      responsive: ["xl"],
    },
    {
      title: t("settings.groupPermissionTable.action").toUpperCase(),
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onEditPermissionGroup(record.id)}>
            <FnbEditFillIcon />
          </a>
          <a hidden={true} onClick={() => onRemoveItem(record)}>
            <FnbTrashFillIcon />
          </a>
        </Space>
      ),
    },
  ];

  const handleClickGroupMember = (record) => {
    const dataMember = [
      {
        staffCode: "ST-1001",
        staffName: "Nguyen Van A",
      },
    ];
    setListMember(dataMember);
    setIsModalVisible(true);
  };

  const onRemoveItem = (record) => {
    /// TODO: remove item
  };

  const onRemoveMember = (record) => {
    /// TODO: remove member
  };

  return (
    <Form className="form-staff">
      <Row gutter={[24, 24]} className="row-reverse">
        <Col md={24} lg={24} xl={4}>
          <div className="action-add-new-button">{props?.renderAddNewButton && props?.renderAddNewButton()}</div>
        </Col>
        <Col md={24} lg={24} xl={20}></Col>
      </Row>
      <Row>
        <FnbTable
          className="fnb-table form-table mt-3"
          columns={columnsPermissionGroup}
          dataSource={props.dataSource}
          pageSize={props.pageSize}
          pageNumber={props?.currentPage}
          total={props.total}
          onChangePage={props.onChangePage}
          numberRecordCurrent={() => {
            let numberRecordCurrent = props?.currentPage * props.pageSize ?? 0;
            if (numberRecordCurrent > props.total) {
              numberRecordCurrent = props.total;
            }
            return numberRecordCurrent;
          }}
          search={{
            placeholder: t("settings.searchGroupPermissionPlaceHolder"),
            onChange: props.onSearch,
          }}
        />
      </Row>
      <MemberModal
        listmember={listmember}
        isModalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        onRemoveMember={onRemoveMember}
      />
    </Form>
  );
}
