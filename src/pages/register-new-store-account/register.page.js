import React, { useEffect, useState } from "react";
import { Form, Row, Input, Button, Col, Steps, Image } from "antd";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import {
  DollarIcon,
  ShopBranchStoreLine,
  WorldIcon,
  DrinkBeerIcon,
  StaffUserOutline,
  PhoneIcon,
  MessageIcon,
  PinIcon,
  ZipCodeIcon,
} from "constants/icons.constants";
import { images } from "constants/images.constants";
import { EnumRegisterStep } from "constants/register-step.constants";
import { FnbSelectRegister } from "components/fnb-select-register/fnb-select-register";
import languageService from "services/language/language.service";
import { languageCode } from "constants/language.constants";
import { ValidPhonePattern } from "utils/helpers";
import "../../stylesheets/authenticator.scss";
import foodBeverageLogo from "assets/images/go-fnb-login-logo.png";
const { Step } = Steps;

const RegisterPage = (props) => {
  const { storeDataService, t } = props;
  const languageCodeLocalStorage = languageService.getLang() || languageCode.en;

  const pageData = {
    done: t("button.done"),
    loginHere: t("signIn.loginHere"),
    haveAccount: t("signIn.haveAccount"),
    registerAccount: t("registerAccount.register"),
    storeName: t("registerAccount.storeName"),
    inputStoreName: t("registerAccount.inputStoreName"),
    fullName: t("form.fullName"),
    enterFullName: t("form.enterFullName"),
    country: t("form.country"),
    phone: t("form.phone"),
    inputPhone: t("form.inputPhone"),
    validPhone: t("form.validPhone"),
    validPhonePattern: t("form.validPhonePattern"),
    email: t("form.email"),
    validEmail: t("form.validEmail"),
    inputEmail: t("form.inputEmail"),
    validEmailPattern: t("form.validEmailPattern"),
    currency: t("form.currency"),
    selectCurrency: t("form.selectCurrency"),
    businessModel: t("form.businessModel"),
    selectBusinessModel: t("form.selectBusinessModel"),
    address: t("form.address"),
    validAddress: t("form.validAddress"),
    inputAddress: t("form.inputAddress"),

    addressTwo: t("form.addressTwo"),
    inputAddressOne: t("form.inputAddressOne"),
    inputAddressTwo: t("form.inputAddressTwo"),

    province: t("form.province"),
    selectProvince: t("form.selectProvince"),
    district: t("form.district"),
    selectDistrict: t("form.selectDistrict"),
    validDistrict: t("form.validDistrict"),
    ward: t("form.ward"),
    selectWard: t("form.selectWard"),
    validWard: t("form.validWard"),
    city: t("form.city"),
    inputCity: t("form.inputCity"),
    validCity: t("form.validCity"),
    state: t("form.state"),
    selectState: t("form.selectState"),
    zip: t("form.zip"),
    inputZip: t("form.inputZip"),
    validZip: t("form.validZip"),
    invalidZip: t("form.invalidZip"),
    citySearchTextMaxLength: 255,
    storeInformation: t("form.storeInformation"),
    yourInformation: t("form.yourInformation"),
    yourAddress: t("form.yourAddress"),
    otpVerification: t("form.otpVerification"),
    justSendCode: t("form.justSendCode"),
    didNotReceive: t("form.didNotReceive"),
    resendCode: t("form.resendCode"),
    awesome: t("form.awesome"),
    proceed: t("form.proceed"),
    checkEmail: t("form.checkEmail"),
    select: t("form.select"),
    button: {
      login: t("form.button.login"),
      back: t("form.button.back"),
      next: t("form.button.next"),
      complete: t("form.button.complete"),
      start: t("form.button.start"),
    },
  };

  const [form] = Form.useForm();
  const [initData, setInitData] = useState({});
  const [businessAreas, setBusinessAreas] = useState(null);
  const [currencies, setCurrencies] = useState(null);
  const [countries, setCountries] = useState(null);
  const [phonecode, setPhonecode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  //Address Info
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setwardsByDistrictId] = useState([]);
  const [searchTextCity, setSearchTextCity] = useState();
  const [currentStep, setCurrentStep] = useState(EnumRegisterStep.StoreInfo);

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
  }, []);

  const getInitDataAsync = async () => {
    var initData = await storeDataService.getPrepareRegisterNewStoreDataAsync();
    setInitData(initData);
    setBusinessAreas(initData?.businessAreas);
    setCurrencies(initData?.currencies);
    setCountries(initData?.countries);
    setPhonecode(initData?.defaultCountry?.phonecode);

    const currency = initData?.currencies?.filter(
      (item) => item.code === initData?.defaultCountry?.currencycode
    );

    //Address Info
    setStates(initData?.states);
    setCities(initData?.cities);
    setDistricts(initData?.districts);
    setWards(initData?.wards);

    //setFieldsValue
    let formValue = form.getFieldsValue();
    formValue.countryId = initData?.defaultCountry?.id;
    formValue.currencyId = currency[0]?.id;
    formValue.langCode = languageCodeLocalStorage;
    form.setFieldsValue(formValue);
  };

  const onChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhonecode(country.phonecode);

    countryId === initData?.defaultCountry?.id
      ? setIsDefaultCountry(true)
      : setIsDefaultCountry(false);

    const currency = currencies?.filter(
      (item) => item.code === country?.currencycode
    );

    let formValue = form.getFieldsValue();
    formValue.currencyId = currency[0]?.id;
    form.setFieldsValue(formValue);
  };

  // Set maxlength for search text input of select
  const onSearchCity = (event) => {
    if (event.length <= pageData.citySearchTextMaxLength) {
      setSearchTextCity(event);
    }
  };

  const onChangeCity = (event) => {
    let districtsFilteredByCity =
      districts?.filter((item) => item.cityId === event) ?? [];
    setDistrictsByCityId(districtsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.districtId = null;
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onChangeDistrict = (event) => {
    let wardsFilteredByCity =
      wards?.filter((item) => item.districtId === event) ?? [];
    setwardsByDistrictId(wardsFilteredByCity);

    let formValue = form.getFieldsValue();
    formValue.wardId = null;
    form.setFieldsValue(formValue);
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      storeDataService.registerNewStoreAccountAsync(values).then((res) => {
        if (res) {
          if (isDefaultCountry)
            setCurrentStep(EnumRegisterStep.CompleteRegisterLocal);
          if (!isDefaultCountry)
            setCurrentStep(EnumRegisterStep.CompleteRegisterOtherCountry);
        }
      });
    });
  };

  const next = () => {
    switch (currentStep) {
      case EnumRegisterStep.StoreInfo:
        form
          .validateFields([
            "storeName",
            "countryId",
            "currencyId",
            "businessAreaId",
            "langCode",
          ])
          .then(() => {
            setCurrentStep(EnumRegisterStep.YourInfo);
          });
        break;
      case EnumRegisterStep.YourInfo:
        form.validateFields(["fullName", "phoneNumber", "email"]).then(() => {
          setCurrentStep(EnumRegisterStep.AddressInfo);
        });
        break;
      case EnumRegisterStep.AddressInfo:
        if (isDefaultCountry) {
          form
            .validateFields(["address1", "cityId", "districtId", "wardId"])
            .then(() => {
              setCurrentStep(EnumRegisterStep.OtpVerificationLocal);
            });
        } else {
          form.validateFields(["address1", "address2", "cityTown"]).then(() => {
            setCurrentStep(EnumRegisterStep.AddressInfoOtherCountry);
          });
        }
        break;
      case EnumRegisterStep.AddressInfoOtherCountry:
        if (!isDefaultCountry) {
          form.validateFields(["stateId", "postalCode"]).then(() => {
            setCurrentStep(EnumRegisterStep.OtpVerificationOtherCountry);
          });
        }
        break;
      default:
        break;
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const prefixSelector = <label className="phone-code">(+{phonecode})</label>;
  return (
    <div className="container-register c-authenticator">
      {props?.isAuthenticated ? (
        <>
          <Redirect to="home" />
        </>
      ) : (
        <>
          <div className="form-logo">
            <div>
              <Image preview={false} src={foodBeverageLogo} width={300} />
            </div>
          </div>
          <div className="login-contain login-contain__right">
            <div className="login-inner login-inner__spacing">
              <Form
                form={form}
                onFinish={onFinish}
                className="form-register form-register__spacing"
                autoComplete="off"
              >
                {/* Step line icon */}
                {((currentStep <= EnumRegisterStep.AddressInfo &&
                  isDefaultCountry) ||
                  (currentStep <= EnumRegisterStep.AddressInfoOtherCountry &&
                    !isDefaultCountry)) && (
                  <div className="step">
                    <Steps
                      responsive={false}
                      direction="horizontal"
                      className="step-box"
                      current={currentStep}
                      progressDot="none"
                    >
                      <Step />
                      <Step />
                      <Step />
                    </Steps>
                  </div>
                )}

                <div className="form-container">
                  {/* Form store information */}
                  {currentStep === EnumRegisterStep.StoreInfo && (
                    <>
                      <h1 className="header">{pageData.storeInformation}</h1>
                      <h4 className="label-register  mt-24">
                        {pageData.storeName}*
                      </h4>
                      <Form.Item
                        name="storeName"
                        rules={[
                          {
                            required: true,
                            message: pageData.inputStoreName,
                          },
                        ]}
                      >
                        <Input
                          prefix={<ShopBranchStoreLine />}
                          maxLength={100}
                          size="large"
                          placeholder={pageData.inputStoreName}
                          className="fnb-input form-input"
                        />
                      </Form.Item>
                      <Row>
                        <Col span={12} className="mt-8">
                          <h4 className="label-register ">
                            {pageData.country}*
                          </h4>
                          <Form.Item
                            name="countryId"
                            rules={[{ required: true }]}
                          >
                            <FnbSelectRegister
                              className="form-select-two-row mt-16"
                              showSearch
                              onChange={onCountryChange}
                              placeholder={
                                <>
                                  <WorldIcon className="icon-select-dropdown" />{" "}
                                  <span className="ml-2">
                                    {" "}
                                    {pageData.select}{" "}
                                  </span>
                                </>
                              }
                              labelOption={
                                <WorldIcon className="icon-select-dropdown" />
                              }
                              option={countries?.map((item) => ({
                                id: item.id,
                                name: item.nicename,
                              }))}
                            ></FnbSelectRegister>
                          </Form.Item>
                        </Col>
                        <Col span={12} className="mt-8">
                          <h4 className="label-register ml-16">
                            {pageData.currency}*
                          </h4>
                          <Form.Item
                            name="currencyId"
                            rules={[
                              {
                                required: true,
                                message: pageData.selectCurrency,
                              },
                            ]}
                          >
                            <FnbSelectRegister
                              className="form-select-two-row mt-16 ml-16"
                              showSearch
                              placeholder={
                                <>
                                  <DollarIcon className="icon-select-dropdown" />{" "}
                                  <span className="ml-2">
                                    {" "}
                                    {pageData.select}{" "}
                                  </span>
                                </>
                              }
                              labelOption={
                                <DollarIcon className="icon-select-dropdown" />
                              }
                              option={currencies?.map((item) => ({
                                id: item.id,
                                name: item.code,
                              }))}
                            ></FnbSelectRegister>
                          </Form.Item>
                        </Col>
                      </Row>
                      <h4 className="label-register mt-8">
                        {pageData.businessModel}*
                      </h4>
                      <Form.Item
                        name="businessAreaId"
                        rules={[
                          {
                            required: true,
                            message: pageData.selectBusinessModel,
                          },
                        ]}
                      >
                        <FnbSelectRegister
                          className="form-select mt-16"
                          showSearch
                          placeholder={
                            <>
                              <DrinkBeerIcon className="icon-select-dropdown" />{" "}
                              <span className="ml-2">
                                {" "}
                                {pageData.selectBusinessModel}
                              </span>
                            </>
                          }
                          labelOption={
                            <DrinkBeerIcon className="icon-select-dropdown" />
                          }
                          option={businessAreas?.map((item) => ({
                            id: item.id,
                            name: item.title,
                          }))}
                        ></FnbSelectRegister>
                      </Form.Item>
                    </>
                  )}

                  {/* Form your information */}
                  {currentStep === EnumRegisterStep.YourInfo && (
                    <>
                      <h1 className="header">{pageData.yourInformation}</h1>
                      <h4 className="label-register mt-24">
                        {pageData.fullName}*
                      </h4>
                      <Form.Item
                        name="fullName"
                        rules={[
                          {
                            required: true,
                            message: pageData.enterFullName,
                          },
                        ]}
                      >
                        <Input
                          prefix={<StaffUserOutline />}
                          maxLength={100}
                          size="large"
                          placeholder={pageData.enterFullName}
                          className="fnb-input form-input"
                        />
                      </Form.Item>

                      <Row>
                        <Col span={24} className="mt-8">
                          <h4 className="label-register">{pageData.phone}*</h4>
                          <Form.Item
                            name="phoneNumber"
                            rules={[
                              {
                                required: true,
                                message: pageData.validPhone,
                              },
                              {
                                pattern: ValidPhonePattern,
                                message: pageData.validPhonePattern,
                              },
                            ]}
                          >
                            <Input
                              prefix={
                                <>
                                  <PhoneIcon></PhoneIcon> {prefixSelector}
                                </>
                              }
                              maxLength={100}
                              size="large"
                              placeholder={pageData.inputPhone}
                              className="fnb-input form-input"
                              onChange={onChangePhoneNumber}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24} className="mt-8">
                          <h4 className="label-register ">{pageData.email}*</h4>
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                type: "email",
                                message: pageData.validEmailPattern,
                              },
                              {
                                required: true,
                                message: pageData.validEmail,
                              },
                            ]}
                            normalize={(value, prevVal, prevVals) =>
                              value.trim()
                            }
                          >
                            <Input
                              prefix={<MessageIcon />}
                              maxLength={100}
                              size="large"
                              placeholder={pageData.inputEmail}
                              className="fnb-input form-input"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Form your address */}
                  {currentStep === EnumRegisterStep.AddressInfo && (
                    <>
                      {isDefaultCountry ? (
                        <>
                          <h1 className="header">{pageData.yourAddress}</h1>
                          <h4 className="label-register  mt-24">
                            {pageData.address}*
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
                              prefix={<PinIcon />}
                              maxLength={255}
                              placeholder={pageData.inputAddress}
                              className="fnb-input form-input"
                            />
                          </Form.Item>
                          <Row>
                            <Col span={24} className="mt-8">
                              <h4 className="label-register ">
                                {pageData.province}
                              </h4>
                              <Form.Item
                                name="cityId"
                                rules={[
                                  {
                                    required: true,
                                    message: pageData.selectProvince,
                                  },
                                ]}
                              >
                                <FnbSelectRegister
                                  className="form-select  mt-16"
                                  showSearch
                                  onChange={onChangeCity}
                                  onSearch={onSearchCity}
                                  searchValue={searchTextCity}
                                  placeholder={pageData.selectProvince}
                                  option={cities?.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                  }))}
                                ></FnbSelectRegister>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row>
                            <Col span={12} className="mt-8">
                              <h4 className="label-register ">
                                {pageData.district}
                              </h4>
                              <Form.Item
                                name="districtId"
                                rules={[
                                  {
                                    required: true,
                                    message: pageData.validDistrict,
                                  },
                                ]}
                              >
                                <FnbSelectRegister
                                  className="form-select-two-row mt-16"
                                  showSearch
                                  onChange={onChangeDistrict}
                                  placeholder={pageData.selectDistrict}
                                  option={districtsByCityId?.map((item) => ({
                                    id: item.id,
                                    name: item?.prefix + " " + item.name,
                                  }))}
                                ></FnbSelectRegister>
                              </Form.Item>
                            </Col>
                            <Col span={12} className="mt-8">
                              <h4 className="label-register ml-16">
                                {pageData.ward}
                              </h4>
                              <Form.Item
                                name="wardId"
                                rules={[
                                  {
                                    required: true,
                                    message: pageData.validWard,
                                  },
                                ]}
                              >
                                <FnbSelectRegister
                                  className="form-select-two-row ml-16 mt-16"
                                  showSearch
                                  placeholder={pageData.selectWard}
                                  option={wardsByDistrictId?.map((item) => ({
                                    id: item.id,
                                    name: item?.prefix + " " + item.name,
                                  }))}
                                ></FnbSelectRegister>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          <h1 className="header">{pageData.yourAddress}</h1>
                          <h4 className="label-register  mt-24">
                            {pageData.address}*
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
                              prefix={<PinIcon />}
                              maxLength={255}
                              placeholder={pageData.inputAddressOne}
                              className="fnb-input form-input"
                            />
                          </Form.Item>

                          <Row>
                            <Col span={24} className="mt-8">
                              <h4 className="label-register  ">
                                {pageData.addressTwo}*
                              </h4>
                              <Form.Item
                                name="address2"
                                rules={[
                                  {
                                    required: true,
                                    message: pageData.validAddress,
                                  },
                                ]}
                              >
                                <Input
                                  prefix={<PinIcon />}
                                  maxLength={255}
                                  placeholder={pageData.inputAddressTwo}
                                  className="fnb-input form-input"
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row>
                            <Col span={24} className="mt-8">
                              <h4 className="label-register ">
                                {" "}
                                {pageData.city}
                              </h4>
                              <Form.Item
                                name="cityTown"
                                rules={[
                                  {
                                    required: true,
                                    message: pageData.validCity,
                                  },
                                ]}
                              >
                                <Input
                                  prefix={<PinIcon />}
                                  maxLength={255}
                                  placeholder={pageData.inputCity}
                                  className="fnb-input form-input"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}

                  {/* Form your address other country */}
                  {currentStep === EnumRegisterStep.AddressInfoOtherCountry &&
                    !isDefaultCountry && (
                      <>
                        <h1 className="header">{pageData.yourAddress}</h1>
                        <h4 className="label-register  mt-24">
                          {pageData.state}
                        </h4>
                        <Form.Item name="stateId">
                          <FnbSelectRegister
                            className="form-select  mt-16"
                            showSearch
                            placeholder={
                              <>
                                <PinIcon className="icon-select-dropdown-2" />
                                <span className="ml-2">
                                  {" "}
                                  {pageData.selectProvince}
                                </span>
                              </>
                            }
                            labelOption={
                              <PinIcon className="icon-select-dropdown-2" />
                            }
                            option={states?.map((item) => ({
                              id: item.id,
                              name: item.name,
                            }))}
                          ></FnbSelectRegister>
                        </Form.Item>

                        <Row>
                          <Col span={24} className="mt-8">
                            <h4 className="label-register  ">{pageData.zip}</h4>
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
                              <Input
                                prefix={<ZipCodeIcon />}
                                maxLength={255}
                                placeholder={pageData.inputZip}
                                className="fnb-input form-input"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}

                  {/* Form OTP verification */}
                  {/* {((currentStep === EnumRegisterStep.OtpVerificationOtherCountry && !isDefaultCountry) ||
                (currentStep === EnumRegisterStep.OtpVerificationLocal && isDefaultCountry)) && (
                <>
                  <h1 className="header-otp">{pageData.otpVerification}</h1>
                  <div className="send-code-text">
                    <p>
                      {pageData.justSendCode} <br></br>
                      <b>
                        (+{phonecode}) {phoneNumber}
                      </b>
                    </p>
                  </div>
                  <div className="otp-box-container">
                    <Input className="fnb-input input-otp" minLength={1} maxLength={1}></Input>
                    <Input className="fnb-input input-otp ml-16" minLength={1} maxLength={1}></Input>
                    <Input className="fnb-input input-otp ml-16" minLength={1} maxLength={1}></Input>
                    <Input className="fnb-input input-otp ml-16" minLength={1} maxLength={1}></Input>
                    <Input className="fnb-input input-otp ml-16" minLength={1} maxLength={1}></Input>
                    <Input className="fnb-input input-otp ml-16" minLength={1} maxLength={1}></Input>
                  </div>
                  <div className="resend-code-text">
                    <p>
                      {pageData.didNotReceive} <br></br>
                      <b> {pageData.resendCode}</b>
                    </p>
                  </div>
                </>
              )} */}

                  {/* Form register completed */}
                  {((currentStep ===
                    EnumRegisterStep.CompleteRegisterOtherCountry &&
                    !isDefaultCountry) ||
                    (currentStep === EnumRegisterStep.CompleteRegisterLocal &&
                      isDefaultCountry)) && (
                    <>
                      <div className="text-center">
                        <Image src={images.completeGif} preview={false} />
                      </div>
                      <div className="awesome-text">
                        <span>{pageData.awesome}</span>
                      </div>
                      <div className="ready-text">
                        <span>{pageData.proceed}</span>
                      </div>
                      <div className="ready-text mt-8">
                        <span>{pageData.checkEmail}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="bottom-content">
                  {currentStep === EnumRegisterStep.StoreInfo && (
                    <Row>
                      <Col span={12} className="mt-8">
                        <div className="text-bottom">
                          <Link className="text-link" to={"/login"}>
                            {pageData.button.login}
                          </Link>
                        </div>
                      </Col>
                      <Col span={12} className="mt-8">
                        <Button
                          className="button-next ml-8"
                          type="primary"
                          onClick={() => next()}
                        >
                          {pageData.button.next}
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {/* CTA Button with OTP */}
                  {/* {(currentStep === EnumRegisterStep.YourInfo ||
                currentStep === EnumRegisterStep.AddressInfo ||
                (currentStep === EnumRegisterStep.AddressInfoOtherCountry && !isDefaultCountry)) && (
                <Row>
                  <Col span={12} className="mt-8">
                    <div className="text-bottom" onClick={() => prev()}>
                      {pageData.button.back}
                    </div>
                  </Col>
                  <Col span={12} className="mt-8">
                    <Button className="button-next ml-12" type="primary" onClick={() => next()}>
                      {pageData.button.next}
                    </Button>
                  </Col>
                </Row>
              )}

              {((currentStep === EnumRegisterStep.OtpVerificationOtherCountry && !isDefaultCountry) ||
                (currentStep === EnumRegisterStep.OtpVerificationLocal && isDefaultCountry)) && (
                <Row>
                  <Col span={12} className="mt-13">
                    <div className="text-bottom" onClick={() => prev()}>
                      {pageData.button.back}
                    </div>
                  </Col>
                  <Col span={12} className="mt-13">
                    <Button className="button-next ml-12" type="primary" htmlType="submit">
                      {pageData.button.complete}
                    </Button>
                  </Col>
                </Row>
              )} */}

                  {/* CTA Button without OTP */}
                  {(currentStep === EnumRegisterStep.YourInfo ||
                    (currentStep === EnumRegisterStep.AddressInfo &&
                      !isDefaultCountry)) && (
                    <Row>
                      <Col span={12} className="mt-8">
                        <div className="text-bottom" onClick={() => prev()}>
                          {pageData.button.back}
                        </div>
                      </Col>
                      <Col span={12} className="mt-8">
                        <Button
                          className="button-next ml-12"
                          type="primary"
                          onClick={() => next()}
                        >
                          {pageData.button.next}
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {((currentStep === EnumRegisterStep.AddressInfo &&
                    isDefaultCountry) ||
                    (currentStep === EnumRegisterStep.AddressInfoOtherCountry &&
                      !isDefaultCountry)) && (
                    <Row>
                      <Col span={12} className="mt-8">
                        <div className="text-bottom" onClick={() => prev()}>
                          {pageData.button.back}
                        </div>
                      </Col>
                      <Col span={12} className="mt-13">
                        <Button
                          className="button-next ml-12"
                          type="primary"
                          htmlType="submit"
                        >
                          {pageData.button.complete}
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {((currentStep ===
                    EnumRegisterStep.CompleteRegisterOtherCountry &&
                    !isDefaultCountry) ||
                    (currentStep === EnumRegisterStep.CompleteRegisterLocal &&
                      isDefaultCountry)) && (
                    <Button
                      className="button-start button-next  mt-8"
                      type="primary"
                    >
                      <Link to={"/login"}>{pageData.button.start}</Link>
                    </Button>
                  )}
                </div>

                {/* Hidden form item */}
                <div>
                  <Form.Item name="langCode" className="d-none">
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name="storeName"
                    hidden="true"
                    rules={[
                      {
                        required: true,
                        message: pageData.inputStoreName,
                      },
                    ]}
                  ></Form.Item>
                  <Form.Item
                    name="fullName"
                    hidden="true"
                    rules={[
                      {
                        required: true,
                        message: pageData.enterFullName,
                      },
                    ]}
                  ></Form.Item>
                  <Form.Item
                    name="countryId"
                    hidden="true"
                    rules={[{ required: true }]}
                  ></Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    hidden="true"
                    rules={[
                      {
                        required: true,
                        message: pageData.validPhone,
                      },
                      {
                        pattern: ValidPhonePattern,
                        message: pageData.validPhonePattern,
                      },
                    ]}
                  ></Form.Item>
                  <Form.Item
                    name="email"
                    hidden="true"
                    rules={[
                      {
                        type: "email",
                        message: pageData.validEmailPattern,
                      },
                      {
                        required: true,
                        message: pageData.validEmail,
                      },
                    ]}
                  ></Form.Item>
                  <Form.Item
                    name="currencyId"
                    hidden="true"
                    rules={[{ required: true }]}
                  ></Form.Item>
                  <Form.Item
                    name="businessAreaId"
                    hidden="true"
                    rules={[
                      {
                        required: true,
                        message: pageData.selectBusinessModel,
                      },
                    ]}
                  ></Form.Item>
                  {isDefaultCountry ? (
                    <>
                      <Form.Item
                        name="address1"
                        hidden="true"
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      ></Form.Item>
                      <Form.Item
                        name="cityId"
                        hidden="true"
                        rules={[{ required: true }]}
                      ></Form.Item>
                      <Form.Item
                        name="districtId"
                        hidden="true"
                        rules={[
                          { required: true, message: pageData.validDistrict },
                        ]}
                      ></Form.Item>
                      <Form.Item
                        name="wardId"
                        hidden="true"
                        rules={[
                          { required: true, message: pageData.validWard },
                        ]}
                      ></Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        name="address1"
                        hidden="true"
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      ></Form.Item>
                      <Form.Item
                        name="address2"
                        hidden="true"
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      ></Form.Item>
                      <Form.Item
                        name="cityTown"
                        hidden="true"
                        rules={[
                          { required: true, message: pageData.validCity },
                        ]}
                      ></Form.Item>
                      <Form.Item name="stateId" hidden="true"></Form.Item>
                      <Form.Item
                        name="postalCode"
                        hidden="true"
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
                      ></Form.Item>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
