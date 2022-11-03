import { Image, Layout, Menu } from "antd";
import { CollapseIcon, ExpandIcon, SettingFill } from "constants/icons.constants";
import { DefaultConstants } from "constants/string.constants";
import { useEffect, useState } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { compose } from "redux";
import { store } from "store";
import { hasPermission, sortChildRoute } from "utils/helpers";
import goFnbLogoCollapse from "../../assets/images/go-fnb-login-logo.png";
import goFnbLogo from "../../assets/images/go-fnb-logo.png";
import "./index.scss";
const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {
  const { t, menuItems, route, isChild, parentKey } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [currentSubMenuKeys, setCurrentSubMenuKeys] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (route.focus) {
      setSelectedKey(route.focus);
    } else {
      setSelectedKey(route.key);
    }

    if (isChild) {
      setCurrentSubMenuKeys([parentKey]);
    }
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const onOpenChange = (items) => {
    const latestOpenKey = items.find((key) => currentSubMenuKeys.indexOf(key) === -1);
    setCurrentSubMenuKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const onFocusFirstItem = (childs) => {
    if (childs?.length > 0) {
      childs = sortChildRoute(childs).sort((a, b) => {
        return a.position - b.position;
      });
      for (let child of childs) {
        if (hasPermission(child.permission) === true) {
          history.push(child.path);
          break;
        }
      }
    }
  };

  const renderMenusItems = () => {
    const { session } = store.getState();
    const { user } = session?.auth;

    const html = menuItems.map((item) => {
      if (item.child && item.child.length > 0) {
        const childs = item.child;
        let isAccess = false;
        childs.forEach((child) => {
          if (hasPermission(child.permission) === true) {
            isAccess = true;
          }
        });
        if (isAccess === true) {
          return (
            <>
              <SubMenu
                onTitleClick={() => onFocusFirstItem(childs)}
                key={item.key}
                icon={item.icon}
                title={t(item.name)}
              >
                {childs.map((child) => {
                  var isShow = child?.permission && hasPermission(child.permission);
                  if (child.isMenu === true && isShow === true)
                    return (
                      <Menu.Item style={{ paddingLeft: "0px !important" }} key={child.key}>
                        <Link to={child.path} />
                        {t(child.name)}
                      </Menu.Item>
                    );
                })}
              </SubMenu>
            </>
          );
        }
      } else {
        var isShow = item?.permission && hasPermission(item.permission);
        /// If item is menu, then check if it has permission
        if (item.isMenu === true && isShow === true) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} />
              {t(item.name)}
            </Menu.Item>
          );
        } else if (!item?.permission && user?.accountType === DefaultConstants.ADMIN_ACCOUNT) {
          /// If item is menu, then check if it has not permission
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} />
              {t(item.name)}
            </Menu.Item>
          );
        }
      }
    });
    return html;
  };

  const handleClickSettingNavigate = () => {
    let header = document.getElementById("header");
    if (header.classList.contains("expand-header")) {
      header.classList.remove("expand-header");
      header.classList.add("collapse-header");
    } else {
      header.classList.add("expand-header");
      header.classList.remove("collapse-header");
    }
  };

  const CustomTrigger = () => (
    <div className="trigger-footer">
      <NavLink to="/settings" className="settings">
        <span className="icon-setting">
          <SettingFill />
        </span>
        <span className="title-setting">{t("menu.settings")}</span>
      </NavLink>
      <div onClick={handleClickSettingNavigate} className="icon-navigate">
        <span className="icon-expand">
          <ExpandIcon />
        </span>
        <span className="icon-collapse">
          <CollapseIcon />
        </span>
      </div>
    </div>
  );

  return (
    <Sider
      className="sider-wrapper"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={<CustomTrigger />}
    >
      <div className="bg-logo">
        <div className="logo">
          <Image id="logo-img" preview={false} src={collapsed ? goFnbLogoCollapse : goFnbLogo} />
        </div>
      </div>
      <div className="menu">
        <Menu
          selectedKeys={[selectedKey]}
          openKeys={currentSubMenuKeys}
          mode="inline"
          onOpenChange={(e) => onOpenChange(e)}
        >
          {renderMenusItems()}
        </Menu>
      </div>
    </Sider>
  );
}

export default compose(withRouter)(SideMenu);
