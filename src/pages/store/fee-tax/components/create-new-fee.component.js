import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Checkbox, Col, DatePicker, Form, Input, InputNumber, message, Radio, Row, Switch, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { MaximumNumber } from "constants/default.constants";
import { CalendarNewIconBold } from "constants/icons.constants";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { currency, DateFormat } from "constants/string.constants";
import feeDataService from "data-services/fee/fee-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTextNumber, formatTextRemoveComma, getCurrency } from "utils/helpers";
import "./create-new-fee.component.scss";

export default function AddNewFeeComponent(props) {
  const [t] = useTranslation();
  const { isModalVisible, listBranch, getListBranch, onCancel } = props;
  const [form] = Form.useForm();
  const [isAllBranches, setIsAllBranches] = useState(false);
  const [isPercent, setIsPercent] = useState(true);
  const [startDate, setStartDate] = useState(moment(new Date(), DateFormat));
  const [endDate, setEndDate] = useState(null);
  const [isAutoApplied, setIsAutoApplied] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pageData = {
    titleAddNewFee: t("feeAndTax.createFee.titleAddNewFee"),
    feeName: t("feeAndTax.createFee.feeName"),
    maxLengthFeeName: 255,
    pleaseEnterFeeName: t("feeAndTax.createFee.pleaseEnterFeeName"),
    enterFeeName: t("feeAndTax.createFee.enterFeeName"),
    percent: "%",
    min: 1,
    maxPercent: 100,
    max: MaximumNumber,
    enterPercentFeeValue: t("feeAndTax.createFee.enterPrecentFeeValue"),
    enterAmountFeeValue: t("feeAndTax.createFee.enterAmountFeeValue"),
    pleaseEnterAmount: t("feeAndTax.createFee.pleaseEnterAmount"),
    pleaseSelectServingTypes: t("feeAndTax.createFee.pleaseSelectServingType"),
    branchName: t("feeAndTax.createFee.branchName"),
    allBranches: t("feeAndTax.createFee.allBranches"),
    selectBranch: t("feeAndTax.createFee.selectBranch"),
    pleaseSelectBranch: t("feeAndTax.createFee.pleaseSelectBranch"),
    description: t("feeAndTax.createFee.description"),
    descriptionMaximum: 1000,
    cancel: t("button.cancel"),
    addNew: t("button.addNew"),
    startDate: t("feeAndTax.createFee.startDate"),
    endDate: t("feeAndTax.createFee.endDate"),
    percentValidation: t("feeAndTax.createFee.percentValidation"),
    enterOnlyNumbers: t("feeAndTax.createFee.pleaseEnterOnlyNumbers"),
    titleFeeValue: t("feeAndTax.table.value"),
    valueValidation: t("feeAndTax.createFee.valueValidation"),
    pleaseStartDate: t("feeAndTax.createFee.pleaseStartDate"),
    orderTypeNames: Object.keys(OrderTypeConstants),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    autoApplied: t("feeAndTax.autoApplied"),
    servingTypes: t("feeAndTax.createFee.servingTypes"),
    createFeeSuccess: t("feeAndTax.createFee.createFeeSuccess"),
  };

  useEffect(() => {
    setInitData();
  }, [isModalVisible]);

  const servingTypeOptions = pageData.orderTypeNames.map((name) => {
    return { label: name, value: OrderTypeConstants[name] };
  });

  const setInitData = () => {
    form.setFieldsValue({
      fee: {
        name: "",
        isPercentage: true,
        isShowAllBranches: false,
        isAutoApplied: false,
        StartDate: moment(new Date(), DateFormat),
        servingTypes: [OrderTypeConstants.InStore],
      },
    });
    setIsChangeForm(false);
  };

  const onFinish = () => {
    let formValues = form.getFieldsValue();
    formValues.fee.isAutoApplied = isAutoApplied;

    if (validFormBeforeSubmit(formValues)) {
      // save data
      feeDataService.createFeeManagementAsync(formValues.fee).then((res) => {
        if (res) {
          message.success(pageData.createFeeSuccess);
          form.resetFields();
          setIsAllBranches(false);
          setIsAutoApplied(false);
          onCancel();
        }
      });
    } else {
      form.validateFields();
    }
  };

  const onChangeCheckBoxAllBranches = (e) => {
    setIsAllBranches(e.target.checked);
    if (!e.target.checked) {
      getListBranch();
    }
  };

  const onSelectBranches = (branchesSelected) => {
    if (branchesSelected.length === listBranch.length) {
      form.setFieldsValue({
        fee: {
          isShowAllBranches: true,
          feeBranchIds: [],
        },
      });
      setIsAllBranches(true);
    }
  };

  const handleCancel = async () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      await form.resetFields();
      onCancel();
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate;
  };

  /** This function is used to check the string is numeric.
   * @param  {string} value The value for example, '1234'
   */
  const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
  };

  /** This function is fired when the group is changed, the fee can be a percent or a price number.
   * @param  {event} e The event will be passed when the input is changed.
   */
  const onChangeRadioGroup = (e) => {
    setIsPercent(e.target.value);
    // Print error messages on the form.
    form.validateFields();
  };

  const onDiscard = () => {
    setShowConfirm(false);
    onCancel();
  };

  const onChangeStartDate = (date) => {
    // if clear start date => clear end date
    if (date === null || date === undefined) {
      form.setFieldsValue({
        fee: {
          EndDate: null,
        },
      });
      setEndDate(null);
      setStartDate(null);
      return;
    }

    // if start date > end date => start date = end date
    if (date !== null && date !== undefined) {
      if (endDate !== null && endDate !== undefined) {
        if (date.toDate() > endDate.toDate()) {
          form.setFieldsValue({
            fee: {
              StartDate: endDate,
            },
          });
          setStartDate(endDate);
          return;
        }
      }
    }

    setStartDate(date);
  };

  // #region Validate From Submit

  const validFormBeforeSubmit = (formValues) => {
    return (
      isValidateName(formValues) &&
      isValidateValue(formValues) &&
      isValidateStartEndDate(formValues) &&
      isValidateServingType(formValues) &&
      isValidateBranch(formValues)
    );
  };

  const isValidateName = (formValues) => {
    return formValues.fee.name !== undefined && formValues.fee.name !== "";
  };

  const isValidateValue = (formValues) => {
    if (formValues.fee.value === "" || formValues.fee.value === undefined || formValues.fee.value === null) {
      return false;
    }

    if (formValues.fee.isPercentage && (formValues.fee.value > 100 || formValues.fee.value < 0)) {
      return false;
    }

    return true;
  };

  const isValidateStartEndDate = (formValues) => {
    let startDate = formValues.fee.StartDate;
    if (startDate === null || startDate === undefined) {
      return false;
    }
    return true;
  };

  const isValidateServingType = (formValues) => {
    let servingTypes = formValues.fee.servingTypes;
    return servingTypes !== undefined && servingTypes !== null && servingTypes.length > 0;
  };

  const isValidateBranch = (formValues) => {
    let isShowAllBranches = formValues.fee.isShowAllBranches;
    let feeBranchIds = formValues.fee.feeBranchIds;
    return !(isShowAllBranches === false && (feeBranchIds === undefined || feeBranchIds.length === 0));
  };

  // #endregion Validate From Submit

  const renderContent = () => {
    return (
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        onFieldsChange={() => {
          if (!isChangeForm) setIsChangeForm(true);
        }}
      >
        {/* NAME */}
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label">
              {pageData.feeName}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name={["fee", "name"]}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseEnterFeeName,
                },
                { type: "string", max: pageData.maxLengthFeeName },
              ]}
            >
              <Input
                className="fnb-input-with-count"
                showCount
                maxLength={pageData.maxLengthFeeName}
                placeholder={pageData.enterFeeName}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* VALUE */}
        <Row>
          <Col span={24}>
            <Input.Group size="large">
              <h4 className="fnb-form-label">
                {pageData.titleFeeValue} <span className="text-danger">*</span>
              </h4>

              {/* % / CURRENCY (Ex: VND) */}
              {isPercent ? (
                <Form.Item
                  name={["fee", "value"]}
                  rules={[
                    { required: true, message: pageData.percentValidation },
                    {
                      min: 0,
                      max: 100,
                      type: "integer",
                      message: pageData.percentValidation,
                    },
                    {
                      validator: (_, value) => {
                        if (value === undefined || (value !== undefined && value <= 100)) {
                          return Promise.resolve();
                        } else {
                          if (value?.length > 0 && !isNumeric(value)) {
                            return Promise.reject(new Error(pageData.enterOnlyNumbers));
                          } else {
                            return Promise.reject(new Error(pageData.percentValidation));
                          }
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber
                    className="fnb-input-number w-100 discount-amount"
                    formatter={(value) => formatTextNumber(value)}
                    parser={(value) => formatTextRemoveComma(value)}
                    placeholder={pageData.enterAmountFeeValue}
                    addonAfter={
                      <Form.Item name={["fee", "isPercentage"]} style={{ display: "contents" }}>
                        <Radio.Group
                          className="radio-group-discount"
                          initialValues={isPercent}
                          onChange={(e) => onChangeRadioGroup(e)}
                        >
                          <Radio.Button value={true} className="percent-option">
                            {pageData.percent}
                          </Radio.Button>
                          <Radio.Button value={false} className="currency-option">
                            {getCurrency()}
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    }
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name={["fee", "value"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.valueValidation,
                    },
                    {
                      min: 0,
                      type: "integer",
                      // max: pageData.form.maximum,
                      message: pageData.valueValidation,
                    },
                  ]}
                >
                  <InputNumber
                    className="w-100 fnb-input-number discount-amount"
                    formatter={(value) => formatTextNumber(value)}
                    parser={(value) => formatTextRemoveComma(value)}
                    min={pageData.min}
                    max={pageData.max}
                    maxLength={11}
                    precision={getCurrency() === currency.vnd ? 0 : 2}
                    placeholder={pageData.enterAmountFeeValue}
                    addonAfter={
                      <Form.Item name={["fee", "isPercentage"]} style={{ display: "contents" }}>
                        <Radio.Group
                          className="radio-group-discount"
                          initialValues={isPercent}
                          onChange={(e) => onChangeRadioGroup(e)}
                        >
                          <Radio.Button value={true} className="percent-option">
                            {pageData.percent}
                          </Radio.Button>
                          <Radio.Button value={false} className="currency-option">
                            {getCurrency()}
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    }
                  />
                </Form.Item>
              )}
            </Input.Group>
          </Col>
        </Row>

        {/* START/END DATE */}
        <Row gutter={[32, 16]}>
          {/* START DATE */}
          <Col xs={24} lg={12}>
            <h4 className="fnb-form-label">
              {pageData.startDate} <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name={["fee", "StartDate"]}
              rules={[
                {
                  required: true,
                  message: pageData.pleaseStartDate,
                },
              ]}
            >
              <DatePicker
                required={true}
                suffixIcon={<CalendarNewIconBold />}
                placeholder={pageData.selectDate}
                className="fnb-date-picker w-100 dtp-start-date"
                disabledDate={disabledDate}
                format={DateFormat.DD_MM_YYYY}
                onChange={(date) => onChangeStartDate(date)}
                initialValues={moment(new Date(), DateFormat)}
              />
            </Form.Item>
          </Col>

          {/* END DATE */}
          <Col xs={24} lg={12}>
            <h4 className="fnb-form-label">{pageData.endDate}</h4>
            <Form.Item name={["fee", "EndDate"]}>
              <DatePicker
                suffixIcon={<CalendarNewIconBold />}
                placeholder={pageData.selectDate}
                className="fnb-date-picker w-100"
                disabledDate={disabledDateByStartDate}
                format={DateFormat.DD_MM_YYYY}
                disabled={startDate ? false : true}
                onChange={(date) => setEndDate(date)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* AUTO APPLIED */}
        <Row>
          <Col>
            <Form.Item name={["fee", "IsAutoApplied"]}>
              <Switch initialValues={isAutoApplied} onChange={(checked) => setIsAutoApplied(checked)} />
              <span className="ml-3 fs-18">
                {pageData.autoApplied}
                <Tooltip
                  placement="topLeft"
                  title={
                    <div>
                      <p>This fee will be applied automatically when created the order.</p>
                      <p>Otherwise, staff must select manually</p>
                    </div>
                  }
                >
                  <span className="ml-3">
                    <ExclamationCircleOutlined />
                  </span>
                </Tooltip>
              </span>
            </Form.Item>
          </Col>
        </Row>

        {/* SERVING TYPE */}
        <Row className="mb-4">
          <Col className="w-100">
            <h4 className="fnb-form-label">
              {pageData.servingTypes} <span className="text-danger">*</span>
            </h4>
            <div className="servingTypes__container">
              <Form.Item
                name={["fee", "servingTypes"]}
                rules={[{ required: true, message: pageData.pleaseSelectServingTypes }]}
              >
                <Checkbox.Group options={servingTypeOptions} />
              </Form.Item>
              {/* {renderServingType()} */}
            </div>
          </Col>
        </Row>

        {/* BRANCH */}
        <Row className="mb-3 flex-space-between">
          <Col>
            <h3>
              {pageData.branchName} <span className="text-danger">*</span>
            </h3>
          </Col>
          <Col>
            <Form.Item name={["fee", "isShowAllBranches"]} valuePropName="checked" noStyle>
              <Checkbox className="w-100" onChange={onChangeCheckBoxAllBranches}>
                {pageData.allBranches}
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {
          <Row>
            <Form.Item
              className="w-100"
              name={["fee", "feeBranchIds"]}
              rules={[
                {
                  required: !isAllBranches,
                  message: pageData.pleaseSelectBranch,
                },
              ]}
            >
              <FnbSelectMultiple
                placeholder={pageData.selectBranch}
                className="w-100"
                allowClear
                disabled={isAllBranches}
                onChange={(value) => onSelectBranches(value)}
                option={listBranch?.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
              />
            </Form.Item>
          </Row>
        }

        {/* DESCRIPTION */}
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label">{pageData.description}</h4>
            <Form.Item name={["fee", "description"]}>
              <FnbTextArea size="large" rows={1} showCount maxLength={pageData.descriptionMaximum} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <>
      <FnbModal
        width={"800px"}
        visible={isModalVisible}
        title={pageData.titleAddNewFee}
        cancelText={pageData.cancel}
        handleCancel={handleCancel}
        content={renderContent()}
        okText={pageData.addNew}
        onOk={onFinish}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={() => setShowConfirm(false)}
        onOk={onDiscard}
        className="d-none"
      />
    </>
  );
}
