import { Card } from "antd";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { tableSettings } from "constants/default.constants";
import staffDataService from "data-services/staff/staff-data.service";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TablePermissionGroup from "./table-permission-group";
import "./index.scss";

export default function PermissionGroupComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const { screenKey } = props;
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
    createGroupPermissionSuccess: t("messages.createGroupPermissionSuccess"),
    updateGroupPermissionSuccess: t("messages.updateGroupPermissionSuccess"),
  };

  const [listGroupPermission, setListGroupPermission] = useState([]);
  const [totalGroupPermission, setTotalGroupPermission] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    async function fetchData() {
      initDataTableGroupPermission(tableSettings.page, tableSettings.pageSize, keySearch);
    }

    fetchData();
  }, []);

  const initDataTableGroupPermission = async (pageNumber, pageSize, keySearch) => {
    if (!pageNumber || !pageSize) {
      return;
    }

    let dataRequest = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      keySearch: keySearch,
      screenKey: screenKey,
    };

    //get list group-permission
    const response = await staffDataService.getDataStaffManagementAsync(dataRequest);
    let groupPermissions = mappingToDataTableGroupPermissions(response?.groupPermissions);
    setListGroupPermission(groupPermissions);
    setTotalGroupPermission(response?.total);
  };

  const mappingToDataTableGroupPermissions = (groupPermissions) => {
    return groupPermissions?.map((i, index) => {
      return {
        id: i?.id,
        no: index + 1,
        groupName: i?.name,
        member: i?.numberOfMember,
        createdBy: i?.createdByStaffName,
      };
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    //get list group-permission by pageNumber, pageSize
    initDataTableGroupPermission(pageNumber, pageSize, keySearch);
  };

  const onSearchGroupPermission = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        initDataTableGroupPermission(tableSettings.page, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onEditPermissionGroup = (id) => {
    history.push(`/permission-group/edit/${id}`);
  };

  return (
    <div>
      <FnbAddNewButton
        className="add-new-permission-group-button"
        onClick={() => history.push("/permission-group/create-new")}
        text={pageData.btnAddNew}
      />
      <Card className="fnb-card-full staff-card-border">
        <>
          <div className="mt-3">
            <TablePermissionGroup
              t={t}
              dataSource={listGroupPermission}
              total={totalGroupPermission}
              pageSize={tableSettings.pageSize}
              currentPage={tableSettings.page}
              onChangePage={onChangePage}
              onSearch={onSearchGroupPermission}
              onEditPermissionGroup={onEditPermissionGroup}
            />
          </div>
        </>
      </Card>
    </div>
  );
}
