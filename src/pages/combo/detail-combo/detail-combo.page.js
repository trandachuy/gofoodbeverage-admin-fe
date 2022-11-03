import { PercentageOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Image, Layout, message, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import defaultImage from "assets/images/combo-default-img.jpg";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { ComboStatus, ComboType } from "constants/combo.constants";
import { DiscountIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import comboDataService from "data-services/combo/combo-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { formatCurrency, formatCurrencyWithoutSuffix, getCurrency, roundNumber } from "utils/helpers";
import "./detail-combo.scss";
const { Content } = Layout;

export default function ComboDetail(props) {
  const [t] = useTranslation();
  const param = useParams();
  const history = useHistory();
  const comboLink = "/combo";
  const pageData = {
    backTo: t("combo.backToCombo"),
    general: t("combo.generalInformation.title"),
    name: t("combo.generalInformation.name"),
    description: t("combo.generalInformation.description"),
    branch: t("combo.generalInformation.branch"),
    showAllBranches: t("combo.generalInformation.allBranches"),
    combo: t("combo.price.combo"),
    originalPrice: t("combo.price.originalPrice"),
    sellingPrice: t("combo.price.sellingPrice"),
    image: t("material.inventory.image"),
    comboType: t("combo.comboType"),
    product: t("combo.product.title"),
    groups: t("combo.product.groups"),
    category: t("combo.product.category"),
    group: t("combo.product.group"),
    price: t("combo.price.title"),
    priceType: t("combo.price.priceType"),
    startDate: t("promotion.form.startDate"),
    endDate: t("promotion.form.endDate"),
    btnLeave: t("button.leave"),
    btnDelete: t("button.delete"),
    btnEdit: t("button.edit"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    comboDeleteSuccess: t("combo.comboDeleteSuccess"),
    comboDeleteFail: t("combo.comboDeleteFail"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopCombo: t("combo.confirmStop"),
    button: {
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    stop: t("button.stop"),
    stopComboSuccess: t("combo.stopComboSuccess"),
    stopComboFail: t("combo.stopComboFail"),
  };

  const [initData, setInitData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  useEffect(() => {
    getInitDataAsync(param?.comboId);
  }, []);

  const getInitDataAsync = (comboId) => {
    comboDataService.getComboByIdAsync(comboId).then((res) => {
      if (res.isSuccess) {
        setInitData(res.combo);
      }
    });
  };

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.combo,
        dataIndex: "comboName",
        width: "40%",
        align: "left",
        render: (comboName) => {
          let comboNameArray = comboName.split(" | ");
          return comboNameArray.map((item) => <div className="product-item">{item}</div>);
        },
      },
      {
        title: `${pageData.originalPrice} (${getCurrency()})`,
        dataIndex: "originalPrice",
        width: "30%",
        align: "right",
        render: (originalPrice) => {
          return <span>{formatCurrencyWithoutSuffix(originalPrice)}</span>;
        },
      },
      {
        title: `${pageData.sellingPrice} (${getCurrency()})`,
        dataIndex: "sellingPrice",
        width: "30%",
        align: "right",
        render: (sellingPrice, record) => {
          return (
            <>
              <div className="selling-price">{formatCurrencyWithoutSuffix(sellingPrice)}</div>
              <div className="selling-price-discount">
                <span className="discount-icon">
                  <DiscountIcon />
                </span>
                {record.discountPercentValue}
                <PercentageOutlined />
              </div>
            </>
          );
        },
      },
    ],
  };

  const getDataTable = () => {
    const dataSource = [];
    initData?.comboPricings?.map((item) => {
      const record = {
        comboName: item?.comboName,
        originalPrice: item?.originalPrice,
        sellingPrice: item?.sellingPrice,
        discountPercentValue: roundNumber(((item?.originalPrice - item?.sellingPrice) / item?.originalPrice) * 100, 1),
      };
      dataSource.push(record);
    });

    return dataSource;
  };

  const getActionButtons = () => {
    if (initData?.statusId === ComboStatus.Schedule) {
      return [
        {
          action: (
            <FnbAddNewButton
              className="float-right"
              type="primary"
              text={pageData.btnEdit}
              onClick={() => history.push(`/combo/edit/${param?.comboId}`)}
            />
          ),
          permission: PermissionKeys.EDIT_COMBO,
        },
        {
          action: (
            <a onClick={leavePage} className="action-cancel">
              {pageData.btnLeave}
            </a>
          ),
          permission: null,
        },
        {
          action: (
            <a onClick={() => setIsModalDeleteVisible(true)} className="action-delete">
              {pageData.btnDelete}
            </a>
          ),
          permission: PermissionKeys.DELETE_COMBO,
        },
      ];
    } else if (initData?.statusId === ComboStatus.Active) {
      return [
        {
          action: (
            <Button type="primary" className="ant-btn ant-btn-primary" onClick={() => setShowConfirm(true)}>
              {pageData.button.btnStop}
            </Button>
          ),
          permission: PermissionKeys.STOP_COMBO,
        },
        {
          action: (
            <a onClick={leavePage} className="action-cancel">
              {pageData.btnLeave}
            </a>
          ),
          permission: null,
        },
      ];
    } else {
      return [
        {
          action: (
            <a onClick={leavePage} className="action-cancel">
              {pageData.btnLeave}
            </a>
          ),
          permission: null,
        },
      ];
    }
  };

  const handleDeleteItem = async (id) => {
    var res = await comboDataService.deleteComboByIdAsync(id);
    if (res) {
      message.success(pageData.comboDeleteSuccess);
      leavePage();
    } else {
      message.error(pageData.comboDeleteFail);
    }
  };

  const onStopCombo = async (id) => {
    await comboDataService.stopComboByIdAsync(id).then((res) => {
      if (res) {
        getInitDataAsync(param?.comboId);
        message.success(pageData.stopComboSuccess);
        setShowConfirm(false);
      } else {
        message.error(pageData.stopComboFail);
      }
    });
  };

  const leavePage = () => {
    history.push(comboLink);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onDiscardDeleteModal = () => {
    setIsModalDeleteVisible(false);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={initData?.name} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup arrayButton={getActionButtons()} />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Content>
        <Card className="fnb-box custom-box card-first">
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
                  <p className="combo-view-text">{initData?.name}</p>
                </Col>
                <Row className="w-100">
                  <Col xs={24} lg={12}>
                    <h4 className="fnb-form-label material-view-lable-text-color">{pageData.startDate}</h4>
                    <p className="combo-view-text">{moment(initData?.startDate).format(DateFormat.DD_MM_YYYY)}</p>
                  </Col>
                  {initData?.endDate && (
                    <Col xs={24} lg={12}>
                      <h4 className="fnb-form-label material-view-lable-text-color">{pageData.endDate}</h4>
                      <p className="combo-view-text">{moment(initData?.endDate).format(DateFormat.DD_MM_YYYY)}</p>
                    </Col>
                  )}
                </Row>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.description}</h4>
                  <p className="combo-view-text">{initData?.description}</p>
                </Col>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color display-block">{pageData.branch}</h4>
                  {initData?.isShowAllBranches === true ? (
                    <Checkbox checked disabled>
                      {pageData.showAllBranches}
                    </Checkbox>
                  ) : (
                    <>
                      {initData?.comboStoreBranches?.map((item, index) => (
                        <Paragraph
                          key={index}
                          style={{ maxWidth: "inherit" }}
                          placement="top"
                          ellipsis={{ tooltip: item?.branch?.name }}
                          color="#50429B"
                          className="combo-view-branch-select combo-view-text display-inline-block"
                        >
                          {item?.branch?.name}
                        </Paragraph>
                      ))}
                    </>
                  )}
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} lg={10}>
              <Row>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.image}</h4>
                  <Image
                    preview={false}
                    width={174}
                    height={174}
                    src={initData?.thumbnail ?? "error"}
                    fallback={defaultImage}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card className="fnb-box custom-box card-first">
          <Row className="group-header-box">
            <Col xs={24} sm={24} lg={24}>
              {pageData.product}
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} lg={24}>
              <Row>
                <Col span={24}>
                  <h4 className="fnb-form-label material-view-lable-text-color">{pageData.comboType}</h4>
                  <p className="combo-view-text">{initData?.comboTypeName}</p>
                </Col>
                <Col span={24}>
                  {initData?.comboTypeId === ComboType.Fixed ? (
                    <>
                      <h4 className="fnb-form-label material-view-lable-text-color">{pageData.groups}</h4>
                      {initData?.comboProductGroups?.map((item, index) => (
                        <div key={index} className="group-combo card-first">
                          <div className="header-group-combo">
                            <span className="title-group">
                              {pageData.group} {(index += 1)}
                            </span>
                          </div>
                          <div className="content-group-combo">
                            <Row>
                              <Col span={24}>
                                <h4 className="fnb-form-label material-view-lable-text-color">{pageData.category}</h4>
                                <p className="combo-view-text">{item?.productCategory?.name}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={24}>
                                <h4 className="fnb-form-label material-view-lable-text-color">{pageData.product}</h4>
                                {item?.comboProductGroupProductPrices?.map((itemProduct, index) => (
                                  <Paragraph
                                    key={index}
                                    style={{ maxWidth: "inherit" }}
                                    placement="top"
                                    ellipsis={{
                                      tooltip: itemProduct?.productPrice?.product?.name,
                                    }}
                                    color="#50429B"
                                    className="combo-view-branch-select combo-view-text display-inline-block"
                                  >
                                    {itemProduct?.productPrice?.product?.name}
                                    {itemProduct?.productPrice?.priceName &&
                                      `(${itemProduct?.productPrice?.priceName})`}
                                  </Paragraph>
                                ))}
                              </Col>
                            </Row>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h4 className="fnb-form-label material-view-lable-text-color">{pageData.product}</h4>
                      {initData?.comboProductPrices?.map((item, index) => (
                        <Paragraph
                          key={index}
                          style={{ maxWidth: "inherit" }}
                          placement="top"
                          ellipsis={{
                            tooltip: item?.productPrice?.priceName
                              ? `${item?.productPrice?.product?.name} (${item?.productPrice?.priceName})`
                              : item?.productPrice?.product?.name,
                          }}
                          color="#50429B"
                          className="combo-view-branch-select combo-view-text display-inline-block"
                        >
                          {item?.productPrice?.product?.name}{" "}
                          {item?.productPrice?.priceName && `(${item?.productPrice?.priceName})`}
                        </Paragraph>
                      ))}
                    </>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card className="fnb-box custom-box">
          <Row className="group-header-box">
            <Col xs={24} sm={24} lg={24}>
              {pageData.price}
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} lg={24}>
              {initData?.comboTypeId === ComboType.Fixed ? (
                <Row>
                  <Col span={24}>
                    <h4 className="fnb-form-label material-view-lable-text-color">{pageData.priceType}</h4>
                    <p className="combo-view-text">{initData?.comboPriceTypeName}</p>
                  </Col>
                  <Col span={24}>
                    <FnbTable
                      className="mt-4 table-striped-rows"
                      columns={tableSettings.columns}
                      pageSize={tableSettings.pageSize}
                      dataSource={getDataTable()}
                    />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col span={24}>
                    <h4 className="fnb-form-label material-view-lable-text-color">{pageData.sellingPrice}</h4>
                    <p className="combo-view-text">{formatCurrency(initData?.sellingPrice)}</p>
                    <h4 className="fnb-form-label material-view-lable-text-color">{pageData.originalPrice}</h4>
                    <p className="combo-view-text line-through">
                      {formatCurrency(initData?.comboProductPrices?.reduce((x, y) => x + y.priceValue, 0))}
                    </p>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Card>
      </Content>
      <DeleteConfirmComponent
        title={pageData.confirmStop}
        content={t(pageData.confirmStopCombo, { name: initData?.name })}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnStop}
        onCancel={onDiscard}
        onOk={() => onStopCombo(initData?.id)}
      />
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={t(pageData.confirmDeleteMessage, { name: initData?.name })}
        visible={isModalDeleteVisible}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        okText={pageData.btnDelete}
        onCancel={onDiscardDeleteModal}
        onOk={() => handleDeleteItem(initData?.id)}
      />
    </>
  );
}
