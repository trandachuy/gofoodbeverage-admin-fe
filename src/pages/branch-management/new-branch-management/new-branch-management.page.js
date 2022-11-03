import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Layout, message, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGoogleMap } from "components/fnb-google-map/google-map.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import PageTitle from "components/page-title";
import { PlacesAutocomplete } from "components/places-auto-complete/places-auto-complete.component";
import { PermissionKeys } from "constants/permission-key.constants";
import storeDataService from "data-services/store/store-data.service";
import { useEffect, useRef, useState } from "react";
import { getValidationMessages } from "utils/helpers";

const { Content } = Layout;

export default function NewBranchManagement(props) {
  const { t, branchDataService, history } = props;

  const pageData = {
    btnCancel: t("button.cancel"),
    btnCreate: t("button.create"),
    titleCreateBranch: t("settings.createBranch.titleCreateBranch"),
    labelBranchName: t("settings.createBranch.name"),
    inputBranchName: t("settings.createBranch.inputBranchName"),
    validBranchName: t("settings.createBranch.validBranchName"),

    labelCountry: t("form.country"),

    labelPhone: t("form.phone"),
    inputPhone: t("form.inputPhone"),
    validPhone: t("form.validPhone"),
    validPhonePattern: t("form.validPhonePattern"),

    labelEmail: t("form.email"),
    inputEmail: t("form.inputEmail"),
    validEmail: t("form.validEmail"),
    invalidMessageEmail: t("staffManagement.generalInformation.emailInvalidMessage"),

    labelAddress: t("form.address"),
    inputAddress: t("form.inputAddress"),
    validAddress: t("form.validAddress"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),
    labelAddressTwo: t("form.addressTwo"),

    labelProvince: t("form.province"),
    selectProvince: t("form.selectProvince"),
    validProvince: t("form.validProvince"),

    labelDistrict: t("form.district"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),

    labelWard: t("form.ward"),
    selectWard: t("form.selectWard"),
    validWard: t("form.validWard"),

    labelCity: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),

    labelState: t("form.state"),
    validState: t("form.validState"),

    labelZip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),
    invalidZip: t("form.invalidZip"),

    leaveForm: t("messages.leaveForm"),
    confirmation: t("messages.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),
    branchAddedSuccessfully: t("settings.createBranch.branchAddedSuccessfully"),
    backBtn: t("settings.createBranch.back"),
    generalInformation: t("settings.createBranch.generalInformation"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),
    inputBranchAddressPlaceholder: t("settings.createBranch.inputBranchAddressPlaceholder"),
    inputBranchAddressValidateMessage: t("settings.createBranch.inputBranchAddressValidateMessage"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);

  const [initData, setInitData] = useState({});
  const [countries, setCountries] = useState(null);
  const [phoneCode, setPhoneCode] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  //Address Info
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [branchLocation, setBranchLocation] = useState(null);
  const autoCompleteRef = useRef();
  const googleMapRef = useRef();

  useEffect(() => {
    checkAvailableBranchQuantity();
  }, []);

  function checkAvailableBranchQuantity() {
    storeDataService.getAvailableBranchQuantityAsync().then((res) => {
      const { availableBranchQuantity } = res;
      if (availableBranchQuantity <= 0) {
        history.push("/branch");
      } else {
        getInitData();
      }
    });
  }

  const getInitData = () => {
    storeDataService.getPrepareAddressDataAsync().then((initData) => {
      setInitData(initData);
      setCountries(initData?.countries);
      setPhoneCode(initData?.defaultCountryStore?.phonecode);

      //Address Info
      setStates(initData?.states);
      setCities(initData?.cities);
      setDistricts(initData?.districts);
      setWards(initData?.wards);
      //setFieldsValue
      let formValue = form.getFieldsValue();
      formValue.countryId = initData?.defaultCountryStore?.id;
      form.setFieldsValue(formValue);
      setIsDefaultCountry(initData?.defaultCountry?.id === initData?.defaultCountryStore?.id);
    });
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhoneCode(country?.phonecode);

    countryId === initData?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);

    ///Set region for select address autocomplete
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setDefaultCountry(countryId === initData?.defaultCountry?.id ? true : false);
      autoCompleteRef.current.clearCurrentLocation();
    }
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

  const prefixSelector = <label>+{phoneCode}</label>;

  const onFinish = async (values) => {
    if (!branchLocation) {
      message.error(pageData.inputBranchAddressValidateMessage);
      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setIsError(true);
      }
      return;
    } else {
      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setIsError(false);
      }
    }

    let request = {
      ...values,
      location: {
        lat: branchLocation?.center?.lat,
        lng: branchLocation?.center?.lng,
      },
    };

    let res = await branchDataService.createBranchManagementAsync(request).catch((errs) => {
      form.setFields(getValidationMessages(errs));
    });

    if (res) {
      const { success } = res;
      if (success === true) {
        onCompleted({
          savedSuccessfully: true,
          message: pageData.branchAddedSuccessfully,
        });
        onResetFields();
      } else {
        message.error(t("createBranch.requestUpgradeMessage"));
      }
    }
  };

  /**
   * This function is used to set the form status,
   * if value is true when you leave this page then a confirmation box will be displayed.
   *
   */
  const onFormChanged = () => {
    if (form.getFieldsValue()) {
      setIsChangeForm(true);
      setDisableSaveButton(false);
    } else {
      setIsChangeForm(false);
      setDisableSaveButton(true);
    }
  };

  /**
   * This function is used to navigate to the Staff Management page.
   * @param  {any} data This data will be called at the Branch Management page.
   */
  const onCompleted = (data) => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push({ pathname: "/branch", state: data });
    }, 100);
  };

  /**
   * This function is used to get location from the google map
   * @param {*} location
   */
  const onSelectLocation = (location) => {
    setBranchLocation(location);
    onSetFormAddressValue(location.address);

    ///Set google map marker
    if (googleMapRef && googleMapRef.current) {
      googleMapRef.current.setCenter(location.center);
    }
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setIsError(false);
    }
  };

  /// Set form address value when input address google map
  const onSetFormAddressValue = (address) => {
    if (address) {
      if (isDefaultCountry) {
        const fullAddress = address;
        const splitAddress = fullAddress.split(",");
        const mainAddress = splitAddress[0];
        const city = splitAddress[3];
        const district = splitAddress[2];

        const fullWard = splitAddress[1];
        const ward = fullWard.replace("phường", "").replace("Phường", "");

        ///Find address id
        let cityId = cities?.find((x) => city?.trim().toLowerCase().includes(x.name?.trim().toLowerCase()))?.id;
        let districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? [];
        setDistrictsByCityId(districtsFilteredByCity);

        let districtId = districtsFilteredByCity?.find(
          (x) => district?.trim().toLowerCase() === x.name?.trim().toLowerCase()
        )?.id;
        let wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? [];
        setWardsByDistrictId(wardsFilteredByCity);

        let wardId = wardsFilteredByCity?.find((x) => ward?.trim().toLowerCase() === x.name?.trim().toLowerCase())?.id;

        ///Set address field value
        let formValue = form.getFieldsValue();
        formValue.address1 = mainAddress;
        formValue.cityId = cityId;
        formValue.districtId = districtId;
        formValue.wardId = wardId;
        form.setFieldsValue(formValue);
      } else {
        const fullAddress = address;
        const [street, ...otherAddressInfo] = fullAddress.split(",");
        const mainAddress = street;
        const subAddress = otherAddressInfo.join(",");

        let stateId = states?.find((x) => subAddress?.trim().toLowerCase().includes(x.name?.trim().toLowerCase()))?.id;

        ///Set address field value
        let formValue = form.getFieldsValue();
        formValue.address1 = mainAddress;
        formValue.stateId = stateId;
        form.setFieldsValue(formValue);
      }
    }
  };

  const onSetEmptyLocation = () => {
    setBranchLocation(null);
  };

  const onResetFields = () => {
    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.clearCurrentLocation();
    }
    form.resetFields();
    onSetEmptyLocation();
  };

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

  return (
    <>
      <Form
        autoComplete="off"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 22,
        }}
        onFinish={onFinish}
        form={form}
        onChange={onFormChanged}
      >
        <Row className="fnb-row-page-header">
          {/* <Col xs={24} sm={24} lg={12}>
            <div className="link-back-page link-back-page-staff">
              <button onClick={onCompleted} type="link">
                <span className="btn-back-icon">
                  <ArrowLeftIcon />
                </span>
                {pageData.backBtn}
              </button>
            </div>
            <p className="card-header pb-0 mb-1">
              <b className="lblTitle">{pageData.titleCreateBranch}</b>
            </p>
          </Col> */}
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.titleCreateBranch} />
            </p>
          </Col>

          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button disabled={disableSaveButton} icon={<PlusSquareOutlined />} type="primary" htmlType="submit">
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

        <Content>
          <Card className="fnb-box custom-box">
            <Row className="group-header-box">
              <Col xs={24} sm={24} lg={24}>
                {pageData.generalInformation}
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelBranchName}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="branchName"
                  rules={[
                    { required: true, message: pageData.validBranchName },
                    { type: "string", warningOnly: true },
                    { type: "string", max: 100, min: 3 },
                  ]}
                >
                  <Input
                    showCount
                    maxLength={100}
                    className="fnb-input-with-count"
                    placeholder={pageData.inputBranchName}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelCountry}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="countryId"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <FnbSelectSingle
                    option={countries?.map((item) => ({
                      id: item.id,
                      name: item.nicename,
                    }))}
                    onChange={onCountryChange}
                    showSearch
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">
                  {pageData.labelPhone}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: pageData.validPhone,
                    },
                    {
                      validator(_, value) {
                        let lengthValue = value.length;
                        let validateValue = /^[0-9\b]+$/;
                        let checkValue = validateValue.test(value);
                        if (value && !checkValue) {
                          return Promise.reject(pageData.allowNumberOnly);
                        } else if (value && checkValue && (lengthValue < 3 || lengthValue > 15)) {
                          return Promise.reject(
                            `${pageData.labelPhone} ${pageData.mustBeBetweenThreeAndFifteenCharacters}`
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    className="fnb-input-addon-before"
                    size="large"
                    placeholder={pageData.inputPhone}
                    addonBefore={prefixSelector}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} xs={24} lg={12}>
                <h4 className="fnb-form-label">{pageData.labelEmail}</h4>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: pageData.invalidMessageEmail,
                    },
                  ]}
                >
                  <Input className="fnb-input" size="large" placeholder={pageData.inputEmail} />
                </Form.Item>
              </Col>
            </Row>

            {isDefaultCountry ? (
              <>
                <Row gutter={[16, 16]}>
                  <Col sm={24} xs={24} lg={12}>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelAddress}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="address1"
                          rules={[
                            {
                              required: true,
                              message: pageData.validAddress,
                            },
                          ]}
                        >
                          <Input
                            showCount
                            maxLength={255}
                            className="fnb-input-with-count"
                            size="large"
                            placeholder={pageData.inputAddress}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelProvince}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="cityId" rules={[{ required: true, message: pageData.validProvince }]}>
                          <FnbSelectSingle
                            placeholder={pageData.inputCity}
                            option={cities?.map((item) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                            onChange={onChangeCity}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelDistrict}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="districtId" rules={[{ required: true, message: pageData.validDistrict }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectDistrict}
                            option={districtsByCityId?.map((item) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                            onChange={onChangeDistrict}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelWard}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="wardId" rules={[{ required: true, message: pageData.validWard }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectWard}
                            option={wardsByDistrictId?.map((item) => ({
                              id: item.id,
                              name: item?.prefix + " " + item.name,
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* Google map */}
                  <Col sm={24} xs={24} lg={12}>
                    <div className="branch-google-map-container">
                      <PlacesAutocomplete
                        inputClassName="input-address"
                        addressPopoverClassName="input-address-popover"
                        textOverflowClassName="input-address-text-overflow"
                        ref={autoCompleteRef}
                        inputPlaceholder={pageData.inputBranchAddressPlaceholder}
                        onSelectLocation={onSelectLocation}
                        onEmptyLocation={onSetEmptyLocation}
                      ></PlacesAutocomplete>
                      <FnbGoogleMap ref={googleMapRef} className="google-map-box"></FnbGoogleMap>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  <Col sm={24} xs={24} lg={12}>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelAddress}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="address1"
                          rules={[
                            {
                              required: true,
                              message: pageData.validAddress,
                            },
                          ]}
                        >
                          <Input className="fnb-input" placeholder={pageData.inputAddressTwo} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">{pageData.labelAddressTwo}</h4>
                        <Form.Item name="address2">
                          <Input className="fnb-input" placeholder={pageData.inputAddressTwo} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelCity}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="cityTown" rules={[{ required: true, message: pageData.validCity }]}>
                          <Input className="fnb-input" placeholder={pageData.inputCity} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelState}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item name="stateId" rules={[{ required: true, message: pageData.validState }]}>
                          <FnbSelectSingle
                            placeholder={pageData.selectProvince}
                            option={states?.map((item) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <h4 className="fnb-form-label">
                          {pageData.labelZip}
                          <span className="text-danger">*</span>
                        </h4>
                        <Form.Item
                          name="postalCode"
                          rules={[
                            {
                              required: true,
                              message: pageData.validZip,
                            },
                            {
                              pattern: /^[0-9]{6}(?:-[0-9]{5})?$/im,
                              message: pageData.invalidZip,
                            },
                          ]}
                        >
                          <Input type={"number"} className="fnb-input" placeholder={pageData.inputZip} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* Google map */}
                  <Col sm={24} xs={24} lg={12}>
                    <div className="branch-google-map-container">
                      <PlacesAutocomplete
                        inputClassName="input-address"
                        addressPopoverClassName="input-address-popover"
                        textOverflowClassName="input-address-text-overflow"
                        ref={autoCompleteRef}
                        inputPlaceholder={pageData.inputBranchAddressPlaceholder}
                        onSelectLocation={onSelectLocation}
                        onEmptyLocation={onSetEmptyLocation}
                      ></PlacesAutocomplete>
                      <FnbGoogleMap ref={googleMapRef} className="google-map-box" zoom={18}></FnbGoogleMap>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Content>
      </Form>
      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveForm}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discard}
        okText={pageData.confirmLeave}
        onCancel={() => setShowConfirm(false)}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
