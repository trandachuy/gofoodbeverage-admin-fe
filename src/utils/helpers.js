/* eslint-disable no-useless-escape */
import { DateFormat } from "constants/string.constants";
import { createBrowserHistory } from "history";
import jwt_decode from "jwt-decode";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import languageService from "services/language/language.service";
import { store } from "store";
import i18n from "utils/i18n";
import { getStorage, localStorageKeys } from "./localStorage.helpers";
import { decryptWithAES } from "./securityHelpers";

const { t } = i18n;
export const browserHistory = createBrowserHistory();

/// Format date
export const formatDate = (date, format) => {
  if (format) {
    return moment.utc(date).local().locale(languageService.getLang()).format(format);
  }
  return moment.utc(date).local().locale(languageService.getLang()).format(DateFormat.DD_MM_YYYY);
};

/**
 * Convert utc time to local time
 * @example utc 1AM => local time = 8AM (+7 GMT)
 * @param {*} dateTime
 * @returns
 */
export const convertUtcToLocalTime = (dateTime) => {
  if (dateTime) return moment.utc(dateTime).local();
  return null;
};

export const getCurrency = () => {
  const { session } = store.getState();
  const { auth } = session;
  if (auth?.user) {
    return auth?.user?.currencyCode ?? "";
  }
  return "";
};

export const getCurrencyWithSymbol = () => {
  const { session } = store.getState();
  const { auth } = session;
  if (auth?.user) {
    return auth?.user?.currencySymbol ?? "";
  }
  return "";
};

/// Format Currency with code
export const formatCurrency = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    const currencyCode = ` ${getCurrency()}`;
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} suffix={currencyCode} />;
  }
  return "";
};

/// Format Currency with code
export const formatCurrencyWithoutSuffix = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} />;
  }
  return "";
};

/// Format Currency without currency symbol
export const formatCurrencyWithoutSymbol = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} />;
  }
  return "";
};

/// Format Currency with symbol
export const formatCurrencyWithSymbol = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    const currencySymbol = ` ${getCurrencyWithSymbol()}`;
    return (
      <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} suffix={currencySymbol} />
    );
  }
  return "";
};

export const formatNumber = (number) => {
  return <CurrencyFormat value={number} displayType={"text"} thousandSeparator={true} />;
};

export const formatTextNumber = (number) => {
  if (isNaN(number) || number === null) {
    return "0";
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
};

export const formatTextRemoveComma = (value) => {
  return value.replace(/\$\s?|(,*)/g, "");
};

/// Run the function in next tick
export const executeAfter = (ms, callback) => {
  clearTimeout(window.searchTimeout);
  return new Promise((resolve) => {
    window.searchTimeout = setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};

// Get permission from store
export const getPermissions = () => {
  const { session } = store.getState();
  return session?.permissions ?? [];
};

/// Check permission
export const hasPermission = (permissionId) => {
  if (permissionId === "public") return true;

  const { session } = store.getState();
  let allPermissions = session?.permissions ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSIONS);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var permissions = JSON.parse(decodeData);
      allPermissions = permissions;
    }
  }

  const isArrayPermissions = Array.isArray(permissionId);
  if (isArrayPermissions === true) {
    let hasPermission = false;
    permissionId.forEach((p) => {
      const index = allPermissions.findIndex((x) => x?.id?.toString().toUpperCase() === p?.toString().toUpperCase());

      if (index !== -1) {
        hasPermission = true;
        return true;
      }
    });

    return hasPermission;
  } else {
    const index = allPermissions.findIndex(
      (x) => x?.id?.toString().toUpperCase() === permissionId?.toString().toUpperCase()
    );
    return index !== -1;
  }
};

/// random GuidId
export const randomGuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

/// check valid email
export const isValidEmail = (string) => {
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailPattern.test(string)) {
    return false;
  }
  return true;
};

/// check valid phone number
export const isValidPhoneNumber = (string) => {
  const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phonePattern.test(string)) {
    return false;
  }
  return true;
};

