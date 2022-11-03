import React from "react";
import FormCreateComboComponent from "pages/combo/components/form-create-combo.component";
import { PermissionKeys } from "constants/permission-key.constants";
import { hasPermission } from "utils/helpers";
import { useHistory } from "react-router-dom";

export default function CreateCompoPage(props) {
  const history = useHistory();
  const comboTablePage = "/combo";

  const renderCreateComboForm = () => {
    return <FormCreateComboComponent onCompleted={() => history.push(comboTablePage)} />;
  };

  return <>{hasPermission(PermissionKeys.CREATE_COMBO) && <>{renderCreateComboForm()}</>}</>;
}
