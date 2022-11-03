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

export default function EditBranchPage(props) {
  const { t, branchDataService, match, history } = props;

  const { Content } = Layout;
  const [form] = Form.useForm();
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    labelBranchName: t("settings.createBranch.branchName"),
    inputBranchName: t("settings.createBranch.inputBranchName"),
    validBranchName: t("settings.createBranch.validBranchName"),
    titleEditBranch: t("settings.editBranch.titleEditBranch"),
    branchUpdatedSuccessfully: t("settings.editBranch.branchUpdatedSuccessfully"),

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
    backBtn: t("settings.createBranch.back"),
    generalInformation: t("settings.createBranch.generalInformation"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),
    inputBranchAddressPlaceholder: t("settings.createBranch.inputBranchAddressPlaceholder"),
    inputBranchAddressValidateMessage: t("settings.createBranch.inputBranchAddressValidateMessage"),
  };

  const [isChangeForm, setIsChangeForm] = useState(false);
  const [initData, setInitData] = useState({});
  const [countries, setCountries] = useState(null);
  const [phonecode, setPhonecode] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  //Address Info
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setwardsByDistrictId] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [branchLocation, setBranchLocation] = useState(null);
  const autoCompleteRef = useRef();
  const googleMapRef = useRef();

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
  }, []);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(storeDataService.getPrepareAddressDataAsync());
    promises.push(branchDataService.getBranchByIdAsync(match?.params?.branchId));
    let [prepareAddressDataResponse, branchData] = await Promise.all(promises);

    /// Meta data
    const { countries, cities, districts, wards, states, defaultCountry } = prepareAddressDataResponse;
    setInitData(prepareAddressDataResponse);
    setCountries(countries);
    setCities(cities);
    setDistricts(districts);
    setWards(wards);
    setStates(states);

    /// Set customer data
    if (branchData) {
      const { branch } = branchData;
      let address1 = branch?.address1;
      let cityId = branch?.cityId;
      let districtId = branch?.districtId;
      let wardId = branch?.wardId;
      let countryId = branch?.countryId;
      let stateId = branch?.stateId;
      let fullAddress = "";

      onChangeCity(cityId);
      onChangeDistrict(districtId);
      const initField = {
        ...branch,
      };
      form.setFieldsValue(initField);
      if (branch?.countryId === defaultCountry?.id) {
        setIsDefaultCountry(true);
      } else {
        setIsDefaultCountry(false);
      }
      let country = countries?.find((item) => item.id === branch?.countryId);
      setPhonecode(country.phonecode);

      let districtsFilteredByCity = districts?.filter((item) => item.cityId === cityId) ?? [];
      setDistrictsByCityId(districtsFilteredByCity);

      let wardsFilteredByCity = wards?.filter((item) => item.districtId === districtId) ?? [];
      setwardsByDistrictId(wardsFilteredByCity);

      ///Set location
      if (branch?.countryId === defaultCountry?.id) {
        const currentAddress = address1;
        const currentWard = wards?.find((x) => x.id === wardId);
        const districtName = districts?.find((x) => x.id === districtId)?.name;
        const cityName = cities?.find((x) => x.id === cityId)?.name;
        fullAddress = `${currentAddress}, ${currentWard?.prefix} ${currentWard?.name}, ${districtName}, ${cityName}`;
      } else {
        const currentAddress = address1;
        const stateName = states?.find((x) => x.id === stateId)?.name;
        const countryName = countries?.find((x) => x.id === countryId).name;
        fullAddress = `${currentAddress}, ${stateName}, ${countryName}`;
      }

      ///Set google map marker
      const currentBranchLocation = { lat: branch?.lat, lng: branch?.lng };

      if (autoCompleteRef && autoCompleteRef.current) {
        autoCompleteRef.current.setAddressWhenEdit(fullAddress);
      }

      setBranchLocation({
        center: currentBranchLocation,
        address: fullAddress,
      });

      if (googleMapRef && googleMapRef.current) {
        googleMapRef.current.setCenter(currentBranchLocation);
      }
    }
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhonecode(country.phonecode);

    countryId === initData?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);

    let formValue = form.getFieldsValue();
    formValue.cityId = null;
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);

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
    setwardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const prefixSelector = <label>+{phonecode}</label>;

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

    var editModel = {
      ...values,
      branchId: match?.params.branchId,
      location: {
        lat: branchLocation?.center?.lat,
        lng: branchLocation?.center?.lng,
      },
    };

    let res = null;
    try {
      res = await branchDataService.updateBranchByIdAsync(editModel);
    } catch (errs) {
      form.setFields(getValidationMessages(errs));
    }

    if (res) {
      onCompleted({
        savedSuccessfully: true,
        message: pageData.branchUpdatedSuccessfully,
      });
      onResetFields();
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
        setwardsByDistrictId(wardsFilteredByCity);

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
      return false;
    } else {
      setShowConfirm(false);
      onCompleted();
      return true;
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
        onFieldsChange={(e) => changeForm(e)}
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.titleEditBranch} />
            </p>
          </Col>

          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button disabled={disableSaveButton} type="primary" htmlType="submit">
                      {pageData.btnSave}
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
                      min: 3,
                      max: 15,
                      message: `${pageData.labelPhone} ${pageData.mustBeBetweenThreeAndFifteenCharacters}`,
                    },
                    {
                      pattern: /^\d+$/g,
                      message: pageData.allowNumberOnly,
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
