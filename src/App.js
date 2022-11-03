import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "./pages/routes";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import PrivateRoute from "./components/private-route";
import { Layout } from "antd";
import { store } from "store";
import { calculateUsedTime } from "store/modules/processing/processing.actions";
import LoadingBar from "react-top-loading-bar";

import "./stylesheets/main.scss";
import "./stylesheets/fnb-styles.scss";

function App(props) {
  const ref = React.useRef(null);
  useEffect(() => {
    store.dispatch(calculateUsedTime());
    if (props.loading) {
      ref.current.continuousStart();
    } else {
      ref.current.complete();
    }
  }, [props.loading]);

  return (
    <Router>
      <LoadingBar color="#ff8c21" ref={ref} />
      <Layout className="ant-layout ant-layout-has-sider" style={{ minHeight: "100vh" }}>
        <Switch>
          {routes.map((route) => {
            const { component: Component, key, path, auth, ...rest } = route;
            if (auth === true) {
              if (route.child.length > 0) {
                return route.child.map((child) => {
                  const { component: Component, ...rest } = child;
                  return (
                    <PrivateRoute
                      t={props.t}
                      key={child.key}
                      route={child}
                      routes={routes}
                      path={child.path}
                      component={Component}
                      parentKey={key}
                      isChild={true}
                      {...rest}
                    />
                  );
                });
              }

              return <PrivateRoute t={props.t} key={key} route={route} routes={routes} path={path} component={Component} {...rest} />;
            } else {
              return <Route t={props.t} key={key} path={path} component={Component} {...rest} />;
            }
          })}
        </Switch>
      </Layout>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state?.processing?.isDataServiceProcessing || false,
  };
};

export default compose(withTranslation("translations"), connect(mapStateToProps))(App);
