import {
  BankOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, message, Radio, Row, Select, Space, Switch, Tooltip, Typography } from "antd";
import { RouterPrompt } from "components/router-prompt";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";

const { Title } = Typography;
const { Option } = Select;

export default function StoreBankAccount(props) {
  const { t, storeDataService } = props;

  const pageData = {
    btnSave: t("button.save"),
    enter: t("form.enter"),
    storeName: t("registerAccount.storeName"),
    store: t("settings.tabStore"),
    updateSuccess: t("messages.isUpdatedSuccessfully"),
    inputStoreName: t("registerAccount.inputStoreName"),
    fullName: t("form.fullName"),
    enterFullName: t("form.enterFullName"),
    country: t("form.country"),
    phone: t("form.phone"),
    inputPhone: t("form.inputPhone"),
    validPhone: t("form.validPhone"),
    validPhonePattern: t("form.validPhonePattern"),
    phoneValidation: t("supplier.phoneValidation"),
    mustBeBetweenThreeAndFifteenCharacters: t("form.mustBeBetweenThreeAndFifteenCharacters"),
    allowNumberOnly: t("form.allowNumberOnly"),
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
    validSelectProvince: t("form.validSelectProvince"),
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

    leaveForm: t("messages.leaveForm"),
    confirmation: t("leaveDialog.confirmation"),
    confirmLeave: t("button.confirmLeave"),
    discard: t("button.discard"),

    titleBank: t("storeBankAccount.title"),
    accountHolder: t("storeBankAccount.accountHolder"),
    accountNumber: t("storeBankAccount.accountNumber"),
    bankName: t("storeBankAccount.bankName"),
    bankBranchName: t("storeBankAccount.bankBranchName"),
    swiftCode: t("storeBankAccount.swiftCode"),
    routingNumber: t("storeBankAccount.routingNumber"),
    swiftCodeMaxLength: 65,
    routingNumberMaxLength: 100,
    kitchenSetting: t("store.kitchenSetting"),
    storeHasKitchen: t("store.storeHasKitchen.title"),
    ifNotHaveKitchen: t("store.storeHasKitchen.tooltip.ifNotHaveKitchen"),
    orderNotHaveKitchen: t("store.storeHasKitchen.tooltip.orderNotHaveKitchen"),
    ifHasKitchen: t("store.storeHasKitchen.tooltip.ifHasKitchen"),
    orderHasKitchen: t("store.storeHasKitchen.tooltip.orderHasKitchen"),
    autoPrintStamp: t("store.autoPrintStamp.title"),
    operation: t("store.operation"),
    paymentFirst: t("store.paymentFirst"),
    paymentLater: t("store.paymentLater"),
    paymentType: t("store.paymentType"),
    tooltipPaymentFirst: t("store.tooltipPaymentFirst"),
    tooltipPaymentLater: t("store.tooltipPaymentLater"),
    inventoryTitle: t("table.inventory"),
    inventory: t("store.inventory"),
    tooltipInventory: t("store.tooltipInventory"),
    generalInformation: t("title.generalInformation"),
  };

  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [initData, setInitData] = useState({});
  const [countries, setCountries] = useState(null);
  const [phoneCode, setPhoneCode] = useState(null);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);
  const [isDefaultBankCountry, setIsDefaultBankCountry] = useState(true);

  //Address Info
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCityId, setDistrictsByCityId] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByDistrictId, setWardsByDistrictId] = useState([]);
  const [searchTextCity, setSearchTextCity] = useState();
  const [storeHasKitchen, setStoreHasKitchen] = useState(null);
  const [autoPrintStamp, setAutoPrintStamp] = useState(null);
  const [paymentLater, setPaymentLater] = useState(true);
  const [inventorySellProduct, setInventorySellProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync();
    }
    fetchData();
  }, []);

  const getInitDataAsync = async () => {
    let promises = [];
    promises.push(storeDataService.getPrepareAddressDataAsync());
    promises.push(storeDataService.getStoreByIdAsync());

    let [prepareAddressDataResponse, storeDataResponse] = await Promise.all(promises);

    const { states, countries, cities, districts, wards, defaultCountry } = prepareAddressDataResponse;
    setInitData(prepareAddressDataResponse);
    setCountries(countries);
    setCities(cities);
    setDistricts(districts);
    setStates(states);
    setWards(wards);

    //General Information
    if (storeDataResponse) {
      const { store, staff } = storeDataResponse;
      const { city, country, district } = store?.address;

      setPhoneCode(country?.phonecode);
      onChangeCity(city?.id);
      onChangeDistrict(district?.id);

      form.setFieldsValue({
        store: {
          ...store,
        },
        staff: {
          ...staff,
        },
      });

      let districtsFilteredByCity = districts?.filter((item) => item.cityId === city?.id) ?? [];
      setDistrictsByCityId(districtsFilteredByCity);

      let wardsFilteredByCity = wards?.filter((item) => item.districtId === district?.id) ?? [];
      setWardsByDistrictId(wardsFilteredByCity);

      ///Kitchen settings
      setStoreHasKitchen(store.isStoreHasKitchen);
      setAutoPrintStamp(store.isAutoPrintStamp);

      ///Payment type
      setPaymentLater(store?.isPaymentLater);

      ///Inventory
      setInventorySellProduct(store?.isCheckProductSell);

      var isDefault = countries?.find((item) => item.iso === "VN").id === store?.address?.countryId;
      setIsDefaultCountry(isDefault);
    }

    var storeBankAccountResponse = await storeDataService.getStoreBankAccountByStoreIdAsync();
    //StoreBankAccount
    if (storeBankAccountResponse.storeBankAccount) {
      const { storeBankAccount } = storeBankAccountResponse;
      form.setFieldsValue({
        storeBankAccount: {
          ...storeBankAccount,
        },
      });
      onChangeCountryBank(storeBankAccount?.countryId);
    } else {
      let formValue = form.getFieldsValue();
      formValue.storeBankAccount.countryId = prepareAddressDataResponse?.defaultCountryStore?.id;
      form.setFieldsValue(formValue);
      onChangeCountryBank(prepareAddressDataResponse?.defaultCountryStore?.id);
    }
    storeBankAccountResponse?.storeBankAccount?.countryId === defaultCountry?.id
      ? setIsDefaultBankCountry(true)
      : setIsDefaultBankCountry(false);
  };

  const onCountryChange = (countryId) => {
    let country = countries?.find((item) => item.id === countryId);
    setPhoneCode(country.phonecode);

    countryId === initData?.defaultCountry?.id ? setIsDefaultCountry(true) : setIsDefaultCountry(false);
  };

  const onChangeCountryBank = (countryId) => {
    countryId === initData?.defaultCountry?.id ? setIsDefaultBankCountry(true) : setIsDefaultBankCountry(false);
  };

  // Set maxlength for search text input of select
  const onSearchCity = (event) => {
    if (event.length <= pageData.citySearchTextMaxLength) {
      setSearchTextCity(event);
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

  ///On change kitchen setting
  const onChangeStoreHasKitchen = (value) => {
    const checked = value;
    setStoreHasKitchen(checked);
    if (!checked) {
      setAutoPrintStamp(true);
    }
  };

  const onChangeAutoPrintStamp = (value) => {
    const checked = value;
    setAutoPrintStamp(checked);
  };

  const prefixSelector = <label>+{phoneCode}</label>;

  const onFinish = (values) => {
    const updateStoreRequest = {
      ...values,
      store: {
        ...values.store,
        isStoreHasKitchen: storeHasKitchen,
        isAutoPrintStamp: autoPrintStamp,
        isPaymentLater: paymentLater,
        isCheckProductSell: inventorySellProduct,
      },
    };

    storeDataService.updateStoreManagementAsync(updateStoreRequest).then((res) => {
      if (res) {
        message.success(`${pageData.store} ${updateStoreRequest.store.title} ${pageData.updateSuccess}`);
      }
    });
  };

  const onPaymentTypeChange = (e) => {
    setPaymentLater(e.target.value);
  };

  const onChangeInventorySellProduct = (value) => {
    setInventorySellProduct(value);
  };

  const renderOperation = () => {
    return (
      <Row className="border-div mt-4">
        <Row>
          <Col span={24}>
            <Title level={3}>{pageData.operation}</Title>
          </Col>
        </Row>
        <Row className="ml-4 mt-3">
          <Col span={24}>
            <Title level={3}>{pageData.kitchenSetting}</Title>
          </Col>
          <Col span={24}>
            <div>
              <Switch checked={storeHasKitchen} onChange={(value) => onChangeStoreHasKitchen(value)} />
              <span className="ml-3 fs-18">
                {pageData.storeHasKitchen}
                <Tooltip
                  placement="topLeft"
                  title={
                    <div>
                      <p>
                        {pageData.ifNotHaveKitchen} {"=>"} {pageData.orderNotHaveKitchen}
                      </p>
                      <p>
                        {pageData.ifHasKitchen} {"=>"} {pageData.orderHasKitchen}{" "}
                      </p>
                    </div>
                  }
                >
                  <span className="ml-3">
                    <ExclamationCircleOutlined />
                  </span>
                </Tooltip>
              </span>
            </div>
          </Col>
          <Col span={24} className="mt-3">
            <div>
              <Switch
                checked={autoPrintStamp}
                onChange={(value) => onChangeAutoPrintStamp(value)}
                disabled={!storeHasKitchen}
              />
              <span className="ml-3 fs-18">{pageData.autoPrintStamp}</span>
            </div>
          </Col>
          <Col span={24} className="mt-4">
            <Title level={3}>{pageData.paymentType}</Title>
          </Col>
          <Col span={24}>
            <Radio.Group onChange={onPaymentTypeChange} value={paymentLater}>
              <Row>
                <Col span={24}>
                  <Radio value={false}>
                    {pageData.paymentFirst}
                    <Tooltip
                      placement="topLeft"
                      title={
                        <div>
                          <p>{pageData.tooltipPaymentFirst}</p>
                        </div>
                      }
                    >
                      <span className="ml-3">
                        <ExclamationCircleOutlined />
                      </span>
                    </Tooltip>
                  </Radio>
                </Col>
                <Col span={24}>
                  <Radio value={true}>
                    {pageData.paymentLater}
                    <Tooltip
                      placement="topLeft"
                      title={
                        <div>
                          <p>{pageData.tooltipPaymentLater}</p>
                        </div>
                      }
                    >
                      <span className="ml-3">
                        <ExclamationCircleOutlined />
                      </span>
                    </Tooltip>
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Col>
          <Col span={24} className="mt-4">
            <Title level={3}>{pageData.inventoryTitle}</Title>
          </Col>
          <Col span={24}>
            <div>
              <Switch checked={inventorySellProduct} onChange={(value) => onChangeInventorySellProduct(value)} />
              <span className="ml-3 fs-18">
                {pageData.inventory}
                <Tooltip
                  placement="topLeft"
                  title={
                    <div>
                      <p>{pageData.tooltipInventory}</p>
                    </div>
                  }
                >
                  <span className="ml-3">
                    <ExclamationCircleOutlined />
                  </span>
                </Tooltip>
              </span>
            </div>
          </Col>
        </Row>
      </Row>
    );
  };

  return (
    <>
      {/* <Prompt when={isChangeForm} message={() => {return onFinish();}} /> */}
      <BrowserRouter
        getUserConfirmation={() => {
          /* Empty callback to block the default browser prompt */
        }}
      >
        <RouterPrompt
          when={isChangeForm}
          title="Leave this page"
          cancelText="Cancel"
          okText="Confirm"
          onOK={() => true}
          onCancel={() => false}
        />
        <Form
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
          autoComplete="off"
        >
          <Card className="fnb-card-full">
            <Row className="border-div">
              <Row>
                <Col span={12}>
                  <Title level={3}>{pageData.generalInformation}</Title>
                </Col>
                <Col span={12}>
                  <Space className="float-right">
                    <Button htmlType="submit" type="primary">
                      {pageData.btnSave}
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span className="item-icon-text">
                    <HomeOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.storeName}</h3>
                  </span>
                  <Form.Item
                    name={["store", "title"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.inputStoreName,
                      },
                    ]}
                  >
                    <Input
                      maxLength={100}
                      size="large"
                      placeholder={pageData.inputStoreName}
                      className="form-input-store-name"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <span className="item-icon-text">
                    <UserOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.fullName}</h3>
                  </span>
                  <Form.Item name={["staff", "id"]} className="d-none">
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name={["staff", "fullName"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.enterFullName,
                      },
                    ]}
                  >
                    <Input maxLength={100} size="large" placeholder={pageData.enterFullName} className="item-input" />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <span className="item-icon-text">
                    <GlobalOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.country}</h3>
                  </span>
                  <Form.Item name={["store", "addressId"]} className="d-none">
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item name={["store", "address", "countryId"]} rules={[{ required: true }]}>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      size="large"
                      className="item-input"
                      onChange={onCountryChange}
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      autoComplete="none"
                    >
                      {countries?.map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.nicename}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <span className="item-icon-text">
                    <PhoneOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.phone}</h3>
                  </span>
                  <Form.Item
                    name={["staff", "phoneNumber"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.phoneValidation,
                      },
                      {
                        min: 3,
                        max: 15,
                        message: `${pageData.phone} ${pageData.mustBeBetweenThreeAndFifteenCharacters}`,
                      },
                      {
                        pattern: /^\d+$/g,
                        message: pageData.allowNumberOnly,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder={pageData.inputPhone}
                      addonBefore={prefixSelector}
                      className="item-input-phone"
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <span className="item-icon-text">
                    <MailOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.email}</h3>
                  </span>
                  <Form.Item
                    name={["staff", "account", "email"]}
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
                  >
                    <Input size="large" disabled placeholder={pageData.inputEmail} className="item-input" />
                  </Form.Item>
                </Col>
              </Row>
              {isDefaultCountry ? (
                <>
                  <Row>
                    <Col span={24}>
                      <span className="item-icon-text">
                        <EnvironmentOutlined className="icon-item mr-1" />
                        <h3 className="ml-32px">{pageData.address}</h3>
                      </span>
                      <Form.Item
                        name={["store", "address", "address1"]}
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      >
                        <Input
                          maxLength={255}
                          size="large"
                          placeholder={pageData.inputAddress}
                          className="form-input-store-name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={7}>
                      <h3>{pageData.province}</h3>
                      <Form.Item
                        name={["store", "address", "city", "id"]}
                        rules={[{ required: true, message: pageData.validSelectProvince }]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          size="large"
                          placeholder={pageData.selectProvince}
                          onChange={onChangeCity}
                          showSearch
                          searchValue={searchTextCity}
                          onSearch={onSearchCity}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {cities?.map((item, index) => (
                            <Option key={index} value={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={8}>
                      <h3>{pageData.district}</h3>
                      <Form.Item
                        name={["store", "address", "district", "id"]}
                        rules={[{ required: true, message: pageData.validDistrict }]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          size="large"
                          placeholder={pageData.selectDistrict}
                          onChange={onChangeDistrict}
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {districtsByCityId?.map((item, index) => (
                            <Option key={index} value={item.id}>
                              {`${item?.prefix} ${item.name}`}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <h3>{pageData.ward}</h3>
                      <Form.Item
                        name={["store", "address", "ward", "id"]}
                        rules={[{ required: true, message: pageData.validWard }]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          size="large"
                          placeholder={pageData.selectWard}
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {wardsByDistrictId?.map((item, index) => (
                            <Option key={index} value={item.id}>
                              {`${item?.prefix} ${item.name}`}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col span={11}>
                      <span className="item-icon-text">
                        <EnvironmentOutlined className="icon-item mr-1" />
                        <h3>{pageData.address}</h3>
                      </span>
                      <Form.Item
                        name={["store", "address", "address1"]}
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      >
                        <Input size="large" placeholder={pageData.inputAddressOne} />
                      </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                      <span className="item-icon-text">
                        <EnvironmentOutlined className="icon-item mr-1" />
                        <h3 className="ml-32px">{pageData.addressTwo}</h3>
                      </span>
                      <Form.Item
                        name={["store", "address", "address2"]}
                        rules={[
                          {
                            required: true,
                            message: pageData.validAddress,
                          },
                        ]}
                      >
                        <Input size="large" placeholder={pageData.inputAddressTwo} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={7}>
                      <h3>{pageData.city}</h3>
                      <Form.Item
                        name={["store", "address", "cityTown"]}
                        rules={[{ required: true, message: pageData.validCity }]}
                      >
                        <Input size="large" placeholder={pageData.inputCity} />
                      </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={8}>
                      <h3>{pageData.state}</h3>
                      <Form.Item
                        name={["store", "address", "state", "id"]}
                        rules={[{ required: true, message: pageData.selectState }]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          size="large"
                          placeholder={pageData.selectProvince}
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {states?.map((item, index) => (
                            <Option key={index} value={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <h3>{pageData.zip}</h3>
                      <Form.Item
                        name={["store", "address", "postalCode"]}
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
                        <Input size="large" placeholder={pageData.inputZip} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Row>
            <Row className="border-div mt-4">
              <Row>
                <Col span={24}>
                  <Title level={3}>{pageData.titleBank}</Title>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <span className="item-icon-text">
                    <BankOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.accountHolder}</h3>
                  </span>
                  <Form.Item name={["storeBankAccount", "accountHolder"]}>
                    <Input
                      maxLength={100}
                      size="large"
                      placeholder={`${pageData.enter} ${pageData.accountHolder}`}
                      className="item-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <span className="item-icon-text">
                    <BankOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.accountNumber}</h3>
                  </span>
                  <Form.Item
                    name={["storeBankAccount", "accountNumber"]}
                    rules={[
                      {
                        pattern: /^\d+$/g,
                        message: pageData.allowNumberOnly,
                      },
                    ]}
                  >
                    <Input
                      maxLength={20}
                      size="large"
                      placeholder={`${pageData.enter} ${pageData.accountNumber}`}
                      className="item-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <span className="item-icon-text">
                    <BankOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.bankName}</h3>
                  </span>
                  <Form.Item name={["storeBankAccount", "bankName"]}>
                    <Input
                      maxLength={100}
                      size="large"
                      placeholder={`${pageData.enter} ${pageData.bankName}`}
                      className="item-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <span className="item-icon-text">
                    <GlobalOutlined className="icon-item mr-1" />
                    <h3 className="ml-32px">{pageData.country}</h3>
                  </span>
                  <Form.Item name={["storeBankAccount", "countryId"]} rules={[{ required: true }]}>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      size="large"
                      className="item-input"
                      onChange={onChangeCountryBank}
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      autoComplete="none"
                    >
                      {countries?.map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.nicename}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {isDefaultBankCountry ? (
                <Row>
                  <Col span={11}>
                    <span className="item-icon-text">
                      <EnvironmentOutlined className="icon-item mr-1" />
                      <h3 className="ml-32px">{pageData.province}</h3>
                    </span>
                    <Form.Item name={["storeBankAccount", "cityId"]}>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        size="large"
                        placeholder={pageData.selectProvince}
                        showSearch
                        searchValue={searchTextCity}
                        onSearch={onSearchCity}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        autoComplete="none"
                      >
                        {cities?.map((item, index) => (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <span className="item-icon-text">
                      <EnvironmentOutlined className="icon-item mr-1" />
                      <h3 className="ml-32px">{pageData.bankBranchName}</h3>
                    </span>
                    <Form.Item name={["storeBankAccount", "bankBranchName"]}>
                      <Input
                        maxLength={20}
                        size="large"
                        placeholder={`${pageData.enter} ${pageData.bankBranchName}`}
                        className="item-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col span={11}>
                    <span className="item-icon-text">
                      <EnvironmentOutlined className="icon-item mr-1" />
                      <h3 className="ml-32px">{pageData.swiftCode}</h3>
                    </span>
                    <Form.Item name={["storeBankAccount", "swiftCode"]}>
                      <Input
                        maxLength={pageData.swiftCodeMaxLength}
                        size="large"
                        placeholder={`${pageData.enter} ${pageData.swiftCode}`}
                        className="item-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <span className="item-icon-text">
                      <EnvironmentOutlined className="icon-item mr-1" />
                      <h3 className="ml-32px">{pageData.routingNumber}</h3>
                    </span>
                    <Form.Item
                      name={["storeBankAccount", "routingNumber"]}
                      rules={[
                        {
                          pattern: /^\d+$/g,
                          message: pageData.allowNumberOnly,
                        },
                      ]}
                    >
                      <Input
                        maxLength={pageData.routingNumberMaxLength}
                        size="large"
                        placeholder={`${pageData.enter} ${pageData.routingNumber}`}
                        className="item-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Row>
            {renderOperation()}
          </Card>
        </Form>
      </BrowserRouter>
    </>
  );
}
