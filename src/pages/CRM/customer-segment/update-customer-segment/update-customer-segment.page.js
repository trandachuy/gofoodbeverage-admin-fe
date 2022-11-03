import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Radio, Row, Select, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import PageTitle from "components/page-title";
import {
  customerDataOptions,
  monthsInYearOptions,
  objectiveOptions,
  registrationDateConditionOptions,
} from "constants/customer-segment-condition-option.constants";
import {
  customerDataEnum,
  objectiveEnum,
  registrationDateConditionEnum,
} from "constants/customer-segment-condition.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { getValidationMessages } from "utils/helpers";

const { Option } = Select;
export default function UpdateCustomerSegment(props) {
  const { t, history, customerSegmentDataService } = props;
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    isAllMatch: false,
    conditions: [],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    title: t("customerSegment.updateCustomerSegment"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    name: {
      label: t("customerSegment.name"),
      placeholder: t("customerSegment.namePlaceholder"),
      required: true,
      maxLength: 100,
      validateMessage: t("customerSegment.nameValidateMessage"),
    },
    namePlaceholder: t("customerSegment.namePlaceholder"),
    condition: {
      title: t("customerSegment.condition.title"),
      objective: t("customerSegment.condition.objective"),
      condition: t("customerSegment.condition.condition"),
      customerData: t("customerSegment.condition.customerData"),
      orderData: t("customerSegment.condition.orderData"),
      registrationDate: t("customerSegment.condition.registrationDate"),
      birthday: {
        label: t("customerSegment.condition.birthday"),
        placeholder: t("customerSegment.condition.birthdayPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.birthdayValidateMessage"),
      },
      gender: t("customerSegment.condition.gender"),
      tag: t("customerSegment.condition.tag"),
      tags: {
        label: t("customerSegment.condition.tags"),
        placeholder: t("customerSegment.condition.tagsPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.tagsValidateMessage"),
      },
      on: t("customerSegment.condition.on"),
      before: t("customerSegment.condition.before"),
      after: t("customerSegment.condition.after"),
      time: {
        label: t("customerSegment.condition.time"),
        placeholder: t("customerSegment.condition.timePlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.timeValidateMessage"),
      },
      male: t("customerSegment.condition.male"),
      is: t("customerSegment.condition.is"),
      totalOrders: t("customerSegment.condition.totalOrders"),
      totalPurchaseAmount: {
        label: t("customerSegment.condition.totalPurchaseAmount"),
        placeholder: t("customerSegment.condition.totalPurchaseAmountPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.totalPurchaseAmountValidateMessage"),
        max: 999999999,
        min: 0,
        format: "^[0-9]*$",
      },
      isEqual: t("customerSegment.condition.isEqual"),
      isLargerThan: t("customerSegment.condition.isLargerThan"),
      isLessThan: t("customerSegment.condition.isLessThan"),
      orderNumber: {
        label: t("customerSegment.condition.orderNumber"),
        placeholder: t("customerSegment.condition.orderNumberPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.orderNumberValidateMessage"),
      },
      allTime: t("customerSegment.condition.allTime"),
      thisWeek: t("customerSegment.condition.thisWeek"),
      thisMonth: t("customerSegment.condition.thisMonth"),
      thisYear: t("customerSegment.condition.thisYear"),
      amount: t("customerSegment.condition.amount"),
      add: t("customerSegment.condition.addCondition"),
      ifAnyMatch: t("customerSegment.condition.ifAnyMatch"),
      allMatch: t("customerSegment.condition.allMatch"),
    },
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    leaveWarningMessage: t("messages.leaveWarningMessage"),
    customerSegmentUpdateSuccess: t("customerSegment.customerSegmentUpdateSuccess"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  useEffect(() => {
    setInitData();
  }, []);

  const setInitData = () => {
    const { customerSegmentId } = props?.match?.params;
    if (customerSegmentId) {
      customerSegmentDataService.getCustomerSegmentByIdAsync(customerSegmentId).then((response) => {
        if (response) {
          const { customerSegment } = response;

          let formValues = {
            ...customerSegment,
            conditions: customerSegment.customerSegmentConditions?.map((condition) => ({
              id: condition.id,
              birthday: condition.birthday,
              objectiveId: condition.objectiveId,
              customerDataId: condition.customerDataId,
              registrationDateConditionId: condition.registrationDateConditionId,
              registrationTime: condition.registrationTime ? moment(condition.registrationTime) : null,
              isMale: condition.isMale,
              tagId: condition.tagId,
              orderData: condition.orderData,
            })),
          };

          form.setFieldsValue(formValues);
          setFormData(formValues);
        }
      });
    }
  };

  /// update form data
  const updateFormData = (formData) => {
    const formValues = form.getFieldsValue();
    const { id, name, isAllMatch } = formValues;

    let initFormData = {
      id: id,
      name: name,
      isAllMatch: isAllMatch,
      conditions: formData.conditions,
    };

    form.setFieldsValue(initFormData);
    setFormData(initFormData);
  };

  /// Submit form
  const onSubmitForm = () => {
    form.validateFields().then(async (values) => {
      customerSegmentDataService
        .updateCustomerSegmentAsync(values)
        .then((res) => {
          if (res) {
            message.success(pageData.customerSegmentUpdateSuccess);
            onCompleted();
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  /// Add condition
  const onAddCondition = () => {
    const formValues = form.getFieldsValue();
    const { id, name, isAllMatch } = formValues;

    const initConditionData = {
      objectiveId: objectiveEnum.customerData,
      customerDataId: customerDataEnum.registrationDate,
      registrationDateConditionId: registrationDateConditionEnum.on,
    };

    let initFormData = {
      id: id,
      name: name,
      isAllMatch: isAllMatch,
      conditions: [...formData.conditions, initConditionData],
    };

    form.setFieldsValue({ ...formValues, ...initFormData });
    setFormData(initFormData);
  };

  /// Delete condition
  const deleteCondition = (index) => {
    const formValues = form.getFieldsValue();
    const { id, name, isAllMatch, conditions } = formValues;
    const newConditions = conditions.filter((_, i) => i !== index);

    let initFormData = {
      id: id,
      name: name,
      isAllMatch: isAllMatch,
      conditions: newConditions,
    };

    setFormData(initFormData);
    form.setFieldsValue(initFormData);
  };

  /// Change objectiveId
  const onChangeObjective = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].objectiveId = value;
    }
    updateFormData(formData);
  };

  /// Change customerDataId
  const onChangeCustomerData = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].customerDataId = value;
    }
    updateFormData(formData);
  };

  /// Change registrationDateConditionId
  const onChangeRegistrationDateCondition = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].registrationDateConditionId = value;
    }
    updateFormData(formData);
  };

  /// Change registrationTime
  const onChangeRegistrationTime = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].registrationTime = value;
    }
    updateFormData(formData);
  };

  /// Change birthdayTime
  const onChangeBirthday = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].birthday = value;
    }
    updateFormData(formData);
  };

  /// Change gender
  const onChangeGender = (value, index) => {
    let { conditions } = formData;
    if (conditions) {
      conditions[index].isMale = value;
      if (value === customerDataEnum.gender) {
        conditions[index].isMale = false;
      }
    }
    updateFormData(formData);
  };

  /// render multiple conditions
  const renderConditions = () => {
    const { conditions } = formData;
    return conditions?.map((condition, index) => {
      return renderCondition(condition, index);
    });
  };

  /// Render single condition
  const renderCondition = (condition, index) => {
    const deleteIcon = formData.conditions?.length > 1 ? <DeleteOutlined className="icon-del" /> : <></>;
    return (
      <>
        <Row key={index}>
          <Col span={4}>
            <h4>{pageData.condition.objective}</h4>
            <Form.Item name={["conditions", index, "id"]} hidden="true"></Form.Item>
            <Form.Item name={["conditions", index, "objectiveId"]}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                defaultValue={objectiveEnum.customerData}
                className="w-100"
                onChange={(value) => onChangeObjective(value, index)}
              >
                {objectiveOptions.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {t(item.name)}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            {condition?.objectiveId === objectiveEnum.customerData && renderOptionCustomerData(condition, index)}
            {condition?.objectiveId === objectiveEnum.orderData && renderOptionOrderData(condition, index)}
          </Col>
          <Col span={2}>
            <div className="float-right">
              <h4>&nbsp;</h4>
              <a onClick={() => deleteCondition(index)}>{deleteIcon}</a>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  /// Render Customer data
  const renderOptionCustomerData = (condition, index) => {
    return (
      <>
        <Row key={index}>
          <Col span={8}>
            <div className="ml-2">
              <h4>{pageData.condition.customerData}</h4>
              <Form.Item name={["conditions", index, "customerDataId"]}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  defaultValue={customerDataEnum.registrationDate}
                  onChange={(value) => onChangeCustomerData(value, index)}
                  className="w-100"
                >
                  {customerDataOptions.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {t(item.name)}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col span={16}>
            {condition?.customerDataId === customerDataEnum.registrationDate && (
              <Row>
                <Col span={12}>
                  <div className="ml-2">
                    <h4>{pageData.condition.condition}</h4>
                    <Form.Item name={["conditions", index, "registrationDateConditionId"]}>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        defaultValue={registrationDateConditionEnum.on}
                        className="w-100"
                        onChange={(value) => onChangeRegistrationDateCondition(value, index)}
                      >
                        {registrationDateConditionOptions.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>
                              {t(item.name)}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="ml-2">
                    <h4>{pageData.condition.time.label}</h4>
                    <Form.Item
                      name={["conditions", index, "registrationTime"]}
                      rules={[
                        {
                          required: pageData.condition.time.required,
                          message: pageData.condition.time.validateMessage,
                        },
                      ]}
                    >
                      <DatePicker
                        className="w-100"
                        format={DateFormat.DD_MM_YYYY}
                        placeholder={pageData.condition.time.placeholder}
                        onChange={(value) => onChangeRegistrationTime(value, index)}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.birthday && (
              <Row>
                <Col span={12}>
                  <h4>&nbsp;</h4>
                  <p className="text-center">{pageData.condition.on}</p>
                </Col>
                <Col span={12}>
                  <h4>{pageData.condition.time.label}</h4>
                  <Form.Item
                    name={["conditions", index, "birthday"]}
                    rules={[
                      {
                        required: pageData.condition.birthday.required,
                        message: pageData.condition.birthday.validateMessage,
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      className="w-100"
                      placeholder={pageData.condition.birthday.placeholder}
                      onChange={(value) => onChangeBirthday(value, index)}
                    >
                      {monthsInYearOptions.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {t(item.name)}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.gender && (
              <>
                <Row>
                  <Col span={12}>
                    <h4>&nbsp;</h4>
                    <p className="text-center">{pageData.condition.is}</p>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["conditions", index, "isMale"]}>
                      <h4>&nbsp;</h4>
                      <Checkbox
                        valuePropName="checked"
                        checked={condition.isMale}
                        onChange={(e) => {
                          const value = e.target.checked;
                          onChangeGender(value, index);
                        }}
                      >
                        {pageData.condition.male}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            {condition?.customerDataId === customerDataEnum.tag && (
              <>
                <Row>
                  <Col span={12}>
                    <h4>&nbsp;</h4>
                    <p className="text-center">{pageData.condition.is}</p>
                  </Col>
                  <Col span={12}>
                    <h4>{pageData.condition.tags.label}</h4>
                    <Form.Item
                      name={["conditions", index, "tagId"]}
                      rules={[
                        {
                          required: pageData.condition.tag.required,
                          message: pageData.condition.tag.validateMessage,
                        },
                      ]}
                    >
                      <Select getPopupContainer={(trigger) => trigger.parentNode} className="w-100"></Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  };

  /// Render Order data
  const renderOptionOrderData = (condition, index) => {};

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/customer/segment");
    }, 100);
  };

  const onCancel = () => {
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
                  <Button type="primary" htmlType="submit" onClick={() => onSubmitForm()}>
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_SEGMENT,
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
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Content>
          <Card>
            <Row>
              <Col span={20}>
                <h4>{pageData.name.label}</h4>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: pageData.name.required,
                      message: pageData.name.validateMessage,
                    },
                  ]}
                >
                  <Input placeholder={pageData.name.placeholder} maxLength={pageData.name.maxLength} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Content>
        <Content className="mt-3">
          <Space className="float-right">
            <Button type="primary" onClick={() => onAddCondition()}>
              {pageData.condition.add}
            </Button>
          </Space>
        </Content>
        <div className="clearfix"></div>
        <Content>
          <p className="pb-0 mb-1">
            <b>{pageData.condition.title}</b>
          </p>
          <Card>
            <Row>
              <Col span={24}>
                <Form.Item name="isAllMatch">
                  <Radio.Group>
                    <Radio value={false}>{pageData.condition.ifAnyMatch}</Radio>
                    <Radio value={true}>{pageData.condition.allMatch}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            {renderConditions()}
          </Card>
        </Content>
        <Form.Item name="id" hidden="true"></Form.Item>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.okText}
        onCancel={onDiscard}
        onOk={onCompleted}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
