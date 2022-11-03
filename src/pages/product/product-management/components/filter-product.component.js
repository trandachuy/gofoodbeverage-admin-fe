import { CheckOutlined } from "@ant-design/icons";
import { Card, Form, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isJsonString } from "utils/helpers";
import { getStorage, localStorageKeys, setStorage } from "utils/localStorage.helpers";
import "../product.scss";
export default function FilterProduct(props) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const { categories, branches, onShowFilter, salesChannel } = props;
  const defaultValue = "";

  const pageData = {
    filter: {
      button: t("button.clear"),
      branch: {
        title: t("productManagement.filter.branch.title"),
        all: t("productManagement.filter.branch.all"),
        placeholder: t("productManagement.filter.branch.placeholder"),
      },
      category: {
        title: t("productManagement.filter.category.title"),
        all: t("productManagement.filter.category.all"),
        placeholder: t("productManagement.filter.category.placeholder"),
      },
      salesChannel: {
        title: t("productManagement.filter.salesChannel.title"),
      },
      status: {
        title: t("productManagement.filter.status.title"),
        all: t("productManagement.filter.status.all"),
        active: t("productManagement.filter.status.active"),
        inactive: t("productManagement.filter.status.inactive"),
      },
      resetallfilters: t("productManagement.filter.resetallfilters"),
    },
  };

  useEffect(() => {
    props.tableFuncs.current = onResetForm;
    var sessionProductFilter = getStorage(localStorageKeys.PRODUCT_FILTER);
    if (isJsonString(sessionProductFilter)) {
      var productFilter = JSON.parse(sessionProductFilter);
      if (productFilter && productFilter.count > 0) {
        form.setFieldsValue(productFilter);
      }
    }
  }, []);

  const onApplyFilter = () => {
    let formValue = form.getFieldsValue();
    formValue.count = countFilterControl(formValue);
    setStorage(localStorageKeys.PRODUCT_FILTER, JSON.stringify(formValue));
    props.fetchDataProducts(formValue);
  };

  const countFilterControl = (formValue) => {
    let countBranch = formValue.branchId === "" || formValue.branchId === undefined ? 0 : 1;

    let countCategory = formValue.productCategoryId === "" || formValue.productCategoryId === undefined ? 0 : 1;
    let countStatus = formValue.statusId === "" || formValue.statusId === undefined ? 0 : 1;

    let salesChannel = formValue.salesChannel === "All" || formValue.salesChannel === undefined ? 0 : 1;

    return countBranch + countCategory + countStatus + salesChannel;
  };

  const onResetForm = () => {
    form?.resetFields();
    onApplyFilter();
    if (onShowFilter) {
      onShowFilter(false);
    }
  };

  return (
    <Form form={form} onFieldsChange={onApplyFilter} className="product-filter">
      <Card className="form-filter-popover">
        <Row>
          <div className="first-column">
            <span>{pageData.filter.branch.title}</span>
          </div>

          <div className="second-column">
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
          <div className="first-column">
            <span>{pageData.filter.category.title}</span>
          </div>

          <div className="second-column">
            <Form.Item name="productCategoryId">
              <FnbSelectSingle
                placeholder={pageData.filter.category.placeholder}
                className="form-select"
                showSearch
                defaultValue={defaultValue}
                option={categories}
              />
            </Form.Item>
          </div>
        </Row>

        <Row>
          <div className="first-column">
            <span>{pageData.filter.salesChannel.title}</span>
          </div>

          <div className="second-column">
            <Form.Item name="salesChannel">
              <Radio.Group defaultValue={defaultValue} buttonStyle="solid">
                {salesChannel?.map((item) => (
                  <Radio.Button value={item?.id}>
                    <CheckOutlined className="check-icon" /> {item?.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        </Row>

        <Row>
          <div className="first-column">
            <span>{pageData.filter.status.title}</span>
          </div>

          <div className="second-column">
            <Form.Item name="statusId">
              <Radio.Group defaultValue={defaultValue} buttonStyle="solid">
                <Radio.Button value={defaultValue}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.all}
                </Radio.Button>
                <Radio.Button value={1}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.active}
                </Radio.Button>
                <Radio.Button value={0}>
                  <CheckOutlined className="check-icon" /> {pageData.filter.status.inactive}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Row>

        <Row className="clear-filter-container clear-filter-text">
          <div onClick={() => onResetForm()}>{pageData.filter.resetallfilters}</div>
        </Row>
      </Card>
    </Form>
  );
}
