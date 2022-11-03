import React, { useState, useEffect } from "react";
import { Row, Col, Button, message } from "antd";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import supplierDataService from "data-services/supplier/supplier-data.service";
import purchaseOrderDataService from "data-services/purchase-order/purchase-order-data.service";
import "../index.scss";
import { DefaultCountryISO } from "constants/string.constants";
import { useMediaQuery } from "react-responsive";
import { ArrowLeftIcon } from "constants/icons.constants";
import { hasPermission } from "utils/helpers";
import { PermissionKeys } from "constants/permission-key.constants";
import DeleteSupplier from "./delete-supplier.component";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import PageTitle from "components/page-title";

export default function SupplierDetail(props) {
  const { t } = useTranslation();
  const { history } = props;
  const param = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initData, setInitData] = useState();
  const [titleModal, setTitleModal] = useState();
  const [infoSupplier, setInfoSupplier] = useState({});
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const pageData = {
    btnEdit: t("button.edit"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    btnLeave: t("button.leave"),
    goBack: t("supplier.goBack"),
    detail: {
      generalInformation: t("supplier.detail.generalInformation"),
      name: t("supplier.detail.name"),
      code: t("supplier.detail.code"),
      country: t("supplier.detail.country"),
      phone: t("supplier.detail.phone"),
      email: t("supplier.detail.email"),
      address: t("supplier.detail.address"),
      addressTwo: t("supplier.detail.addressTwo"),
      province: t("supplier.detail.province"),
      district: t("supplier.detail.district"),
      ward: t("supplier.detail.ward"),
      state: t("supplier.detail.state"),
      cityTown: t("supplier.detail.cityTown"),
      zipCode: t("supplier.detail.zipCode"),
      description: t("supplier.detail.description"),
    },
    notificationTitle: t("form.notificationTitle"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    supplierDeleteSuccess: t("messages.isDeletedSuccessfully"),
    supplierDeleteFail: t("supplier.supplierDeleteFail"),
  };

  useEffect(() => {
    getInitDataAsync(param.id);
  }, []);

  const getInitDataAsync = async (id) => {
    var res = await supplierDataService.getSupplierByIdAsync(id);
    if (res.supplier) {
      setInitData(res);
    } else {
      history.push("/inventory/supplier");
    }
  };

  const goBack = () => {
    history.push("/inventory/supplier");
  };

  const gotoEditSupplierPage = () => {
    history.push(`/inventory/supplier/edit/${param.id}`);
  };

  //Delete supplier
  const handleDeleteItem = async (id) => {
    purchaseOrderDataService.getPurchaseOrderBySupplierIdAsync(id).then((res) => {
      if (res.isOpenPurchaseOrder) {
        setTitleModal(pageData.notificationTitle);
      } else {
        setTitleModal(pageData.confirmDelete);
      }
      setInfoSupplier(res);
      setIsModalVisible(true);
    });
  };

  const onDelete = (id, name) => {
    supplierDataService.deleteSupplierByIdAsync(id).then((res) => {
      if (res) {
        setIsModalVisible(false);
        history.push("/inventory/supplier");
        message.success(`${name} ${pageData.supplierDeleteSuccess}`);
      } else {
        message.error(pageData.supplierDeleteFail);
      }
    });
  };

  return (
    <div className={isTabletOrMobile ? "responsive-layout" : ""}>
      <DeleteSupplier
        isModalVisible={isModalVisible}
        infoSupplier={infoSupplier}
        titleModal={titleModal}
        handleCancel={() => setIsModalVisible(false)}
        onDelete={onDelete}
      />

      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={initData?.supplier?.name} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    className="btn-edit"
                    onClick={() => gotoEditSupplierPage()}
                  >
                    {pageData.btnEdit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_SUPPLIER,
              },
              {
                action: (
                  <a onClick={() => goBack()} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null,
              },
              {
                action: (
                  <a className="action-delete" onClick={() => handleDeleteItem(param.id)}>
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.DELETE_SUPPLIER,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>

      <div className="supplier-detail-card">
        <div className="title-session">
          <span>{pageData.detail.generalInformation}</span>
        </div>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.name}</p>
              <p className="text-detail">{initData?.supplier?.name ?? "-"}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.code}</p>
              <p className="text-detail">{initData?.supplier?.code ?? "-"}</p>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.country}</p>
              <p className="text-detail">{initData?.supplier?.address?.country?.name ?? "-"}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.phone}</p>
              <p className="text-detail">
                +{initData?.supplier?.address?.country?.phonecode} {initData?.supplier?.phoneNumber}
              </p>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.email}</p>
              <p className="text-detail">{initData?.supplier?.email ?? "-"}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.address}</p>
              <p className="text-detail">{initData?.supplier?.address?.address1 ?? "-"}</p>
            </div>
          </Col>
        </Row>

        {initData?.supplier?.address?.country?.iso !== DefaultCountryISO.vn && (
          <Row>
            <Col span={24}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.addressTwo}</p>
                <p className="text-detail">{initData?.supplier?.address?.address2 ?? "-"}</p>
              </div>
            </Col>
          </Row>
        )}

        {initData?.supplier?.address?.country?.iso === DefaultCountryISO.vn ? (
          <Row>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.province}</p>
                <p className="text-detail">{initData?.supplier?.address?.city?.name ?? "-"}</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.district}</p>
                <p className="text-detail">{initData?.supplier?.address?.district?.name ?? "-"}</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.ward}</p>
                <p className="text-detail">{initData?.supplier?.address?.ward?.name ?? "-"}</p>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.state}</p>
                <p className="text-detail">{initData?.supplier?.address?.state?.name ?? "-"}</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.cityTown}</p>
                <p className="text-detail">{initData?.supplier?.address?.cityTown ?? "-"}</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-container">
                <p className="text-label">{pageData.detail.zipCode}</p>
                <p className="text-detail">{initData?.supplier?.address?.postalCode ?? "-"}</p>
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            <div className="text-container">
              <p className="text-label">{pageData.detail.description}</p>
              <p className="text-detail">{initData?.supplier?.description ?? "-"}</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
