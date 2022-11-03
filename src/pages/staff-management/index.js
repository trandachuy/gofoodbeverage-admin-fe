import { message, Row, Space } from "antd";
import { FnbTabs } from "components/fnb-tabs/fnb-tabs";
import PageTitle from "components/page-title";
import { tableSettings } from "constants/default.constants";
import { Profile2UserIcon, UserIcon } from "constants/icons.constants";
import staffDataService from "data-services/staff/staff-data.service";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PermissionGroup from "./permission-group";
import Staff from "./staff/staff.page";

export default function StaffManagement(props) {
  const { t } = useTranslation();
  const history = useHistory();

  const screens = {
    staff: 1,
    permissionGroup: 2,
  };
  const initTabs = [
    {
      key: screens.staff,
      icon: <UserIcon />,
      title: "settings.tabStaff",
      component: <Staff screenKey={screens.staff} />,
    },
    {
      key: screens.permissionGroup,
      icon: <Profile2UserIcon />,
      title: "settings.tabPermissionGroup",
      component: <PermissionGroup screenKey={screens.permissionGroup} />,
    },
  ];

  const [activeScreen, setActiveScreen] = React.useState(screens.staff);
  const [tabs, setTabs] = React.useState(initTabs);

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    const dataRequest = {
      pageNumber: tableSettings.page,
      pageSize: tableSettings.pageSize,
      keySearch: "",
      screenKey: screens.staff,
    };
    staffDataService.getDataStaffManagementAsync(dataRequest).then((res) => {
      const { tabRecords } = res;
      if (tabRecords) {
        let newTabs = [];
        tabRecords.forEach((tab) => {
          const { screenKey, totalRecords } = tab;
          const currentTab = initTabs.find((t) => t.key === screenKey);
          if (currentTab) {
            const newTab = {
              ...currentTab,
              extract: totalRecords,
            };
            newTabs.push(newTab);
          }
        });

        if (newTabs.length === initTabs.length) {
          setTabs(newTabs);
        }
      }
    });
  };

  /**
   * This method is used to set the current screen, when the tab is changed then all messages will be destroyed.
   * @param  {number} key The screen key, please refer to the Screens constant.
   */
  const onChangeTab = (key) => {
    message.destroy();
    setActiveScreen(key);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Space className="page-title">
          <PageTitle content={t("settings.tabStaffManagement")} />
        </Space>
        <Space className="page-action-group"></Space>
      </Row>

      <FnbTabs
        onClick={initData}
        defaultActiveKey={activeScreen}
        panes={tabs}
        onChangeTab={onChangeTab}
        location={props.location}
      />
    </>
  );
}
