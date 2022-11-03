import { Button, Card, Col, Form, Input, InputNumber, message, Row, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency } from "constants/string.constants";
import storeDataService from "data-services/store/store-data.service";
import React, { useEffect, useState } from "react";
import { getValidationMessages } from "utils/helpers";
import "./index.scss";

const { TextArea } = Input;

export default function EditCustomerMembershipPage(props) {
  const { t, membershipDataService, history } = props;
  const fnbImageSelectRef = React.useRef();
  const [showConfirm, setShowConfirm] = useState(false);

  const pageData = {
    title: t("membership.addNewForm.titleUpdate"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    name: t("membership.addNewForm.name"),
    accumulatedPoint: t("membership.addNewForm.accumulatedPoint"),
    description: t("membership.addNewForm.description"),
    discount: t("membership.addNewForm.discount"),
    maximumDiscount: t("membership.addNewForm.maximumDiscount"),
    nameValidation: t("membership.addNewForm.nameValidation"),
    accumulatedPointValidation: t("membership.addNewForm.accumulatedPointValidation"),
    discountValidation: t("membership.addNewForm.discountValidation"),
    maximumDiscountValidation: t("membership.addNewForm.maximumDiscountValidation"),
    uploadImage: t("productManagement.generalInformation.uploadImage"),
    percent: "%",
    membershipAddSuccess: t("membership.addNewForm.membershipAddSuccess"),
    membershipUpdateSuccess: t("membership.addNewForm.membershipUpdateSuccess"),
    descriptionMaximum: t("membership.addNewForm.descriptionMaximum"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
    const { membershipId } = props?.match?.params;
    if (membershipId) {
      membershipDataService.getMembershipByIdAsync(membershipId).then((response) => {
        if (response) {
          const { customerMembership } = response;

          form.setFieldsValue({
            ...customerMembership,
          });

          if (fnbImageSelectRef && fnbImageSelectRef.current) {
            fnbImageSelectRef.current.setImageUrl(customerMembership?.thumbnail);
          }
        }
      });
    }
  };

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      let request = {
        ...values,
      };

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        const imageUrl = fnbImageSelectRef.current.getImageUrl();
        if (imageUrl) {
          request = {
            ...request,
            thumbnail: imageUrl,
          };
        }
      }

      membershipDataService
        .updateMembershipAsync(request)
        .then((res) => {
          if (res) {
            setIsChangeForm(false);
            message.success(pageData.membershipUpdateSuccess);
            history.push("/membership/management");
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      navigateToManagementPage();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const navigateToManagementPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/membership/management");
    }, 100);
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Space className="float-left">
            <h2>{pageData.title}</h2>
          </Space>
        </Col>
        <Col span={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" onClick={onFinish}>
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_MEMBERSHIP_LEVEL,
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
        className="mt-3 combo-form"
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        onFieldsChange={() => {
          if (!isChangeForm) setIsChangeForm(true);
        }}
        form={form}
      >
        <Content>
          <Card>
            <Row style={{ display: "grid" }}>
              <Row>
                <Col span={11}>
                  <h4>{pageData.name}</h4>
                  <Form.Item name={"name"} rules={[{ required: true, message: pageData.nameValidation }]}>
                    <Input size="large" placeholder={pageData.namePlaceholder} />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Row className="justify-content-center">
                    <FnbImageSelectComponent ref={fnbImageSelectRef} />
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={11} className="accumulated-margin">
                  <h4>{pageData.accumulatedPoint}</h4>
                  <Form.Item
                    name={"accumulatedPoint"}
                    rules={[
                      {
                        required: true,
                        message: pageData.accumulatedPointValidation,
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      max={1000000000000}
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <h4>{pageData.description}</h4>
                  <Form.Item
                    name={"description"}
                    rules={[
                      {
                        max: 1000,
                        message: pageData.descriptionMaximum,
                      },
                    ]}
                  >
                    <TextArea maxLength={1001} size="large" rows={4} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <h4>{pageData.discount}</h4>
                  <Form.Item name={"discount"}>
                    <InputNumber
                      className="w-100"
                      addonAfter={pageData.percent}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={1}
                      max={100}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11} className="margin-top-auto">
                  <h4>{pageData.maximumDiscount}</h4>
                  <Form.Item name={"maximumDiscount"}>
                    <InputNumber
                      addonAfter={currencyCode}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={1}
                      max={1000000000000}
                      precision={currencyCode === currency.vnd ? 0 : 2}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Card>
        </Content>
        <Form.Item name="id" hidden="true"></Form.Item>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discard}
        okText={pageData.okText}
        onCancel={onDiscard}
        onOk={navigateToManagementPage}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
