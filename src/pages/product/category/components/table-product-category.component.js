import { Form, message, Row, Tooltip } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import productDataService from "data-services/product/product-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { executeAfter } from "utils/helpers";
import TableProduct from "./products-in-category.modal";

export default function TableProductCategory() {
  const history = useHistory();
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const permissions = useSelector((state) => state?.session?.permissions);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [selectedProductCategory, setSelectedProductCategory] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const pageData = {
    btnFilter: t("button.filter"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    productCategoryDeleteSuccess: t("productCategory.productCategoryDeleteSuccess"),
    productCategoryUpdateSuccess: t("productCategory.productCategoryUpdateSuccess"),
    productCategoryDeleteFail: t("productCategory.productCategoryDeleteFail"),
    table: {
      searchPlaceholder: t("productCategory.table.searchPlaceholder"),
      no: t("productCategory.table.no"),
      name: t("productCategory.table.name"),
      priority: t("productCategory.table.priority"),
      product: t("productCategory.table.product"),
      action: t("productManagement.table.action"),
    },
    product: {
      title: t("productCategory.product.title"),
      placeholder: t("productCategory.product.placeholder"),
    },
  };

  useEffect(() => {
    fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, "");
  }, []);

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const fetchDataTableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await productCategoryDataService.getProductCategoriesAsync(pageNumber, pageSize, keySearch);
    const data = response?.productCategories.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
  };

  const reload = async () => {
    await fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, "");
  };

  const mappingRecordToColumns = (item) => {
    return {
      key: item?.id,
      index: item?.no,
      id: item?.id,
      name: item?.name,
      priority: item?.priority,
      numberOfProduct: item?.numberOfProduct,
      products: item?.products,
    };
  };

  const onEditItem = (item) => {
    return history.push(`/product/product-category/edit/${item?.id}`);
  };

  const onRemoveItem = async (id) => {
    try {
      const res = await productCategoryDataService.deleteProductCategoryByIdAsync(id);
      if (res) {
        message.success(pageData.productCategoryDeleteSuccess);

        // Recount selected items after delete
        const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id);
        if (newSelectedRowKeys) {
          setSelectedRowKeys(newSelectedRowKeys);
        }
      } else {
        message.error(pageData.productCategoryDeleteFail);
      }
      await fetchDataTableAsync(currentPageNumber, tableConfigs.pageSize, "");
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSelectedProductCategory = async (productCategory, keySearch) => {
    try {
      const responseData = await productDataService.getProductsByCategoryIdAsync(productCategory?.id, keySearch);

      if (responseData) {
        const records = responseData?.productsByCategoryId?.map((item) => {
          return {
            key: item?.productId,
            productId: item?.productId,
            name: item?.name ?? "N/A",
            unitName: item?.unitName ?? "N/A",
            thumbnail: item?.thumbnail,
          };
        });
        setShowProductsModal(true);
        setSelectedProductCategory(productCategory);

        setDataModal(records);
        await getProducts(records);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelRemoveProductModal = (productId) => {
    let addDataItemProduct = allProducts.filter((item) => item?.productId === productId);
    setProducts(products.concat(addDataItemProduct));

    const newData = dataModal.filter((item) => item?.productId !== productId);
    setDataModal(newData);
  };

  const onCloseModal = async () => {
    setSelectedProductCategory(null);
    setDataModal([]);
    setShowProductsModal(false);
    setProducts([]);
  };

  const onSubmitModal = async () => {
    try {
      const data = dataModal.map((item) => {
        return {
          productId: item?.productId,
          name: item?.name,
          thumbnail: "",
          unitName: "",
          index: item?.index,
        };
      });
      const putData = {
        productCategoryId: selectedProductCategory?.id,
        productByCategoryIdModel: [],
      };
      putData["productByCategoryIdModel"] = data;
      const res = await productDataService.updateProductByCategoryAsync(putData);
      if (res) {
        message.success(pageData.productCategoryUpdateSuccess);
        await reload();
        onCloseModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tableConfigs = {
    pageSize: tableSettings.pageSize,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "index",
        key: "index",
        width: "10%",
        align: "right",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        key: "name",
        width: "50%",
        className: "category-name-column",
        ellipsis: {
          showTitle: false,
        },
        render: (_, record) => <Tooltip title={record?.name}>{record?.name}</Tooltip>,
      },
      {
        title: pageData.table.priority,
        dataIndex: "priority",
        key: "priority",
        width: "15%",
        align: "right",
      },
      {
        title: pageData.table.product,
        dataIndex: "numberOfProduct",
        key: "numberOfProduct",
        width: "15%",
        align: "right",
        render: (_, record) => (
          <div>
            <a
              onClick={() => {
                onHandleSelectedProductCategory(record, "");
              }}
            >
              {record?.numberOfProduct}
            </a>
          </div>
        ),
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.EDIT_PRODUCT_CATEGORY) && (
                <EditButtonComponent
                  className="mr-3"
                  onClick={() => onEditItem(record)}
                  permission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
                />
              )}

              {permissions?.find((x) => x?.id?.toString().toUpperCase() === PermissionKeys.DELETE_PRODUCT_CATEGORY) && (
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.name)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  permission={PermissionKeys.DELETE_PRODUCT_CATEGORY}
                  onOk={() => onRemoveItem(record?.id)}
                />
              )}
            </>
          );
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDataTableAsync(1, tableConfigs.pageSize, keySearch);
      });
    },
  };

  const onSearchProductModal = async (keySearch) => {
    executeAfter(500, async () => {
      await onHandleSelectedProductCategory(selectedProductCategory, keySearch);
    });
  };

  const getProducts = async (records) => {
    try {
      var res = await productDataService.getAllProductIncludedProductUnitAsync();
      if (res) {
        const productsToAddModel = res.productsToAddModel;
        setAllProducts(productsToAddModel);
        var productIds = records.map(function (item) {
          return item["productId"];
        });
        const result = productsToAddModel.filter((item) => !productIds.includes(item?.productId));
        setProducts(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectedProduct = (productName) => {
    let selectedProducts = products.find((item) => item?.name === productName);
    const productItem = {
      key: selectedProducts?.productId,
      productId: selectedProducts?.productId,
      name: selectedProducts?.name,
      unitName: selectedProducts?.unitName,
      thumbnail: selectedProducts?.thumbnail,
    };
    setProducts(products.filter((item) => item?.name !== productName));
    setDataModal([...dataModal, productItem]);
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <>
      <Form className="form-staff">
        <Row>
          <FnbTable
            className="mt-4"
            columns={tableConfigs.columns}
            pageSize={tableConfigs.pageSize}
            dataSource={dataSource}
            currentPageNumber={currentPageNumber}
            total={totalRecords}
            onChangePage={tableConfigs.onChangePage}
            editPermission={PermissionKeys.EDIT_PRODUCT_CATEGORY}
            deletePermission={PermissionKeys.DELETE_PRODUCT_CATEGORY}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectedRowKeysChange,
              columnWidth: 40,
            }}
            search={{
              placeholder: pageData.table.searchPlaceholder,
              onChange: tableConfigs.onSearch,
            }}
          />
        </Row>
      </Form>
      <TableProduct
        title={selectedProductCategory?.name}
        showProductsModal={showProductsModal}
        onCancel={onCloseModal}
        dataModal={dataModal}
        products={products}
        onSelectedProduct={onSelectedProduct}
        setDataModal={setDataModal}
        onRemoveItemModal={handelRemoveProductModal}
        onSearchProductModal={onSearchProductModal}
        onSubmitModal={onSubmitModal}
      />
    </>
  );
}
