import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, message, Radio, Row, Tooltip } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import PageTitle from "components/page-title";
import { EmptyId } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getValidationMessagesWithParentField } from "utils/helpers";
import "../staff/staff.page.scss";

const { Content } = Layout;

export function CreateNewStaff(props) {
  const history = useHistory();
  const { t, staffDataService } = props;
  // eslint-disable-next-line no-unused-vars
  const [formHasValue, setFormHasValue] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [isChangeForm, setIsChangeForm] = useState(false);
  //#region Page data
  const pageData = {
    btnCancel: t("button.cancel"),
    btnCreate: t("button.create"),
    title: t("staffManagement.addStaff"),
    createStaff: t("staffManagement.createStaff"),
    backBtn: t("staffManagement.generalInformation.back"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    generalInformation: {
      title: t("staffManagement.generalInformation.title"),
      fullName: {
        label: t("staffManagement.generalInformation.fullName"),
        placeholder: t("staffManagement.generalInformation.fullNamePlaceholder"),
        required: true,
        maxLength: 50,
        validateMessage: t("staffManagement.generalInformation.fullNameValidateMessage"),
      },
      code: {
        label: t("staffManagement.generalInformation.code"),
        placeholder: t("staffManagement.generalInformation.codePlaceholder"),
        required: true,
        maxLength: 10,
        format: "^[a-zA-Z0-9]*$",
        invalidMessage: t("staffManagement.generalInformation.codeInvalidMessage"),
        validateMessage: t("staffManagement.generalInformation.codeValidateMessage"),
        existValidateMessage: t("staffManagement.generalInformation.codeExisted"),
      },
      phoneNumber: {
        label: t("staffManagement.generalInformation.phone"),
        placeholder: t("staffManagement.generalInformation.phonePlaceholder"),
        required: true,
        maxLength: 15,
        format: "^[0-9]*$",
        validateMessage: t("staffManagement.generalInformation.phoneValidateMessage"),
        invalidMessage: t("staffManagement.generalInformation.phoneInvalidMessage"),
        existValidateMessage: t("staffManagement.generalInformation.phoneExisted"),
      },
      email: {
        label: t("staffManagement.generalInformation.email"),
        placeholder: t("staffManagement.generalInformation.emailPlaceholder"),
        required: true,
        format: "email",
        validateMessage: t("staffManagement.generalInformation.emailValidateMessage"),
        invalidMessage: t("staffManagement.generalInformation.emailInvalidMessage"),
        existValidateMessage: t("staffManagement.generalInformation.emailExisted"),
      },
      birthDay: {
        label: t("staffManagement.generalInformation.birthday"),
        placeholder: t("staffManagement.generalInformation.birthdayPlaceholder"),
        format: "date",
      },
      gender: {
        label: t("staffManagement.generalInformation.gender"),
        male: t("staffManagement.generalInformation.male"),
        female: t("staffManagement.generalInformation.female"),
      },
    },
    permission: {
      title: t("staffManagement.permission.title"),
      selectGroup: {
        label: t("staffManagement.permission.group"),
        placeholder: t("staffManagement.permission.selectGroup"),
        required: true,
        validateMessage: t("staffManagement.permission.pleaseSelectGroup"),
      },
      selectBranch: {
        label: t("staffManagement.permission.branch"),
        placeholder: t("staffManagement.permission.selectBranch"),
        required: true,
        validateMessage: t("staffManagement.permission.pleaseSelectBranch"),
        specialOptionKey: EmptyId,
        specialOptionValue: t("staffManagement.permission.allBranches"),
      },
      btnAddGroup: t("staffManagement.permission.addGroup"),
      allGroup: t("staffManagement.permission.allGroup"),
      allBranch: t("staffManagement.permission.allBranch"),
      addStaffPermission: t("staffManagement.permission.addStaffPermission"),
    },
    staffAddedSuccessfully: t("staffManagement.staffAddedSuccessfully"),
    staffAddedFailed: t("staffManagement.staffAddedFailed"),
  };
  //#endregion

  const [groupPermissionBranches, setGroupPermissionBranches] = useState([
    {
      index: 0,
      groupIds: [],
      branchIds: [],
      selectedAllGroups: false,
      selectedAllBranches: false,
    },
  ]);
  const [branches, setBranches] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPrepareCreateNewStaffData = async () => {
      const response = await props.staffDataService.getPrepareCreateNewStaffDataAsync();
      if (response) {
        const { branches, groupPermissions } = response;
        setBranches(branches);
        setGroupPermissions(groupPermissions);
      }
    };
    fetchPrepareCreateNewStaffData();
  }, []);

  const onClickSaveStaff = () => {
    if (branches?.length > 0 && groupPermissions?.length > 0) {
      form.validateFields().then((values) => {
        // Copy array from the old array.
        let formData = { ...values };

        // The array contains new items after handling.
        let newGroups = [];

        // Go to each item and check the condition.
        for (let item of groupPermissionBranches) {
          let aGroup = {};

          // If the user clicks on the checkbox control Permission Group and the checkbox is checked,
          // set data for the object's property from the permission list.
          if (item.selectedAllGroups) {
            aGroup.groupPermissionIds = groupPermissions.map((item) => item.id);
          } else {
            aGroup.groupPermissionIds = item.groupIds;
          }

          // If the user clicks on the checkbox control Branch and the checkbox is checked,
          // set data for the object's property from the branch list.
          if (item.selectedAllBranches) {
            aGroup.branchIds = branches.map((item) => item.id);
          } else {
            aGroup.branchIds = item.branchIds;
          }

          // Push this object to the array list.
          newGroups.push(aGroup);
        }

        // Set data
        formData.groupPermissionBranches = newGroups;
        formData.staff.birthday = formData.staff.birthday
          ? moment.utc(formData.staff.birthday).format("yyyy-MM-DD HH:mm:ss")
          : null;
        staffDataService
          .createNewStaffAsync(formData)
          .then((response) => {
            if (response === true) {
              setFormHasValue(false);
              onCompleted({
                savedSuccessfully: true,
                message: pageData.staffAddedSuccessfully,
              });
            } else {
              message.error(pageData.staffAddedFailed);
            }
          })
          .catch((errs) => {
            form.setFields(getValidationMessagesWithParentField(errs, "staff"));
          });
      });
    } else {
      form.validateFields().then(() => {
        groupPermissionBranches.forEach((_, index) => {
          form.setFields([
            {
              name: ["groupPermissionBranches", index, "tmpGroupPermissionIds"],
              errors: [pageData.permission.selectGroup.validateMessage],
            },
          ]);

          form.setFields([
            {
              name: ["groupPermissionBranches", index, "tmpBranchIds"],
              errors: [pageData.permission.selectBranch.validateMessage],
            },
          ]);
        });
      });
    }
  };

  const onRemoveGroupPermissionAndBranch = (index) => {
    let formData = form.getFieldsValue();
    let { groupPermissionBranches } = formData;
    if (groupPermissionBranches.length === 1) {
      return;
    }

    groupPermissionBranches.splice(index, 1);
    setGroupPermissionBranches([...groupPermissionBranches]);
    form.setFieldsValue(formData);
  };

  const onAddGroupPermissionAndBranch = () => {
    // add new item into group permission
    form.validateFields().then(() => {
      let newGroupPermissionBranch = {
        index: groupPermissionBranches.length,
        groupPermissionIds: [],
        branchIds: [],
        selectedAllGroups: false,
        selectedAllBranches: false,
      };
      setGroupPermissionBranches([...groupPermissionBranches, newGroupPermissionBranch]);
    });
  };

  const renderGroupPermissionAndBranch = () => {
    return groupPermissionBranches.map((item, index) => (
      <Row key={index} gutter={[16, 16]}>
        <Col xs={22} sm={22} lg={22}>
          <Row className="group-permission-item" gutter={[22, 18]}>
            <Col xs={24} sm={24} lg={12}>
              <div className="select-all">
                <Checkbox onChange={(event) => onSelectAllGroups(event, index)}>
                  {pageData.permission.allGroup}
                </Checkbox>
              </div>

              <Form.Item
                hidden={item?.selectedAllGroups}
                className="select-control"
                label={pageData.permission.selectGroup.label}
                name={["groupPermissionBranches", index, "groupPermissionIds"]}
                rules={[
                  {
                    required: item?.selectedAllGroups
                      ? false
                      : item?.groupIds?.length > 0
                      ? false
                      : pageData.permission.selectGroup.required,
                    message: pageData.permission.selectGroup.validateMessage,
                  },
                ]}
              >
                <FnbSelectMultiple
                  disabled={item?.selectedAllGroups}
                  showArrow
                  placeholder={pageData.permission.selectGroup.placeholder}
                  option={item?.selectedAllGroups ? [] : groupPermissions}
                  onChange={(values) => onUpdateGroupPermission(index, values, true)}
                />
              </Form.Item>

              <Form.Item
                name={["groupPermissionBranches", index, "tmpGroupPermissionIds"]}
                className="select-control"
                label={pageData.permission.selectGroup.label}
                hidden={!item?.selectedAllGroups}
              >
                <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} lg={12}>
              <div className="select-all">
                <Checkbox onChange={(event) => onSelectAllBranches(event, index)}>
                  {pageData.permission.allBranch}
                </Checkbox>
              </div>

              <Form.Item
                hidden={item?.selectedAllBranches}
                className="select-control"
                label={pageData.permission.selectBranch.label}
                name={["groupPermissionBranches", index, "branchIds"]}
                rules={[
                  {
                    required: item?.selectedAllBranches
                      ? false
                      : item?.branchIds?.length > 0
                      ? false
                      : pageData.permission.selectBranch.required,
                    message: pageData.permission.selectBranch.validateMessage,
                  },
                ]}
              >
                <FnbSelectMultiple
                  disabled={item?.selectedAllBranches}
                  showArrow
                  placeholder={pageData.permission.selectBranch.placeholder}
                  option={item?.selectedAllBranches ? [] : branches}
                  onChange={(values) => onUpdateGroupPermission(index, values, false)}
                />
              </Form.Item>

              <Form.Item
                name={["groupPermissionBranches", index, "tmpBranchIds"]}
                className="select-control"
                label={pageData.permission.selectBranch.label}
                hidden={!item?.selectedAllBranches}
              >
                <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col className="btn-remove-icon" xs={2} sm={2} lg={1}>
          <Tooltip placement="top" title={t("button.delete")} color="#50429B">
            <TrashFill
              onClick={() => onRemoveGroupPermissionAndBranch(index)}
              className="icon-del mt-4 pt-2 float-right"
            />
          </Tooltip>
        </Col>
      </Row>
    ));
  };

  /**
   * This function is used to set the form status,
   * if value is true when you leave this page then a confirmation box will be displayed.
   *
   */
  const onFormChanged = () => {
    if (form.getFieldsValue()) {
      setFormHasValue(true);
      setDisableSaveButton(false);
    } else {
      setFormHasValue(false);
      setDisableSaveButton(true);
    }
  };

  /**
   * This method is used to set value for the variable 'isSelectedAllGroups', it will be called when the user clicks on the control.
   * @param  {CheckboxChangeEvent} event The event data
   */
  const onSelectAllGroups = (event, index) => {
    let isChecked = event.target.checked;
    let groups = [...groupPermissionBranches];
    let itemInGroups = groups[index];
    if (itemInGroups) {
      itemInGroups.selectedAllGroups = isChecked;
      setGroupPermissionBranches(groups);
      if (isChecked && !groupPermissions?.length > 0) {
        form.setFields([
          {
            name: ["groupPermissionBranches", index, "tmpGroupPermissionIds"],
            errors: [pageData.permission.selectGroup.validateMessage],
          },
        ]);
      }
    }
  };

  /**
   * This method is used to set value for the variable 'isSelectedAllBranches', it will be called when the user clicks on the control.
   * @param  {CheckboxChangeEvent} event The event data
   */
  const onSelectAllBranches = (event, index) => {
    let isChecked = event.target.checked;
    let groups = [...groupPermissionBranches];
    let itemInGroups = groups[index];
    if (itemInGroups) {
      itemInGroups.selectedAllBranches = isChecked;
      setGroupPermissionBranches(groups);
      if (isChecked && !branches?.length > 0) {
        form.setFields([
          {
            name: ["groupPermissionBranches", index, "tmpBranchIds"],
            errors: [pageData.permission.selectBranch.validateMessage],
          },
        ]);
      }
    }
  };

  /**
   * This function is used to set value for the control.
   * @param  {int} index The current index of the control.
   * @param  {listOfString} values The values (it's array) of the control.
   * @param  {bool} setValueForGroup If the value is true, set value for the group Ids.
   */
  const onUpdateGroupPermission = (index, values, setValueForGroup) => {
    // Copy array.
    let groups = [...groupPermissionBranches];

    // Get object from the array by the current index.
    let itemInGroups = groups[index];
    if (itemInGroups) {
      if (setValueForGroup) {
        itemInGroups.groupIds = values;
      } else {
        itemInGroups.branchIds = values;
      }

      // Set the new value for the variable.
      setGroupPermissionBranches(groups);
    }
  };

  /**
   * This function is used to navigate to the Staff Management page.
   * @param  {any} data This data will be called at the Staff Management page.
   */
  const onCompleted = (data) => {
    setIsChangeForm(false);
    setFormHasValue(false);
    setTimeout(() => {
      if (data) {
        history.push({ pathname: "/staff", state: data });
      } else {
        history.push("/staff");
      }
    }, 100);
  };

  /**
   * This function is used to close the confirmation modal.
   */
  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  function updateDateFields(event) {
    var checkDate = moment(event.target.value, DateFormat.DD_MM_YYYY, true);
    if (checkDate.isValid() && checkDate <= moment()) {
      form.setFieldsValue({
        staff: {
          birthday: moment(event.target.value, DateFormat.DD_MM_YYYY, true),
        },
      });
    }
  }

  const disabledDate = (current) => {
    return current.isAfter(moment());
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.createStaff} />
          </p>
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    disabled={disableSaveButton}
                    icon={<PlusSquareOutlined />}
                    type="primary"
                    htmlType="submit"
                    onClick={() => onClickSaveStaff()}
                  >
                    {pageData.btnCreate}
                  </Button>
                ),
                permission: PermissionKeys.ADMIN,
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
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
        onChange={onFormChanged}
        onFieldsChange={(e) => changeForm(e)}
      >
        <Content>
          <Card className="fnb-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation.title}
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={["staff", "code"]}
                  label={pageData.generalInformation.code.label}
                  rules={[
                    {
                      required: pageData.generalInformation.code.required,
                      message: pageData.generalInformation.code.validateMessage,
                    },
                    { type: "string", warningOnly: true },
                    {
                      pattern: new RegExp(pageData.generalInformation.code.format),
                      message: pageData.generalInformation.code.invalidMessage,
                    },
                    {
                      type: "string",
                      max: pageData.generalInformation.code.maxLength,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.code.placeholder}
                    maxLength={pageData.generalInformation.code.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={["staff", "phone"]}
                  label={pageData.generalInformation.phoneNumber.label}
                  rules={[
                    {
                      required: pageData.generalInformation.phoneNumber.required,
                      message: pageData.generalInformation.phoneNumber.validateMessage,
                    },
                    {
                      pattern: new RegExp(pageData.generalInformation.phoneNumber.format),
                      message: pageData.generalInformation.phoneNumber.invalidMessage,
                    },
                    { type: "string", warningOnly: true },
                    {
                      type: "string",
                      max: pageData.generalInformation.phoneNumber.maxLength,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.phoneNumber.placeholder}
                    maxLength={pageData.generalInformation.phoneNumber.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={["staff", "birthday"]}
                  label={pageData.generalInformation.birthDay.label}
                  onChange={(event) => updateDateFields(event)}
                >
                  <DatePicker
                    className="w-100 fnb-input"
                    format={DateFormat.DD_MM_YYYY}
                    placeholder={pageData.generalInformation.birthDay.placeholder}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  name={["staff", "name"]}
                  label={pageData.generalInformation.fullName.label}
                  rules={[
                    {
                      required: pageData.generalInformation.fullName.required,
                      message: pageData.generalInformation.fullName.validateMessage,
                    },
                    { type: "string", warningOnly: true },
                    {
                      type: "string",
                      max: pageData.generalInformation.fullName.maxLength,
                    },
                  ]}
                >
                  <Input
                    className="fnb-input"
                    placeholder={pageData.generalInformation.fullName.placeholder}
                    maxLength={pageData.generalInformation.fullName.maxLength}
                  />
                </Form.Item>

                <Form.Item
                  name={["staff", "email"]}
                  label={pageData.generalInformation.email.label}
                  rules={[
                    {
                      required: pageData.generalInformation.email.required,
                      message: pageData.generalInformation.email.validateMessage,
                    },
                    {
                      type: "email",
                      message: pageData.generalInformation.email.invalidMessage,
                    },
                  ]}
                >
                  <Input className="fnb-input" placeholder={pageData.generalInformation.email.placeholder} />
                </Form.Item>

                <Form.Item
                  initialValue={true}
                  className="gender-control"
                  name={["staff", "gender"]}
                  label={pageData.generalInformation.gender.label}
                >
                  <Radio.Group>
                    <Radio value={true}>{pageData.generalInformation.gender.male}</Radio>
                    <Radio value={false}>{pageData.generalInformation.gender.female}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Content>

        <Content className="mt-3">
          <Card className="fnb-box group-permission custom-box">
            <Row className="group-header-box">
              <Col className="items-in-group-header-box" xs={24} sm={24} lg={24}>
                <span>{pageData.permission.title}</span>
                <Button className="mt-4" icon={<PlusSquareOutlined />} onClick={() => onAddGroupPermissionAndBranch()}>
                  {pageData.permission.addStaffPermission}
                </Button>
              </Col>
            </Row>
            {renderGroupPermissionAndBranch()}
          </Card>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={() => setShowConfirm(false)}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
