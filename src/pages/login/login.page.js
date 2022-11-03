import { Button, Form, Image, Input, message, Row, Select } from "antd";
import "antd/dist/antd.css";
import foodBeverageLogo from "assets/images/go-fnb-login-logo.png";
import { accountStatusConstants } from "constants/account-status.constants";
import {
  ArrowDown,
  EarthIcon,
  EyeIcon,
  EyeOpenIcon,
  HeadphoneIcon,
  LockIcon,
  TabletIcon,
  UserNameIcon,
} from "constants/icons.constants";
import { languageCodeLocalStorageKey, listDefaultLanguage } from "constants/language.constants";
import permissionDataService from "data-services/permission/permission-data.service";
import storeDataService from "data-services/store/store-data.service";
import jwt_decode from "jwt-decode";
import { KindlyNotificationComponent } from "pages/login/components/kindly-notification/kindly-notification.component";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  resetSession,
  setAuth,
  setPermissionGroup,
  setPermissions,
  setStoreInformation,
  setStoreLogo,
  setToken,
} from "store/modules/session/session.actions";
import { getParamsFromUrl } from "utils/helpers";
import i18n from "utils/i18n";
import { claimTypesConstants } from "../../constants/claim-types.constants";
import loginDataService from "../../data-services/login/login-data.service";
import "../../stylesheets/authenticator.scss";
import { setLanguageSession } from "./../../store/modules/session/session.actions";
import ListStoreComponent from "./components/list-store.component";

