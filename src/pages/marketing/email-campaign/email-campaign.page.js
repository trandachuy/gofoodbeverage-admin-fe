import { Card, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { PermissionKeys } from "constants/permission-key.constants";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TableEmailCampaign from "./components/table-email-campaign.component";

export function EmailCampaign(props) {
  const [t] = useTranslation();
  const history = useHistory();

  const translateData = {
    title: t("marketing.emailCampaign.title", "Email Campaign Management"),
    addNew: t("button.addNew", "Add new"),
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} xl={12}>
          <Space className="page-title">
            <h1 className="fnb-title-header">{translateData.title}</h1>
          </Space>
        </Col>
        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <FnbAddNewButton
                    permission={PermissionKeys.CREATE_EMAIL_CAMPAIGN}
                    onClick={() => history.push("/email-campaign/create-new")}
                    text={translateData.addNew}
                  />
                ),
                permission: PermissionKeys.CREATE_EMAIL_CAMPAIGN,
              },
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card cart-with-no-border">
        <TableEmailCampaign />
      </Card>
    </>
  );
}