export const ValidPhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;

/*
  Create combos from groups of array
  Example:
  Group has two array:
  array 1: ["1", "2"]
  array 2: ["4", "5"]
  Result: [ [ '1', '4' ], [ '1', '5' ], [ '2', '4' ], [ '2', '5' ] ]
*/
export const combinationPossible = (groups) => {
  const availableGroups = groups.filter((g) => g && g.length > 0);
  const combos = availableGroups.reduce((a, b) => a.flatMap((x) => b.map((y) => x + "#" + y)), [""]);
  const result = combos.map((combo) => {
    const members = combo.split("#").filter((x) => x !== "");
    return members;
  });

  return result;
};

/*
  ROUND NUMBER
  Params:
  @number: number to round
  @precision: precision of round
*/
export const roundNumber = (number, precision) => {
  if (precision === undefined || precision === null || precision < 1) {
    precision = 1;
  } else {
    precision = Math.pow(10, precision);
  }

  return Math.round(number * precision) / precision;
};

/*
  LOWERCASE FIRST LETTER OF STRING
  Example: "HELLO" => "hELLO"
*/
export const lowercaseFirst = (str) => {
  return str[0].toLowerCase() + str.slice(1);
};

/**
 * Convert API response errors to error object
 * @param {*} errors
 * @returns Object
 */
export const getApiError = (errors) => {
  const errorsData = errors?.map((err) => {
    return {
      name: lowercaseFirst(err.type),
      message: err.message,
    };
  });

  var object = errorsData.reduce((obj, item) => Object.assign(obj, { [item.name]: item.message }), {});

  return object;
};

/*
  MAPPING VALIDATE ERROR
*/
export const getValidationMessages = (errors) => {
  return errors?.map((err) => {
    return {
      name: lowercaseFirst(err.type),
      errors: [t(err.message)],
    };
  });
};

/*
  MAPPING VALIDATE ERROR WITH PARENT FIELD
*/
export const getValidationMessagesWithParentField = (errors, field) => {
  return errors?.map((err) => {
    return {
      name: [field, lowercaseFirst(err.type)],
      errors: [t(err.message)],
    };
  });
};

/**
 * Build Form data from object
 * @param {*} formData
 * @param {*} data
 * @param {*} parentKey
 */
export const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === "object" && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data === null ? "" : data;
    formData.append(parentKey, value);
  }
};

/**
 * Convert json object to form data
 * @param {*} data
 * @returns
 */
export const jsonToFormData = (data) => {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
};

//Capitalized Case
export const capitalize = (data) => {
  var result = data.toLowerCase();
  return result[0].toUpperCase() + result.slice(1);
};

export const compareTwoArrays = (array1, array2) => {
  try {
    if (array1?.length > 0 && array2?.length > 0) {
      let array2Sorted = array2?.slice()?.sort();
      let result =
        array1?.length === array2?.length &&
        array1
          ?.slice()
          ?.sort()
          ?.every(function (value, index) {
            return value === array2Sorted[index];
          });
      return result;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

/**
 * Capitalize the first letter of each word in a string
 * @param {*} string
 * @input "i have learned something new today"
 * @output "I Have Learned Something New Today"
 */
export const capitalizeFirstLetterEachWord = (words) => {
  if (words) {
    var separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  }
  return "";
};

/**
 * Format file name
 * @param {*} fileName
 * @input "hình- -ảnh"
 * @output "hinh-anh"
 */
export const fileNameNormalize = (fileName) => {
  const parsed = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/\-\-+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, ""); // Remove extra hyphens from beginning or end of the string

  return parsed;
};

export const tokenExpired = (token) => {
  const decoded = jwt_decode(token);
  const utcTime = moment.unix(decoded.exp);
  var tokenExpireDate = new Date(utcTime.format("M/DD/YYYY hh:mm:ss A UTC"));
  const currentDate = Date.now();
  var tokenExpired = moment(currentDate).isAfter(tokenExpireDate) ?? false;

  return tokenExpired;
};

export const getPermission = (permissionId) => {
  if (permissionId === "public") return true;
  const { session } = store.getState();
  let allPermissions = session?.permissions ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSIONS);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var permissions = JSON.parse(decodeData);
      allPermissions = permissions;
    }
  }

  const index = allPermissions.findIndex((x) => x.id === permissionId);

  return index !== -1 ? allPermissions[index] : null;
};

