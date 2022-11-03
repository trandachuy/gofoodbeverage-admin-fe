import Moment from "moment";
import { localStorageKeys, setStorage } from "utils/localStorage.helpers";
import { encryptWithAES } from "utils/securityHelpers";
import actionTypes from "./session.types";

const sessionInitialState = {
  storeInfo: {},
  auth: {},
  currentUser: {},
  lastUpdated: 1439478405547,
  languageSession: undefined,
};

const sessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        currentUser: action?.auth?.user,
        auth: action.auth,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_PERMISSIONS:
      const jsonPermissions = JSON.stringify(action.permissions);
      let encodeData = encryptWithAES(jsonPermissions);
      setStorage(localStorageKeys.PERMISSIONS, encodeData);
      return {
        ...state,
        permissions: action.permissions,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.RESET_SESSION:
      return {
        ...sessionInitialState,
        lastUpdated: Moment.utc().format("x"),
      };

    case actionTypes.SET_AUTH_TOKEN:
      setStorage(localStorageKeys.TOKEN, action.token);
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.token,
          refreshToken: action.refreshToken,
          expire: action.expire,
        },
      };
    case actionTypes.LANGUAGE_SESSION:
      return { ...state, languageSession: action?.payload };
    case actionTypes.SET_WORKSPACE:
      const { auth, token, permissions } = action.data;
      const jsonWorkspacePermissions = JSON.stringify(permissions);
      let encodeJsonWorkspacePermissions = encryptWithAES(jsonWorkspacePermissions);
      setStorage(localStorageKeys.PERMISSIONS, encodeJsonWorkspacePermissions);
      setStorage(localStorageKeys.TOKEN, token);
      return {
        ...state,
        auth: auth,
        permissions: permissions,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_THUMBNAIL:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            thumbnail: action?.thumbnail,
          },
        },
      };
    case actionTypes.SET_PERMISSION_GROUP:
      const jsonPermissionGroup = JSON.stringify(action.permissionGroup);
      let encodePermissionGroupData = encryptWithAES(jsonPermissionGroup);
      setStorage(localStorageKeys.PERMISSION_GROUP, encodePermissionGroupData);
      return {
        ...state,
        permissionGroup: action.permissionGroup,
        lastUpdated: Moment.utc().format("x"),
      };
    case actionTypes.SET_FULL_NAME:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            fullName: action?.fullName,
          },
        },
      };
    case actionTypes.STORE_LOGO:
      return {
        ...state,
        storeLogo: action?.storeLogoUrl,
      };

    case actionTypes.SET_STORE_INFO:
      return {
        ...state,
        storeInfo: action.storeInfo,
        lastUpdated: Moment.utc().format("x"),
      };
    default:
      return state;
  }
};

export default sessionReducer;
