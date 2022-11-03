import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Route } from "react-router-dom";
import { store } from "store";
import { calculateUsedTime } from "store/modules/processing/processing.actions";
import { resetSession } from "store/modules/session/session.actions";
import { hasPermission, tokenExpired } from "utils/helpers";
import { getStorage, localStorageKeys } from "utils/localStorage.helpers";
import SideMenu from "../side-menu";
import TopBar from "../top-bar/index";

const { Content } = Layout;
export default function PrivateRoute(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    exact,
    route,
    routes,
    computedMatch,
    component: Component,
    key,
    path,
    auth,
    isChild,
    parentKey,
    ...rest
  } = props;
  const [menuItems, setMenuItems] = useState([]);
  const [notSupportInCurrentVersion, setNotSupportInCurrentVersion] = useState(false);

  useEffect(() => {
    const { permission, nextVersionIsSupport } = route;
    let isTokenExpired = checkTokenExpired();
    // Navigate to RESTRICTED Page whether user has not permission
    if (!isTokenExpired) {
      if (permission && !hasPermission(permission)) {
        history.push("/page-not-permitted");
      }
    } else {
      dispatch(resetSession());
      history.push("/login");
    }

    // filter menus from routes where isMenu === true
    const menuItems = routes.filter((route) => route.isMenu === true);
    setMenuItems(menuItems);

    if (nextVersionIsSupport) {
      window.open(`/coming-soon?version_support=${nextVersionIsSupport}`, "_blank");
      setNotSupportInCurrentVersion(true);
    }
  
    /// calculate used time
    store.dispatch(calculateUsedTime());
  }, []);

  const checkTokenExpired = () => {
    let isTokenExpired = true;
    let token = getStorage(localStorageKeys.TOKEN);
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token);
    }
    return isTokenExpired;
  };

  return (
    <>
      <SideMenu t={t} menuItems={menuItems} route={route} routes={routes} isChild={isChild} parentKey={parentKey} />
      <Layout className="fnb-site-layout">
        <TopBar menuItems={menuItems} route={route} routes={routes} isChild={isChild} parentKey={parentKey} />
        <Content className="main-content-bg main-body">
          {!notSupportInCurrentVersion &&
            <Route key={key} path={path} component={Component} {...rest} />
          }
        </Content>
      </Layout>
    </>
  );
}
