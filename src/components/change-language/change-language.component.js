import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Popover } from "antd";
import Flags from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import languageService from "services/language/language.service";
import languageDataService from "data-services/language/language-data.service";
import i18n from "utils/i18n";
import { setLanguageSession } from "./../../store/modules/session/session.actions";
import "./change-language.scss";

function ChangeLanguage(props) {
  const { t } = useTranslation();
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [languageList, setLanguageList] = useState([]);
  const dispatch = useDispatch();
  const languageSession = useSelector(state => state.session?.languageSession);

  useEffect(() => {
    if (!languageSession) {
      loadLanguage();
      window.reloadLang = loadLanguage;
    } else {
      setDefaultLanguage(languageSession.default);
      setLanguageList(languageSession.list);
    }
  }, []);

  const loadLanguage =() => {
    languageDataService.getListLanguageByStoreIdAndIsPublishAsync().then(jsonObject => {
      setLanguageList(jsonObject.languages);

      let defaultLanguageCode = languageService.getLang();
      let language = jsonObject.languages.find(lang => lang.languageCode === defaultLanguageCode);
      setDefaultLanguage(language);
      dispatch(setLanguageSession({ default: language, list: jsonObject.languages }));
    });
  };

  const onChangeLang = selectedLang => {
    languageService.setLang(selectedLang);
    i18n.changeLanguage(selectedLang);

    let language = languageList?.find(lang => lang.languageCode === selectedLang);
    setDefaultLanguage(language);
    dispatch(setLanguageSession({ default: language, list: languageList }));
    props.showAndHideLanguageBox(false);
  };

  const contentLanguage = () => {
    return (
      <>
        {languageList?.map((item, index) => (
          <div key={index} onClick={() => onChangeLang(item.languageCode)} className="pointer">
            {getFlag(item.emoji, item.name)}
            <a>{t(item.name)}</a>
          </div>
        ))}
      </>
    );
  };

  const getFlag = (languageCode, title) => {
    var Flag = Flags[languageCode];
    return <Flag title={t(title)} className="flag" />;
  };

  const getDefaultFlag = (languageCode, title) => {
    var Flag = Flags[languageCode];
    return (
      <>
        <Flag title={t(title)} className="flag" />
        {t(title)}
      </>
    );
  };

  return (
    <>
      <div>
        <Popover
          placement="bottom"
          overlayClassName="language-top-bar"
          content={contentLanguage}
          trigger="hover"
          visible={props.visible}
          onVisibleChange={props.showAndHideLanguageBox}
        >
          <a className="link-language">
            {defaultLanguage && getDefaultFlag(defaultLanguage.emoji, defaultLanguage.name)}
          </a>
        </Popover>
      </div>
    </>
  );
}

export default ChangeLanguage;
