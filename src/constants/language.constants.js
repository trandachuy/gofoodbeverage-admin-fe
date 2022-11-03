import { UKFlagIcon, VNFlagIcon } from "./icons.constants";

export const languageCode = {
  en: "en",
  vi: "vi",
  ko: "ko",
  ja: "ja",
  zh: "zh",
  th: "th",
  ms: "ms",
  id: "id",
};

export const listDefaultLanguage = [
  {
    name: "language.english",
    emoji: "GB",
    isPublish: false,
    isDefault: true,
    languageCode: "en",
    countryCode: "US",
    flag: <UKFlagIcon />,
  },
  {
    name:  "language.vietnamese",
    emoji: "VN",
    isPublish: false,
    isDefault: true,
    languageCode: "vi",
    countryCode: "VN",
    flag: <VNFlagIcon />,
  }
];

export const languageCodeLocalStorageKey = "i18nextLng";
