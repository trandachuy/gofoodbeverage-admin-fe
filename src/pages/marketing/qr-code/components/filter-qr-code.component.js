import { CheckOutlined } from "@ant-design/icons";
import { Card, Form, Radio } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../qr-code.page.scss";

export default function FilterQRCode(props) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { branches, serviceTypes, targets, status, onShowFilter } = props;
  const defaultValue = "";

  const pageData = {
    branch: t("material.filter.branch.title"),
    serviceType: t("reportRevenue.serviceType"),
    target: t("marketing.qrCode.target"),
    status: t("table.status"),
    filter: {
      resetAllFilters: t("productManagement.filter.resetallfilters"),
    },
    allBranches: t("material.filter.branch.all"),
    allTypes: t("order.allTypes"),
    allTargets: t("marketing.qrCode.allTargets"),
    all: t("order.all"),
  };

  useEffect(() => {
    props.tableFuncs.current = onResetForm;
  }, []);

  const onApplyFilter = () => {
    let formValue = form.getFieldsValue();
    formValue.count = countFilterControl(formValue);
    props.handleFilterQRCode(formValue);
  };

  const countFilterControl = (formValue) => {
    let countBranch = formValue.branchId === "" || formValue.branchId === undefined ? 0 : 1;
    let countServiceType = formValue.serviceTypeId === "" || formValue.serviceTypeId === undefined ? 0 : 1;
    let countTarget = formValue.targetId === "" || formValue.targetId === undefined ? 0 : 1;
    let countStatus = formValue.statusId === "" || formValue.statusId === undefined ? 0 : 1;

    return countBranch + countServiceType + countTarget + countStatus;
  };

  const onResetForm = () => {
    form?.resetFields();
    onApplyFilter();
    if (onShowFilter) {
      onShowFilter(false);
    }
  };

  return (
    <Form form={form} onFieldsChange={onApplyFilter} className="qr-code-filter">
      <Card className="form-filter-popover">
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.branch}</span>
          </div>
          <div className="second-column">
            <Form.Item name="branchId">
              <FnbSelectSingle
                placeholder={pageData.allBranches}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={branches}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.serviceType}</span>
          </div>
          <div className="second-column">
            <Form.Item name="serviceTypeId">
              <FnbSelectSingle
                placeholder={pageData.allTypes}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={serviceTypes}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.target}</span>
          </div>
          <div className="second-column">
            <Form.Item name="targetId">
              <FnbSelectSingle
                placeholder={pageData.allTargets}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={targets}
              />
            </Form.Item>
          </div>
        </div>
        <div className="filter-popover-row">
          <div className="first-column">
            <span>{pageData.status}</span>
          </div>
          <div className="second-column">
            <Form.Item name="statusId">
              <Radio.Group defaultValue={defaultValue} buttonStyle="solid">
                <Radio.Button value={defaultValue}>
                  <CheckOutlined className="check-icon" /> {pageData.all}
                </Radio.Button>
                {status.map((item, index) => {
                  return (
                    <Radio.Button value={item.id}>
                      <CheckOutlined className="check-icon" /> {t(item.name)}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        <div className="clear-filter-container clear-filter-text">
          <div onClick={() => onResetForm()}>{pageData.filter.resetAllFilters}</div>
        </div>
      </Card>
    </Form>
  );
}