export const getPermissionGroup = (...permissions) => {
  const { session } = store.getState();
  let allPermissions = session?.permissionGroup ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSION_GROUP);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var _permissions = JSON.parse(decodeData);
      allPermissions = _permissions;
    }
  }
  var results = [];
  for (let i = 0; i < permissions.length; i++) {
    const element = permissions[i];
    var permission = getPermission(element);
    if (permission !== null) {
      const index = allPermissions.findIndex((x) => x.permissionGroupId === permission.permissionGroupId);
      if (index !== -1) {
        results.push(allPermissions[index]);
      }
    }
  }

  return results;
};

export const sortChildRoute = (routes) => {
  let numberIndex = 0;
  for (let i = 0; i < routes.length; i++) {
    const element = routes[i];
    if (element.isMenu === true && hasPermission(element.permission)) {
      var permissionGroup = getPermissionGroup(element.permission);
      if (permissionGroup.every((x) => x.isFullPermission === true)) {
        routes[i].position = 0;
      } else {
        routes[i].position = numberIndex + 1;
      }
      numberIndex++;
    }
  }

  return routes;
};

var lockedAt = 0;
const timeOut = 600;
export const preventMultipleClick = (e, ...funcs) => {
  if (+new Date() - lockedAt > timeOut) {
    funcs.forEach((func) => {
      if (func && {}.toString.call(func) === "[object Function]") {
        func();
      }
    });
  }
  lockedAt = +new Date();
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Get the value of a given query string parameter.
 */
export const getParamsFromUrl = (url) => {
  const params = new URLSearchParams(url);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

/**
 * Get Unique Id
 * @returns string (ex: 'ed596b16-debf-4471-b824-79e0d568ef0f')
 */
export const getUniqueId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

// Format time from dd/MM/yyyy: 00:00:00 to dd/MM/yyyy: current time
export const formatOnlyDate = (moment) => {
  var time = new Date();
  moment
    .set("hour", time.getHours())
    .set("minute", time.getMinutes())
    .set("second", time.getSeconds())
    .set("millisecond", time.getMilliseconds());

  return moment;
};

export const getStartDateEndDateInUtc = (startDate, endDate) => {
  let startDateParseMoment = moment(startDate);
  let endDateParseMoment = moment(endDate).add(1, "d").seconds(-1);
  // Parse local time from client to UTC time before comparation
  let fromDate = moment.utc(startDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
  let toDate = moment.utc(endDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);

  return {
    fromDate,
    toDate,
  };
};

/**
 * Format bytes of file size
 * @param {*} bytes the size in bytes to be converted
 * @param {*} decimals
 * @returns
 */
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const handleDownloadFile = ({ fileName, data }) => {
  var a = document.createElement("a");
  var url = window.URL.createObjectURL(data);
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Convert moment to date time zone
 * @param {*} momentLocalTime moment
 * @returns
 */
export const momentFormatDateTime = (momentLocalTime) => {
  if (momentLocalTime) {
    return momentLocalTime.format();
  } else {
    return null;
  }
};

export const getStartDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.startOf("day"));
  }

  return null;
};

export const getEndDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.endOf("day"));
  }

  return null;
};

String.prototype.clone = function () {
  if (this) {
    let newStr = this?.toString() + "-copy";
    return newStr;
  }

  return "New";
};

String.prototype.removeVietnamese = function () {
  let newStr = this?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  return newStr;
};

export const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
