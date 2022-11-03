import { Card, Checkbox, Col, Form, Image, Input, InputNumber, message, Row, Space, Tooltip } from "antd";
import { arrayMoveImmutable } from "array-move";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectMultipleProduct } from "components/fnb-select-multiple-product/fnb-select-multiple-product";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import PageTitle from "components/page-title";
import { ExclamationIcon, PolygonIcon, TrashFill } from "constants/icons.constants";
import { images } from "constants/images.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import branchDataService from "data-services/branch/branch-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import productDataService from "data-services/product/product-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { getValidationMessages } from "utils/helpers";

import "../index.scss";

export default function EditProductCategoryPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [dataSelectedProducts, setDataSelectedProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchOptionValue, setBranchOptionValue] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [disableAllBranches, setDisableAllBranches] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [title, setTitle] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  const pageData = {
    title: t("productCategory.updateProductCategory"),
    goBack: t("productCategory.goBack"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnUpdate: t("button.update"),
    btnDelete: t("button.delete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    generalInformation: {
      title: t("productCategory.generalInformation.title"),
      name: {
        label: t("productCategory.generalInformation.name"),
        placeholder: t("productCategory.generalInformation.namePlaceholder"),
        required: true,
        maxLength: 100,
        validateMessage: t("productCategory.generalInformation.nameValidateMessage"),
      },
    },
    branch: {
      title: t("productCategory.branch.title"),
      all: t("productCategory.branch.all"),

      displayAll: t("productCategory.branch.displayAll"),
      displaySpecific: t("productCategory.branch.displaySpecific"),
      placeholder: t("productCategory.branch.selectBranchPlaceholder"),
      validateMessage: t("productCategory.branch.selectBranchValidateMessage"),
    },
    product: {
      title: t("productCategory.product.title"),
      placeholder: t("productCategory.product.placeholder"),
    },
    priority: {
      title: t("productCategory.priority.title"),
      placeholder: t("productCategory.priority.placeholder"),
      validateMessage: t("productCategory.priority.validateMessage"),
      tooltip: t("productCategory.priority.tooltip"),
    },
    productCategoryNameExisted: t("productCategory.productNameExisted"),
    productCategoryAddedSuccess: t("productCategory.productCategoryAddedSuccess"),
    productCategoryUpdateSuccess: t("productCategory.productCategoryUpdateSuccess"),
    leaveWarningMessage: t("productCategory.leaveWarningMessage"),
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    productCategoryDeleteSuccess: t("productCategory.productCategoryDeleteSuccess"),
    productCategoryDeleteFail: t("productCategory.productCategoryDeleteFail"),
  };

  useEffect(() => {
    getProducts();
    getBranches();
    getEditData();
  }, []);

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history?.push(`/product/product-category`);
    }, 100);
  };

  const getEditData = () => {
    const { productCategoryId } = match?.params;
    if (productCategoryId) {
      productCategoryDataService.getProductCategoryByIdAsync(productCategoryId).then((response) => {
        if (response) {
          const { productCategory } = response;
          /// Handle set data
          if (productCategory.products) {
            setDataSelectedProducts(productCategory.products);
            setProductCategoryName(productCategory.name);
            setProductCategoryId(productCategory.id);
          }
          setTitle(productCategory.name);
          setCurrentName(productCategory.name);
          setBranchOptionValue(productCategory.isDisplayAllBranches);
          setDisableAllBranches(productCategory.isDisplayAllBranches);

          form.setFieldsValue({
            id: productCategory.id,
            name: productCategory.name,
            priority: productCategory.priority,
            productIds: productCategory.products?.map((x) => x.id),
            storeBranchIds: productCategory.storeBranchIds,
          });
        }
      });
    }
  };

  const getProducts = () => {
    productDataService.getAllProductsAsync().then((res) => {
      if (res) {
        setProducts(res.products);
      }
    });
  };

  const getBranches = () => {
    branchDataService.getAllBranchsAsync().then((res) => {
      if (res) {
        setBranches(res.branchs);
      }
    });
  };

  const onChangeOption = (e) => {
    const isChecked = e.target.checked;
    setBranchOptionValue(isChecked);
    setDisableAllBranches(isChecked);
  };

  const onSelectProduct = (ids) => {
    const productIds = ids;
    let productList = [];
    productIds.forEach((productId, index) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const newProduct = { ...product, position: index + 1 };
        productList.push(newProduct);
      }
    });
    setDataSelectedProducts(productList);
  };

  const onDeleteSelectedProduct = (productId) => {
    let restProducts = dataSelectedProducts.filter((o) => o.id !== productId);
    restProducts = restProducts.map((product, index) => ({
      ...product,
      position: index + 1,
    }));
    setDataSelectedProducts(restProducts);

    ///Set form value
    let formValues = form.getFieldsValue();
    let { productIds } = formValues;
    productIds = productIds.filter((pid) => pid !== productId);
    form.setFieldsValue({ ...formValues, productIds });
  };

  const renderSelectBranch = () => {
    return (
      <>
        <h3 className="fnb-form-label branch-label">{pageData.branch.title}</h3>
        <div className="material-check-box-select-all-branch">
          <Checkbox onChange={(event) => onChangeOption(event)} checked={branchOptionValue}>
            {pageData.branch.all}
          </Checkbox>
        </div>
        <Form.Item
          hidden={disableAllBranches}
          name="storeBranchIds"
          className="last-item"
          rules={[
            {
              required: !disableAllBranches,
              message: pageData.branch.validateMessage,
            },
          ]}
        >
          <FnbSelectMultiple
            placeholder={pageData.branch.placeholder}
            className="w-100"
            allowClear
            option={branches?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
          ></FnbSelectMultiple>
        </Form.Item>
        <Form.Item hidden={!disableAllBranches} className="last-item">
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Form.Item>
      </>
    );
  };

  const renderSelectProduct = () => {
    return (
      <>
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.product.title}</h3>
          <Form.Item name="productIds">
            <FnbSelectMultipleProduct
              showSearch
              allowClear
              placeholder={pageData.product.placeholder}
              onChange={(value) => onSelectProduct(value)}
              className="w-100"
              option={products?.map((item) => ({
                id: item.id,
                name: item.name,
                thumbnail: item?.thumbnail,
              }))}
            ></FnbSelectMultipleProduct>
          </Form.Item>
        </Col>
      </>
    );
  };
  //#region Handle drag drop
  const DragHandle = sortableHandle(({ component }) => {
    return (
      <Row gutter={[16, 16]} className="all-scroll">
        <Col span={1}>
          <div className="drag-handle">
            <PolygonIcon />
          </div>
        </Col>
        <Col span={23}>{component()}</Col>
      </Row>
    );
  });

  const renderProductInfo = (product) => {
    return (
      <div className="product-info">
        <div className="product-position">
          <span>{product?.position}</span>
        </div>
        <div className="image-box">
          <Image src={product?.thumbnail ?? images.imgDefault} preview={false} />
        </div>
        <div className="product-name">
          <span>{product?.name}</span>
        </div>
      </div>
    );
  };

  const SortableItem = sortableElement(({ product }) => {
    return (
      <>
        <div className="selected-product-card mt-3">
          <Row>
            <Col span={22}>
              <DragHandle component={() => renderProductInfo(product)}></DragHandle>
            </Col>
            <Col span={2}>
              <div className="delete-icon">
                <TrashFill onClick={() => onDeleteSelectedProduct(product?.id)} />
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let arraySorted = arrayMoveImmutable(dataSelectedProducts, oldIndex, newIndex);
    arraySorted = arraySorted.map((product, index) => ({
      ...product,
      position: index + 1,
    }));
    setDataSelectedProducts(arraySorted);
  };

  const SortableList = sortableContainer(({ items }) => {
    return (
      <div className="selected-product-width mt-16">
        {items.map((value, index) => (
          <SortableItem key={value.id} index={index} product={value} />
        ))}
      </div>
    );
  });

  const renderSelectedProduct = () => {
    return <SortableList items={dataSelectedProducts} onSortEnd={onSortEnd} useDragHandle />;
  };
  //#endregion

  const onSubmitForm = () => {
    form.validateFields().then((values) => {
      const updateProductCategoryRequestModel = {
        id: values.id,
        name: values.name,
        isDisplayAllBranches: branchOptionValue,
        products: dataSelectedProducts,
        storeBranchIds: values.storeBranchIds,
        priority: values.priority,
      };

      productCategoryDataService
        .updateProductCategoryAsync(updateProductCategoryRequestModel)
        .then((response) => {
          if (response) {
            message.success(pageData.productCategoryUpdateSuccess);
            onCompleted();
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs));
        });
    });
  };

  const onChangeName = (e) => {
    const value = e.target.value;
    setTitle(value);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
    }
  };

  const onRemoveItem = async () => {
    var res = await productCategoryDataService.deleteProductCategoryByIdAsync(productCategoryId);
    if (res) {
      message.success(pageData.productCategoryDeleteSuccess);
      props?.history.push(`/product/product-category`);
    } else {
      message.error(pageData.productCategoryDeleteFail);
    }
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={title !== "" ? title : currentName} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Space className="float-right header-control">
              <ActionButtonGroup
                arrayButton={[
                  {
                    action: (
                      <FnbAddNewButton
                        type="primary"
                        text={pageData.btnUpdate}
                        onClick={() => onSubmitForm()}
                        className="float-right"
                      />
                    ),
                    permission: PermissionKeys.EDIT_PRODUCT_CATEGORY,
                  },
                  {
                    action: (
                      <button className="action-cancel" onClick={() => onCancel()}>
                        {pageData.btnCancel}
                      </button>
                    ),
                    permission: null,
                  },
                  {
                    action: (
                      <DeleteConfirmComponent
                        title={pageData.confirmDelete}
                        content={formatDeleteMessage(productCategoryName)}
                        okText={pageData.btnDelete}
                        cancelText={pageData.btnIgnore}
                        buttonText={pageData.btnDelete}
                        buttonType="TEXT"
                        permission={PermissionKeys.DELETE_PRODUCT_CATEGORY}
                        onOk={() => onRemoveItem("")}
                      />
                    ),
                    permission: PermissionKeys.DELETE_PRODUCT_CATEGORY,
                  },
                ]}
              />
            </Space>
          </Col>
        </Row>
        <Row>
          <div className="w-100">
            <Card className="fnb-card">
              <h2 className="label-information mt-16">{pageData.generalInformation.title}</h2>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <h3 className="fnb-form-label mt-16">
                    {pageData.generalInformation.name.label}
                    <span className="text-danger">*</span>
                  </h3>
                  <Form.Item
                    name={["name"]}
                    className="item-name"
                    rules={[
                      {
                        required: pageData.generalInformation.name.required,
                        message: pageData.generalInformation.name.validateMessage,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      placeholder={pageData.generalInformation.name.placeholder}
                      maxLength={pageData.generalInformation.name.maxLength}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={12} span={12}>
                  {renderSelectBranch()}
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} span={12}>
                  <div className="d-flex">
                    <h3 className="fnb-form-label mt-16">
                      {pageData.priority.title}
                      <span className="text-danger">*</span>
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.priority.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name={["priority"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.priority.validateMessage,
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={pageData.priority.placeholder}
                      className="fnb-input-number w-100"
                      min={1}
                      max={1000000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>{renderSelectProduct()}</Row>
              <Row>{renderSelectedProduct()}</Row>
            </Card>
          </div>
        </Row>
        <Form.Item name="id" hidden="true"></Form.Item>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
