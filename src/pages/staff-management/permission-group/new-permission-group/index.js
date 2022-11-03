import { Button, Card, Checkbox, Col, Collapse, Form, Input, Layout, message, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import PageTitle from "components/page-title";
import { ArrowActivePanelIcon, ArrowDeActivePanelIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import permissionDataService from "data-services/permission/permission-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { capitalize } from "utils/index";
import "../index.scss";
const { Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function NewPermissionGroup(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    titlePermission: t("settings.createGroupPermission.titlePermission"),
    titleGeneralInformation: t("settings.createGroupPermission.titleGeneralInformation"),
    titleCheckboxAllPermissionGoFB: t("settings.createGroupPermission.titleCheckboxAllPermissionGoFB"),
    lblInputName: t("settings.createGroupPermission.lblInputName"),
    placeholderInputName: t("settings.createGroupPermission.placeholderInputName"),
    lblInputDescription: t("settings.createGroupPermission.lblInputDescription"),
    textFullPermission: t("settings.createGroupPermission.textFullPermission"),
    backToPermissionGroup: t("settings.createGroupPermission.backToPermissionGroup"),
    titleCreatePermission: t("settings.createGroupPermission.titleCreatePermission"),
    btnConfirmLeave: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    createGroupPermissionSuccess: t("messages.createGroupPermissionSuccess"),
  };

  const [form] = Form.useForm();
  const [permissions, setPermissions] = React.useState([]);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    //get list permission group
    const permissionGroupsResponse = await permissionDataService.getPermissionGroupsAsync();
    if (permissionGroupsResponse) {
      const permissionsDataRender = mappingPermissionGroups(permissionGroupsResponse.permissionGroups);
      setPermissions(permissionsDataRender);
    }
  }

  const mappingPermissionGroups = (permissionGroups) => {
    return permissionGroups?.map((permission, index) => {
      const childrens = permission.permissions?.map((permission) => {
        const childPermissionName = capitalize(permission.name);
        return {
          id: permission.id,
          name: childPermissionName,
          checked: false,
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
      const newPermissionGroup = {
        permissionName: values?.name,
        description: values?.description,
        permissions: permissions,
      };

      onCreateGroupPermission(newPermissionGroup);
    });
  };

  const onCreateGroupPermission = async (values) => {
    let permissions = [];
    values.permissions.forEach((permission) => {
      const childPermissions = permission.children.filter((p) => p.checked);
      permissions = [...permissions, ...childPermissions];
    });

    const createGroupPermissionRequestModel = {
      groupPermissionName: values.permissionName,
      description: values.description,
      permissionIds: permissions.map((p) => p.id),
    };

    const res = await permissionDataService.createGroupPermissionAsync(createGroupPermissionRequestModel);
    if (res) {
      message.success(pageData.createGroupPermissionSuccess);

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
    let checked = e.target.checked;
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
        <Col span={12}>
          <div className="float-left">
            <div className="body-1">{title}</div>
          </div>
        </Col>
        <Col span={12}>
          <div className="float-right">
            <Checkbox checked={checked} onChange={onChangeCheckboxFullPermissions}>
              <div className="body-2">{checkboxTitle}</div>
            </Checkbox>
          </div>
        </Col>
      </Row>
    );
  };

  const renderPermissionCard = (permission, key) => {
    const renderCardBody = permission.children.map((child, index) => {
      return (
        <Col key={index} span={6} className="mt-2 mb-2">
          <Checkbox key={index} checked={child.checked} onChange={(e) => onChangeCheckbox(e, child, permission)}>
            <div className="body-2">{child.name}</div>
          </Checkbox>
        </Col>
      );
    });

    return (
      <Collapse
        key={key}
        collapsible="header"
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (isActive ? <ArrowActivePanelIcon /> : <ArrowDeActivePanelIcon />)}
      >
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
            <PageTitle content={pageData.titleCreatePermission} />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" htmlType="submit" onClick={() => onClickSavePermission()}>
                    {pageData.btnSave}
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
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        className="new-permission-group-format"
        onFieldsChange={(e) => changeForm(e)}
      >
        <Content>
          <Card className="w-100 card-body-bottom-0" style={{ background: "#FFFFFF" }}>
            <h2 style={{ marginBottom: "32px", marginTop: "9px" }}>{pageData.titleGeneralInformation}</h2>
            <Row style={{ marginBottom: "8px" }}>
              <Col span={24}>
                <h4 className="fnb-form-label" style={{ color: "#000000" }}>
                  {pageData.lblInputName}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true },
                    { type: "string", warningOnly: true },
                    { type: "string", max: 50, min: 3 },
                  ]}
                >
                  <Input
                    className="fnb-input-with-count"
                    showCount
                    maxLength={50}
                    placeholder={pageData.placeholderInputName}
                  />
                </Form.Item>
              </Col>
              <Col span={24} style={{ marginTop: "16px" }}>
                <h4 className="fnb-form-label" style={{ color: "#000000" }}>
                  {pageData.lblInputDescription}
                </h4>
                <Form.Item name="description">
                  <TextArea className="fnb-text-area-with-count no-resize" showCount maxLength={255} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Content>
        <Content style={{ marginTop: "32px" }}>
          <Row>
            <Card className="w-100" style={{ background: "#FFFFFF" }}>
              <h2 style={{ marginTop: "9px", marginBottom: "44px" }}>{pageData.titlePermission}</h2>
              <Row>
                <Col span={24}>
                  <Card>
                    <Checkbox checked={checkedAll} onChange={(e) => onChangeCheckAllPermissions(e)}>
                      <div className="body-1">{pageData.titleCheckboxAllPermissionGoFB}</div>
                    </Checkbox>
                  </Card>
                </Col>
              </Row>

              <Row style={{ marginBottom: "8px" }}>
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
