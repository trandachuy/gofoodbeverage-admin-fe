import { Avatar, Drawer, Image, Layout, Menu, Popover } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { LogoutIcon, MenuIcon, SettingFill, ShopIcon, StaffUserFill } from "constants/icons.constants";
import { DefaultConstants } from "constants/string.constants";
import storeDataService from "data-services/store/store-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { store } from "store";
import { hasPermission } from "utils/helpers";
import goFnbLogo from "../../assets/images/go-fnb-login-logo.png";
import ChangeLanguage from "../change-language/change-language.component";
import "./index.scss";

const { Header } = Layout;
const { SubMenu } = Menu;

function TopBar(props) {
  const [t] = useTranslation();
  const { signedInUser, signOut, history, menuItems, route, isChild, parentKey } = props;
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visiblePopoverUser, setVisiblePopoverUser] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [currentSubMenuKeys, setCurrentSubMenuKeys] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  useEffect(() => {
    if (route.focus) {
      setSelectedKey(route.focus);
    } else {
      setSelectedKey(route.key);
    }

    if (isChild) {
      setCurrentSubMenuKeys([parentKey]);
    }
  }, [route]);

  const logOut = () => {
    var request = { UserId: signedInUser?.userId };
    signOut(request).then(() => {
      history.push("/login");
    });
  };

  const getShortName = (name) => {
    const names = name?.split(" ") ?? "";
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    if (names.length === 1) {
      return names[0][0];
    }
    return names;
  };

  const showAndHideLanguageBox = (value) => {
    setIsVisiblePopover(value);
  };

  const renderAvatarPopover = (
    <>
      <div className="avatar-account-popover">
        <div className="header-avatar">
          <Avatar src={signedInUser?.thumbnail ?? null} className="avatar-popover">
            {getShortName(signedInUser?.fullName)}
          </Avatar>
        </div>
        <div className="avatar-infor account-name">{signedInUser?.fullName}</div>
        <div className="avatar-infor account-email">{signedInUser?.emailAddress}</div>
        <div className="store-info">
          <div className="account-store-name">
            <ShopIcon className="shop-icon" />
          </div>
          <div className="account-store-name">
            <span> {storeInfo?.title}</span>
          </div>
          <div span={24} className="account-store-address">
            <Paragraph
              className="paragraph-style"
              placement="top"
              ellipsis={{
                tooltip: isDefaultCountry
                  ? `${storeInfo?.address?.address1}, ${storeInfo?.address?.ward?.prefix} ${storeInfo?.address?.ward?.name}, ${storeInfo?.address?.district?.prefix} ${storeInfo?.address?.district?.name}`
                  : `${storeInfo?.address?.address1} ${storeInfo?.address?.address2}, ${storeInfo?.address?.cityTown},`,
              }}
              color="#50429B"
            >
              <span>
                {isDefaultCountry
                  ? `${storeInfo?.address?.address1}, ${storeInfo?.address?.ward?.prefix} ${storeInfo?.address?.ward?.name}, ${storeInfo?.address?.district?.prefix} ${storeInfo?.address?.district?.name}`
                  : `${storeInfo?.address?.address1} ${storeInfo?.address?.address2}, ${storeInfo?.address?.cityTown},`}
              </span>
            </Paragraph>
            <span>
              {isDefaultCountry
                ? storeInfo?.address?.city?.name
                : `${storeInfo?.address?.state?.name}, ${storeInfo?.address?.postalCode}`}
            </span>
          </div>
        </div>
        <div className="account-popover-content">
          <div onClick={() => onOpenMyAccount()} className="pointer manage-account">
            <span className="avt-staff-icon">
              <StaffUserFill width={28} height={28} />
            </span>
            <a>{t("topBar.myAccount")}</a>
          </div>
          <hr />
          <div onClick={() => logOut()} className="pointer log-out-border">
            <span className="avt-menu-icon">
              <LogoutIcon width={28} height={28} />
            </span>
            <a>{t("topBar.logOut")}</a>
          </div>
        </div>
      </div>
    </>
  );

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const renderMenuMobile = () => {
    showDrawer(true);
  };

  const onOpenMyAccount = () => {
    history.push("/my-account");
  };

  const onClickAvatar = () => {
    if (!visiblePopoverUser) {
      storeDataService.getStoreByIdAsync().then((data) => {
        setStoreInfo(data?.store);
        setIsDefaultCountry(data?.isDefaultCountry);
      });
    }
    setVisiblePopoverUser(!visiblePopoverUser);
  };

  /* Side Menu */
  const onOpenChange = (items) => {
    const latestOpenKey = items.find((key) => currentSubMenuKeys.indexOf(key) === -1);
    setCurrentSubMenuKeys(latestOpenKey ? [latestOpenKey] : []);
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
            <SubMenu key={item.key} icon={item.icon} title={t(item.name)}>
              {childs.map((child) => {
                let isShow = child?.permission && hasPermission(child.permission);
                if (child.isMenu === true && isShow === true)
                  return (
                    <Menu.Item style={{ paddingLeft: "0px !important" }} key={child.key}>
                      <Link to={child.path} />
                      {t(child.name)}
                    </Menu.Item>
                  );
              })}
            </SubMenu>
          );
        }
      } else {
        let isShow = item?.permission && hasPermission(item.permission);
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

  return (
    <>
      <Header className="expand-header">
        <div className="header-content">
          <div className="header-mobile">
            <div className="menu-icon" onClick={renderMenuMobile}>
              <MenuIcon />
            </div>
            <div className="logo">
              <Image preview={false} src={goFnbLogo} width={55} />
            </div>
          </div>
        </div>
        <div className="header-language">
          <ChangeLanguage showAndHideLanguageBox={showAndHideLanguageBox} visible={isVisiblePopover} />
        </div>
        <div className="header-avatar">
          <Popover
            visible={visiblePopoverUser}
            content={renderAvatarPopover}
            trigger="click"
            placement="bottomRight"
            overlayClassName="avatar-top-bar"
          >
            <Avatar onClick={onClickAvatar} src={signedInUser?.thumbnail ?? null}>
              {getShortName(signedInUser?.fullName)}
            </Avatar>
          </Popover>
        </div>
      </Header>
      <Drawer width={"70%"} placement={"left"} closable={false} onClose={onClose} visible={visible}>
        <div className="menu menu-mobile">
          <Menu
            selectedKeys={[selectedKey]}
            openKeys={currentSubMenuKeys}
            mode="inline"
            onOpenChange={(e) => onOpenChange(e)}
          >
            {renderMenusItems()}
          </Menu>
        </div>
        <div className="trigger-footer-mobile">
          <NavLink to="/settings" className="settings-mobile">
            <span className="icon-setting">
              <SettingFill />
            </span>
            <span className="title-setting">Settings</span>
          </NavLink>
        </div>
      </Drawer>
    </>
  );
}

export default TopBar;
