import "./staff.page.scss";
import { Card, message } from "antd";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import TableStaff from "./components/table-staff.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { useTranslation } from "react-i18next";

export default function Staff(props) {
  const { screenKey } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const openEditStaffPage = (id) => {
    history.push(`/staff/edit/${id}`);
  };

  const pageData = {
    btnAddNew: t("button.addNew"),
  };

  useEffect(() => {
    let state = location?.state;
    if (state?.savedSuccessfully) {
      message.success(state?.message);
      history.replace();
    }
  }, []);

  return (
    <div>
      <FnbAddNewButton
        className="float-right add-new-staff-button"
        text={pageData.btnAddNew}
        onClick={() => history.push("/staff/create-new")}
      />
      <div className="clearfix"></div>
      <Card className="fnb-card">
        <TableStaff screenKey={screenKey} onEditStaff={openEditStaffPage} />
      </Card>
    </div>
  );
}
