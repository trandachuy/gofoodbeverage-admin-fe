import { Button, Checkbox, Col, Form, Image, message, Row, Tabs, Typography } from "antd";
import productImageDefault from "assets/images/product-img-default.png";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { ProductStatus } from "constants/product-status.constants";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatCurrency, formatCurrencyWithoutSuffix, formatTextNumber, getCurrency } from "utils/helpers";
import productDefaultImage from "../../../assets/images/combo-default-img.jpg";
import DeleteProductComponent from "../product-management/components/delete-product.component";
import "./index.scss";

const { TabPane } = Tabs;
const { Text } = Typography;

export default function ProductDetailPage(props) {
  const { t, match, productDataService } = props;
  const history = useHistory();

  const [product, setProduct] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [activate, setActivate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productId, setProductId] = useState(null);
  const [titleModal, setTitleModal] = useState();
  const [orderOpenStatus, setOrderOpenStatus] = useState({});
  const [valuePlatforms, setValuePlatforms] = useState([]);
  const [listPlatforms, setListPlatforms] = useState([]);
  const [productToppings, setProductToppings] = useState([]);
  const [isVisibaleProductToppingModal, setIsVisibaleProductToppingModal] = useState(false);

  const pageData = {
    btnDelete: t("button.delete"),
    btnEdit: t("button.edit"),
    btnLeave: t("button.leave"),
    action: t("button.action"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    productDeleteSuccess: t("productManagement.productDeleteSuccess"),
    productDeleteFail: t("productManagement.productDeleteFail"),
    generalInformation: {
      title: t("productManagement.generalInformation.title"),
      name: {
        label: t("productManagement.generalInformation.name"),
      },
      description: {
        label: t("productManagement.generalInformation.description"),
      },
    },
    pricing: {
      title: t("productManagement.pricing.title"),
      price: t("productManagement.pricing.price"),
    },
    unit: {
      title: t("productManagement.unit.title"),
      recipe: t("productManagement.unit.recipe"),
    },
    optionInformation: {
      title: t("option.title"),
    },
    inventoryTracking: {
      title: t("inventoryTracking.title"),
      byMaterial: t("inventoryTracking.byMaterial"),
      totalCost: t("table.totalCost"),
      pleaseEnterQuantity: t("inventoryTracking.pleaseEnterQuantity"),
      table: {
        materialName: t("table.materialName"),
        quantity: t("table.quantity"),
        unit: t("table.unit"),
        cost: t("table.cost"),
        totalCost: t("table.totalCost"),
      },
    },
    productCategory: {
      label: t("productManagement.category.title"),
    },
    tax: {
      title: t("productManagement.details.tax"),
    },
    topping: t("productManagement.topping"),
    media: "MEDIA",
    notificationTitle: t("form.notificationTitle"),
    platform: {
      title: t("platform.title"),
    },
    addTopping: t("productManagement.addTopping"),
    toppingSelected: t("productManagement.toppingSelected"),
    table: {
      name: t("productManagement.table.name"),
    },
    selectedTopping: t("productManagement.selectedTopping"),
  };

  useEffect(async () => {
    getInitData();
  }, []);

  const getInitData = async () => {
    let response = await productDataService.getProductByIdAsync(match?.params?.id);
    setProductId(match?.params?.id);
    setProduct(response.product);

    if (response?.product?.productToppingIds?.length > 0) {
      const selectedProductTopping = response?.productToppings?.filter((item) =>
        response?.product?.productToppingIds?.includes(item.id)
      );
      setProductToppings(selectedProductTopping);
    }

    if (response?.product?.statusId === ProductStatus.Activate) {
      setActivate("productManagement.deactivate");
    } else {
      setActivate("productManagement.activate");
    }
    if (response?.product?.platforms) {
      setListPlatforms(response?.product?.platforms);
      setValuePlatforms(response?.product?.listPlatformIds);
    }
  };

  const onChangeStatus = async () => {
    var res = await productDataService.changeStatusAsync(match?.params?.id);
    if (res) {
      getInitData();
    }
  };

  const getFormSelectedMaterials = () => {
    return (
      <>
        <Row className="mt-3 mb-3">
          {product?.productPrices?.length > 1 && product?.productInventoryData?.length > 0 && (
            <Tabs type="card" className="w-100" onChange={getTotalCost}>
              {product?.productInventoryData?.map((p, index) => {
                return (
                  <TabPane tab={<Text className="material-tabs">{p?.priceName}</Text>} key={index}>
                    <Row className="w-100">
                      <Col span={24}>
                        <FnbTable dataSource={p.listProductPriceMaterial} columns={columnsMaterial(index)} />
                      </Col>
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          )}
          {product?.productPrices?.length === 1 && product?.productInventoryData?.length > 0 && (
            <>
              <Row className="w-100 mt-2">
                <Col span={24}>
                  <FnbTable
                    dataSource={product?.productInventoryData[0]?.listProductPriceMaterial}
                    columns={columnsMaterial(0)}
                  />
                </Col>
              </Row>
            </>
          )}
        </Row>
        {product?.productPrices?.length > 0 && product?.productInventoryData?.length > 0 && (
          <Row className="float-right">
            <Text className="total-material-price text-total">{pageData.inventoryTracking.totalCost}: </Text>
            <Text col className="total-material-price text-cost">
              {totalCost
                ? formatTextNumber(totalCost.toFixed())
                : formatTextNumber(product?.productInventoryData[0]?.totalCost.toFixed())}
            </Text>
            <Text className="total-material-price text-unit-name">/ {product?.unit.name}</Text>
          </Row>
        )}
      </>
    );
  };

  const getTotalCost = (index) => {
    let sum = 0;
    product.productInventoryData[index]?.listProductPriceMaterial?.map((material) => {
      sum = sum + material.quantity * material.unitCost;
    });
    setTotalCost(sum);
  };

  const columnsMaterial = (indexPriceName) => {
    let columns = [
      {
        title: pageData.inventoryTracking.table.materialName,
        dataIndex: "material",
        width: "30%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "materialId"]}>
            <p>{record.material}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.quantity,
        dataIndex: "quantity",
        width: "15%",
        align: "right",
        editable: true,
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "quantity"]}>
            <p>{formatCurrencyWithoutSuffix(record.quantity)}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.unit,
        dataIndex: "unit",
        width: "10%",
        align: "center",
        render: (value) => (
          <div className="ant-row ant-form-item">
            <p>{value}</p>
          </div>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.cost} (${getCurrency()})`,
        dataIndex: "unitCost",
        align: "right",
        width: "20%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "unitCost"]}>
            <p>{formatCurrencyWithoutSuffix(record.unitCost)}</p>
          </Form.Item>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.totalCost} (${getCurrency()})`,
        dataIndex: "cost",
        align: "right",
        width: "25%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "cost"]}>
            <p>{formatCurrencyWithoutSuffix(record.cost)}</p>
          </Form.Item>
        ),
      },
    ];
    return columns;
  };

  const renderOptions = () => {
    let productOptions = [];
    product?.options?.map((option) => {
      let selectOption = product?.listOptionIds?.find((item) => item === option?.id);
      if (selectOption) {
        productOptions.push(option);
      }
    });

    return (
      <div className="option-item">
        {productOptions.map((item) => (
          <>
            <div className="product-detail-div">
              <Text className="text-name">{item.name}</Text>
            </div>
            <div className="product-detail-div div-item-option">
              {item?.optionLevel.map((itemOptLevel) => {
                return (
                  <div className={`option-level ${itemOptLevel?.isSetDefault && "level-default"}`}>
                    <Text className={`text-option-level ${itemOptLevel?.isSetDefault && "text-option-level-default"}`}>
                      {itemOptLevel?.name}
                    </Text>
                  </div>
                );
              })}
            </div>
          </>
        ))}
      </div>
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const handleDeleteItem = async (id) => {
    var res = await productDataService.deleteProductByIdAsync(id);
    if (res) {
      message.success(pageData.productDeleteSuccess);
      history.push("/product-management");
    } else {
      message.error(pageData.productDeleteFail);
    }
  };

  // const onDeleteItem = (productId) => {
  //   productDataService.getAllOrderNotCompletedByProductIdAsync(productId).then((res) => {
  //     if (res.orderOpenStatus.isOpenOrder) {
  //       setTitleModal(pageData.notificationTitle);
  //     } else {
  //       setTitleModal(pageData.confirmDelete);
  //     }
  //     setOrderOpenStatus(res.orderOpenStatus);
  //     setIsModalVisible(true);
  //   });
  // };

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
    ];

    return column;
  };

  const renderModalContent = () => {
    return (
      <Form>
        <div className="modal-product-topping">
          <Row className="modal-product-topping-table-detail">
            <Col span={24}>
              <FnbTable
                className="selected-product-topping-modal"
                dataSource={productToppings}
                columns={productToppingSelectedColumnTable()}
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const handleCancelToppingModal = () => {
    setIsVisibaleProductToppingModal(false);
  };

  return (
    <>
      <Form layout="vertical" autoComplete="off">
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={product?.name} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      onClick={() => history.push(`/product/edit/${productId}`)}
                      className="button-edit"
                    >
                      {pageData.btnEdit}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_PRODUCT,
                },
                {
                  action: (
                    <a onClick={() => history.push(`/product-management`)} className="action-cancel">
                      {pageData.btnLeave}
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
                //       onClick={() => onDeleteItem(product?.id)}
                //     >
                //       {pageData.btnDelete}
                //     </a>
                //   ),
                //   permission: null,
                // },
              ]}
            />
            {
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(product?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                visible={isModalVisible}
                buttonType={""}
                permission={PermissionKeys.DELETE_PRODUCT}
                onOk={() => handleDeleteItem(product?.id)}
                onCancel={handleCancel}
              />
            }
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="product-container">
          <div className="product-form-left">
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.generalInformation.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.name.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.name}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.description.label}</Text>
              </div>
              <div className="div-text">
                <Text className="text-name">{product?.description}</Text>
              </div>
              {productToppings.length > 0 && (
                <div className="div-text-product-topping">
                  <Row onClick={() => setIsVisibaleProductToppingModal(!isVisibaleProductToppingModal)}>
                    <span className="topping-selected-count">{productToppings.length}</span>
                    <span className="topping-selected-text">{pageData.toppingSelected}</span>
                  </Row>
                </div>
              )}
            </div>
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.pricing.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.pricing.price}</Text>
              </div>
              <div className="product-detail-div">
                {product?.productPrices?.length > 1 &&
                  product?.productPrices?.map((item, index) => (
                    <Row key={index}>
                      <Col span={6}>
                        <Text className="text-name">{item?.priceName}</Text>
                      </Col>
                      <Col span={18}>
                        <Text className="text-name">{formatCurrency(item?.priceValue)}</Text>
                      </Col>
                    </Row>
                  ))}
                {product?.productPrices?.length === 1 && (
                  <Text className="text-name">{formatCurrency(product?.productPrices[0]?.priceValue)}</Text>
                )}
              </div>
              <Row>
                <Col span={12}>
                  <div className="product-detail-div">
                    <Text className="text-item">{pageData.tax.title}</Text>
                  </div>
                  <div className="div-text">
                    <Text className="text-name">
                      {product?.tax?.name && `${product?.tax?.name} (${product?.tax?.percentage} %)`}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="product-detail-div">
                    <Text className="text-item">{pageData.unit.title}</Text>
                  </div>
                  <div className="div-text">
                    <Text className="text-name">{product?.unit?.name}</Text>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.unit.recipe}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{pageData.inventoryTracking.byMaterial}</Text>
              </div>
              <div className="dev-form-material">{getFormSelectedMaterials()}</div>
            </div>
          </div>
          <div className="product-form-right">
            <div className="form-image padding-t-l-b">
              <Text className="text-title media">{pageData.media}</Text>
              <Image width={176} src={product?.thumbnail ?? "error"} fallback={productImageDefault} />
            </div>
            {!product?.isTopping && (
              <>
                <div className="form-category padding-t-l-b">
                  <div className="div-title">
                    <Text className="text-title">{pageData.productCategory.label}</Text>
                  </div>
                  <Text className="text-name">{product?.productCategoryName}</Text>
                </div>
                <div className="form-option padding-t-l-b">
                  <Text className="text-title">{pageData.optionInformation.title}</Text>
                  {renderOptions()}
                </div>
                <div className="form-option padding-t-l-b">
                  <Text className="text-title">{pageData.platform.title}</Text>
                  <div className="platform-group">
                    <Checkbox.Group value={valuePlatforms} disabled>
                      {listPlatforms?.map((p, index) => {
                        return (
                          <div key={index} className="platform-item">
                            <Checkbox value={p.id}>{p.name}</Checkbox>
                          </div>
                        );
                      })}
                    </Checkbox.Group>
                  </div>
                </div>
              </>
            )}
          </div>
        </Row>
      </Form>
      <FnbModal
        width={"800px"}
        title={pageData.selectedTopping}
        visible={isVisibaleProductToppingModal}
        handleCancel={handleCancelToppingModal}
        footer={null}
        content={renderModalContent()}
      ></FnbModal>
      <DeleteProductComponent
        isModalVisible={isModalVisible}
        orderOpenStatus={orderOpenStatus}
        titleModal={titleModal}
        handleCancel={() => setIsModalVisible(false)}
        onDelete={handleDeleteItem}
      />
    </>
  );
}
