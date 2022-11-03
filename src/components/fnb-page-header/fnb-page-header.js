import { Button, Col, Row, Space } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import PageTitle from "components/page-title";
import { ArrowLeftIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";

import "./fnb-page-header.scss";

/**
 * FnbPageHeader component
 * @param {*} props
 * @param {*} props.showBackLink Enable to show back link
 * @param {string} props.backText Back link title
 * @param {function} props.onBack Handle on click back link
 * @param {string} props.cancelText Cancel title
 * @param {function} props.onCancel Handle on click cancel
 * @param {string} props.title Page title
 * @param {string} props.actionText Title for action button
 * @param {function} props.onAction Handle on action button
 */
export function FnbPageHeader({
  showBackLink,
  backText,
  onBack,
  cancelText,
  onCancel,
  title,
  actionText,
  onAction,
  actionDisabled,
  actionButtons,
}) {
  const [t] = useTranslation();
  const translateData = {
    delete: t("button.delete"),
  };

  const getActionButtons = (actionButtons) => {
    const newActionButtons = actionButtons?.map((button) => {
      if (button?.action === actionButton.delete) {
        return {
          ...button,
          action: (
            <Button type="link" className="action-delete" danger onClick={() => {}}>
              {translateData.delete}
            </Button>
          ),
        };
      } else {
        return button;
      }
    });

    return newActionButtons;
  };

  return (
    <>
      <div className="fnb-page-header">
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <div className="link-back-page link-back-page-staff">
              {showBackLink && (
                <Button onClick={onBack} type="link">
                  <span className="btn-back-icon">
                    <ArrowLeftIcon />
                  </span>
                  {backText ?? "Back"}
                </Button>
              )}
            </div>
            <PageTitle content={title ?? "Page header"} />
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Space className="float-right">
              {!actionButtons && (
                <>
                  <Button className="second-button" onClick={onCancel}>
                    {cancelText ?? "Cancel"}
                  </Button>
                  <Button className="action-button" type="primary" onClick={onAction} disabled={actionDisabled}>
                    {actionText ?? "Action"}
                  </Button>
                </>
              )}
              {actionButtons && <ActionButtonGroup arrayButton={getActionButtons(actionButtons)} />}
            </Space>
          </Col>
        </Row>
      </div>
    </>
  );
}

export const actionButton = {
  delete: "DELETE",
};
