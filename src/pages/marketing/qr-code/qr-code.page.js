import { Card, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TableQRCode from "./components/table-qr-code.component";

export function QRCode(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const pageData = {
    title: t("marketing.qrCode.title"),
    addNew: t("button.addNew"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} xl={12}>
          <Space className="page-title">
            <h1 className="fnb-title-header">{pageData.title}</h1>
          </Space>
        </Col>
        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_QR_CODE}
                    onClick={() => history.push("/qrcode/create-new")}
                    text={pageData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_QR_CODE,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card cart-with-no-border">
        <TableQRCode />
      </Card>
    </>
  );
}
