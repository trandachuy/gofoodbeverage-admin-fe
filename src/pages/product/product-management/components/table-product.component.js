import React, { useEffect, useState } from "react";
import { Row, Col, Popover, message, Space, Tooltip } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { executeAfter, getCurrency, formatCurrencyWithoutSuffix, isJsonString, hasPermission } from "utils/helpers";
import { BadgeStatus } from "components/badge-status";
import { PermissionKeys } from "constants/permission-key.constants";
import { Link } from "react-router-dom";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FnbTable } from "components/fnb-table/fnb-table";
import FilterProduct from "./filter-product.component";
import productDataService from "data-services/product/product-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import branchDataService from "data-services/branch/branch-data.service";
import { Thumbnail } from "components/thumbnail/thumbnail";
import storeDataService from "data-services/store/store-data.service";
import DeleteProductComponent from "./delete-product.component";
import { getStorage, setStorage, localStorageKeys } from "utils/localStorage.helpers";
import { TrashFill } from "constants/icons.constants";
import { object } from "prop-types";

export default function TableProduct(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [productCategories, setProductCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [countFilter, setCountFilter] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopover, setShowPopover] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderOpenStatus, setOrderOpenStatus] = useState({});
  const [preventDeleteProduct, setPreventDeleteProduct] = useState({});

  const [titleModal, setTitleModal] = useState();
  const [salesChannel, setSalesChannel] = useState([]);

  const clearFilterFunc = React.useRef(null);
  const maxNumberToShowPrice = 5;

  const pageData = {
    btnFilter: t("button.filter"),
    btnSort: t("button.sort"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    productDeleteSuccess: t("productManagement.productDeleteSuccess"),
    productDeleteFail: t("productManagement.productDeleteFail"),
    table: {
      searchPlaceholder: t("productManagement.table.searchPlaceholder"),
      no: t("productManagement.table.no"),
      name: t("productManagement.table.name"),
      price: t("productManagement.table.price"),
      platform: t("productManagement.table.platform"),
      status: t("productManagement.table.status"),
      action: t("productManagement.table.action"),
    },
    notificationTitle: t("form.notificationTitle"),
  };
  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.name,
        dataIndex: "name",
        key: "name",
        className: "grid-product-name-column",
        align: "left",
        width: "45%",
        render: (value, record) => {
          return (
            <Row className="table-img-box">
              <div>
                <Thumbnail src={record?.thumbnail} />
              </div>
              <div className="product-name">
                <Link to={`/product/details/${record?.id}`}>{value}</Link>
              </div>
            </Row>
          );
        },
      },
      {
        title: `${pageData.table.price} (${getCurrency()})`,
        dataIndex: "price",
        key: "price",
        align: "right",
        className: "grid-price-column",
        width: "20%",
      },
      {
        title: pageData.table.platform,
        dataIndex: "channel",
        key: "channel",
        align: "center",
        className: "grid-channel-column",
        width: "15%",
        render: (_, record) => {
          return (
            <Row>
              <Col span={24}>{record.channel}</Col>
            </Row>
          );
        },
      },
      {
        title: pageData.table.status,
        dataIndex: "status",
        key: "status",
        align: "left",
        className: "grid-status-column",
        width: "10%",
        render: (_, record) => {
          const isActive = record?.status?.id === 1;
          return <BadgeStatus isActive={isActive} />;
        },
      },
      {
        title: pageData.table.action,
        key: "action",
        align: "center",
        render: (_, record) => {
          return (
            <div className="action-column">
              <EditButtonComponent
                className="action-button-space mr-0"
                onClick={() => onEditItem(record)}
                permission={PermissionKeys.EDIT_PRODUCT}
              />
              {hasPermission(PermissionKeys.DELETE_PRODUCT) && (
                <Space wrap>
                  <div className="fnb-table-action-icon">
                    <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                      <TrashFill className="icon-svg-hover" onClick={() => onDeleteItem(record?.id, record?.name)} />
                    </Tooltip>
                  </div>
                </Space>
              )}
            </div>
          );
        },
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
      });
    },
  };

  const onDeleteItem = (productId, productName) => {
    productDataService.getAllOrderNotCompletedByProductIdAsync(productId).then((res) => {
      const { preventDeleteProduct } = res;
      // Set property for object
      Object.assign(preventDeleteProduct, { productName: productName });

      setPreventDeleteProduct(preventDeleteProduct);
      if (!preventDeleteProduct?.isPreventDelete) {
        setTitleModal(pageData.confirmDelete);
      } else {
        setTitleModal(pageData.notificationTitle);
      }
      setIsModalVisible(true);
    });
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setPreventDeleteProduct({});
  };

  const handleDeleteItem = async (productId) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      message.success(pageData.productDeleteSuccess);

      // Recount selected items after delete
      const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== productId);
      if (newSelectedRowKeys) {
        setSelectedRowKeys(newSelectedRowKeys);
      }
    } else {
      message.error(pageData.productDeleteFail);
    }
    setIsModalVisible(false);
    await fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  };

  const onEditItem = (item) => {
    return history.push(`/product/edit/${item?.id}`);
  };

  useEffect(() => {
    var sessionProductFilter = getStorage(localStorageKeys.PRODUCT_FILTER);
    if (isJsonString(sessionProductFilter)) {
      var productFilter = JSON.parse(sessionProductFilter);
      if (productFilter && productFilter.count > 0) {
        var data = {
          branchId: productFilter.branchId,
          productCategoryId: productFilter.productCategoryId,
          statusId: productFilter.statusId,
          count: productFilter.count,
          salesChannel: productFilter.salesChannel,
        };
        handleFilterProduct(data);
      } else {
        fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
      }
    } else {
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
    }
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await productDataService.getProductsAsync(pageNumber, pageSize, keySearch);
    const data = response?.products.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
  };

  const PopoverContentComponent = (props) => {
    return (
      <div className="popover-container-custom">
        <div className="popover-container-custom-header">
          <span className="popover-container-custom-header-title">{props?.title}</span>
        </div>

        <div className="popover-container-custom-body">{props?.children}</div>
      </div>
    );
  };

  const renderPopoverItems = (productPrices, take, onPopover) => {
    let priceList = [];
    if (productPrices?.length > 0) {
      priceList = [...productPrices];
    }

    if (take) {
      priceList = priceList.splice(0, take);
    }

    return priceList?.map((p) => {
      if (p.priceName) {
        return (
          <>
            <Row className="price-box">
              {onPopover ? (
                <>
                  <Col offset={4} span={6}>
                    <span className="float-left">{p?.priceName}</span>
                  </Col>
                  <Col offset={4} span={6} className="mt-1">
                    <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}</span>
                  </Col>
                </>
              ) : (
                <>
                  <Col span={12}>
                    <span className="float-left">{p?.priceName}</span>
                  </Col>
                  <Col span={12} className="mt-1">
                    <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}</span>
                  </Col>
                </>
              )}
            </Row>
          </>
        );
      } else {
        return (
          <>
            <Row>
              <Col span={12}></Col>
              <Col span={12}>
                <span className="float-right">{formatCurrencyWithoutSuffix(p?.priceValue)}</span>
              </Col>
            </Row>
          </>
        );
      }
    });
  };

  const onVisibleChange = (isShow, item) => {
    let button = document.getElementById(`btn-show-more-${item.id}`);
    if (isShow) {
      button?.classList?.add("btn-show-more-hover");
    } else {
      button?.classList?.remove("btn-show-more-hover");
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      key: item?.id,
      index: item?.no,
      id: item?.id,
      name: item?.name,
      thumbnail: item?.thumbnail,
      prices: item?.prices,
      price: (
        <>
          {item?.productPrices &&
            (item?.productPrices?.length > maxNumberToShowPrice ? (
              <div>
                {renderPopoverItems(item?.productPrices, maxNumberToShowPrice)}
                <Popover
                  onVisibleChange={(isShow) => onVisibleChange(isShow, item)}
                  content={
                    <PopoverContentComponent title={`Prices (${item?.productPrices?.length})`}>
                      {renderPopoverItems(item?.productPrices, null, true)}
                    </PopoverContentComponent>
                  }
                  trigger="click"
                >
                  <div className="btn-show-more-container">
                    <button id={`btn-show-more-${item.id}`} className="btn-show-more">
                      <EllipsisOutlined />
                    </button>
                  </div>
                </Popover>
              </div>
            ) : (
              <>{renderPopoverItems(item?.productPrices)}</>
            ))}
        </>
      ),
      channels: item?.channels,
      channel: item?.channels?.map((c) => (
        <>
          {c.name}
          <br></br>
        </>
      )),
      status: item?.status,
    };
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }
    var resCategory = await productCategoryDataService.getAllProductCategoriesAsync();
    if (resCategory) {
      const allCategoryOption = {
        id: "",
        name: t("productManagement.filter.category.all"),
      };
      const categoryOptions = [allCategoryOption, ...resCategory.allProductCategories];
      setProductCategories(categoryOptions);
    }

    var resBranch = await branchDataService.getAllBranchsAsync();
    if (resBranch) {
      const allBranchOption = {
        id: "",
        name: t("productManagement.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...resBranch.branchs];
      setBranches(branchOptions);
    }

    var resSalesChannel = await storeDataService.getAllPlatformActivatedAsync();
    if (resSalesChannel) {
      const allSalesChannel = {
        id: "",
        name: t("productManagement.filter.status.all"),
      };
      const salesChannels = [allSalesChannel, ...resSalesChannel.platforms];
      setSalesChannel(salesChannels);
    }
  };

  const handleFilterProduct = async (data) => {
    const response = await productDataService.getProductsByFilterAsync(
      currentPageNumber,
      tableSettings.pageSize,
      "",
      data?.branchId ?? "",
      data?.productCategoryId ?? "",
      data?.statusId ?? "",
      data?.salesChannel ?? ""
    );

    const products = response?.products.map((s) => mappingRecordToColumns(s));
    setDataSource(products);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    setCountFilter(data?.count);
  };

  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onClearFilter = (e) => {
    if (clearFilterFunc.current) {
      clearFilterFunc.current();
      setShowPopover(false);
    } else {
      setStorage(localStorageKeys.PRODUCT_FILTER, null);
      setCountFilter(0);
      setShowPopover(false);
      fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
    }
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterProduct
          fetchDataProducts={handleFilterProduct}
          categories={productCategories}
          branches={branches}
          tableFuncs={clearFilterFunc}
          salesChannel={salesChannel}
        />
      )
    );
  };

  return (
    <>
      <Row className="form-staff mt-4">
        <FnbTable
          className="mt-4 table-striped-rows"
          columns={tableSettings.columns}
          pageSize={tableSettings.pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={totalRecords}
          onChangePage={tableSettings.onChangePage}
          editPermission={PermissionKeys.EDIT_PRODUCT}
          deletePermission={PermissionKeys.DELETE_PRODUCT}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            columnWidth: 40,
          }}
          search={{
            maxLength: 100,
            placeholder: pageData.table.searchPlaceholder,
            onChange: tableSettings.onSearch,
          }}
          filter={{
            onClickFilterButton: onClickFilterButton,
            totalFilterSelected: countFilter,
            onClearFilter: onClearFilter,
            buttonTitle: pageData.btnFilter,
            component: filterComponent(),
          }}
          sort={{ buttonTitle: pageData.btnSort, onClick: () => {} }}
        />
        <DeleteProductComponent
          isModalVisible={isModalVisible}
          preventDeleteProduct={preventDeleteProduct}
          titleModal={titleModal}
          handleCancel={() => onCloseModal()}
          onDelete={handleDeleteItem}
        />
      </Row>
    </>
  );
}
