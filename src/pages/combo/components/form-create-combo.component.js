import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Tooltip,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content } from "antd/lib/layout/layout";
import { FnbSelectMultipleProductRenderOption } from "components/fnb-select-multiple-product-render-option/fnb-select-multiple-product-render-option";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import { CalendarNewIconBold, DiscountIcon, TrashFill } from "constants/icons.constants";

import { InfoCircleOutlined, PercentageOutlined, PlusOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { ComboType } from "constants/combo.constants";
import { MaximumNumber } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency, DateFormat } from "constants/string.constants";
import comboDataService from "data-services/combo/combo-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  combinationPossible,
  formatCurrency,
  formatCurrencyWithSymbol,
  formatOnlyDate,
  formatTextNumber,
  getCurrency,
  roundNumber,
} from "utils/helpers";
import comboDefaultImage from "../../../assets/images/combo-default-img.jpg";
const { Option, OptGroup } = Select;

export default function FormCreateComboComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { onCompleted } = props;
  const initProductGroup = {
    categoryId: null,
    quantity: 1,
    productIds: [],
  };
  const combos = {
    flexibleCombo: {
      name: t("combo.flexibleCombo"),
      value: 0,
    },
    specificCombo: {
      name: t("combo.specificCombo"),
      value: 1,
    },
  };
  const prices = {
    fixed: {
      name: t("combo.price.fixed"),
      value: 0,
    },
    specific: {
      name: t("combo.price.specific"),
      value: 1,
    },
  };
  const [form] = Form.useForm();
  const [formChanged, setFormChanged] = useState(false);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProductPriceOptions, setAllProductPriceOptions] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedProductCategoryIds, setSelectedProductCategoryIds] = useState([]);
  const [selectedProductPriceIds, setSelectedProductPriceIds] = useState([]); /// group combo by product price id
  const [productCombos, setProductCombos] = useState([]);
  const [sellingFixedPrice, setSellingFixedPrice] = useState(0);
  const [productGroups, setProductGroups] = useState([initProductGroup]);

  const [selectedComboType, setSelectedComboType] = useState(combos.flexibleCombo.value);
  const [selectedPriceType, setSelectedPriceType] = useState(prices.fixed.value);
  const [selectedSpecificProducts, setSelectedSpecificProducts] = useState([]);
  const [totalOriginalPriceOfSpecificCombo, setTotalOriginalPriceOfSpecificCombo] = useState(0);
  const [discountPercentAmountOfSpecificCombo, setDiscountPercentAmountOfSpecificCombo] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [disableAllBranches, setDisableAllBranches] = useState(false);
  const [isShowAllBranches, setIsShowAllBranches] = useState(false);

  const [allproductsWithCategory, setAllproductsWithCategory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    title: t("combo.createCombo"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnIgnore: t("button.ignore"),
    btnConfirmLeave: t("button.confirmLeave"),
    leaveWarningMessage: t("messages.leaveForm"),
    messages: {
      createdSuccess: t("combo.messages.createdSuccess"),
    },
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    selectDate: t("promotion.selectDate"),
    generalInformation: {
      title: t("combo.generalInformation.title"),
      name: t("combo.generalInformation.name"),
      namePlaceholder: t("combo.generalInformation.namePlaceholder"),
      nameValidateMessage: t("combo.generalInformation.nameValidateMessage"),
      description: t("combo.generalInformation.description"),
      thumbnailValidateMessage: t("combo.generalInformation.thumbnailValidateMessage"),
      branch: t("combo.generalInformation.branch"),
      branchPlaceholder: t("combo.generalInformation.branchPlaceholder"),
      branchValidateMessage: t("combo.generalInformation.branchValidateMessage"),
      allBranches: t("combo.generalInformation.allBranches"),
      maximum1000Characters: t("form.maximum1000Characters"),
      startDate: t("promotion.form.startDate"),
      PleaseStartDate: t("promotion.form.pleaseStartDate"),
      endDate: t("promotion.form.endDate"),
      PlaceholderDateTime: t("promotion.form.placeholderDateTime"),
    },
    product: {
      title: t("combo.product.title"),
      comboType: t("combo.comboType"),
      productPlaceholder: t("combo.product.productPlaceholder"),
      productValidateMessage: t("combo.product.productValidateMessage"),
      tooltipMessage: t("combo.product.tooltipMessage"),
      categoryValidateMessage: t("combo.product.categoryValidateMessage"),
      categoryPlaceholder: t("combo.product.categoryPlaceholder"),
      groups: t("combo.product.groups"),
      group: t("combo.product.group"),
      category: t("combo.product.category"),
      itemQuantity: t("combo.product.itemQuantity"),
      itemQuantityPlaceholder: t("combo.product.itemQuantityPlaceholder"),
      itemQuantityValidateMessage: t("combo.product.itemQuantityValidateMessage"),
      addGroup: t("combo.product.addGroup"),
    },
    price: {
      title: t("combo.price.title"),
      combo: t("combo.price.combo"),
      originalPrice: t("combo.price.originalPrice"),
      sellingPrice: t("combo.price.sellingPrice"),
      sellingPricePlaceholder: t("combo.price.sellingPricePlaceholder"),
      sellingPriceValidateMessage: t("combo.price.sellingPriceValidateMessage"),
    },
    upload: {
      addFromUrl: t("material.addFromUrl"),
      uploadImage: t("material.addFile"),
    },
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
  };

  const tableSettings = {
    columns: [
      {
        title: pageData.price.combo,
        dataIndex: "comboName",
        width: "40%",
        render: (comboName) => {
          let comboNameArray = comboName.split(" | ");
          return comboNameArray.map((item) => <div className="product-price-item">{item}</div>);
        },
      },
      {
        title: `${pageData.price.originalPrice} (${getCurrency()})`,
        dataIndex: "originalPrice",
        width: "30%",
        render: (value) => {
          return <span>{formatTextNumber(value)}</span>;
        },
      },
      {
        title: `${pageData.price.sellingPrice} (${getCurrency()})`,
        dataIndex: "sellingPrice",
        width: "30%",
        render: (sellingPrice, record) => {
          const originalPrice = record?.originalPrice ?? 1;
          const discountPercentValue =
            originalPrice == 0 ? 0 : roundNumber(((originalPrice - sellingPrice) / originalPrice) * 100, 1);
          const disabled = selectedPriceType === prices.fixed.value;
          return (
            <>
              <InputNumber
                onChange={(value) => onChangeComboSellingPrice(value, record.index)}
                disabled={disabled}
                addonAfter={getCurrency()}
                value={sellingPrice}
                placeholder={pageData.product.quantityPlaceholder}
                className="w-100 fnb-input-number"
                min={0}
                max={originalPrice}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                precision={getCurrency() === currency.vnd ? 0 : 2}
              />
              <div className="float-right color-primary discount-products-wrapper">
                <Row>
                  <Col className="discount-icon-col">
                    <DiscountIcon />
                  </Col>
                  <Col className="discount-percent-col">
                    <span className="ml-2">{discountPercentValue}</span>
                    <PercentageOutlined />
                  </Col>
                </Row>
              </div>
            </>
          );
        },
      },
    ],
  };

  useEffect(() => {
    getPrepareData();
    setInitFormValue();
    setSelectedComboType();
  }, []);

  //#region Actions

  const setInitFormValue = () => {
    form.setFieldsValue({
      name: "",
      description: "",
      thumbnail: "",
      isShowAllBranches: true,
      comboTypeId: selectedComboType,
      priceTypeId: selectedPriceType,
    });
  };

  const getPrepareData = () => {
    comboDataService.getPrepareCreateProductComboDataAsync().then((data) => {
      const { branches, products, productsWithCategory, productCategories } = data;
      setBranches(branches);
      setProducts(products);
      setAllproductsWithCategory(productsWithCategory);

      const productDataOptions = getProductDataOptions(products);
      setAllProductPriceOptions(productDataOptions);
      setProductCategories(productCategories);
    });
  };

  const getProductDataOptions = (products) => {
    let productOptions = [];
    products?.map((product) => {
      if (product?.productPrices?.length > 0) {
        product?.productPrices.map((price) => {
          const text = price?.priceName ? `${product?.name} (${price?.priceName})` : product?.name;
          const option = {
            key: price?.id,
            productId: product?.id,
            productName: product?.name,
            text: text,
            productPriceId: price?.id,
            productPriceName: price?.name,
            productPrice: price?.priceValue,
            isSinglePrice: product?.productPrices?.length <= 1,
            thumbnail: product?.thumbnail,
            unitName: product?.unit?.name,
          };

          productOptions.push(option);
        });
      }
    });
    return productOptions;
  };

  const getDataTable = () => {
    const dataSource = [];
    productCombos.forEach((combo, index) => {
      const originalPrice = combo?.comboData?.map((p) => p?.productPrice)?.reduce((a, b) => a + b, 0);
      let sellingPrice = combo?.sellingPrice && combo?.sellingPrice > 0 ? combo?.sellingPrice : originalPrice;
      if (selectedPriceType === prices.fixed.value && sellingFixedPrice > 0) {
        sellingPrice = sellingFixedPrice;
      }

      const record = {
        index: index,
        productIds: combo?.comboData?.map((p) => p?.productId),
        comboName: combo?.comboData?.map((p) => p?.text)?.join(" | "),
        originalPrice: originalPrice,
        sellingPrice: sellingPrice,
      };
      dataSource.push(record);
    });

    return dataSource;
  };

  const onSubmitForm = () => {
    form.validateFields().then((values) => {
      const { comboTypeId } = values;

      const comboPricings = productCombos?.map((combo) => {
        return {
          comboProductName: combo?.comboData?.map((p) => p.text)?.join(" | "),
          sellingPrice: combo?.sellingPrice,
          comboPricingProducts: combo?.comboData?.map((item) => {
            return {
              productPriceId: item?.productPriceId,
              productPrice: item?.productPrice,
            };
          }),
        };
      });

      let requestModel = {
        ...values,
        comboPricings: comboPricings,
        thumbnail: selectedImage?.url,
      };

      /// Mapping selected product price name to productPriceIds
      if (comboTypeId === ComboType.Specific) {
        const productPriceIds = allProductPriceOptions
          .filter((p) => requestModel.productPriceIds.includes(p?.text))
          .map((p) => p.productPriceId);
        requestModel = {
          ...requestModel,
          productPriceIds: productPriceIds,
          isShowAllBranches: isShowAllBranches,
        };
      }

      /// Mapping selected product price name to productPriceIds
      if (comboTypeId === ComboType.Fixed) {
        let productGroups = requestModel?.productGroups?.map((group) => {
          const productPriceIds = allProductPriceOptions
            .filter((p) => group.productPriceIds.includes(p?.text))
            .map((p) => p.productPriceId);

          return {
            ...group,
            productPriceIds: productPriceIds,
          };
        });

        requestModel = {
          ...requestModel,
          productGroups: productGroups,
          isShowAllBranches: isShowAllBranches,
        };
      }

      comboDataService.createComboAsync(requestModel).then((success) => {
        if (success) {
          setFormChanged(false);
          onCompleted();
          message.success(pageData.messages.createdSuccess);
        }
      });
    });
  };

  const onClickUploadImage = (file) => {
    setSelectedImage(file);
  };

  const onAddNewProductGroup = () => {
    const formValues = form.getFieldsValue();
    const { productGroups } = formValues;
    const newProductGroup = [...productGroups, initProductGroup];
    setProductGroups(newProductGroup);
    form.setFieldsValue({ productGroups: newProductGroup });
  };

  const onRemoveProductGroup = (index) => {
    const formValues = form.getFieldsValue();
    const { productGroups } = formValues;
    const newProductGroup = productGroups.filter((_, i) => i !== index);
    setProductGroups(newProductGroup);
    form.setFieldsValue({ productGroups: newProductGroup });

    /// Update selectedProductPriceIds
    selectedProductPriceIds[index] = [];
    refreshOptionsAndCalculateCombos(selectedProductPriceIds);
  };

  const onChangeComboSellingPrice = (value, index) => {
    productCombos[index].sellingPrice = value;
    setProductCombos([...productCombos]);
  };

  const onChangeProductCategory = (index) => {
    const formValues = form.getFieldsValue();
    const { productGroups } = formValues;
    const productCategoryIds = productGroups?.map((group) => group.categoryId) ?? [];
    setSelectedProductCategoryIds(productCategoryIds);
    productGroups?.map((productGroup, i) => {
      if (i === index) {
        productGroup.productPriceIds = [];
      }
    });
    form.setFieldsValue({ productGroups });
  };

  /// Selecting product and find product combos
  const onChangeProduct = (listSelectedItemName, options, index) => {
    const optionsByListSelectedName = allProductPriceOptions.filter((p) => listSelectedItemName.includes(p.text));
    const productPriceIds = optionsByListSelectedName?.map((o) => o.productPriceId) ?? [];

    /// update group combos by product price id
    selectedProductPriceIds[index] = productPriceIds;
    refreshOptionsAndCalculateCombos(selectedProductPriceIds);
  };

  const refreshOptionsAndCalculateCombos = (selectedProductPriceIds) => {
    setSelectedProductPriceIds(selectedProductPriceIds);

    /// Find combos
    calculateCombinationPossible(selectedProductPriceIds);
  };

  const calculateCombinationPossible = (selectedProductPriceIds) => {
    const combos = combinationPossible(selectedProductPriceIds);
    if (combos.length > 0) {
      /// Mapping product options to product combos
      const productCombosData = combos.map((combo) => {
        const data = combo.map((productPriceId) => {
          const productOption = allProductPriceOptions.find((p) => p.key === productPriceId);
          if (productOption) {
            return productOption;
          }
        });

        return {
          comboData: data,
          sellingPrice: sellingFixedPrice,
        };
      });

      setProductCombos(productCombosData);
    }
  };

  const onSelectSpecificProducts = (options) => {
    const productPriceIds = options?.map((o) => o.productPriceId) ?? [];
    const listProductSelected =
      productPriceIds?.map((productPriceId) => {
        const option = options.find((p) => p.productPriceId === productPriceId);
        const product = products.find((p) => p.id === option?.productId);
        if (option && product) {
          return {
            productId: product?.id,
            name: product?.name,
            productPriceId: option?.productPriceId,
            price: option?.price,
          };
        }
      }) ?? [];

    setSelectedSpecificProducts(listProductSelected);
    const totalOriginalPrice = listProductSelected?.map((p) => p.price)?.reduce((a, b) => a + b, 0);

    setTotalOriginalPriceOfSpecificCombo(totalOriginalPrice);

    updateTotalOriginalPriceOfSpecificCombo(sellingFixedPrice, listProductSelected);
  };

  const updateTotalOriginalPriceOfSpecificCombo = (sellingFixedPrice, listProductSelected) => {
    if (!listProductSelected) {
      listProductSelected = selectedSpecificProducts;
    }
    const totalOriginalPrice = listProductSelected?.map((p) => p.price)?.reduce((a, b) => a + b, 0);
    var discountPercentAmount = calculatingDiscountPercent(sellingFixedPrice, totalOriginalPrice);
    setDiscountPercentAmountOfSpecificCombo(discountPercentAmount);
  };

  const calculatingDiscountPercent = (sellingFixedPrice, totalOriginalPrice) => {
    if (totalOriginalPrice == 0) return 0;
    return ((totalOriginalPrice - sellingFixedPrice) / totalOriginalPrice) * 100;
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate;
  };

  //#endregion

  //#region Render components

  const renderGeneralInformationComponent = () => {
    return (
      <>
        <h4 className="fnb-form-label mt-32">
          {pageData.generalInformation.name}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: pageData.generalInformation.nameValidateMessage,
            },
            {
              type: "string",
              max: 100,
            },
          ]}
        >
          <Input className="fnb-input-with-count" showCount maxLength={100} />
        </Form.Item>

        <Row gutter={[32, 16]}>
          <Col xs={24} lg={12}>
            <h4 className="fnb-form-label">{pageData.generalInformation.startDate}</h4>
            <Form.Item
              name={["startDate"]}
              rules={[
                {
                  required: true,
                  message: pageData.generalInformation.PleaseStartDate,
                },
              ]}
            >
              <DatePicker
                suffixIcon={<CalendarNewIconBold />}
                placeholder={pageData.selectDate}
                className="fnb-date-picker w-100"
                disabledDate={disabledDate}
                format={DateFormat.DD_MM_YYYY}
                onChange={(date) => setStartDate(formatOnlyDate(date))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <h4 className="fnb-form-label">{pageData.generalInformation.endDate}</h4>
            <Form.Item name={["endDate"]}>
              <DatePicker
                suffixIcon={<CalendarNewIconBold />}
                placeholder={pageData.selectDate}
                className="fnb-date-picker w-100"
                disabledDate={disabledDateByStartDate}
                format={DateFormat.DD_MM_YYYY}
                disabled={startDate ? false : true}
              />
            </Form.Item>
          </Col>
        </Row>

        <h4 className="fnb-form-label">{pageData.generalInformation.description}</h4>
        <Form.Item name="description">
          <TextArea
            showCount
            className="fnb-text-area-with-count no-resize combo-description-box"
            placeholder={pageData.generalInformation.maximum1000Characters}
            maxLength={1000}
          />
        </Form.Item>
        <h4 className="fnb-form-label">{pageData.generalInformation.branch}</h4>
        <div className="combo-check-box-select-all-branch">
          <Checkbox onChange={(event) => onSelectAllBranches(event)} checked={isShowAllBranches}>
            {pageData.generalInformation.allBranches}
          </Checkbox>
        </div>

        <Form.Item
          hidden={disableAllBranches}
          name={["branchIds"]}
          rules={[
            {
              required: !disableAllBranches,
              message: pageData.generalInformation.branchValidateMessage,
            },
          ]}
        >
          <FnbSelectMultiple
            placeholder={pageData.generalInformation.branchPlaceholder}
            className="w-100"
            allowClear
            option={branches?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
          ></FnbSelectMultiple>
        </Form.Item>
        <Form.Item hidden={!disableAllBranches}>
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Form.Item>
      </>
    );
  };

  const onSelectAllBranches = (event) => {
    const isChecked = event.target.checked;
    setIsShowAllBranches(isChecked);
    setDisableAllBranches(isChecked);
  };

  const renderProductComponent = () => {
    return (
      <>
        <h3 className="label-information mt-10">{pageData.product.title}</h3>
        <h4 className="combo-type-name mt-3">{pageData.product.comboType}</h4>
        <Form.Item className="select-product-radio-wrapper" name={["comboTypeId"]}>
          <Radio.Group
            onChange={(e) => {
              const value = e.target.value;
              setSelectedComboType(value);
              setSelectedProductCategoryIds([]);
            }}
            className="product-component-radio"
          >
            <Radio value={combos.flexibleCombo.value}>
              <p>{combos.flexibleCombo.name}</p>
            </Radio>
            <Radio value={combos.specificCombo.value}>
              <p>{combos.specificCombo.name}</p>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {selectedComboType === combos.specificCombo.value ? renderSpecificCombo() : renderFlexibleCombo()}
      </>
    );
  };

  const renderPriceComponent = () => {
    return (
      <>
        <h3 className="label-information mt-10">{pageData.price.title}</h3>
        {selectedComboType === combos.specificCombo.value ? (
          renderSpecificComboSellingPrice()
        ) : (
          <>
            <Form.Item name={["priceTypeId"]}>
              <Radio.Group
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPriceType(value);
                }}
              >
                <Radio value={prices.fixed.value}>
                  <p>{prices.fixed.name}</p>
                </Radio>
                <Radio value={prices.specific.value}>
                  <p>{prices.specific.name}</p>
                </Radio>
              </Radio.Group>
            </Form.Item>
            {selectedPriceType === prices.fixed.value && renderSellingPrice()}
            <FnbTable
              className="table-product-combo-prices"
              columns={tableSettings.columns}
              dataSource={getDataTable()}
            />
          </>
        )}
      </>
    );
  };

  const renderFlexibleCombo = () => {
    return (
      <>
        <div>
          <h4 className="float-left combo-type-name">
            <span>{pageData.product.groups}</span>
            <Tooltip placement="topLeft" title={pageData.product.tooltipMessage}>
              <span className="ml-2 pointer">
                <InfoCircleOutlined />
              </span>
            </Tooltip>
          </h4>
          <Button className="float-right" onClick={onAddNewProductGroup}>
            <PlusOutlined />
            <span>{pageData.product.addGroup}</span>
          </Button>
        </div>
        <div className="clearfix"></div>
        <div className="mt-3">{renderProductGroups()}</div>
      </>
    );
  };

  const renderSpecificCombo = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.product.title}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="productPriceIds"
          rules={[
            {
              required: true,
              message: pageData.product.productValidateMessage,
            },
          ]}
        >
          <FnbSelectMultipleProductRenderOption
            selectOption={renderProductSpecificOptions()}
            placeholder={pageData.product.productPlaceholder}
            onChange={(_, options) => onSelectSpecificProducts(options)}
            listHeight={600}
          />
        </Form.Item>
      </>
    );
  };

  const renderProductSpecificOptions = () => {
    let options = [];
    let allProducts = products;

    allProducts.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    allProducts.forEach((product, index) => {
      const listProductPriceByProductId = allProductPriceOptions.filter((p) => p.productId === product.id);
      if (listProductPriceByProductId.length > 1) {
        const groupName = listProductPriceByProductId[0].productName;
        const groupThumbnail = listProductPriceByProductId[0].thumbnail;
        const groupOptions = [];
        listProductPriceByProductId?.forEach((optionData) => {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item-grouped"
            >
              <Row className="option-item-grouped-row">
                <Col xs={0} sm={0} md={0} lg={24}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-prices-name text-normal text-line-clamp-2">
                          <Text>{optionData?.text}</Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-unit text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-price-value text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={0} className="option-item-responsive">
                  <div className="option-grouped-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-grouped-responsive-product-name text-normal text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          groupOptions.push(option);
        });

        if (groupOptions.length > 0) {
          const groupOption = (
            <OptGroup
              label={
                <Row className="option-grouped-label">
                  <Col xs={9} sm={9} md={9} lg={2}>
                    <div className="item-group-product-image">
                      <Image preview={false} src={groupThumbnail ?? "error"} fallback={comboDefaultImage} />
                    </div>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={22}>
                    <div className="item-group-product-name text-line-clamp-2">
                      <span>{groupName}</span>
                    </div>
                  </Col>
                  <Col xs={15} sm={15} md={15} lg={0}>
                    <div className="option-grouped-label-responsive">{groupName}</div>
                  </Col>
                </Row>
              }
            >
              {groupOptions}
            </OptGroup>
          );
          options.push(groupOption);
        }
      } else {
        const optionData = listProductPriceByProductId.length > 0 ? listProductPriceByProductId[0] : null;
        if (optionData) {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item"
            >
              <Row className="option-item-row">
                <Col xs={9} sm={9} md={9} lg={2}>
                  <div className="item-product-image">
                    <Image preview={false} src={optionData?.thumbnail ?? "error"} fallback={comboDefaultImage} />
                  </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={22}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-name text-bold text-line-clamp-2">
                          <span>{optionData?.text}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={3}>
                      <Row>
                        <Col span={24} className="text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={5}>
                      <Row>
                        <Col span={24} className="item-product-price text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={15} sm={15} md={15} lg={0} className="option-item-responsive">
                  <div className="option-group-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-responsive-product-name text-bold text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          options.push(option);
        }
      }
    });

    return options;
  };

  const renderProductFlexibleOptions = (index) => {
    let allProducts = [];
    if (index !== null) {
      const formValues = form.getFieldsValue();
      const { productGroups } = formValues;

      if (productGroups !== undefined) {
        let productCategory = productGroups[index];
        let productsByCategory = allproductsWithCategory?.filter(
          (item) => item?.productCategoryId === productCategory?.categoryId
        );
        if (productsByCategory?.length > 0) {
          allProducts = productsByCategory;
        }
      }
    }

    let options = [];
    allProducts.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    allProducts.forEach((product, index) => {
      const listProductPriceByProductId = allProductPriceOptions.filter((p) => p.productId === product.id);
      if (listProductPriceByProductId.length > 1) {
        const groupThumbnail = listProductPriceByProductId[0].thumbnail;
        const groupName = listProductPriceByProductId[0].productName;
        const groupOptions = [];
        listProductPriceByProductId?.forEach((optionData) => {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item-grouped"
            >
              <Row className="option-item-grouped-row">
                <Col xs={0} sm={0} md={0} lg={24} className="option-item-grouped-infor">
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-prices-name text-normal text-line-clamp-2">
                          <Text>{optionData?.text}</Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-unit text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-price-value text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={0} className="option-item-responsive">
                  <div className="option-grouped-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-grouped-responsive-product-name text-normal text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          groupOptions.push(option);
        });

        if (groupOptions.length > 0) {
          const groupOption = (
            <OptGroup
              label={
                <Row className="option-grouped-label">
                  <Col xs={9} sm={9} md={9} lg={2}>
                    <div className="item-group-product-image">
                      <Image preview={false} src={groupThumbnail ?? "error"} fallback={comboDefaultImage} />
                    </div>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={22}>
                    <div className="item-group-product-name text-line-clamp-2">
                      <span>{groupName}</span>
                    </div>
                  </Col>
                  <Col xs={15} sm={15} md={15} lg={0}>
                    <div className="option-grouped-label-responsive">{groupName}</div>
                  </Col>
                </Row>
              }
            >
              {groupOptions}
            </OptGroup>
          );
          options.push(groupOption);
        }
      } else {
        const optionData = listProductPriceByProductId.length > 0 ? listProductPriceByProductId[0] : null;
        if (optionData) {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item"
            >
              <Row className="option-item-row">
                <Col xs={9} sm={9} md={9} lg={2}>
                  <div className="item-product-image">
                    <Image preview={false} src={optionData?.thumbnail ?? "error"} fallback={comboDefaultImage} />
                  </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={22}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-name text-bold text-line-clamp-2">
                          <span>{optionData?.text}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={3}>
                      <Row>
                        <Col span={24} className="text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={5}>
                      <Row>
                        <Col span={24} className="item-product-price text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={15} sm={15} md={15} lg={0} className="option-item-responsive">
                  <div className="option-group-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-responsive-product-name text-bold text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          options.push(option);
        }
      }
    });

    return options;
  };

  const renderProductGroups = () => {
    return productGroups?.map((_, index) => {
      return (
        <>
          {index >= 1 && <div className="group-clearfix"></div>}
          <div className="product-group-container">
            <div className="product-group-header">
              <Row>
                <Col span={20}>
                  <h4 className="product-group-name label-information">
                    {pageData.product.group} {productGroups.length > 1 && index + 1}
                  </h4>
                </Col>
                {index > 0 && (
                  <Col span={4}>
                    <div className="product-group-delete-action float-right">
                      <a onClick={() => onRemoveProductGroup(index)}>
                        <TrashFill className="icon-svg-hover" />
                      </a>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
            <div className="product-group-body">
              <Row gutter={[24, 24]} className="mt-1">
                <Col xs={24} sm={24} md={24} lg={24} span={24}>
                  <h4 className="fnb-form-label">
                    {pageData.product.category}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["productGroups", index, "categoryId"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.product.categoryValidateMessage,
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      className="fnb-select-single"
                      dropdownClassName="fnb-select-single-dropdown"
                      placeholder={pageData.product.categoryPlaceholder}
                      onChange={() => onChangeProductCategory(index)}
                    >
                      {renderOptionsProductCategory()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} span={0} className="d-none">
                  <h4 className="fnb-form-label d-none">
                    {pageData.product.itemQuantity}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    className="d-none"
                    name={["productGroups", index, "quantity"]}
                    rules={[
                      {
                        required: false,
                        message: pageData.product.itemQuantityValidateMessage,
                      },
                    ]}
                  >
                    <InputNumber
                      type="hidden"
                      defaultValue={3}
                      placeholder={pageData.product.quantityPlaceholder}
                      className="w-100 fnb-input input-quantity"
                      min={1}
                      max={MaximumNumber}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} span={24}>
                  <h4 className="fnb-form-label">
                    {pageData.product.title}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["productGroups", index, "productPriceIds"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.product.productValidateMessage,
                      },
                    ]}
                  >
                    <FnbSelectMultipleProductRenderOption
                      selectOption={renderProductFlexibleOptions(index)}
                      placeholder={pageData.product.productPlaceholder}
                      onChange={(e, option) => onChangeProduct(e, option, index)}
                      listHeight={600}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
        </>
      );
    });
  };

  const renderProductCategoryOptions = (indexRecord) => {
    const formValues = form.getFieldsValue();
    const { productGroups } = formValues;
    let existedProductCategoryIds = [];
    productGroups?.forEach((item, index) => {
      if (item.categoryId && index !== indexRecord) {
        existedProductCategoryIds.push(item.categoryId);
      }
    });

    const productCategoryOptions = productCategories?.filter(
      (category) => !existedProductCategoryIds.includes(category.id)
    );
    return productCategoryOptions?.map((category) => (
      <Option key={category?.id} value={category?.id}>
        {category?.name}
      </Option>
    ));
  };

  const renderOptionsProductCategory = () => {
    return productCategories?.map((category) => (
      <Option key={category?.id} value={category?.id}>
        {category?.name}
      </Option>
    ));
  };

  const renderSellingPrice = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.price.sellingPrice}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="sellingPrice"
          rules={[
            {
              required: true,
              message: pageData.price.sellingPriceValidateMessage,
            },
          ]}
        >
          <InputNumber
            onChange={(value) => {
              setSellingFixedPrice(value);
              productCombos.forEach((combo) => {
                combo.sellingPrice = value;
              });

              setProductCombos([...productCombos]);
            }}
            addonAfter={getCurrency()}
            placeholder={pageData.price.sellingPricePlaceholder}
            className="w-100 fnb-input-number"
            min={1}
            max={MaximumNumber}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            precision={getCurrency() === currency.vnd ? 0 : 2}
          />
        </Form.Item>
      </>
    );
  };

  /// Render selling price field if product combo type is specific
  const renderSpecificComboSellingPrice = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.price.sellingPrice}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="sellingPrice"
          rules={[
            {
              required: true,
              message: `${pageData.price.sellingPriceValidateMessage} ${formatTextNumber(
                totalOriginalPriceOfSpecificCombo
              )}`,
            },
          ]}
        >
          <InputNumber
            onChange={(value) => {
              setSellingFixedPrice(value);
              updateTotalOriginalPriceOfSpecificCombo(value);
            }}
            addonAfter={getCurrency()}
            placeholder={pageData.price.sellingPricePlaceholder}
            className="w-100 fnb-input-number"
            min={1}
            max={totalOriginalPriceOfSpecificCombo}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            precision={getCurrency() === currency.vnd ? 0 : 2}
          />
        </Form.Item>

        <Row gutter={[16, 16]} className="float-right flexible-combo-by-group-of-items">
          <Col className="flexible-combo-discount-icon">
            <b>
              <span>{pageData.price.originalPrice}</span>:
              <span className="ml-2">{formatCurrency(totalOriginalPriceOfSpecificCombo)}</span>
            </b>
          </Col>
          <Col className="color-primary ml-2 flexible-combo-discount-percent">
            <DiscountIcon />
            <span className="ml-2">{roundNumber(discountPercentAmountOfSpecificCombo, 1)}</span>
            <PercentageOutlined />
          </Col>
        </Row>
      </>
    );
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

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  const navigateToManagementPage = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/combo");
    }, 100);
  };

  //#endregion

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" htmlType="submit" onClick={() => onSubmitForm()}>
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.CREATE_COMBO,
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
        className="combo-form"
        form={form}
        layout="vertical"
        autoComplete="off"
        onChange={() => {
          if (!formChanged) setFormChanged(true);
        }}
        onFieldsChange={(e) => changeForm(e)}
      >
        <div className="w-100">
          <Content>
            <Card className="w-100 mb-4 fnb-card h-auto">
              <h3 className="label-information mt-10">{pageData.generalInformation.title}</h3>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={17} span={17}>
                  {renderGeneralInformationComponent()}
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} span={7} className="combo-media">
                  <h3 className="fnb-form-label mt-32">{pageData.media.title}</h3>
                  <Form.Item>
                    <Row className={`non-image ${selectedImage !== null ? "have-image" : ""}`}>
                      <Col span={24} className={`image-product ${selectedImage !== null ? "justify-left" : ""}`}>
                        <Row className="d-flex">
                          <FnbUploadImageComponent
                            buttonText={pageData.upload.uploadImage}
                            onChange={onClickUploadImage}
                          />
                          <a className="upload-image-url" hidden={selectedImage !== null ? true : false}>
                            {pageData.upload.addFromUrl}
                          </a>
                        </Row>
                      </Col>
                      <Col span={24} className="text-non-image" hidden={selectedImage !== null ? true : false}>
                        <Text disabled>{pageData.media.textNonImage}</Text>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card className="fnb-card mb-4">
              <Row gutter={[16, 16]} className="mb-4">
                <Col span={24}>{renderProductComponent()}</Col>
              </Row>
            </Card>
            <Card className="fnb-card mb-4">
              <Row gutter={[16, 16]}>
                <Col span={24}>{renderPriceComponent()}</Col>
              </Row>
            </Card>
          </Content>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.btnConfirmLeave}
        onCancel={onDiscard}
        onOk={navigateToManagementPage}
        className="d-none"
        isChangeForm={isChangeForm}
      />
    </>
  );
}
