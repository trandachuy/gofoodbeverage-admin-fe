import { Button, Col, Row } from "antd";
import { PermissionKeys } from "constants/permission-key.constants";
import qrCodeDataService from "data-services/qr-code/qr-code-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import moment from "moment";
import "./detail-qr-code.scss";
import { DateFormat } from "constants/string.constants";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { formatCurrency } from "utils/helpers";
import { FnbQrCode } from "components/fnb-qr-code/fnb-qr-code.component";
import { CancelButton } from "components/cancel-button";
import PageTitle from "components/page-title";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";

export default function QrCodeDetailPage(props) {
  const [t] = useTranslation();
  const param = useParams();
  const history = useHistory();
  const [qrCode, setQrCode] = useState({});

  const pageData = {
    noColumnTitle: t("detailQrCode.noColumnTitle", "No"),
    productNameColumnTitle: t("detailQrCode.productNameColumnTitle", "Product name"),
    quantityColumnTitle: t("detailQrCode.quantityColumnTitle", "Quantity"),
    unitNameColumnTitle: t("detailQrCode.unitNameColumnTitle", "Unit"),
    generalInformation: t("detailQrCode.generalInformation", "General information"),
    name: t("detailQrCode.name", "Name"),
    branch: t("detailQrCode.branch", "Branch"),
    serviceType: t("detailQrCode.serviceType", "Service Type"),
    area: t("detailQrCode.area", "Area"),
    table: t("detailQrCode.table", "Table"),
    validFrom: t("detailQrCode.validFrom", "Valid from"),
    validUntil: t("detailQrCode.validUntil", "Valid until"),
    target: t("detailQrCode.target", "Target"),
    discount: t("detailQrCode.discount", "Discount"),
    discountValue: t("detailQrCode.discountValue", "Discount Value"),
    maxDiscount: t("detailQrCode.maxDiscount", "Max Discount"),
    button: {
      leave: t("button.leave", "Leave"),
      edit: t("button.edit", "Edit"),
      clone: t("button.clone", "Clone"),
      stop: t("button.stop", "Stop"),
      delete: t("button.delete", "Delete"),
    },
  };

  useEffect(() => {
    getInitDataAsync(param.qrCodeId);
  }, []);

  const getInitDataAsync = async (id) => {
    var res = await qrCodeDataService.getQrCodeByIdAsync(id);
    if (res) {
      setQrCode(res.qrCodeDetail);
    } else {
      goBack();
    }
  };

  const getProductTableColumns = () => {
    let columns = [
      {
        title: pageData.noColumnTitle,
        width: "74px",
        className: "",
        render: (_, record, index) => <>{index + 1}</>,
      },
      {
        title: pageData.productNameColumnTitle,
        width: "707px",
        className: "",
        render: (_, record) => (
          <div className="product-name-box">
            <div>
              <Thumbnail src={record?.productThumbnail} width={88} height={88} />
            </div>
            <span className="product-name-text">{record?.productName}</span>
          </div>
        ),
      },
      {
        title: pageData.quantityColumnTitle,
        width: "375px",
        className: "",
        render: (_, record) => <>{record?.productQuantity}</>,
      },
      {
        title: pageData.unitNameColumnTitle,
        width: "318px",
        className: "",
        render: (_, record) => <>{record?.unitName}</>,
      },
    ];
    return columns;
  };

  const goToEditQrCodePage = () => {
    history.push(`/marketing/qrcode/edit/${param.qrCodeId}`);
  };

  const goBack = () => {
    history.push("/marketing/qrcode");
  };

  const goToCreateQrCodePage = () => {
    history.push("/qrcode/create-new");
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header card-header">
            <PageTitle content={qrCode?.name} />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button className="button-edit-qr-code" type="primary" onClick={goToEditQrCodePage}>
                    {pageData.button.edit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_QR_CODE,
              },
              {
                action: <CancelButton buttonText={pageData.button.leave} onOk={goBack} />,
              },
              {
                action: <CancelButton buttonText={pageData.button.clone} onOk={goToCreateQrCodePage} />,
                permission: PermissionKeys.CREATE_QR_CODE,
              },
              {
                action: <CancelButton buttonText={pageData.button.stop} onOk={goBack} />,
                permission: PermissionKeys.STOP_QR_CODE,
              },
              {
                action: <CancelButton buttonText={pageData.button.delete} onOk={goBack} />,
                permission: PermissionKeys.DELETE_QR_CODE,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>

      <div className="qr-code-info-wrapper">
        <div className="qr-code-general-info-card">
          <div className="qr-code-general-info-container">
            <Row>
              <Col xs={24} sm={24} lg={16}>
                <div>
                  <p className="title-text">{pageData.generalInformation}</p>
                </div>
                <div>
                  <p className="label-text mt-20">{pageData.name}</p>
                  <p className="detail-text mt-25">{qrCode?.name}</p>
                </div>
                <div>
                  <p className="label-text mt-56">{pageData.branch}</p>
                  <p className="detail-text mt-25">{qrCode?.branchName}</p>
                </div>
                <div>
                  <p className="label-text mt-56">{pageData.serviceType}</p>
                  <p className="detail-text mt-25">{qrCode?.serviceTypeName}</p>
                </div>
                <Row>
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.area}</p>
                      <p className="detail-text mt-25">{qrCode?.areaName}</p>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.table}</p>
                      <p className="detail-text mt-25">{qrCode?.areaTableName}</p>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-56">
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.validFrom}</p>
                      <p className="detail-text mt-25">
                        {qrCode?.startDate ? moment.utc(qrCode?.startDate).local().format(DateFormat.DD_MM_YYYY) : "-"}
                      </p>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.validUntil}</p>
                      <p className="detail-text mt-25">
                        {qrCode?.endDate ? moment.utc(qrCode?.endDate).local().format(DateFormat.DD_MM_YYYY) : "-"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} lg={8}>
                <Row className="justify-content-center">
                  <FnbQrCode fileName={qrCode?.qrCodeId} value={qrCode?.url ?? ""} size={172} showDownloadButton />
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div className="qr-code-target-info-card mt-24">
          <div className="qr-code-target-info-container">
            <div>
              <p className="title-text">{pageData.target}</p>
            </div>
            <div>
              <p className="label-text mt-20">{pageData.target}</p>
              <p className="detail-text mt-25">{t(qrCode?.targetName)}</p>
            </div>

            {qrCode && qrCode.products && qrCode.products.length > 0 && (
              <div className="mt-48">
                <FnbTable
                  className="table-qr-code-product"
                  dataSource={qrCode?.products}
                  columns={getProductTableColumns()}
                  total={qrCode?.products?.length}
                  scrollY={116 * 5}
                />
              </div>
            )}
          </div>
        </div>

        <div className="qr-code-discount-info-card mt-24">
          <div className="qr-code-discount-info-container">
            <div>
              <p className="title-text">{pageData.discount}</p>
            </div>
            <div className="mb-56">
              <Row>
                <Col xs={24} sm={24} lg={12}>
                  <p className="label-text mt-20">{pageData.discountValue}</p>
                  <p className="detail-text mt-25">
                    {qrCode?.isPercentDiscount
                      ? qrCode?.percentNumber + "%"
                      : formatCurrency(qrCode?.maximumDiscountAmount)}
                  </p>
                </Col>
                {qrCode?.isPercentDiscount && (
                  <Col xs={24} sm={24} lg={12}>
                    <p className="label-text mt-20">{pageData.maxDiscount}</p>
                    <p className="detail-text mt-25">{formatCurrency(qrCode?.maximumDiscountAmount)}</p>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
