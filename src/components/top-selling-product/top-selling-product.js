import { Card, Col, Row, Table, Typography } from "antd";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { FolderIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatTextNumber, getCurrency } from "utils/helpers";
import "./top-selling-product.scss";
const { Paragraph } = Typography;

export function TopSellingProductComponent(props) {
  let { dataSource, title, hideSeeMore } = props;
  const [t] = useTranslation();
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const pageData = {
    noDataFound: t("table.noDataFound"),
    topSellingProductItems: t("dashboard.topSellingProduct.items"),
    topSellingProductSeemore: t("dashboard.topSellingProduct.seemore"),
  };
  const tableTopSellingProductSettings = {
    pageSize: 20,
    columns: [
      {
        dataIndex: "productName",
        width: "65%",
        align: "left",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <div className="table-selling-product-row">
              <Row>
                <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
                <div className="table-selling-product-thumbnail">
                  <Thumbnail src={record?.thumbnail} />
                </div>
                <div className="table-selling-product-no table-selling-product-name-mobile">
                  <Row>
                    <Col span={24} className="table-selling-product-text-product-name">
                      <Paragraph
                        style={{ maxWidth: "inherit" }}
                        placement="top"
                        ellipsis={{ tooltip: value }}
                        color="#50429B"
                      >
                        {value}
                      </Paragraph>
                    </Col>
                  </Row>
                  <Row style={record?.priceName && { marginTop: "4px" }}>
                    <Col span={24} className="table-selling-product-text-no" style={{ fontSize: "14px" }}>
                      {record?.priceName}
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          ) : (
            <Row>
              <div className="table-selling-product-text-no table-selling-product-no">{record?.no}</div>
              <div className="table-selling-product-thumbnail">
                <Thumbnail src={record?.thumbnail} />
              </div>
              <Col span={10} className="table-selling-product-no">
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-name-overflow"
                  >
                    <Paragraph
                      style={{ maxWidth: "inherit" }}
                      placement="top"
                      ellipsis={{ tooltip: value }}
                      color="#50429B"
                    >
                      {value}
                    </Paragraph>
                  </Col>
                </Row>
                <Row style={record?.priceName && { marginTop: "4px" }}>
                  <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                    {record?.priceName}
                  </Col>
                </Row>
              </Col>
            </Row>
          );
        },
      },
      {
        dataIndex: "quantity",
        width: "35%",
        align: "right",
        render: (value, record) => {
          return isTabletOrMobile ? (
            <>
              <div
                className={
                  record?.priceName
                    ? "table-selling-product-component-item-mobile table-selling-product-row"
                    : "table-selling-product-component-item-mobile table-selling-product-row table-selling-product-item-mobile-margin"
                }
              >
                <Row>
                  <Col
                    span={24}
                    className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                  >
                    {`${value} ${pageData.topSellingProductItems}`}
                  </Col>
                </Row>
                <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                  <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <Row>
                <Col
                  span={24}
                  className="table-selling-product-text-product-name table-selling-product-text-no-font-size"
                >
                  {`${value} ${pageData.topSellingProductItems}`}
                </Col>
              </Row>
              <Row className="table-selling-product-text-no table-selling-product-quantity-style">
                <Col span={24}>{`${formatTextNumber(record?.totalCost)} ${getCurrency()}`}</Col>
              </Row>
            </>
          );
        },
      },
    ],
  };

  return (
    <>
      <Card
        className={
          isTabletOrMobile
            ? "fnb-box custom-box card-selling-product-thumbnail"
            : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-component-width"
        }
      >
        <Row className="group-header-top-selling-product-box">
          <Col xs={18} sm={18} lg={18}>
            <p style={{ color: "#2B2162" }}>{title}</p>
          </Col>
          <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align" hidden={hideSeeMore}>
            <p className="table-selling-product-see-more">{pageData.topSellingProductSeemore}</p>
          </Col>
        </Row>
        <Table
          locale={{
            emptyText: (
              <>
                <p className="text-center table-emty-icon">
                  <FolderIcon />
                </p>
                <p className="text-center body-2 table-emty-text">{pageData.noDataFound}</p>
              </>
            ),
          }}
          className="fnb-table form-table table-selling-product"
          columns={tableTopSellingProductSettings.columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Card>
    </>
  );
}