const { Option } = Select;
const LoginPage = (props) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [languageList, setLanguageList] = useState(listDefaultLanguage);
  const [defaultLanguage, setDefaultLanguage] = useState(
    localStorage.getItem(languageCodeLocalStorageKey) ?? listDefaultLanguage[0]?.languageCode
  );
  const [kindlyNotification, setKindlyNotification] = useState(false);
  const kindlyNotificationRef = useRef();
  const [userData, setUserData] = useState({});
  const [storeList, setStoreList] = useState([]);
  const [loginInfo, setLoginInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const { search } = props.location;
    const params = getParamsFromUrl(search);
    const { username } = params;
    if (username) {
      form.setFieldsValue({
        userName: username,
      });
    }
    dispatch(resetSession());
    getInitData();
  }, []);

  const setUserAuth = (auth, token, permissions) => {
    dispatch(setAuth(auth));
    dispatch(setToken(token));
    dispatch(setPermissions(permissions));

    storeDataService.getStoreInformationAsync().then((response) => {
      dispatch(setStoreInformation(response));
    });
  };

  const onFinish = (values) => {
    loginDataService
      .authenticate(values)
      .then((res) => {
        const { token, accountStatus, thumbnail, storeLogoUrl } = res;
        dispatch(setStoreLogo(storeLogoUrl));
        switch (accountStatus) {
          case accountStatusConstants.firstLogin:
            var userInfo = getUserInfo(token);
            var authStaff = {
              ...userInfo,
              thumbnail: thumbnail,
            };
            setUserData({
              token: token,
              user: authStaff,
            });
            if (kindlyNotificationRef && kindlyNotificationRef.current) {
              kindlyNotificationRef.current.setKindlyNotifyType(accountStatusConstants.firstLogin);
            }
            break;
          case accountStatusConstants.waitingForApproval:
            if (kindlyNotificationRef && kindlyNotificationRef.current) {
              kindlyNotificationRef.current.setKindlyNotifyType(accountStatusConstants.waitingForApproval);
            }
            break;
          default:
            var user = getUserInfo(token);
            var auth = {
              ...user,
              thumbnail: thumbnail,
            };
            setupWorkspace(token, auth);
            break;
        }
      })
      .catch(() => {});
  };

  const getUserInfo = (token) => {
    let claims = jwt_decode(token);
    let user = {
      userId: claims[claimTypesConstants.id],
      accountId: claims[claimTypesConstants.accountId],
      fullName: claims[claimTypesConstants.fullName],
      emailAddress: claims[claimTypesConstants.email],
      accountType: claims[claimTypesConstants.accountType],
      currencyCode: claims[claimTypesConstants.currencyCode],
      storeId: claims[claimTypesConstants.storeId],
    };

    return user;
  };

  const setupFirstLoginWorkspace = () => {
    const { token } = userData;
    setUserAuth(userData, token, []);
    props.history.push("/billing");
  };

  const setupWorkspace = (token, userInfo) => {
    let auth = { token: token, user: userInfo };
    /// get permissions
    permissionDataService.getPermissionsAsync(token).then((res) => {
      const { permissions, permissionGroup } = res;
      if (permissions.length > 0 && permissionGroup.length > 0) {
        message.success(t("signIn.youHaveBeenLoggedInSuccessfully"));
        dispatch(setPermissionGroup(permissionGroup));
        setUserAuth(auth, token, permissions);
        props.history.push("/home");
      } else {
        message.error(t("signIn.youHaveNoPermissions"));
      }
    });
  };

  const getInitData = () => {
    setLanguageList(listDefaultLanguage);
    onChangeLang(defaultLanguage);
  };

  const onChangeLang = (selectedLang) => {
    var lang = listDefaultLanguage.find((item) => item.languageCode === selectedLang);
    i18n.changeLanguage(selectedLang);
    setDefaultLanguage(selectedLang);
    dispatch(setLanguageSession({ default: lang, list: listDefaultLanguage }));
  };

  const checkAccountLogin = (values) => {
    setLoginInfo(values);
    loginDataService
      .checkAccountLoginAsync(values)
      .then((res) => {
        if (res.success) {
          setStoreList(res.stores);
          if (res.stores.length <= 1) {
            let valueSubmitLogin = {
              ...values,
              storeId: res.stores[0]?.storeId,
              accountId: res.stores[0]?.accountId,
            };
            onFinish(valueSubmitLogin);
          }
        } else {
          setIsLogin(false);
        }
      })
      .then((error) => {});
  };

  const onSelectStore = (storeId, accountId) => {
    let loginValue = {
      ...loginInfo,
      storeId: storeId,
      accountId: accountId,
    };
    onFinish(loginValue);
  };

  const onBackLogin = () => {
    form.setFieldsValue({
      userName: loginInfo?.userName,
      password: loginInfo?.password,
    });
    setStoreList([]);
  };

  return (
    <div className="c-authenticator">
      <div className="form-logo">
        <div>
          <Image preview={false} src={foodBeverageLogo} width={300} />
        </div>
      </div>
      {storeList.length < 2 && (
        <div className="div-form login-contain login-contain__right">
          <Form
            className="login-form login-inner login-inner__spacing"
            name="basic"
            autoComplete="off"
            onFinish={checkAccountLogin}
            form={form}
          >
            <div className="frm-content">
              <Row className="form-lang">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  suffixIcon={<ArrowDown />}
                  dropdownClassName="select-language-dropdown"
                  value={t(defaultLanguage)}
                  onChange={(languageCode) => onChangeLang(languageCode)}
                >
                  {languageList?.map((item) => {
                    return (
                      <Option key={item.languageCode}>
                        <span className="flag">{item.flag}</span>
                        <span>{t(item.name)}</span>
                      </Option>
                    );
                  })}
                </Select>
              </Row>

              {!isLogin && (
                <div className="error-field">
                  <p>{t("signIn.errorLogin")} </p>
                </div>
              )}

              <h1 className="label-login">{t("signIn.text")}</h1>
              <h4 className="label-input">{t("signIn.username.label")}</h4>
              <Form.Item
                name="userName"
                rules={[
                  {
                    required: true,
                    message: `${t("signIn.username.validateMessage")}`,
                  },
                  {
                    type: "email",
                    message: t("messages.pleaseEnterValidEmailAddress"),
                  },
                ]}
              >
                <Input prefix={<UserNameIcon />} placeholder={t("signIn.username.placeholder")} />
              </Form.Item>

              <h4 className="label-input">{t("signIn.password.label")}</h4>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: `${t("signIn.password.validateMessage")}`,
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockIcon />}
                  iconRender={(visible) => (visible ? <EyeOpenIcon /> : <EyeIcon />)}
                  placeholder={t("signIn.password.placeholder")}
                />
              </Form.Item>

              <Row className="forgot-password">
                <div>
                  <a className="login-form-forgot" href="">
                    {t("signIn.forgotPassword")}
                  </a>
                </div>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  {t("signIn.buttonLogin")}
                </Button>
              </Form.Item>
              <p className="text-register">
                <span>{t("signIn.dontHaveAccount")}</span>
                <Link className="link-register ml-1" to={"/register-account"}>
                  {t("signIn.register")}
                </Link>
                <span className="ml-1"> {t("signIn.here")}</span>
              </p>
              <div className="content-bottom">
                <span className="icon-content-bottom">
                  <EarthIcon />
                </span>
                <span className="icon-content-bottom">
                  <HeadphoneIcon />
                </span>
                <span className="icon-content-bottom">
                  <TabletIcon />
                </span>
              </div>
            </div>
          </Form>
        </div>
      )}

      {storeList.length >= 2 && (
        <ListStoreComponent storeList={storeList} onSelectStore={onSelectStore} onBackLogin={onBackLogin} />
      )}

      <KindlyNotificationComponent
        visible={kindlyNotification}
        onActive={setupFirstLoginWorkspace}
        onClick={() => setKindlyNotification(false)}
        ref={kindlyNotificationRef}
      />
    </div>
  );
};

export default LoginPage;
