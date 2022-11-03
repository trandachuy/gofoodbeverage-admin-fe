import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.scss";

export default function PageNotFound(props) {
  const history = useHistory();
  const [t] = useTranslation();
  const pageData = {
    opps: t("pageNotFound.opps"),
    pageNotFound: t("pageNotFound.pageNotFound"),
    message: t("pageNotFound.message"),
    backToHomePage: t("pageNotFound.backToHomePage"),
  };

  return (
    <div className="page-not-found">
      <div className="page-background">
        <div className="img-background">
          <div className="box-center">
            <div className="head-text">{pageData.opps}</div>
            <div className="exclamation-point">!</div>
            <div className="error-text">{pageData.pageNotFound}</div>
            <div className="message-text">{pageData.message}</div>
            <button className="button-bg" onClick={() => history.push("/")}>
              <span className="button-text">{pageData.backToHomePage}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
