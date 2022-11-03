import React from "react";
import { Button } from "antd";
import { compose } from "redux";
import { hasPermission } from "utils/helpers";
import { withTranslation } from "react-i18next";

function PrivateButton(props) {
  const { onClick, icon, type, className, text, permission } = props;
  return (
    <>
      {hasPermission(permission) && (
        <Button className={className} type={type} icon={icon} onClick={onClick}>
          {text}
        </Button>
      )}
    </>
  );
}

export default compose(withTranslation("translations"))(PrivateButton);
