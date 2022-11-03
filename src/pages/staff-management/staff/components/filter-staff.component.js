import React, { useEffect } from "react";
import { Card, Row, Form } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useTranslation } from "react-i18next";
import "../staff.page.scss";

export default function FilterStaff(props) {
  const { groupPermissions, branches, onShowFilter } = props;

  const [t] = useTranslation();
  const [form] = Form.useForm();
  const defaultValue = "";

  useEffect(() => {
    form.setFieldsValue({ branchId: "", permissionId: "" });
    props.tableFuncs.current = onResetForm;
  }, []);

  const onResetForm = () => {
    form?.resetFields();
    onApplyFilter();
    onShowFilter(false);
  };

  //#region PageData
  const pageData = {
    filter: {
      button: t("button.filter"),
      resetData: t("button.resetData"),
      branch: {
        title: t("productManagement.filter.branch.title"),
        all: t("productManagement.filter.branch.all"),
        placeholder: t("productManagement.filter.branch.placeholder"),
      },
      permission: {
        title: t("staffManagement.permission.filter.title"),
        all: t("staffManagement.permission.filter.all"),
        placeholder: t("staffManagement.permission.filter.placeholder"),
      },
    },
  };
  //#endregion

  const onApplyFilter = () => {
    let formValue = form.getFieldsValue();
    formValue.count = countFilterControl(formValue);

    props.fetchDataProducts(formValue);
  };

  const countFilterControl = (formValue) => {
    let countBranch = formValue?.branchId === "" || formValue?.branchId === undefined ? 0 : 1;
    let countPermission =
      formValue?.permissionId === "" || formValue?.permissionId === undefined ? 0 : 1;

    return countBranch + countPermission;
  };

  const onResetFilter = () => {
    let formData = { branchId: "", permissionId: "", count: 0 };
    form.setFieldsValue(formData);
    props.fetchDataProducts(formData);
    props?.onShowFilter(false);
  };

  return (
    <Form form={form} onFieldsChange={onApplyFilter}>
      <Card className="staff-form-filter-popover">
        <Row>
          <div className="staff-first-column">
            <span>{pageData.filter.branch.title}</span>
          </div>
          <div className="staff-second-column">
            <Form.Item name="branchId">
              <FnbSelectSingle
                placeholder={pageData.filter.branch.placeholder}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={branches}
              />
            </Form.Item>
          </div>
        </Row>
        <Row>
          <div className="staff-first-column">
            <span>{pageData.filter.permission.title}</span>
          </div>
          <div className="staff-second-column">
            <Form.Item name="permissionId">
              <FnbSelectSingle
                placeholder={pageData.filter.permission.placeholder}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={groupPermissions}
              />
            </Form.Item>
          </div>
        </Row>
        <Row className="row-reset-filter">
          <a onClick={onResetFilter} className="reset-filter">
            {pageData.filter.resetData}
          </a>
        </Row>
      </Card>
    </Form>
  );
}
