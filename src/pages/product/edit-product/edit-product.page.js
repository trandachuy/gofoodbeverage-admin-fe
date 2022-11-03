import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbDeleteIcon } from "components/fnb-delete-icon/fnb-delete-icon";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import FnbSelectMaterialComponent from "components/fnb-select-material/fnb-select-material";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import SelectEditComponent from "components/select-edit-new-item/select-edit-new-item";
import { IconBtnAdd, ImageMaterialDefault, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { Platform } from "constants/platform.constants";
import { ProductStatus } from "constants/product-status.constants";
import { currency } from "constants/string.constants";
import productDataService from "data-services/product/product-data.service";
import storeDataService from "data-services/store/store-data.service";
import unitDataService from "data-services/unit/unit-data.service";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { formatCurrencyWithoutSuffix, getApiError, getCurrency, roundNumber } from "utils/helpers";
import productDefaultImage from "../../../assets/images/combo-default-img.jpg";
import DeleteProductComponent from "../product-management/components/delete-product.component";
import EditProductInCombo from "./edit-product-in-combo.component";
import "./edit-product.scss";

const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

export default function EditProductPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const fnbImageSelectRef = React.useRef();

  const tableMaterialSettings = {
    page: 1,
    pageSize: 20,
  };

  const [image, setImage] = useState(null);
  const [prices, setPrices] = useState([{}]);
  const [initDataOptions, setInitDataOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [listPlatforms, setListPlatforms] = useState([]);
  const [defaultValueNull, setDefaultValueNull] = useState(null);
  const [isUnitNameExisted, setIsUnitNameExisted] = useState(false);
  const [listAllProductCategory, setListAllProductCategory] = useState([]);
  const [listAllTax, setListAllTax] = useState([]);
  const [pageNumber, setPageNumber] = useState(tableMaterialSettings.page);
  const [units, setUnits] = useState([]);
  const [nameUnit, setNameUnit] = useState("");
  const [isTopping, setTopping] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [titleName, setTitleName] = useState("");
  const selectNewItemFuncs = React.useRef(null);
  const [form] = Form.useForm();
  const [totalCost, setTotalCost] = useState(0);
  const [dataInventoryTable, setDataInventoryTable] = useState([]);
  const [unitId, setUnitId] = useState(null);
  const [totalCostInitial, setTotalCostInitial] = useState(0);
  const [activate, setActivate] = useState(null);
  const [isSelectedMaterial, setIsSelectedMaterial] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [valuePlatforms, setValuePlatforms] = useState([]);
  const [currencyCode, setCurrencyCode] = useState(false);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPaging, setShowPaging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [orderOpenStatus, setOrderOpenStatus] = useState({});
  const [titleModal, setTitleModal] = useState();

  const [allproductToppings, setAllProductToppings] = useState([]);
  const [productToppings, setProductToppings] = useState([]);
  const [productToppingIds, setProductToppingIds] = useState([]);
  const [productToppingSelected, setProductToppingSelected] = useState([]);
  const [isVisibaleProductToppingModal, setIsVisibaleProductToppingModal] = useState(false);
  const [isModalComboVisible, setIsModalComboVisible] = useState(false);
  const [comboInfos, setComboInfos] = useState([]);
  const [valuePlatformInits, setValuePlatformInits] = useState([]);

  useEffect(async () => {
    getInitData();
    checkCurrencyVND();
  }, []);

  const pageData = {
    notificationTitle: t("form.notificationTitle"),
    title: t("productManagement.addProduct"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    btnDelete: t("button.delete"),
    action: t("button.action"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    productDeleteSuccess: t("productManagement.productDeleteSuccess"),
    productDeleteFail: t("productManagement.productDeleteFail"),
    generalInformation: {
      title: t("productManagement.generalInformation.title"),
      name: {
        label: t("productManagement.generalInformation.name"),
        placeholder: t("productManagement.generalInformation.namePlaceholder"),
        required: true,
        maxLength: 100,
        validateMessage: t("productManagement.generalInformation.nameValidateMessage"),
      },
      description: {
        label: t("productManagement.generalInformation.description"),
        placeholder: t("productManagement.generalInformation.descriptionPlaceholder"),
        required: false,
        maxLength: 255,
      },
      uploadImage: t("productManagement.generalInformation.addFile"),
    },
    pricing: {
      title: t("productManagement.pricing.price"),
      addPrice: t("productManagement.pricing.addPrice"),
      price: {
        label: t("productManagement.pricing.price"),
        placeholder: t("productManagement.pricing.pricePlaceholder"),
        required: true,
        max: 999999999,
        min: 0,
        format: "^[0-9]*$",
        validateMessage: t("productManagement.pricing.priceRange"),
      },
      priceName: {
        label: t("productManagement.pricing.priceName"),
        placeholder: t("productManagement.pricing.priceNamePlaceholder"),
        required: true,
        maxLength: 100,
        validateMessage: t("productManagement.pricing.priceNameValidateMessage"),
      },
    },
    unit: {
      title: t("productManagement.unit.title"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      pleaseSelectUnit: t("productManagement.unit.pleaseSelectUnit"),
      pleaseEnterNameUnit: t("productManagement.unit.pleaseEnterNameUnit"),
      unitNameExisted: t("productManagement.unit.unitNameExisted"),
      recipe: t("productManagement.unit.recipe"),
    },
    optionInformation: {
      title: t("option.title"),
      selectOption: t("option.selectOption"),
      pleaseSelectOption: t("option.pleaseSelectOption"),
    },
    inventoryTracking: {
      title: t("inventoryTracking.title"),
      byMaterial: t("inventoryTracking.byMaterial"),
      totalCost: t("table.totalCost"),
      pleaseEnterQuantity: t("inventoryTracking.pleaseEnterQuantity"),
      selectMaterial: t("inventoryTracking.selectMaterial"),
      pleaseSelectMaterial: t("inventoryTracking.pleaseSelectMaterial"),
      quantityMoreThanZero: t("inventoryTracking.quantityGreaterThanZero"),
      table: {
        materialName: t("table.materialName"),
        quantity: t("table.quantity"),
        unit: t("table.unit"),
        cost: t("table.cost"),
        totalCost: t("table.totalCost"),
        action: t("table.action"),
      },
    },
    productCategory: {
      label: t("productManagement.category.title"),
      placeholder: t("productManagement.category.placeholder"),
    },
    productNameExisted: t("productManagement.productNameExisted"),
    fileSizeLimit: t("productManagement.fileSizeLimit"),
    productEditedSuccess: t("productManagement.productEditedSuccess"),
    leaveWarningMessage: t("productManagement.leaveWarningMessage"),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    topping: t("productManagement.isTopping"),
    tax: t("table.tax"),
    pleaseSelectTax: t("table.pleaseSelectTax"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    platform: {
      title: t("platform.title"),
    },
    upload: {
      adFromUrl: "Add from URL",
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    table: {
      name: t("productManagement.table.name"),
      action: t("productManagement.table.action"),
    },
    addTopping: t("productManagement.addTopping"),
    toppingSelected: t("productManagement.toppingSelected"),
    selectToppings: t("productManagement.selectToppings"),
  };

  const getInitData = async () => {
    productDataService.getProductByIdAsync(match?.params?.id).then((data) => {
      setImgUrl(data?.product?.thumbnail);
      setTopping(data?.product?.isTopping);
      setTitleName(data?.product?.name);

      setAllProductToppings(data?.productToppings);
      if (data?.product?.productToppingIds?.length > 0) {
        setProductToppingIds(data?.product?.productToppingIds);

        const toppingNotSelected = data?.productToppings?.filter(
          (item) => !data?.product?.productToppingIds?.includes(item.id)
        );
        setProductToppings(toppingNotSelected);

        const toppingSelected = data?.productToppings?.filter((item) =>
          data?.product?.productToppingIds?.includes(item.id)
        );
        setProductToppingSelected(toppingSelected);
      } else {
        setProductToppings(data?.productToppings);
      }

      if (data?.product?.statusId === ProductStatus.Activate) {
        setActivate("productManagement.deactivate");
      } else {
        setActivate("productManagement.activate");
      }

      if (data?.product?.options) {
        setOptions(data?.product?.options);
        setInitDataOptions(data?.product?.options);
      }

      if (data?.product?.units) {
        setUnits(data?.product?.units);
      }

      if (data?.product?.materials) {
        setMaterials(data?.product?.materials);
        setInitDataMaterials(data?.product?.materials);
      }
      setListAllProductCategory(data?.product?.allProductCategories);

      if (data?.product?.taxes) {
        setListAllTax(data?.product?.taxes);
      }

      if (data?.product?.platforms) {
        setListPlatforms(data?.product?.platforms);
      }

      let listSelectedOption = [];
      let listRestOptions = [];
      data?.product?.listOptionIds.map((optionId) => {
        let selectedOption = data?.product?.options.find((o) => o.id === optionId);
        if (selectedOption) {
          listSelectedOption.push(selectedOption);
        }
      });

      setValuePlatforms(data?.product?.listPlatformIds);
      setValuePlatformInits(data?.product?.listPlatformIds);

      data?.product?.options.map((option) => {
        listRestOptions.push(option);
      });

      listSelectedOption.map((option) => {
        var index = listRestOptions.indexOf(option);
        if (index !== -1) {
          listRestOptions.splice(index, 1);
        }
      });

      setSelectedOptions(listSelectedOption);
      setOptions(listRestOptions);

      const pricesData = [];
      const newPrices = [];
      const inventoryTable = [];
      if (data?.product?.productPrices.length > 1) {
        data?.product?.productPrices.map((price, index) => {
          pricesData.push({
            id: price?.id,
            name: price?.priceName,
            price: price?.priceValue,
          });
          newPrices.push({});
        });
        setPrices(newPrices);
      }

      setTotalCostInitial(data?.product?.productInventoryData[0].totalCost);
      data?.product?.productInventoryData.map((productInventory) => {
        let listSelectedMaterials = [];
        let listRestMaterials = [];
        let listInitMaterials = [];

        data?.product?.materials.map((material) => {
          listInitMaterials.push(material);
          listRestMaterials.push(material);
        });
        productInventory?.listProductPriceMaterial.map((material) => {
          const selectedMaterials = listInitMaterials.find((o) => o.id === material?.key);
          listSelectedMaterials.push(selectedMaterials);
        });
        if (productInventory?.listProductPriceMaterial.length > 0) {
          listSelectedMaterials.map((material) => {
            var index = listRestMaterials.indexOf(material);
            if (index !== -1) {
              listRestMaterials.splice(index, 1);
            }
          });
          setMaterials(listRestMaterials);
          setDefaultValueNull(null);
        }
        inventoryTable.push(productInventory);
      });

      setDataInventoryTable(inventoryTable);
      const initData = {
        product: {
          description: data?.product?.description,
          name: data?.product?.name,
          productCategoryId: data?.product?.productCategoryId,
          taxId: data?.product?.tax?.id,
          unitId: data?.product?.unit?.id,
          price: data?.product?.productPrices.length === 1 ? data?.product?.productPrices[0].priceValue : null,
          prices: pricesData,
        },
      };

      /// Set value into select new item dropdown list component
      if (selectNewItemFuncs.current) {
        selectNewItemFuncs.current(data?.product?.unit?.id);
      }
      setUnitId(data?.product?.unit?.id);

      /// Update image
      if (fnbImageSelectRef && fnbImageSelectRef.current) {
        fnbImageSelectRef.current.setImageUrl(data?.product?.thumbnail);
        setSelectedImage(data?.product?.thumbnail);
      }

      form.setFieldsValue(initData);
    });
  };

  const onSubmitForm = async () => {
    let checkChangePlatForm =
      (valuePlatformInits.find((x) => x === Platform.POS?.toLowerCase()) &&
        !valuePlatforms.find((x) => x === Platform.POS?.toLowerCase())) ||
      (valuePlatformInits.find((x) => x === Platform.GoFnBApp?.toLowerCase()) &&
        !valuePlatforms.find((x) => x === Platform.GoFnBApp?.toLowerCase()));
    if (checkChangePlatForm) {
      let res = await productDataService.getProductInComboByProductIdAsync(match?.params?.id);
      if (!res.isEditProduct) {
        setComboInfos(res.combos);
        setIsModalComboVisible(true);
      } else {
        editProduct();
      }
    } else {
      editProduct();
    }
  };

  const editProduct = () => {
    if (fnbImageSelectRef && fnbImageSelectRef.current) {
      var imageUrl = fnbImageSelectRef.current.getImageUrl();
    }
    form.validateFields().then(async (values) => {
      let optionIds = [];
      selectedOptions.map((o) => {
        optionIds.push(o.id);
      });
      const editProductRequestModel = {
        units: units,
        ...values.product,
        optionIds: optionIds,
        image: imageUrl,
        isTopping: isTopping,
        productId: match?.params?.id,
        platformIds: valuePlatforms,
        productToppingIds: productToppingSelected?.map(function (item) {
          return item["id"];
        }),
      };

      if (
        editProductRequestModel.prices > 0 ||
        (editProductRequestModel.materials && editProductRequestModel.materials.priceName.length > 0)
      ) {
        if (editProductRequestModel.prices) {
          editProductRequestModel.prices.map((item, index) => {
            let listMaterials = [];
            dataInventoryTable[index]?.listProductPriceMaterial?.map((material, index) => {
              var newMaterials = {
                materialId: material.key,
                quantity: material.quantity,
                unitCost: material.unitCost,
              };
              listMaterials.push(newMaterials);
            });
            item.materials = listMaterials;
          });
          editProductRequestModel.materials = null;
        } else {
          let listMaterials = [];
          dataInventoryTable[0]?.listProductPriceMaterial?.map((material, index) => {
            var newMaterials = {
              materialId: material.key,
              quantity: material.quantity,
              unitCost: material.unitCost,
            };
            listMaterials.push(newMaterials);
          });
          editProductRequestModel.materials = listMaterials;
        }

        try {
          const response = await productDataService.updateProductAsync(editProductRequestModel);
          if (response) {
            message.success(pageData.productEditedSuccess);
            onCompleted();
          }
        } catch (errors) {
          // build error message
          const errorData = getApiError(errors);
          const errMessage = t(errorData?.message, {
            comboName: errorData?.comboName,
            productName: errorData?.productName,
          });

          message.error(errMessage);
          getInitData();
        }
      } else {
        setIsSelectedMaterial(false);
      }
    });
  };

  const onChangeStatus = async () => {
    var res = await productDataService.changeStatusAsync(match?.params?.id);
    if (res) {
      getInitData();
    }
  };

  const onSelectOption = (key) => {
    let selectedOption = options.find((o) => o.id === key);
    let restOptions = options.filter((o) => o.id !== key);
    setOptions(restOptions);
    setDefaultValueNull(null);
    selectedOptions.push(selectedOption);
  };

  const onDeleteSelectedOption = (key) => {
    let restOptions = selectedOptions.filter((o) => o.id !== key);
    setSelectedOptions(restOptions);

    let initDataOption = initDataOptions.find((o) => o.id === key);
    options.push(initDataOption);
  };

  const onChangeImage = (file) => {
    setImage(file);
  };

  const onClickAddPrice = () => {
    form.validateFields().then(async (values) => {
      const newPrices = [...prices];
      newPrices.push({});
      setPrices(newPrices);
    });

    const newInventoryTable = [...dataInventoryTable];
    var dataInventoryTableCopy = cloneDeep(dataInventoryTable);
    dataInventoryTableCopy[0].listProductPriceMaterial.map((material, index) => {
      material.quantity = 0;
    });
    newInventoryTable.push({
      priceName: "",
      listProductPriceMaterial: dataInventoryTableCopy[0].listProductPriceMaterial,
    });
    setDataInventoryTable(newInventoryTable);
  };

  const onChangePriceName = (index, evt) => {
    var dataInventory = [...dataInventoryTable];
    dataInventory[index].priceName = evt.target.value;
    setDataInventoryTable(dataInventory);
  };

  const onDeletePrice = (index) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    if (product.prices.length > 0) {
      product.prices.splice(index, 1);
      product.selectedMaterials?.priceName?.splice(index, 1);
    }
    setPrices(product.prices);
    dataInventoryTable.splice(index, 1);
    if (product.prices.length === 1) {
      product.price = product.prices[0].price;
    }
    form.setFieldsValue(formValue);
  };

  //Enter Unit name and check existed
  const onNameChange = (event) => {
    if (units.filter((u) => u.name.trim() === event.target.value.trim()).length > 0) {
      setIsUnitNameExisted(true);
    } else {
      setIsUnitNameExisted(false);
    }
    setNameUnit(event.target.value);
  };

  const onChangeOption = (id) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    product.unitId = id;
    form.setFieldsValue(formValue);
    if (selectNewItemFuncs.current) {
      selectNewItemFuncs.current(id);
      setUnitId(id);
    }
  };

  //Handle add New Unit
  const addNewUnit = async (e) => {
    if (nameUnit) {
      e.preventDefault();
      let req = {
        name: nameUnit,
      };
      let res = await unitDataService.createUnitAsync(req);
      if (res) {
        let newItem = {
          id: res.id,
          name: res.name,
        };
        setUnits([newItem, ...units]);
        setNameUnit("");
      }
    }
  };

  //Handle check Topping
  function onTopicChange(e) {
    setTopping(e.target.checked);
  }

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/product-management");
    }, 100);
  };

  const renderPrices = () => {
    const addPriceButton = (
      <Button
        type="primary"
        icon={<IconBtnAdd className="icon-btn-add-topping" />}
        className="btn-add-topping"
        onClick={onClickAddPrice}
      >
        {pageData.pricing.addPrice}
      </Button>
    );

    const singlePrice = (
      <>
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label mt-24">{pageData.pricing.priceName.label}</h4>
            <Form.Item
              name={["product", "price"]}
              rules={[
                {
                  required: true,
                  message: pageData.pricing.price.validateMessage,
                },
              ]}
            >
              <InputNumber
                className="w-100 fnb-input-number"
                placeholder={pageData.pricing.price.placeholder}
                max={pageData.pricing.price.max}
                min={pageData.pricing.price.min}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                addonAfter={currencyCode}
                precision={currencyCode === currency.vnd ? 0 : 2}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="ml-2" hidden={isTopping}>
              {addPriceButton}
            </div>
          </Col>
        </Row>
      </>
    );

    const multiplePrices = (
      <>
        <h4 className="fnb-form-label mt-24">{pageData.pricing.priceName.label}</h4>
        {prices.map((price, index) => {
          return (
            <>
              <Row className="mt-14">
                <Col span={21}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <Form.Item name={["product", "prices", index, "id"]} hidden={true}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={["product", "prices", index, "name"]}
                        rules={[
                          {
                            required: true,
                            message: pageData.pricing.priceName.validateMessage,
                          },
                        ]}
                      >
                        <Input
                          className="fnb-input"
                          onInput={(evt) => onChangePriceName(index, evt)}
                          placeholder={pageData.pricing.priceName.placeholder}
                          maxLength={pageData.pricing.priceName.maxLength}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <Form.Item
                        name={["product", "prices", index, "price"]}
                        rules={[
                          {
                            required: true,
                            message: pageData.pricing.price.validateMessage,
                          },
                        ]}
                      >
                        <InputNumber
                          className="fnb-input-number w-100"
                          placeholder={pageData.pricing.price.placeholder}
                          max={pageData.pricing.price.max}
                          min={pageData.pricing.price.min}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          addonAfter={currencyCode}
                          precision={currencyCode === currency.vnd ? 0 : 2}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={3} className="icon-delete-price">
                  <a onClick={() => onDeletePrice(index)}>
                    <FnbDeleteIcon />
                  </a>
                </Col>
              </Row>
            </>
          );
        })}
        <Col span={24}>
          <div className="mt-2" hidden={isTopping}>
            {addPriceButton}
          </div>
        </Col>
      </>
    );

    return (
      <>
        {prices.length === 1 && singlePrice}
        {prices.length > 1 && multiplePrices}

        <Row className="w-100 mt-3" gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <h4 className="fnb-form-label mt-14">{pageData.tax}</h4>
            <Form.Item name={["product", "taxId"]}>
              <FnbSelectSingle
                placeholder={pageData.pleaseSelectTax}
                showSearch
                allowClear
                option={listAllTax?.map((b) => ({
                  id: b.id,
                  name: b?.formatName,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <h4 className="fnb-form-label mt-14">{pageData.unit.title}</h4>
            <Form.Item
              name={["product", "unitId"]}
              rules={[
                {
                  required: true,
                  message: pageData.unit.pleaseSelectUnit,
                },
              ]}
            >
              <SelectEditComponent
                getPopupContainer={(trigger) => trigger.parentNode}
                EditComponent
                functions={selectNewItemFuncs}
                placeholder={pageData.unit.unitPlaceholder}
                pleaseEnterNam={pageData.unit.pleaseEnterNameUnit}
                nameExisted={pageData.unit.unitNameExisted}
                btnAddNew={pageData.btnAddNew}
                listOption={units}
                onChangeOption={onChangeOption}
                onNameChange={onNameChange}
                addNewItem={addNewUnit}
                isNameExisted={isUnitNameExisted}
                name={nameUnit}
                isEditProduct={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  //form item option
  const renderOptions = () => {
    return (
      <>
        <Row className="mt-24">
          <Col span={24}>
            <FnbSelectSingle
              placeholder={pageData.optionInformation.selectOption}
              showSearch
              option={options?.map((b) => ({
                id: b.id,
                name: b.name,
              }))}
              optionFilterProp="children"
              value={defaultValueNull}
              onChange={(value) => onSelectOption(value)}
            />
          </Col>
        </Row>
        <Row className="mt-3" gutter={[0, 16]}>
          {selectedOptions.map((option, index) => {
            option.optionLevel.sort((a, b) => b.isSetDefault - a.isSetDefault);
            return (
              <>
                <Col span={20}>
                  <Paragraph
                    className="option-name"
                    placement="top"
                    ellipsis={{ tooltip: option.name }}
                    color="#50429B"
                  >
                    <Text strong className="option-name-text">
                      {option.name}
                    </Text>
                  </Paragraph>
                </Col>
                <Col span={4}>
                  <a className="mr-3 float-right">
                    <a onClick={() => onDeleteSelectedOption(option.id)} className="icon-delete-option">
                      <FnbDeleteIcon />
                    </a>
                  </a>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={24}>
                      <div id={"container-options-" + index} className="w-100 container-options">
                        {option.optionLevel.map((item) => {
                          let htmlResult = (
                            <>
                              <Tag
                                key={item.id}
                                className={
                                  item.isSetDefault === true
                                    ? `option-default option--border`
                                    : `option-value option--border`
                                }
                              >
                                <Paragraph id={item.id} ellipsis={{ tooltip: item.name }}>
                                  <span>{item.name}</span>
                                </Paragraph>
                              </Tag>
                            </>
                          );

                          return htmlResult;
                        })}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </>
            );
          })}
        </Row>
      </>
    );
  };

  //form item Inventory Trackings
  const renderInventoryTrackings = () => {
    return (
      <>
        <Row>
          <h4 className="fnb-form-label">{pageData.inventoryTracking.byMaterial}</h4>
          <Col span={24}>
            <FnbSelectMaterialComponent
              t={t}
              materialList={materials}
              onChangeEvent={(value) =>
                onSelectMaterial(value, tableMaterialSettings.page, tableMaterialSettings.pageSize)
              }
            />
          </Col>
        </Row>
      </>
    );
  };

  const onSelectMaterial = (key, pageNumber, pageSize) => {
    setPageNumber(pageNumber);
    const restMaterials = materials.filter((o) => o.id !== key);
    setMaterials(restMaterials);
    const selectedMaterials = initDataMaterials.find((o) => o.id === key);
    const newRow = {
      key: selectedMaterials.id,
      material: selectedMaterials.name,
      quantity: 0,
      unit: selectedMaterials.unitName,
      unitCost: selectedMaterials.costPerUnit,
      cost: 0,
    };
    setDataSelectedMaterial([...dataSelectedMaterial, newRow]);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > dataSelectedMaterial.length) {
      numberRecordCurrent = dataSelectedMaterial.length + 1;
    }
    setNumberRecordCurrent(numberRecordCurrent);

    if (dataSelectedMaterial.length <= 20) {
      setShowPaging(false);
    } else {
      setShowPaging(true);
    }

    ///data inventory table
    dataInventoryTable?.map((inventory) => {
      let arrNew = [];
      let newRow = {
        key: selectedMaterials.id,
        material: selectedMaterials.name,
        quantity: 0,
        unit: selectedMaterials.unitName,
        unitCost: selectedMaterials.costPerUnit,
        cost: 0,
      };
      inventory.listProductPriceMaterial?.map((productPriceMaterial) => {
        let newProductPriceMaterial = {
          key: productPriceMaterial?.key,
          material: productPriceMaterial?.material,
          quantity: productPriceMaterial?.quantity,
          unit: productPriceMaterial?.unit,
          unitCost: productPriceMaterial?.unitCost,
          cost: productPriceMaterial?.cost,
        };
        arrNew.push(newProductPriceMaterial);
      });
      arrNew.push(newRow);
      inventory.listProductPriceMaterial = arrNew;
    });
    setDefaultValueNull(null);
    setIsSelectedMaterial(true);
  };

  const getFormSelectedMaterials = () => {
    let formValue = form.getFieldsValue();
    return (
      <>
        {prices?.length > 1 && dataInventoryTable.length > 0 && (
          <Row>
            <Tabs onChange={getTotalCost} className="w-100 inventory-tab" id="tab-inventory">
              {dataInventoryTable.map((p, index) => {
                return (
                  <TabPane tab={p?.priceName} key={index} forceRender={true}>
                    <Row>
                      <Col span={24}>
                        <FnbTable
                          columns={columnsMaterial(index)}
                          dataSource={p.listProductPriceMaterial}
                          pageSize={tableMaterialSettings.pageSize}
                          pageNumber={pageNumber}
                          total={dataInventoryTable[0]?.listProductPriceMaterial.length}
                          numberRecordCurrent={numberRecordCurrent}
                          showPaging={!showPaging}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </Row>
        )}
        {prices?.length === 1 && dataInventoryTable.length > 0 && (
          <>
            <br />
            <Row className="w-100">
              <Col span={24}>
                <FnbTable
                  dataSource={dataInventoryTable[0]?.listProductPriceMaterial}
                  columns={columnsMaterial(0)}
                  pageSize={tableMaterialSettings.pageSize}
                  pageNumber={pageNumber}
                  total={dataInventoryTable[0]?.listProductPriceMaterial.length}
                  numberRecordCurrent={numberRecordCurrent}
                  showPaging={!showPaging}
                />
              </Col>
            </Row>
          </>
        )}
        {prices?.length > 0 && dataInventoryTable.length > 0 && (
          <>
            <br />
            <Row className="float-right">
              <Text strong>{pageData.inventoryTracking.totalCost}: </Text>
              <Text col className="ml-3 mr-1" type="danger" strong>
                {totalCost
                  ? formatCurrencyWithoutSuffix(roundNumber(totalCost, 2))
                  : formatCurrencyWithoutSuffix(roundNumber(totalCostInitial, 2))}
              </Text>
              <Text>/ {units.find((u) => u.id === unitId)?.name}</Text>
            </Row>
          </>
        )}
      </>
    );
  };

  const getTotalCost = (index) => {
    let sum = 0;
    dataInventoryTable[index]?.listProductPriceMaterial?.map((material, index) => {
      sum = sum + material.quantity * material.unitCost;
    });
    setTotalCost(sum);
  };

  const columnsMaterial = (indexPriceName) => {
    let columns = [
      {
        title: pageData.inventoryTracking.table.materialName,
        dataIndex: "material",
        align: "center",
        width: "20%",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "materialId"]}
            className="form-item-material"
          >
            <p>{record.material}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.quantity,
        dataIndex: "quantity",
        width: "20%",
        align: "center",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "quantity"]}
            rules={[
              {
                type: "number",
                min: 1,
                message: pageData.inventoryTracking.quantityMoreThanZero,
              },
              {
                required: true,
                message: pageData.inventoryTracking.pleaseEnterQuantity,
              },
            ]}
            className="form-item-quantity"
            initialValue={record?.quantity}
          >
            <InputNumber
              onChange={(value) => onChangeQuantity(record, indexPriceName, index, value)}
              style={{ width: "100%" }}
              className="fnb-input input-quantity"
              max={pageData.pricing.price.max}
              min={pageData.pricing.price.min}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              defaultValue={record?.quantity}
            />
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.unit,
        dataIndex: "unit",
        width: "20%",
        align: "center",
        render: (_, record, index) => <p>{record?.unit}</p>,
      },
      {
        title: `${pageData.inventoryTracking.table.cost} (${getCurrency()})`,
        dataIndex: "unitCost",
        align: "center",
        width: "20%",
        align: "center",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "unitCost"]}
            className="form-item-unit-cost"
          >
            <p>{formatCurrencyWithoutSuffix(record?.unitCost)}</p>
          </Form.Item>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.totalCost} (${getCurrency()})`,
        dataIndex: "cost",
        align: "center",
        width: "15%",
        render: (_, record, index) => {
          let formValue = form.getFieldsValue();
          let { product } = formValue;
          const item = product.materials?.priceName[indexPriceName]?.material[index];
          return item && item?.quantity > 0 && item?.unitCost > 0 ? (
            <p>{formatCurrencyWithoutSuffix(roundNumber(item?.quantity * item?.unitCost, 2))}</p>
          ) : (
            <p>{formatCurrencyWithoutSuffix(roundNumber(record?.quantity * record?.unitCost, 2))}</p>
          );
        },
      },
      {
        title: pageData.inventoryTracking.table.action,
        dataIndex: "action",
        align: "center",
        width: "5%",
        render: (_, record) => (
          <a onClick={() => onRemoveItemMaterial(record.key, indexPriceName)} className="icon-delete-price">
            <FnbDeleteIcon />
          </a>
        ),
      },
    ];
    return columns;
  };

  //Hanlde change quantity and get total cost
  const onChangeQuantity = (record, indexPriceName, index, value) => {
    dataInventoryTable[indexPriceName].listProductPriceMaterial[index].materialId = record.key;
    dataInventoryTable[indexPriceName].listProductPriceMaterial[index].unitCost = record.unitCost;
    dataInventoryTable[indexPriceName].listProductPriceMaterial[index].quantity = value;
    getTotalCost(indexPriceName);
  };

  const onRemoveItemMaterial = (key, index) => {
    dataInventoryTable?.map((inventory) => {
      let arrNew = [];
      inventory.listProductPriceMaterial?.map((productPriceMaterial) => {
        if (productPriceMaterial.key !== key) {
          let newProductPriceMaterial = {
            key: productPriceMaterial?.key,
            material: productPriceMaterial?.material,
            quantity: productPriceMaterial?.quantity,
            unit: productPriceMaterial?.unit,
            unitCost: productPriceMaterial?.unitCost,
            cost: productPriceMaterial?.cost,
          };
          arrNew.push(newProductPriceMaterial);
        }
      });
      inventory.listProductPriceMaterial = arrNew;
    });
    let restMaterials = dataSelectedMaterial.filter((o) => o.key !== key);
    setDataSelectedMaterial(restMaterials);

    let initDataMaterial = initDataMaterials.find((o) => o.id === key);
    materials.push(initDataMaterial);
    getTotalCost(index);

    let formValue = form.getFieldsValue();
    let { product } = formValue;

    product.materials.priceName?.map((item) => {
      item.material.splice(index, 1);
      return item;
    });

    form.setFieldsValue(formValue);
  };

  const handleDeleteItem = async (productId, productName) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      message.success(pageData.productDeleteSuccess);
      history.push("/product-management");
    } else {
      message.error(pageData.productDeleteFail);
    }
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
    setDisableCreateButton(false);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onChangePlatform = (values) => {
    setValuePlatforms(values);
  };

  const formCreateProductSubmitCapture = () => {
    let tabControl = document.getElementById("tab-inventory");
    if (tabControl) {
      let tabItem = tabControl.querySelectorAll(".ant-tabs-tab");
      tabItem?.forEach((itemControl, index) => {
        let breakException = {};
        let tabInventoryContent = document.getElementById(`tab-inventory-panel-${index}`);
        if (tabInventoryContent) {
          let errorControl = tabInventoryContent.querySelectorAll(".ant-form-item-explain-error");
          if (errorControl.length > 0) {
            let activeTab = document.getElementById(`tab-inventory-tab-${index}`);
            activeTab.click();
            throw breakException;
          }
        }
      });
    }
  };

  const checkCurrencyVND = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const onDeleteItem = (productId) => {
    productDataService.getAllOrderNotCompletedByProductIdAsync(productId).then((res) => {
      if (res.orderOpenStatus.isOpenOrder) {
        setTitleModal(pageData.notificationTitle);
      } else {
        setTitleModal(pageData.confirmDelete);
      }
      setOrderOpenStatus(res.orderOpenStatus);
      setIsModalVisible(true);
    });
  };

  const renderModalContent = () => {
    return (
      <Form>
        <div className="modal-product-topping">
          <Row className="modal-product-topping-search" style={{ display: "contents" }}>
            <Col span={24}>
              <Select
                value={null}
                placeholder={pageData.selectToppings}
                showSearch
                className="fnb-select-multiple-product"
                dropdownClassName="fnb-select-multiple-product-dropdown"
                suffixIcon=""
                onChange={(key) => onSelectProductTopping(key)}
                listHeight={480}
                filterOption={(input, option) => {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {productToppings?.map((item) => (
                  <Select.Option key={item?.id} value={item?.id} label={item?.name}>
                    <div className="product-option-box">
                      <div className="img-box">
                        {item?.thumbnail ? <Image preview={false} src={item?.thumbnail} /> : <ImageMaterialDefault />}
                      </div>
                      <span className="product-name">{item?.name}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="modal-product-topping-table">
            <Col span={24}>
              <FnbTable
                className="selected-product-topping-modal"
                dataSource={productToppingSelected}
                columns={productToppingSelectedColumnTable()}
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const onSelectProductTopping = (id) => {
    const selectedTopping = allproductToppings.find((item) => item?.id === id);
    setProductToppingSelected([...productToppingSelected, selectedTopping]);
    setProductToppings(productToppings.filter((item) => item?.id !== id));
  };

  const onRemoveProductTopping = (id) => {
    const removedTopping = allproductToppings.find((item) => item?.id === id);
    setProductToppingSelected(productToppingSelected.filter((item) => item?.id !== id));
    setProductToppings([...productToppings, removedTopping]);
  };

  const productToppingSelectedColumnTable = () => {
    const column = [
      {
        title: pageData.table.name,
        dataIndex: "thumbnail",
        render: (_, record) => {
          return <Image preview={false} src={record.thumbnail ?? "error"} fallback={productDefaultImage} />;
        },
      },
      {
        title: " ",
        width: "80%",
        dataIndex: "name",
        align: "left",
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "20%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              <a onClick={() => onRemoveProductTopping(record?.id)}>
                <div className="fnb-table-action-icon">
                  <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                    <TrashFill className="icon-svg-hover" />
                  </Tooltip>
                </div>
              </a>
            </>
          );
        },
      },
    ];

    return column;
  };

  const handleCancel = () => {
    if (productToppingIds?.length > 0) {
      const toppingNotSelected = allproductToppings?.filter((item) => !productToppingIds?.includes(item.id));
      setProductToppings(toppingNotSelected);

      const toppingSelected = allproductToppings?.filter((item) => productToppingIds?.includes(item.id));
      setProductToppingSelected(toppingSelected);
    } else {
      setProductToppings(allproductToppings);
      setProductToppingSelected([]);
    }
    setIsVisibaleProductToppingModal(false);
  };

  const handleOK = () => {
    setIsVisibaleProductToppingModal(false);
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        onFinish={onSubmitForm}
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onSubmitCapture={() => formCreateProductSubmitCapture()}
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={titleName} />
            </p>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12} className="fnb-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disableCreateButton}
                      icon={<PlusOutlined className="icon-btn-add-option" />}
                      className="btn-create-form"
                    >
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_PRODUCT,
                },
                {
                  action: (
                    <a onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </a>
                  ),
                  permission: null,
                },
                {
                  action: (
                    <a
                      className={activate === "productManagement.activate" ? "action-activate" : "action-deactivate"}
                      onClick={() => onChangeStatus()}
                    >
                      {t(activate)}
                    </a>
                  ),
                  permission: PermissionKeys.ACTIVATE_PRODUCT,
                },
                // {
                //   action: (
                //     <a
                //       className="action-delete"
                //       onClick={() => onDeleteItem(match?.params?.id)}
                //     >
                //       {pageData.btnDelete}
                //     </a>
                //   ),
                //   permission: null,
                // },
              ]}
            />
          </Col>
        </Row>
        <br />

        <div className="col-input-full-width">
          <Row className="grid-container">
            <Col span={24} className="left-create-product">
              <Card className="w-100 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="fnb-form-label mt-20">
                      {pageData.generalInformation.name.label}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={["product", "name"]}
                      rules={[
                        {
                          required: pageData.generalInformation.name.required,
                          message: pageData.generalInformation.name.validateMessage,
                        },
                      ]}
                    >
                      <Input
                        className="fnb-input"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                      />
                    </Form.Item>

                    <h4 className="fnb-form-label mt-32">{pageData.generalInformation.description.label}</h4>
                    <Form.Item name={["product", "description"]} rules={[]}>
                      <TextArea
                        className="fnb-text-area"
                        maxLength={pageData.generalInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Checkbox className="mt-20" onChange={onTopicChange} checked={isTopping}>
                        {pageData.topping}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item className={`${isTopping === true ? "d-none" : ""}`}>
                      <Row>
                        <Col span={24}>
                          <Row>
                            <Col lg={6} md={6} sm={24}>
                              <Button
                                type="primary"
                                disabled={disableCreateButton}
                                icon={<IconBtnAdd className="icon-btn-add-topping" />}
                                className="btn-add-topping"
                                onClick={() => setIsVisibaleProductToppingModal(!isVisibaleProductToppingModal)}
                              >
                                {pageData.addTopping}
                              </Button>
                            </Col>
                            {productToppingSelected.length > 0 && (
                              <Col lg={18} md={18} sm={24} className="topping-text">
                                <Row onClick={() => setIsVisibaleProductToppingModal(!isVisibaleProductToppingModal)}>
                                  <span className="topping-selected-count">{productToppingSelected.length}</span>
                                  <span className="topping-selected-text">{pageData.toppingSelected}</span>
                                </Row>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <br />
            </Col>

            <Col span={24} className="price-product">
              <Card className="w-100 mt-1 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.pricing.title}</h4>
                    {renderPrices()}
                  </Col>
                </Row>
              </Card>
              <br />
              <Card className="w-100 mt-1 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.unit.recipe}</h4>
                    {renderInventoryTrackings()}
                  </Col>
                  <Col span={24}>
                    {getFormSelectedMaterials()}
                    {!isSelectedMaterial && (
                      <Text type="danger">{pageData.inventoryTracking.pleaseSelectMaterial}</Text>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 fnb-card h-auto">
                    <h4 className="title-group">{pageData.media.title}</h4>
                    <FnbImageSelectComponent ref={fnbImageSelectRef} />
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br hidden={isTopping} />
                  <Card className={`w-100 mt-1 fnb-card h-auto ${isTopping === true ? "hidden" : ""}`}>
                    <h4 className="title-group">{pageData.productCategory.label}</h4>
                    <Form.Item name={["product", "productCategoryId"]}>
                      <FnbSelectSingle
                        placeholder={pageData.productCategory.placeholder}
                        showSearch
                        option={listAllProductCategory?.map((b) => ({
                          id: b.id,
                          name: b.name,
                        }))}
                      />
                    </Form.Item>
                    <br />
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br hidden={isTopping} />
                  <Card className={`w-100 mt-1 fnb-card h-auto ${isTopping === true ? "hidden" : ""}`}>
                    <h4 className="title-group">{pageData.optionInformation.title}</h4>
                    {renderOptions()}
                  </Card>
                </Col>
              </Row>

              <Row hidden={listPlatforms.length > 0 ? "" : "hidden"}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br />
                  <Card className="w-100 mt-1 fnb-card platform-card">
                    <h4 className="title-platform">{pageData.platform.title}</h4>
                    <div className="platform-group">
                      <Checkbox.Group onChange={onChangePlatform} value={valuePlatforms}>
                        {listPlatforms?.map((p, index) => {
                          return (
                            <div className={index === 0 ? "mt-1" : "mt-10"}>
                              <Checkbox value={p.id}>{p.name}</Checkbox>
                            </div>
                          );
                        })}
                      </Checkbox.Group>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
      <FnbModal
        width={"800px"}
        title={pageData.addTopping}
        handleCancel={handleCancel}
        onOk={handleOK}
        cancelText={pageData.btnCancel}
        okText={pageData.btnAdd}
        visible={isVisibaleProductToppingModal}
        content={renderModalContent()}
      ></FnbModal>
      <DeleteProductComponent
        isModalVisible={isModalVisible}
        orderOpenStatus={orderOpenStatus}
        titleModal={titleModal}
        handleCancel={() => setIsModalVisible(false)}
        onDelete={handleDeleteItem}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        className="d-none"
        isChangeForm={isChangeForm}
      />
      <EditProductInCombo
        isModalVisible={isModalComboVisible}
        combos={comboInfos}
        titleModal={pageData.notificationTitle}
        handleCancel={() => setIsModalComboVisible(false)}
        onDelete={() => {}}
      />
    </>
  );
}
