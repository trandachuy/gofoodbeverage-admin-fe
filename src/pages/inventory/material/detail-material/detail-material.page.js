import { Button, Card, Checkbox, Col, Image, Layout, message, Modal, Row, Tooltip } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import PageTitle from "components/page-title";
import { EditFill, ExclamationIcon } from "constants/icons.constants";
import { images } from "constants/images.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatTextNumber, getCurrency } from "utils/helpers";
import DeleteMaterial from "../components/delete-material.component";
import DeleteProductRecipes from "../components/delete-product-recipes.component";
import "./index.scss";
import UpdateCostPerUnitComponent from "./update-cost-per-unit.component";
const { Content } = Layout;

export default function MaterialDetail(props) {
  const { t, history, materialDataService, storeDataService } = props;
  const param = useParams();
  const materialDetailLink = "/inventory/material";
  const [activateMaterial, setActivateMaterial] = useState();

  const pageData = {
    activate: t("status.activate"),
    deactivate: t("status.deactivate"),
    backTo: t("material.back"),
    materialManagement: t("material.materialManagement"),
    name: t("material.name"),
    description: t("material.description"),
    category: t("form.category"),
    general: t("material.generalInformation"),
    pricing: t("material.pricing"),
    currentCostPerUnit: t("material.currentCostPerUnit"),
    tooltipCostPerUnit: t("material.tooltipCostPerUnit"),
    baseUnit: t("material.baseUnit"),
    inventory: t("material.inventory.title"),
    sku: t("table.sku"),
    minQuantity: t("material.inventory.minQuantity"),
    branch: t("material.inventory.branch"),
    productHasExpiryDate: t("material.inventory.productHasExpiryDate"),
    image: t("material.inventory.image"),
    btnEdit: t("button.edit"),
    btnDelete: t("button.delete"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    isDeletedSuccessfully: t("messages.isDeletedSuccessfully"),
    notificationTitle: t("form.notificationTitle"),
    isUpdatedSuccessfully: t("messages.isUpdatedSuccessfully"),
    btnLeave: t("button.leave"),
    updateMaterialCost: t("material.updateMaterialCost"),
  };

  const [initData, setInitData] = useState([]);
  const [initMaterialInventoryBranches, setInitMaterialInventoryBranches] = useState([]);
  const [currency, setCurrency] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [titleModal, setTitleModal] = useState({});
  const [infoMaterial, setInfoMaterial] = useState({});
  const [isModalProductVisible, setIsModalProductVisible] = useState(false);
  const [isModalPOVisible, setIsModalPOVisible] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [isModalCostUnitVisible, setIsModalCostUnitVisible] = useState(false);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const tableFuncs = React.useRef(null);

  useEffect(() => {
    async function fetchData() {
      await getInitDataAsync(param.id);
    }
    fetchData();
  }, []);

  const getInitDataAsync = async (id) => {
    var res = await materialDataService.getMaterialByIdAsync(id);
    var currencyDefault = await storeDataService.getCurrencyByStoreId();
    if (res.material) {
      const { isActive } = res.material;
      setMaterialName(res?.material?.name);
      setActivateMaterial(isActive);
      setInitData(res);
      setCostPerUnit(res?.material?.costPerUnit);
      setInitMaterialInventoryBranches(res?.material?.materialInventoryBranches);
      setCurrency(currencyDefault);
      let listBranch = [];
      res.material?.materialInventoryBranches?.map((i) => {
        let item = {
          id: i.id,
          name: i.branch.name,
          position: i.position,
          quantity: i.quantity,
          branchId: i.branch.id,
        };
        listBranch.push(item);
      });
      setSelectedBranches(listBranch);
    } else {
      history.push(`${materialDetailLink}`);
    }
  };

  async function onActivateMaterialAsync() {
    const response = await materialDataService.activateMaterialByIdAsync(param.id);
    if (response?.isSuccess === true) {
      message.success(`${materialName} ${t(pageData.isUpdatedSuccessfully)}`);
    }

    await getInitDataAsync(param.id);
  }

  async function onDeActiveMaterialAsync() {
    const response = await materialDataService.deactivateMaterialByIdAsync(param.id);
    const { isSuccess, data } = response;
    if (isSuccess === false) {
      const { isOpenPurchaseOrder, isOpenProduct } = data;
      if (isOpenPurchaseOrder) {
        setTitleModal(pageData.notificationTitle);
        setInfoMaterial(data);
        setIsModalPOVisible(true);
      } else if (isOpenProduct) {
        setTitleModal(pageData.notificationTitle);
        setInfoMaterial(data);
        setIsModalProductVisible(true);
      }
    } else {
      message.success(`${materialName} ${t(pageData.isUpdatedSuccessfully)}`);
      await getInitDataAsync(param.id);
    }
  }

  const renderModalDelete = () => {
    return (
      <Modal
        className="delete-confirm-modal"
        title={pageData.confirmDelete}
        visible={isModalVisible}
        okText={pageData.btnDelete}
        okType="danger"
        cancelText={pageData.btnIgnore}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {formatDeleteMessage(initData?.material?.name)}
      </Modal>
    );
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });

    return <span dangerouslySetInnerHTML={{ __html: mess }}></span>;
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleDeleteItem(param.id, initData?.material?.name);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOpenDeletePopup = () => {
    setIsModalVisible(true);
    setIsShowPopover(false);
  };

  const handleDeleteItem = async (id, name) => {
    await materialDataService.deleteMaterialManagementAsync(id).then((res) => {
      if (res) {
        history.push("/inventory/material");
        message.success(`${name} ${pageData.isDeletedSuccessfully}`);
      }
    });
  };

  const renderBranchAndQuantity = (branch) => {
    return (
      <>
        <Row gutter={[16, 16]} className="material-view-row-branch-margin">
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col sm={24} xs={24} lg={18}>
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: branch?.name }}
                  color="#50429B"
                  className="material-view-text material-view-lable-text-color"
                >
                  {branch?.name}
                </Paragraph>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col sm={16} xs={16} lg={2}>
                <span className="material-view-text">{branch?.quantity ? formatTextNumber(branch?.quantity) : 0}</span>
              </Col>
              <Col sm={8} xs={8} lg={16}>
                <span className="material-view-text">{initData?.material?.unitName}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const onDeleteProductPriceMaterial = async (id) => {
    await materialDataService.deleteProductPriceMaterialByMaterialIdAsync(id);

    setIsModalProductVisible(false);

    await onDeActiveMaterialAsync();
  };

  const renderToolTipCostPerUnit = () => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: pageData.tooltipCostPerUnit,
        }}
      ></span>
    );
  };

  const updateCostPerUnit = () => {
    if (tableFuncs && tableFuncs.current) {
      tableFuncs.current(costPerUnit);
    }
    setIsModalCostUnitVisible(true);
  };

  const renderBaseUnitLabel = () => {
    const text = `${getCurrency()}/${initData?.material?.unitName}`;
    return text;
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={initData?.material?.name} />
          </p>
        </Col>

        <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    onClick={() => history.push(`/inventory/material/edit-material/${param.id}`)}
                    className="material-view-button-edit"
                  >
                    {pageData.btnEdit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_MATERIAL,
              },
              {
                action: (
                  <a onClick={() => history.push(materialDetailLink)} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null,
              },
              {
                action: activateMaterial ? (
                  <a onClick={onDeActiveMaterialAsync} className="action-deactivate">
                    {pageData.deactivate}
                  </a>
                ) : (
                  <a onClick={onActivateMaterialAsync} className="action-activate">
                    {pageData.activate}
                  </a>
                ),
                permission: PermissionKeys.ACTIVATE_MATERIAL,
              },
              {
                action: (
                  <a onClick={() => handleOpenDeletePopup()} className="action-delete">
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.DELETE_MATERIAL,
              },
            ]}
          />
          {renderModalDelete()}
        </Col>
      </Row>

      <div className="clearfix"></div>

      <Content>
        <Card className="fnb-box custom-box">
          <Row className="group-header-box">
            <Col xs={24} sm={24} lg={24}>
              {pageData.general}
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} lg={14}>
              <Row>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.name}</h4>
                  <p className="material-view-text">{initData?.material?.name}</p>
                </Col>
              </Row>
              <Row className="material-view-row-margin">
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.description}</h4>
                  <p className="material-view-text">{initData?.material?.description}</p>
                </Col>
              </Row>
              <Row className="material-view-row-margin">
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.category}</h4>
                </Col>
                {initData?.material?.materialCategory?.name ? (
                  <p className="material-view-branch-select material-view-text">
                    {initData?.material?.materialCategory?.name}
                  </p>
                ) : (
                  ""
                )}
              </Row>
            </Col>
            <Col xs={24} sm={24} lg={10}>
              <Row>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.image}</h4>
                  <Image
                    className="thumbnail"
                    width={176}
                    src={initData?.material?.thumbnail ?? "error"}
                    fallback={images.imgDefault}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card className="fnb-box custom-box material-view-card-margin">
          <Row className="group-header-box">
            <Col xs={24} sm={24} lg={24}>
              {pageData.pricing}
            </Col>
          </Row>
          <Row className="material-view-row-margin">
            <Col sm={24} xs={24} lg={12}>
              <div className="d-flex">
                <h4 className="fnb-form-label mt-22">{pageData.currentCostPerUnit} </h4>
                <Tooltip placement="topLeft" title={renderToolTipCostPerUnit()}>
                  <span className="ml-18 mt-22">
                    <ExclamationIcon />
                  </span>
                </Tooltip>
              </div>
            </Col>
          </Row>
          <div className="d-flex">
            <p className="material-view-cost-per-unit-text">
              <b>{`${costPerUnit} ${currency} / ${initData?.material?.unitName}`}</b>{" "}
            </p>
            <a onClick={() => updateCostPerUnit()}>
              <Tooltip placement="top" title={pageData.updateMaterialCost} color="#50429B">
                <EditFill className="ml-18 icon-svg-hover" />
              </Tooltip>
            </a>
          </div>
          <Row className="material-view-row-margin">
            <Col span={24}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.baseUnit}</h4>
              <p className="material-view-text">{initData?.material?.unitName}</p>
            </Col>
          </Row>
        </Card>
        <Card className="fnb-box custom-box material-view-card-margin">
          <Row className="group-header-box">
            <Col xs={24} sm={24} lg={24}>
              {pageData.inventory}
            </Col>
          </Row>
          <Row className="material-view-row-margin">
            <Col span={12}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.sku.toUpperCase()}</h4>
              <p className="material-view-text">{initData?.material?.sku}</p>
            </Col>
            <Col span={12}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.minQuantity}</h4>
              <p className="material-view-text">{initData?.material?.minQuantity}</p>
            </Col>
          </Row>

          <Checkbox
            className="material-view-text material-view-check-box-margin"
            disabled={true}
            checked={initData?.material?.hasExpiryDate}
          >
            {pageData.productHasExpiryDate}
          </Checkbox>

          <Row className="material-view-row-margin">
            <Col span={6}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.branch}</h4>
            </Col>
          </Row>
          <Row className="material-view-branch-margin">
            <Col sm={24} xs={24} lg={24}>
              <Row>
                {initMaterialInventoryBranches?.map((item) => (
                  <Paragraph
                    style={{ maxWidth: "inherit" }}
                    placement="top"
                    ellipsis={{ tooltip: item?.branch?.name }}
                    color="#50429B"
                    className="material-view-branch-select material-view-text"
                  >
                    {item?.branch?.name}
                  </Paragraph>
                ))}
              </Row>
            </Col>
            <div className="form-edit-material-inventory-scroll">
              {selectedBranches?.map((item, index) => renderBranchAndQuantity(item, index))}
            </div>
          </Row>
        </Card>
      </Content>
      <DeleteMaterial
        isModalVisible={isModalPOVisible}
        infoMaterial={infoMaterial}
        titleModal={titleModal}
        handleCancel={() => setIsModalPOVisible(false)}
        onDelete={() => {}}
      />

      <DeleteProductRecipes
        isModalVisible={isModalProductVisible}
        infoMaterial={infoMaterial}
        titleModal={titleModal}
        handleCancel={() => setIsModalProductVisible(false)}
        onDelete={() => onDeleteProductPriceMaterial(param.id)}
      />
      <UpdateCostPerUnitComponent
        isModalVisible={isModalCostUnitVisible}
        handleCancel={() => setIsModalCostUnitVisible(false)}
        materialId={initData?.material?.id}
        setCostPerUnit={setCostPerUnit}
        tableFuncs={tableFuncs}
        renderBaseUnitLabel={renderBaseUnitLabel}
      />
    </>
  );
}
