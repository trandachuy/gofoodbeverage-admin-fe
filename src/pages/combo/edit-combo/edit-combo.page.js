import { DeleteOutlined, InfoCircleOutlined, PercentageOutlined, PlusOutlined } from "@ant-design/icons";
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
import Text from "antd/lib/typography/Text";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbSelectMultipleProductRenderOption } from "components/fnb-select-multiple-product-render-option/fnb-select-multiple-product-render-option";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { ComboType } from "constants/combo.constants";
import { MaximumNumber } from "constants/default.constants";
import { CalendarNewIconBold, DiscountIcon, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency, DateFormat } from "constants/string.constants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  combinationPossible,
  formatCurrency,
  formatCurrencyWithSymbol,
  formatTextNumber,
  getCurrency,
  roundNumber,
} from "utils/helpers";
import comboDefaultImage from "../../../assets/images/combo-default-img.jpg";
const { Option, OptGroup } = Select;

export default function EditCompoPage(props) {
  const fnbImageSelectRef = React.useRef();
  const { t, history, match, comboDataService, branchDataService, productDataService, productCategoryDataService } =
    props;

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

  const initProductGroup = {
    categoryId: null,
    quantity: 1,
    productIds: [],
  };

  const [selectedProductCategoryIds, setSelectedProductCategoryIds] = useState([]);
  const [form] = Form.useForm();
  const [comboId, setComboId] = useState("");
  const [blockNavigation, setBlockNavigation] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedComboType, setSelectedComboType] = useState(null);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [allProductPriceOptions, setAllProductPriceOptions] = useState([]);
  const [productGroups, setProductGroups] = useState([initProductGroup]);
  const [sellingFixedPrice, setSellingFixedPrice] = useState(0);
  const [selectedSpecificProducts, setSelectedSpecificProducts] = useState([]);
  const [discountPercentAmountOfSpecificCombo, setDiscountPercentAmountOfSpecificCombo] = useState(0);
  const [totalOriginalPriceOfSpecificCombo, setTotalOriginalPriceOfSpecificCombo] = useState(0);
  const [selectedPriceType, setSelectedPriceType] = useState(prices.fixed.value);
  const [productCombos, setProductCombos] = useState([]);
  const [selectedProductPriceIds, setSelectedProductPriceIds] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [disableAllBranches, setDisableAllBranches] = useState(false);

  const [allproductsWithCategory, setAllproductsWithCategory] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);

  const pageData = {
    title: t("combo.editCombo"),
    btnCancel: t("button.cancel"),
    btnUpdate: t("button.update"),
    btnAddNew: t("button.addNew"),
    selectDate: t("promotion.selectDate"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
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
    comboUpdatedSuccessfully: t("messages.comboUpdatedSuccessfully"),
    leaveWarningMessage: t("productManagement.leaveWarningMessage"),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
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
    getBranches();
    getInitData();
  }, []);

  const getBranches = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      if (res && res?.branchs?.length > 0) {
        setBranches(res?.branchs);
      }
    });
  };

  const getInitData = () => {
    let allProductPriceOptions = [];
    let cacheSelectedProductPrices = [];
    productDataService.getAllProductsActiveAsync().then((res) => {
      if (res) {
        setProducts(res.products);
        const productDataOptions = getProductDataOptions(res.products);
        setAllProductPriceOptions(productDataOptions);
        allProductPriceOptions = productDataOptions;
      }
    });

    productDataService.getAllProductsWithCategoryAsync().then((res) => {
      if (res) {
        setAllproductsWithCategory(res.products);
      }
    });

    setComboId(match?.params.comboId);
    comboDataService.getComboByIdAsync(match?.params.comboId).then((res) => {
      const { combo } = res;
      const { comboTypeId } = combo;
      const initData = {
        combo: {
          comboName: combo.name,
          thumbnail: combo.thumbnail,
          startDate: moment.utc(combo.startDate).local(),
          endDate: combo?.endDate != null ? moment.utc(combo?.endDate).local() : null,
          description: combo.description,
          isShowAllBranches: combo.isShowAllBranches,
          comboTypeId: combo.comboTypeId,
          //<-- EDIT PRICE
          comboPriceTypeId: combo?.comboPriceTypeId,
          sellingPrice: combo?.sellingPrice,
          //--> END EDIT PRICE
        },
      };

      setDisableAllBranches(initData?.combo?.isShowAllBranches);
      //<-- EDIT PRICE
      const comboPricings = mappingProductComboToDataTable(combo.comboPricings);
      setProductCombos(comboPricings);

      /// Set edit SelectedProductPriceIds
      const { comboProductGroups } = combo;
      let editSelectedProductPriceIds = [];
      if (comboProductGroups.length > 0) {
        comboProductGroups.forEach((group, index) => {
          const { comboProductGroupProductPrices } = group;
          editSelectedProductPriceIds[index] = comboProductGroupProductPrices?.map((product) => {
            return product?.productPriceId;
          });
        });
      }
      setSelectedProductPriceIds(editSelectedProductPriceIds);

      setSelectedPriceType(combo.comboPriceTypeId);

      const listProductSelected = combo?.comboProductPrices?.map((item) => {
        return {
          productId: item?.productPrice?.productId,
          name: item?.productPrice?.product?.name,
          productPriceId: item?.productPriceId,
          price: item?.priceValue,
        };
      });
      const totalOriginalPrice = listProductSelected?.map((p) => p.price)?.reduce((a, b) => a + b, 0);
      setTotalOriginalPriceOfSpecificCombo(totalOriginalPrice);
      updateTotalOriginalPriceOfSpecificCombo(combo?.sellingPrice, listProductSelected);
      //--> END EDIT PRICE

      let comboStoreBranches = combo.comboStoreBranches;
      let branchIds = [];
      branchIds = comboStoreBranches.map((branch) => branch.branchId);
      initData.combo.branchIds = branchIds;

      setSelectedComboType(combo.comboTypeId);
      onChangeComboType(combo.comboTypeId);

      if (comboTypeId === ComboType.Fixed) {
        let listComboProductGroup = getFormItemProductCategory(combo.comboProductGroups);
        setProductGroups(listComboProductGroup);
        let productGroupIds = productCategories.filter((pc) =>
          listComboProductGroup.find((cpg) => cpg.productCategoryId !== pc.id)
        );

        setProductCategories(productGroupIds);

        /// Mapping listComboProductGroup to comboProductGroups
        /// the select options using option value is name to display
        const comboProductGroups = listComboProductGroup.map((group) => {
          const selectedProductPrices = allProductPriceOptions.filter((p) =>
            group.productPriceIds.includes(p.productPriceId)
          );

          cacheSelectedProductPrices = cacheSelectedProductPrices.concat(selectedProductPrices);
          return {
            ...group,
            productPriceIds: selectedProductPrices.map((p) => p.text),
          };
        });

        initData.combo.productGroups = comboProductGroups;
      }

      if (comboTypeId === ComboType.Specific) {
        let productPrices = combo.comboProductPrices;
        const productPriceIds = productPrices.map((item) => item.productPriceId);

        /// Mapping listComboProductGroup to comboProductGroups
        /// the select options using option value is name to display
        const selectedProductPrices = allProductPriceOptions
          .filter((p) => productPriceIds.includes(p.productPriceId))
          ?.map((p) => p.text);
        initData.combo.productPriceIds = selectedProductPrices;

        cacheSelectedProductPrices = cacheSelectedProductPrices.concat(selectedProductPrices);
      }

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        fnbImageSelectRef.current.setImageUrl(initData?.combo?.thumbnail);
        setSelectedImage(initData?.combo?.thumbnail);
      }

      form.setFieldsValue(initData);
      setStartDate(initData.combo.startDate);
    });
  };

  const onChangeComboType = (value) => {
    if (value === combos.flexibleCombo.value) {
      getProductCategories();
    }
    getProducts();
    setSelectedComboType(value);
  };

  const getProducts = () => {
    productDataService.getAllProductsActiveAsync().then((res) => {
      if (res) {
        setProducts(res.products);
        const productDataOptions = getProductDataOptions(res.products);
        setAllProductPriceOptions(productDataOptions);
      }
    });

    productDataService.getAllProductsWithCategoryAsync().then((res) => {
      if (res) {
        setAllproductsWithCategory(res.products);
      }
    });
  };

  const getProductCategories = () => {
    productCategoryDataService.getAllProductCategoriesAsync().then((res) => {
      if (res) {
        setProductCategories(res.allProductCategories);
      }
    });
  };

  const getFormItemProductCategory = (comboProductGroups) => {
    let listComboProductGroup = [];
    comboProductGroups.map((item) => {
      let comboProductGroup = {
        id: item.id,
        productCategoryId: item.productCategoryId,
        quantity: item.quantity,
        productPriceIds: item.comboProductGroupProductPrices.map((i) => i.productPriceId),
      };
      listComboProductGroup.push(comboProductGroup);
    });
    return listComboProductGroup;
  };

  const getProductDataOptions = (products) => {
    let productOptions = [];
    products?.map((product) => {
      if (product?.productPrices.length > 0) {
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
            isSinglePrice: product?.productPrices.length <= 1,
            thumbnail: product?.thumbnail,
            unitName: product?.unit?.name,
          };

          productOptions.push(option);
        });
      }
    });

    return productOptions;
  };

  const onCompleted = () => {
    setBlockNavigation(false);
    return history.push("/combo");
  };

  const onFinish = async () => {
    form.validateFields().then((values) => {
      values.combo.comboId = comboId;
      if (disableAllBranches) {
        values.combo.branchIds = [];
      }
      if (values.combo.comboTypeId === combos.flexibleCombo.value) {
        values.combo.productPriceIds = [];
      } else {
        values.combo.productGroups = [];
      }
      //EDIT PRICE
      const comboPricings = productCombos?.map((combo) => {
        return {
          id: combo?.comboData[0]?.id,
          comboProductName: combo?.comboData?.map((p) => p.text)?.join(" | "),
          sellingPrice: combo?.sellingPrice,
          comboPricingProducts: combo?.comboData?.map((item) => {
            return {
              id: item?.idPricingProduct,
              productPriceId: item?.productPriceId,
              productPrice: item?.productPrice,
            };
          }),
        };
      });

      let requestModel = {
        ...values?.combo,
        comboPricings: comboPricings,
      };

      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        const imageUrl = fnbImageSelectRef.current.getImageUrl();
        if (imageUrl) {
          requestModel = {
            ...requestModel,
            thumbnail: imageUrl,
          };
        }
      }

      const { comboTypeId } = values?.combo;
      /// Mapping selected product price name to productPriceIds
      if (comboTypeId === ComboType.Specific) {
        const productPriceIds = allProductPriceOptions
          .filter((p) => requestModel.productPriceIds.includes(p?.text))
          .map((p) => p.productPriceId);
        requestModel = {
          ...requestModel,
          productPriceIds: productPriceIds,
          isShowAllBranches: disableAllBranches,
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
          isShowAllBranches: disableAllBranches,
        };
      }

      comboDataService.updateComboAsync({ combo: requestModel }).then((res) => {
        if (res) {
          setBlockNavigation(false);
          message.success(pageData.comboUpdatedSuccessfully);
          history.push("/combo");
        }
      });
    });
  };

  const onChangeProductCategory = (index) => {
    const formValues = form.getFieldsValue();
    const { combo } = formValues;
    const productCategoryIds = combo.productGroups?.map((group) => group.productCategoryId) ?? [];
    setSelectedProductCategoryIds(productCategoryIds);
    combo.productGroups?.map((productGroup, i) => {
      if (i === index) {
        productGroup.productPriceIds = [];
      }
    });
    form.setFieldsValue({ combo });
  };

  const onAddNewProductGroup = () => {
    const formValues = form.getFieldsValue();
    const { combo } = formValues;
    const newProductGroup = [...combo.productGroups, initProductGroup];
    setProductGroups(newProductGroup);
    combo.productGroups = newProductGroup;
    form.setFieldsValue(formValues);
  };

  const onRemoveProductGroup = (index) => {
    const formValues = form.getFieldsValue();
    const { combo } = formValues;
    const newProductGroup = combo.productGroups.filter((_, i) => i !== index);
    setProductGroups(newProductGroup);
    combo.productGroups = newProductGroup;
    form.setFieldsValue(formValues);

    /// Update selectedProductPriceIds
    selectedProductPriceIds[index] = [];
    refreshOptionsAndCalculateCombos(selectedProductPriceIds);
  };

  ///<-- EDIT PRICE
  const calculatingDiscountPercent = (sellingFixedPrice, totalOriginalPrice) => {
    if (totalOriginalPrice == 0) return 0;
    return ((totalOriginalPrice - sellingFixedPrice) / totalOriginalPrice) * 100;
  };

  const updateTotalOriginalPriceOfSpecificCombo = (sellingFixedPrice, listProductSelected) => {
    if (!listProductSelected) {
      listProductSelected = selectedSpecificProducts;
    }
    const totalOriginalPrice = listProductSelected?.map((p) => p.price)?.reduce((a, b) => a + b, 0);
    var discountPercentAmount = calculatingDiscountPercent(sellingFixedPrice, totalOriginalPrice);
    setDiscountPercentAmountOfSpecificCombo(discountPercentAmount);
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

  const renderProductGroups = () => {
    const deleteIcon = productGroups?.length > 1 ? <DeleteOutlined className="icon-del" /> : <></>;
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
                  <Form.Item name={["combo", "productGroups", index, "id"]} className="d-none">
                    <Input type="hidden" />
                  </Form.Item>
                  <h4 className="fnb-form-label">
                    {pageData.product.category}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["combo", "productGroups", index, "productCategoryId"]}
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
                      onChange={(e) => onChangeProductCategory(index)}
                    >
                      {renderOptionsProductCategory()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} span={0} className="d-none">
                  <Form.Item
                    name={["combo", "productGroups", index, "quantity"]}
                    label={pageData.product.itemQuantity}
                    rules={[
                      {
                        required: false,
                        message: pageData.product.itemQuantityValidateMessage,
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={pageData.product.quantityPlaceholder}
                      className="w-100"
                      defaultValue={3}
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
                    name={["combo", "productGroups", index, "productPriceIds"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.product.productValidateMessage,
                      },
                    ]}
                  >
                    <FnbSelectMultipleProductRenderOption
                      selectOption={renderProductFlexibleOptions(index)}
                      onChange={(e, option) => onChangeProduct(e, option, index)}
                      placeholder={pageData.product.productPlaceholder}
                      listHeight={600}
                    ></FnbSelectMultipleProductRenderOption>
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
    const { combo } = formValues;
    let existedProductCategoryIds = [];
    combo?.productGroups?.forEach((item, index) => {
      if (item.productCategoryId && index !== indexRecord) {
        existedProductCategoryIds.push(item.productCategoryId);
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

  const renderSpecificCombo = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.product.title}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name={["combo", "productPriceIds"]}
          rules={[
            {
              required: true,
              message: pageData.product.productValidateMessage,
            },
          ]}
        >
          <FnbSelectMultipleProductRenderOption
            selectOption={renderProductSpecificOptions()}
            onChange={(_, options) => onSelectSpecificProducts(options)}
            placeholder={pageData.product.productPlaceholder}
            listHeight={600}
          ></FnbSelectMultipleProductRenderOption>
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
                      <Col span={24} className="item-grouped-responsive-product-name text-normal">
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
                      <Col span={24} className="item-responsive-product-name text-bold">
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
      const { combo } = formValues;
      if (combo?.productGroups !== undefined) {
        let productCategory = combo?.productGroups[index];
        let productsByCategory = allproductsWithCategory?.filter(
          (item) => item?.productCategoryId === productCategory?.productCategoryId
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
                        <Col span={24} className="item-product-prices-name text-normal">
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
                      <Col span={24} className="item-grouped-responsive-product-name text-normal">
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
                      <Col span={24} className="item-responsive-product-name text-bold">
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

  const renderSellingPrice = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.price.sellingPrice}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name={["combo", "sellingPrice"]}
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

  const onChangeComboSellingPrice = (value, index) => {
    productCombos[index].sellingPrice = value;
    setProductCombos([...productCombos]);
  };

  const getDataTable = () => {
    const dataSource = [];
    productCombos.forEach((combo, index) => {
      const originalPrice = combo?.comboData?.map((p) => p.productPrice)?.reduce((a, b) => a + b, 0);
      let sellingPrice = combo.sellingPrice && combo.sellingPrice > 0 ? combo.sellingPrice : originalPrice;
      if (selectedPriceType === prices.fixed.value && sellingFixedPrice > 0) {
        sellingPrice = sellingFixedPrice;
      }

      const record = {
        index: index,
        productIds: combo?.comboData?.map((p) => p.productId),
        comboName: combo?.comboData?.map((p) => p.text)?.join(" | "),
        originalPrice: originalPrice,
        sellingPrice: sellingPrice,
      };
      dataSource.push(record);
    });

    return dataSource;
  };

  const mappingProductComboToDataTable = (comboPricings) => {
    return comboPricings?.map((item, index) => {
      const { comboPricingProducts, sellingPrice } = item;
      const comboData = comboPricingProducts?.map((c) => {
        const { productPrice, productPriceId } = c;
        let comboName = productPrice?.product?.name ?? "";
        if (productPrice?.priceName) {
          comboName = `${productPrice?.product?.name} ${productPrice?.priceName}`;
        }
        return {
          id: item.id,
          idPricingProduct: c.id,
          key: productPriceId,
          productId: productPrice?.productId,
          productName: productPrice?.product?.name,
          productPrice: productPrice?.priceValue,
          productPriceId: productPriceId,
          productPriceName: productPrice?.priceName,
          text: comboName,
        };
      });

      return {
        comboData: comboData,
        sellingPrice: sellingPrice,
      };
    });
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

  /// Render selling price field if product combo type is specific
  const renderSpecificComboSellingPrice = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.price.sellingPrice}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name={["combo", "sellingPrice"]}
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

  const onSelectAllBranches = (event) => {
    const isChecked = event.target.checked;
    setDisableAllBranches(isChecked);
  };

  const renderProductComponent = () => {
    return (
      <>
        <h3 className="label-information mt-10">{pageData.product.title}</h3>
        <h4 className="combo-type-name mt-3">{pageData.product.comboType}</h4>
        <Form.Item name={["combo", "comboTypeId"]} className="select-product-radio-wrapper">
          <Radio.Group className="product-component-radio" onChange={(e) => onChangeComboType(e.target.value)}>
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
            <Form.Item name={["combo", "comboPriceTypeId"]}>
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

  const onClickUploadImage = (file) => {
    setSelectedImage(file);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate;
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
                  <FnbAddNewButton
                    onClick={(e) => onFinish(e)}
                    className="float-right"
                    type="primary"
                    text={pageData.btnUpdate}
                  />
                ),
                permission: PermissionKeys.EDIT_COMBO,
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
        onFieldsChange={(e) => changeForm(e)}
      >
        <div className="w-100">
          <Content>
            <Card className="w-100 mb-4 fnb-card h-auto">
              <h3 className="label-information mt-10">{pageData.generalInformation.title}</h3>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={17} span={17}>
                  <h4 className="fnb-form-label mt-32">
                    {pageData.generalInformation.name}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["combo", "comboName"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.generalInformation.nameValidateMessage,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={100}
                      placeholder={pageData.generalInformation.namePlaceholder}
                    />
                  </Form.Item>

                  <Row gutter={[32, 16]}>
                    <Col xs={24} lg={12}>
                      <h4 className="fnb-form-label">{pageData.generalInformation.startDate}</h4>
                      <Form.Item
                        name={["combo", "startDate"]}
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
                          onChange={(date) => setStartDate(date)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <h4 className="fnb-form-label">{pageData.generalInformation.endDate}</h4>
                      <Form.Item name={["combo", "endDate"]}>
                        <DatePicker
                          suffixIcon={<CalendarNewIconBold />}
                          placeholder={pageData.selectDate}
                          className="fnb-date-picker w-100"
                          disabledDate={disabledDateByStartDate}
                          format={DateFormat.DD_MM_YYYY}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h4 className="fnb-form-label">{pageData.generalInformation.description}</h4>
                  <Form.Item name={["combo", "description"]}>
                    <TextArea
                      showCount
                      className="fnb-text-area-with-count no-resize combo-description-box"
                      placeholder={pageData.generalInformation.maximum1000Characters}
                      maxLength={1000}
                    />
                  </Form.Item>

                  <h4 className="fnb-form-label">{pageData.generalInformation.branch}</h4>
                  <div className="combo-check-box-select-all-branch">
                    <Checkbox onChange={(event) => onSelectAllBranches(event)} checked={disableAllBranches}>
                      {pageData.generalInformation.allBranches}
                    </Checkbox>
                  </div>
                  <Form.Item
                    hidden={disableAllBranches}
                    name={["combo", "branchIds"]}
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} span={7} className="combo-media">
                  <h3 className="fnb-form-label mt-32">{pageData.media.title}</h3>
                  <Form.Item>
                    <FnbImageSelectComponent ref={fnbImageSelectRef} />
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
