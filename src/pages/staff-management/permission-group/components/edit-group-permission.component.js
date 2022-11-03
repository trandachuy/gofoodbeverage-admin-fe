import { Button, Card, Checkbox, Col, Collapse, Form, Input, Layout, message, Row, Space } from "antd";
import React, { useEffect, useState } from "react";

import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import permissionDataService from "data-services/permission/permission-data.service";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { capitalize } from "utils/index";
const { Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function EditGroupPermission(props) {
  const { t } = useTranslation();
  const history = useHistory();

  const pageData = {
    title: t("settings.createGroupPermission.edit"),
    btnCancel: t("button.cancel"),
    btnUpdate: t("button.update"),
    titlePermission: t("settings.createGroupPermission.titlePermission"),
    titleGeneralInformation: t("settings.createGroupPermission.titleGeneralInformation"),
    titleCheckboxAllPermissionGoFB: t("settings.createGroupPermission.titleCheckboxAllPermissionGoFB"),
    lblInputName: t("settings.createGroupPermission.lblInputName"),
    placeholderInputName: t("settings.createGroupPermission.placeholderInputName"),
    lblInputDescription: t("settings.createGroupPermission.lblInputDescription"),
    textFullPermission: t("settings.createGroupPermission.textFullPermission"),
    btnConfirmLeave: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    updateGroupPermissionSuccess: t("messages.updateGroupPermissionSuccess"),
  };

  const [form] = Form.useForm();
  const [permissions, setPermissions] = React.useState([]);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [permissionGroupData, setPermissionGroupData] = React.useState([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [groupPermissionId, setGroupPermissionId] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    //get list permission group
    const permissionGroupsResponse = await permissionDataService.getPermissionGroupsAsync();
    if (permissionGroupsResponse) {
      getGroupPermissionDetail(permissionGroupsResponse.permissionGroups);
    }
  }

  const getGroupPermissionDetail = async (listPermissionGroup) => {
    const { id } = props?.match?.params || {};
    setGroupPermissionId(id);
    const res = await permissionDataService.getGroupPermissionByIdAsync(id);
    setPermissionGroupData(res.groupPermission);
    if (listPermissionGroup.length > 0) {
      const permissionsDataRender = mappingPermissionGroups(
        listPermissionGroup,
        res.groupPermission.groupPermissionPermissions
      );
      setPermissions(permissionsDataRender);

      let checkFullPermission = permissionsDataRender?.find((p) => p?.checked === false);
      if (checkFullPermission == null || checkFullPermission == undefined) {
        setCheckedAll(true);
      }

      let formValue = form.getFieldsValue();
      formValue.name = res.groupPermission.name;
      formValue.description = res.groupPermission.description;
      form.setFieldsValue(formValue);
    }
  };

  const mappingPermissionGroups = (permissionGroups, permissionsDetail) => {
    return permissionGroups?.map((permission, index) => {
      const childrens = permission.permissions?.map((permission) => {
        const childPermissionName = capitalize(permission.name);
        const permissionItem = permissionsDetail?.find((p) => p.permissionId === permission.id);
        return {
          id: permission.id,
          name: childPermissionName,
          checked: permissionItem ? true : false,
        };
      });

      const permissionName = capitalize(permission.name);
      return {
        id: permission.id,
        name: permissionName,
        checkboxName: `${pageData.textFullPermission} ${permissionName}`,
        checked: false,
        children: childrens,
      };
    });
  };

  const onClickSavePermission = () => {
    form.validateFields().then((values) => {
      const updatePermissionGroup = {
        permissionName: values?.name,
        description: values?.description,
        permissions: permissions,
      };
      onUpdateGroupPermission(updatePermissionGroup);
    });
  };

  const onUpdateGroupPermission = async (values) => {
    let permissions = [];
    values.permissions.forEach((permission) => {
      const childPermissions = permission.children.filter((p) => p.checked);
      permissions = [...permissions, ...childPermissions];
    });

    const createGroupPermissionRequestModel = {
      groupPermissionId: groupPermissionId,
      groupPermissionName: values.permissionName,
      description: values.description,
      permissionIds: permissions.map((p) => p.id),
    };

    const res = await permissionDataService.updateGroupPermissionByIdAsync(createGroupPermissionRequestModel);
    if (res) {
      message.success(pageData.updateGroupPermissionSuccess);
      onCompleted();
    }
  };

  /// Check all permission gof&b
  const isCheckedAll = () => {
    let anyUnchecked = permissions.some(
      (permission) => permission.checked === false || permission.children.some((child) => child.checked === false)
    );

    return anyUnchecked ? false : true;
  };

  /// Permission checkbox
  const onChangeCheckbox = (e, child, parent) => {
    let parentPermission = permissions.find((permission) => permission.id === parent.id);
    let childPermission = parentPermission.children.find((permission) => permission.id === child.id);
    if (childPermission) {
      let checked = e.target.checked;
      childPermission.checked = checked;
    }

    /// Check parent permission
    let countChecked = parentPermission.children.filter((child) => child.checked === false).length;
    if (countChecked > 0) {
      parentPermission.checked = false;
    }
    if (countChecked === 0) {
      parentPermission.checked = true;
    }

    isCheckedAll() ? setCheckedAll(true) : setCheckedAll(false);
    setPermissions([...permissions]);
  };

  /// Full permissions
  const onChangeCheckboxFullPermissions = (e, id) => {
    const checked = e.target.checked;
    let permission = permissions.find((permission) => permission.id === id);
    if (permission) {
      permission.checked = checked;
      let childrens = permission.children;
      childrens.forEach((element) => {
        element.checked = checked;
      });
    }

    isCheckedAll() ? setCheckedAll(true) : setCheckedAll(false);
    setPermissions([...permissions]);
  };

  /// Full permission on GoF&B
  const onChangeCheckAllPermissions = (e) => {
    let checked = e.target.checked;
    permissions.forEach((permission) => {
      permission.checked = checked;
      permission.children.forEach((child) => {
        child.checked = checked;
      });
    });

    isCheckedAll() ? setCheckedAll(true) : setCheckedAll(false);
    setPermissions([...permissions]);
  };

  const renderPermissionCardHeader = (title, checkboxTitle, checked, onChangeCheckboxFullPermissions) => {
    return (
      <Row>
        <Col span={18}>
          <div className="float-left">
            <p>
              <b>{title}</b>
            </p>
          </div>
        </Col>
        <Col span={6}>
          <div className="float-right">
            <Checkbox checked={checked} onChange={onChangeCheckboxFullPermissions}>
              {checkboxTitle}
            </Checkbox>
          </div>
        </Col>
      </Row>
    );
  };

  const renderPermissionCard = (permission, key) => {
    const countPermissionItem = permission.children.length;
    let countPermissionEdit = 0;
    const renderCardBody = permission.children.map((child, index) => {
      const countItem = permissionGroupData.groupPermissionPermissions.find((p) => p.permissionId === child.id);
      if (countItem) {
        countPermissionEdit = countPermissionEdit + 1;
      }
      return (
        <Col key={index} span={6} className="mt-2 mb-2">
          <Checkbox key={index} checked={child.checked} onChange={(e) => onChangeCheckbox(e, child, permission)}>
            {child.name}
          </Checkbox>
        </Col>
      );
    });
    if (!isEdit) {
      if (countPermissionItem === countPermissionEdit) {
        permission.checked = true;
      } else {
        permission.checked = false;
      }
      setIsEdit(true);
    }

    return (
      <Collapse key={key} collapsible="header" defaultActiveKey={["1"]}>
        <Panel
          key={permission.id}
          className="card-collapse-header"
          header={renderPermissionCardHeader(permission.name, permission.checkboxName, permission.checked, (e) =>
            onChangeCheckboxFullPermissions(e, permission.id)
          )}
        >
          <Row>{renderCardBody}</Row>
        </Panel>
      </Collapse>
    );
  };

  const onLeavePage = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/staff", { tabPermissionGroup: 2 });
    }, 100);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" htmlType="submit" onClick={() => onClickSavePermission()}>
                    {pageData.btnUpdate}
                  </Button>
                ),
                permission: PermissionKeys.ADMIN,
              },
              {
                action: (
                  <a onClick={() => onLeavePage()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Content>
          <p className="pb-0 mb-1">
            <b>{pageData.titleGeneralInformation}</b>
          </p>
          <Row>
            <Card className="w-100 card-body-bottom-0">
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={pageData.lblInputName}
                  rules={[
                    { required: true },
                    { type: "string", warningOnly: true },
                    { type: "string", max: 50, min: 3 },
                  ]}
                >
                  <Input placeholder={pageData.placeholderInputName} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label={pageData.lblInputDescription}>
                  <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
              </Col>
            </Card>
          </Row>
        </Content>

        <Content className="mt-3">
          <p className="pb-0 mb-1">
            <b>{pageData.titlePermission}</b>
          </p>
          <Row>
            <Card className="w-100">
              <Row>
                <Col span={24}>
                  <Checkbox checked={checkedAll} onChange={(e) => onChangeCheckAllPermissions(e)}>
                    {pageData.titleCheckboxAllPermissionGoFB}
                  </Checkbox>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col span={24}>
                  <Space direction="vertical" className="w-100">
                    {permissions.map((permission, index) => {
                      return renderPermissionCard(permission, index);
                    })}
                  </Space>
                </Col>
              </Row>
            </Card>
          </Row>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.btnConfirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
