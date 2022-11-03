import { Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import PageTitle from "components/page-title";
import { CalendarNewIcon, IconBtnAdd } from "constants/icons.constants";
import { images } from "constants/images.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { ClassicMember, DateFormat } from "constants/string.constants";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { formatCurrency, getValidationMessages } from "utils/helpers";
import "../create-customer/create-customer.page.scss";
import "./index.scss";

export default function EditCustomerPage(props) {
  const { t, customerDataService, history, match } = props;
  const fnbImageSelectRef = React.useRef();

  const pageData = {
    title: t("customer.updateForm.title"),
    btnCancel: t("button.cancel"),
    btnUpdate: t("button.update"),
    btnSave: t("button.save"),
    allowedLetterAndNumber: t("form.allowedLetterAndNumber"),
    code: t("table.code"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    customerUpdateSuccess: t("customer.updateForm.customerUpdateSuccess"),
    customerUpdateFail: t("customer.updateForm.customerUpdateFail"),
    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    firstName: t("customer.addNewForm.firstName"),
    lastName: t("customer.addNewForm.lastName"),
    phone: t("customer.addNewForm.phone"),
    email: t("customer.addNewForm.email"),
    birthday: t("customer.addNewForm.birthday"),
    male: t("customer.addNewForm.male"),
    note: t("customer.addNewForm.note"),
    firstNamePlaceholder: t("customer.addNewForm.firstNamePlaceholder"),
    lastNamePlaceholder: t("customer.addNewForm.lastNamePlaceholder"),
    emailPlaceholder: t("customer.addNewForm.emailPlaceholder"),
    phonePlaceholder: t("customer.addNewForm.phonePlaceholder"),
    addressPlaceholder: t("customer.addNewForm.addressPlaceholder"),
    firstNameValidation: t("customer.addNewForm.firstNameValidation"),
    lastNameValidation: t("customer.addNewForm.lastNameValidation"),
    phoneValidation: t("customer.addNewForm.phoneValidation"),
    emailValidation: t("customer.addNewForm.emailValidation"),
    address: t("customer.addNewForm.address"),
    mustBeBetweenOneAndFiftyCharacters: t("customer.addNewForm.mustBeBetweenOneAndFiftyCharacters"),
    emailInvalidEmail: t("customer.addNewForm.emailInvalidEmail"),
    birthdayPlaceholder: t("customer.addNewForm.birthdayPlaceholder"),
    allowNumberOnly: t("form.allowNumberOnly"),
    validPhonePattern: t("form.validPhonePattern"),
    province: t("form.province"),
    district: t("form.district"),
    ward: t("form.ward"),
    selectProvince: t("form.selectProvince"),
    stateProvinceRegion: t("form.stateProvinceRegion"),
    selectProvinceStateRegion: t("form.selectProvinceStateRegion"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    selectWard: t("form.selectWard"),
    uploadImage: t("productManagement.generalInformation.uploadImage"),
    female: t("customer.addNewForm.female"),
    rank: t("customer.rank"),
    rewardPoint: t("customer.updateForm.rewardPoint"),
    totalOrder: t("customer.updateForm.totalOrder"),
    totalMoney: t("customer.updateForm.totalMoney"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),

    fullName: t("customer.fullName"),
    country: t("form.country"),
    customerManagement: t("customer.title"),

    generalInformation: t("customer.generalInformation"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    customerDeleteSuccess: t("customer.customerDeleteSuccess"),
    customerDeleteFail: t("customer.customerDeleteFail"),
    gender: t("customer.addNewForm.gender"),
    platformTitle: t("platform.title"),

    labelAddress: t("form.address"),
    inputAddress: t("form.inputAddress"),
    validAddress: t("form.validAddress"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),
    labelAddressTwo: t("form.addressTwo"),
    labelState: t("form.state"),
    labelZip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),

    labelCity: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("material.addFromUrl"),
      uploadImage: t("material.addFile"),
    },
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    btnConfirmLeave: t("button.confirmLeave"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [phonecode, setPhonecode] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [isMale, setMale] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [customer, setCustomer] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [defaultCountryId, setDefaultCountryId] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(storeDataService.getPrepareAddressDataAsync());
    promises.push(customerDataService.getCustomerByIdAsync(match?.params?.customerId));
    let [prepareAddressDataResponse, customerResponse] = await Promise.all(promises);

    /// Meta data
    const { defaultCountry, cities, districts, wards, defaultCountryStore, countries, states } =
      prepareAddressDataResponse;
    setCities(cities);
    setDistricts(districts);
    setWards(wards);
    setPhonecode(defaultCountryStore?.phonecode);
    setCountries(countries);
    setStates(states);
    setDefaultCountryId(defaultCountry?.id);
    let address1 = null;
    let cityId = null;
    let districtId = null;
    let wardId = null;
    let countryId = null;
    let stateId = null;
    let cityTown = null;
    let address2 = null;

    /// Set customer data
    if (customerResponse) {
      const { customer } = customerResponse;
      address1 = customer?.customerAddress?.address1;
      cityId = customer?.customerAddress?.cityId;
      districtId = customer?.customerAddress?.districtId;
      wardId = customer?.customerAddress?.wardId;
      countryId = customer?.customerAddress?.countryId;
      stateId = customer?.customerAddress?.stateId;
      cityTown = customer?.customerAddress?.cityTown;
      address2 = customer?.customerAddress?.address2;

      setCustomer(customer);
      setMale(customer?.gender);
      setIsDefaultCountry(countryId === defaultCountry?.id ? true : false);
      onChangeCity(cityId);
      onChangeDistrict(districtId);
      setCustomerName(customer?.fullName);
      let country = countries?.find((item) => item.id === countryId);
      setPhonecode(country.phonecode);

      const initField = {
        ...customer,
        birthDay: customer?.birthday ? moment.utc(customer?.birthday).local() : null,
        phone: customer?.phoneNumber,
        address: {
          address1: address1,
          cityId: cityId,
          districtId: districtId,
          wardId: wardId,
          countryId: countryId,
          stateId: stateId,
          cityTown: cityTown,
          address2: address2,
        },
      };
      form.setFieldsValue(initField);

      let districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? [];
      setDistrictsByCityId(districtsFilteredByCity);

      let wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? [];
      setWardsByDistrictId(wardsFilteredByCity);

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        fnbImageSelectRef.current.setImageUrl(customer?.thumbnail ?? images.imgDefault);
        setSelectedImage(customer?.thumbnail ?? images.imgDefault);
      }
    }
  };

  const prefixSelector = <label>+{phonecode}</label>;

  const onFinish = async (values) => {
    const editUserRequestModel = {
      ...values,
      isMale: isMale,
      addressId: customer?.addressId,
      id: match?.params?.customerId,
      thumbnail:
        fnbImageSelectRef.current.getImageUrl() === images.imgDefault ? null : fnbImageSelectRef.current.getImageUrl(),
      birthDay: values.birthDay ? moment.utc(values.birthDay).format("yyyy-MM-DD HH:mm:ss") : null,
    };
    customerDataService
      .updateCustomerAsync(editUserRequestModel)
      .then((res) => {
        if (res) {
          setIsChangeForm(false);
          message.success(pageData.customerUpdateSuccess);
          history.push("/customer/management");
        } else {
          message.error(pageData.customerUpdateFail);
        }
      })
      .catch((errs) => {
        form.setFields(getValidationMessages(errs));
      });
  };

  const onGenderChange = (e) => {
    setMale(e.target.value);
  };

  const confirm = (props) => {
    Modal.confirm({
      title: pageData.confirmation,
      content: pageData.leaveForm,
      okText: pageData.confirmLeave,
      cancelText: pageData.discard,
      onOk() {
        history.push("/customer/management");
      },
    });
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity = districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity = wards?.filter((item) => item.districtId === event) ?? [];
    setWardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.customerDeleteSuccess);
        history.push(`/customer/management`);
      } else {
        message.error(pageData.customerDeleteFail);
      }
    });
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onDeleteCustomer = () => {
    setShowConfirm(true);
  };

  const gotoCustomerPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/customer/management");
    }, 100);
  };

  const contentPopover = (
    <div className="material-view-popover material-view-delete">
      <a onClick={() => setShowConfirm(true)}>{pageData.btnDelete}</a>
    </div>
  );

  const handleVisibleChange = (newVisible) => {
    setIsShowPopover(newVisible);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirmLeave(true);
    } else {
      setShowConfirmLeave(false);
      gotoCustomerPage();
    }
  };

  const onDiscardLeaveModal = () => {
    setShowConfirmLeave(false);
  };

  return (
    <Form
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
      <div>
        <Row className="staff-header-box">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={customerName} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<IconBtnAdd className="icon-btn-edit-customer" />}
                      className="btn-edit-customer"
                    >
                      {pageData.btnUpdate}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_CUSTOMER,
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </a>
                  ),
                  permission: PermissionKeys.VIEW_CUSTOMER,
                },
                {
                  action: (
                    <a onClick={() => handleVisibleChange()} className="action-delete">
                      {pageData.btnDelete}
                    </a>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <div className="clearfix"></div>
        <div className="customer-edit-card">
          <div className="title-session">
            <span>{pageData.generalInformation}</span>
          </div>
          <Row>
            <Col sm={24} xs={24} lg={8}>
              <div className="left-card">
                <div className="left-card-image">
                  <FnbImageSelectComponent ref={fnbImageSelectRef} />
                </div>
                <div className="info-container">
                  <div className="rank-box">
                    <span className="text-left">{pageData.rank}</span>
                    <span
                      className="rank-badge"
                      style={
                        customer.badgeColor && customer.badgeColor !== ""
                          ? { background: customer.badgeColor }
                          : { background: "#efbb00" }
                      }
                    >
                      {customer?.rank ?? ClassicMember}
                    </span>
                  </div>
                  <div className="other-info-box">
                    <div className="reward">
                      <span className="text-left">{pageData.rewardPoint}</span>
                      <span className="reward-point">-</span>
                    </div>
                    <div className="total">
                      <span className="text-left">{pageData.totalOrder}</span>
                      <span className="total-amount">
                        <b>{customer?.totalOrder}</b>
                      </span>
                    </div>
                    <div className="total">
                      <span className="text-left">{pageData.totalMoney}</span>
                      <span className="total-amount">
                        <b>{formatCurrency(customer?.totalMoney)}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={24} xs={24} lg={16} className="customer-edit-card-right-padding">
              <div className="fnb-box custom-box customer-edit-general-title">
                <Row className="group-header-box">
                  <Col span={24}>{pageData.generalInformation}</Col>
                </Row>
              </div>
              <Row style={{ display: "grid" }}>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">
                      {pageData.fullName} <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={"fullName"}
                      rules={[
                        {
                          required: true,
                          message: pageData.fullNameValidation,
                        },
                        { type: "string", warningOnly: true },
                        {
                          type: "string",
                          max: 50,
                          min: 1,
                          message: `${pageData.firstName} ${pageData.mustBeBetweenOneAndFiftyCharacters}`,
                        },
                      ]}
                    >
                      <Input
                        className="fnb-input-with-count"
                        showCount
                        maxLength={50}
                        size="large"
                        onChange={(event) => {
                          setCustomerName(event.target.value);
                        }}
                        placeholder={pageData.fullNamePlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.country}</h4>
                    <Form.Item
                      initialValue={defaultCountryId}
                      name={["address", "countryId"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.lastNameValidation,
                        },
                      ]}
                    >
                      <FnbSelectSingle
                        defaultValue={defaultCountryId}
                        size="large"
                        placeholder={pageData.selectCountry}
                        onChange={(value) => {
                          if (value && value !== defaultCountryId) {
                            setIsDefaultCountry(false);
                          } else {
                            setIsDefaultCountry(true);
                          }
                          let country = countries?.find((item) => item.id === value);
                          setPhonecode(country.phonecode);
                        }}
                        showSearch
                        autoComplete="none"
                        option={countries?.map((item, index) => ({
                          id: item.id,
                          name: item.nicename,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">
                      {pageData.phone}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={"phone"}
                      rules={[
                        {
                          required: true,
                          message: pageData.phoneValidation,
                        },
                        {
                          pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                          message: pageData.validPhonePattern,
                        },
                      ]}
                    >
                      <Input
                        maxLength={15}
                        className="fnb-input-addon-before"
                        size="large"
                        placeholder={pageData.phonePlaceholder}
                        addonBefore={prefixSelector}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.address}</h4>
                    <Form.Item name={["address", "address1"]}>
                      <Input className="fnb-input" size="large" placeholder={pageData.addressPlaceholder} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.email}</h4>
                    <Form.Item
                      name={"email"}
                      rules={[
                        {
                          required: false,
                          message: pageData.emailValidation,
                        },
                        {
                          type: "email",
                          message: pageData.emailInvalidEmail,
                        },
                      ]}
                    >
                      <Input className="fnb-input" size="large" placeholder={pageData.emailPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    {isDefaultCountry ? (
                      <>
                        <h4 className="fnb-form-label">{pageData.province}</h4>
                        <Form.Item name={["address", "cityId"]}>
                          <FnbSelectSingle
                            size="large"
                            placeholder={pageData.selectProvince}
                            onChange={onChangeCity}
                            showSearch
                            autoComplete="none"
                            option={cities?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <h4 className="fnb-form-label">{pageData.labelAddressTwo}</h4>
                        <Form.Item name={["address", "address2"]}>
                          <Input className="fnb-input" size="large" placeholder={pageData.inputAddressTwo} />
                        </Form.Item>
                      </>
                    )}
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.birthday}</h4>
                    <Form.Item name={"birthDay"}>
                      <DatePicker
                        suffixIcon={<CalendarNewIcon />}
                        className="fnb-date-picker w-100"
                        format={DateFormat.DD_MM_YYYY}
                        onChange={(date) => setStartDate(date)}
                        placeholder={pageData.birthdayPlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    {isDefaultCountry ? (
                      <>
                        <h4 className="fnb-form-label">{pageData.district}</h4>
                        <Form.Item name={["address", "districtId"]}>
                          <FnbSelectSingle
                            size="large"
                            placeholder={pageData.selectDistrict}
                            onChange={onChangeDistrict}
                            showSearch
                            autoComplete="none"
                            option={districtsByCityId?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <h4 className="fnb-form-label">{pageData.labelCity}</h4>
                        <Form.Item name={["address", "cityTown"]}>
                          <Input className="fnb-input" placeholder={pageData.inputCity} />
                        </Form.Item>
                      </>
                    )}
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <h4 className="fnb-form-label">{pageData.gender}</h4>
                    <Form.Item className="form-gender-customer-edit">
                      <Radio.Group onChange={onGenderChange} value={isMale}>
                        <Row>
                          <Col sm={24} xs={24} lg={12}>
                            <Radio value={false}>{pageData.female}</Radio>
                          </Col>
                          <Col sm={24} xs={24} lg={12}>
                            <Radio className="last-gender-option-customer-edit" value={true}>
                              {pageData.male}
                            </Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col sm={24} xs={24} lg={12}>
                    {isDefaultCountry ? (
                      <>
                        <h4 className="fnb-form-label">{pageData.ward}</h4>
                        <Form.Item name={["address", "wardId"]}>
                          <FnbSelectSingle
                            size="large"
                            placeholder={pageData.selectWard}
                            showSearch
                            option={wardsByDistrictId?.map((item, index) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <h4 className="fnb-form-label">{pageData.labelState}</h4>
                        <Form.Item name={["address", "stateId"]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectProvinceStateRegion}
                            option={states?.map((item) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </>
                    )}
                  </Col>
                </Row>
                <Row gutter={[25, 25]} className="form-row">
                  <Col sm={24} xs={24} lg={12}>
                    <p className="text-label">{pageData.platformTitle}</p>
                    <p className="text-detail">{customer?.platformName ?? "-"}</p>
                  </Col>
                </Row>
                <Row gutter={[25, 25]}>
                  <Col sm={24} xs={24} lg={24} className="form-row">
                    <h4 className="fnb-form-label">{pageData.note}</h4>
                    <Form.Item
                      name={"note"}
                      rules={[
                        {
                          max: 1000,
                          message: pageData.descriptionMaximum,
                        },
                      ]}
                    >
                      <FnbTextArea showCount maxLength={1000} rows={4}></FnbTextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={formatDeleteMessage(customer?.firstName?.concat(" ", customer?.lastName))}
        okText={pageData.btnDelete}
        cancelText={pageData.btnIgnore}
        permission={PermissionKeys.DELETE_CUSTOMER}
        onOk={() => handleDeleteItem(match?.params?.customerId)}
        onCancel={onDiscard}
        visible={showConfirm}
        className="d-none"
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirmLeave}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.btnConfirmLeave}
        onCancel={onDiscardLeaveModal}
        onOk={gotoCustomerPage}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </Form>
  );
}
