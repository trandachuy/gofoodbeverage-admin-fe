import { Space, Image } from "antd";
import { BackToIcon } from "constants/icons.constants";
import React from "react";
import { useTranslation } from "react-i18next";
import storeDefault from "../../../assets/images/store-default.jpg";

function ListStoreComponent(props) {
  const { storeList, onSelectStore, onBackLogin } = props;
  const [t] = useTranslation();

  const pageData = {
    selectStore: t("signIn.selectStore"),
    back: t("button.back"),
  };

  return (
    <div className="div-form login-contain login-contain__right">
      <div className="select-store-form login-form login-inner login-inner__spacing">
        <div className="content-inner">
          <a onClick={onBackLogin}>
            <span>
              <BackToIcon />
            </span>
            {pageData.back}
          </a>
          <h1 className="label-store">{pageData.selectStore}</h1>
          <div className="store-form">
            {storeList.map((store) => {
              return (
                <div className="store-detail-form" onClick={() => onSelectStore(store.storeId, store.accountId)}>
                  <Space>
                    <Image preview={false} src={store.StoreThumbnail || storeDefault} width={100} />
                    <span>{store.storeName}</span>
                  </Space>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListStoreComponent;
