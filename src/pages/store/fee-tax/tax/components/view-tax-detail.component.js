import React from "react";
import { Row, Col } from "antd";
export default function ViewTaxDetail(props) {
  const { t, taxDetail } = props;

  const pageData = {
    name: t("feeAndTax.tax.name"),
    value: t("feeAndTax.tax.value"),
    type: t("feeAndTax.tax.type"),
    description: t("feeAndTax.tax.description"),
  };

  return (
    <>
      <Row>
        <Col span={5}>
          <h3>{pageData.name}</h3>
        </Col>
        <Col span={12}>{taxDetail?.name}</Col>
      </Row>
      <Row>
        <Col span={5}>
          <h3>{pageData.value}</h3>
        </Col>
        <Col span={12}>{taxDetail?.percentage}%</Col>
      </Row>
      <Row>
        <Col span={5}>
          <h3>{pageData.type}</h3>
        </Col>
        <Col span={12}>{t(taxDetail?.taxType)}</Col>
      </Row>
      <Row>
        <Col span={5}>
          <h3>{pageData.description}</h3>
        </Col>
        <Col span={12}>{taxDetail?.description}</Col>
      </Row>
    </>
  );
}
