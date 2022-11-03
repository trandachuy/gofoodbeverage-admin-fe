import { FnbUploadBanner } from "components/fnb-upload-banner/fnb-upload-banner.component";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import storeDataService from "data-services/store/store-data.service";
import "./display.component.scss";
import { Card, Col, Row, Typography } from "antd";
import { FnbUploadStoreLogoComponent } from "components/fnb-upload-store-logo/fnb-upload-store-logo.component";
import { useRef } from "react";
import { useSelector } from "react-redux";

export const BannerTypes = {
  FullScreen: 0,
  LeftSide: 1,
};

const { Text } = Typography;

export default function Display(props) {
  const { t, storeId } = props;
  const [countImgFullScreen, setCountImgFullScreen] = useState(false);
  const [countImgLeftSide, setCountImgLeftSide] = useState(false);
  const [bannersFullScreen, setBannerFullScreen] = useState([]);
  const [bannersLeftSide, setBannerLeftSide] = useState([]);
  const [haveImage, setHaveImage] = useState(null);
  const uploadStoreLogoRef = useRef();
  const stateInformation = useSelector((state) => state);

  const pageData = {
    storeBanner: {
      title: t("storeBanner.title"),
      subTitle: t("storeBanner.subTitle"),
      subSubTitle1: t("storeBanner.subSubTitle1"),
      subSubTitle2: t("storeBanner.subSubTitle2"),

      fullscreenTitle: t("storeBanner.fullscreenTitle"),
      fullscreenSubTitle: t("storeBanner.fullscreenSubTitle"),
      leftSideTitle: t("storeBanner.leftSideTitle"),
      leftSideSubTitle: t("storeBanner.leftSideSubTitle"),
    },
    btnAddNew: t("button.addNew"),
    uploadStoreLogo: t("productManagement.generalInformation.addFile"),
    addFromUrl: t("upload.addFromUrl"),
    textNonImage: t("media.textNonImage"),
    storeLogoTitle: t("storeLogo.title"),
    storeLogoSubTitle: t("storeLogo.subTitle"),
    storeLogoSubSubTitle1: t("storeLogo.subSubTitle1"),
    storeLogoSubSubTitle2: t("storeLogo.subSubTitle2"),
  };

  useEffect(() => {
    initBannerValue();
    getStoreLogo();
  }, []);

  //#region STORE BANNER

  const initBannerValue = () => {
    //Get fullscreen banners
    getFullScreenBanners();

    //Get leftSide banners
    getLeftSideBanners();
  };

  const getFullScreenBanners = async () => {
    const res = await storeDataService.getStoreBannersAsync(BannerTypes.FullScreen);
    if (res) {
      let mapperThumbnail = res.thumbnails.map((thumbnail) => {
        return { data_url: thumbnail };
      });
      setBannerFullScreen(mapperThumbnail);
      setCountImgFullScreen(mapperThumbnail.length > 0);
    }
  };

  const getLeftSideBanners = async () => {
    const res = await storeDataService.getStoreBannersAsync(BannerTypes.LeftSide);
    if (res) {
      let mapperThumbnail = res.thumbnails.map((thumbnail) => {
        return { data_url: thumbnail };
      });
      setBannerLeftSide(mapperThumbnail);
      setCountImgLeftSide(mapperThumbnail.length > 0);
    }
  };

  const onChangeBanner = async (bannerType, file) => {
    if (bannerType === BannerTypes.FullScreen) {
      setCountImgFullScreen(file.length > 0);
    }

    if (bannerType === BannerTypes.LeftSide) {
      setCountImgLeftSide(file.length > 0);
    }

    //Update Banner
    let listThumbs = [];
    for (let i = 0; i < file.length; i++) {
      listThumbs.push(String(file[i].data_url));
    }
    let data = {
      storeId: storeId,
      type: bannerType,
      thumbnails: listThumbs,
    };
    const res = await storeDataService.updateStoreBannersAsync(data);
    if (res) {
      if (bannerType === BannerTypes.FullScreen) {
        getFullScreenBanners();
      } else {
        getLeftSideBanners();
      }
    }
  };

  //#endregion

  const onChangeImage = (file) => {
    setHaveImage(file);
  };

  const getStoreLogo = () => {
    let storeLogo = stateInformation?.session?.storeLogo;
    if (uploadStoreLogoRef && uploadStoreLogoRef.current) {
      uploadStoreLogoRef.current.setImage(storeLogo);
    }
    setHaveImage(storeLogo?.length > 0);
  };

  return (
    <>
      <div className="setting-general-display">
        <div className="logo">
          <div className="logo__info">
            <Card className="fnb-card-store-logo">
              <Row className="fnb-card-store-logo-body">
                <Col sm={24} md={24} lg={12} className="store-logo-suggest-content">
                  <div className="store-logo-suggest-information">
                    <p className="store-logo-suggest-information-title">{pageData.storeLogoTitle}</p>
                    <p className="store-logo-suggest-information-sub-title">{pageData.storeLogoSubTitle}</p>
                    <p className="store-logo-suggest-information-sub-subtitle">
                      <span className="store-logo-dot"></span>
                      <span className="store-logo-text">{pageData.storeLogoSubSubTitle1}</span>
                    </p>
                    <p className="store-logo-suggest-information-sub-subtitle">
                      <span className="store-logo-dot"></span>
                      <span className="store-logo-text">{pageData.storeLogoSubSubTitle2}</span>
                    </p>
                  </div>
                </Col>
                <Col sm={24} md={24} lg={12} className="image-store-logo-suggest-content">
                  <div className={`store-logo-content ${haveImage && "store-logo-content-none-background"}`}>
                    <Row className={`store-none-logo ${haveImage && "have-image"}`}>
                      <Col span={24} className={`image-product ${haveImage && "justify-right"}`}>
                        <FnbUploadStoreLogoComponent
                          ref={uploadStoreLogoRef}
                          buttonText={pageData.uploadStoreLogo}
                          onChange={onChangeImage}
                        />
                        <a className="upload-image-url" hidden={haveImage}>
                          {pageData.addFromUrl}
                        </a>
                      </Col>
                      <Col span={24} className="text-non-image" hidden={haveImage}>
                        <div>
                          <Text disabled>{pageData.textNonImage}</Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
        <div className="banner">
          <div className="banner__info">
            <h3 className="title">{pageData.storeBanner.title}</h3>
            <p className="description">{pageData.storeBanner.subTitle}</p>
          </div>
          <div className="banner__upload">
            <div className="banner__upload__fullscreen">
              <h3 className="title">{pageData.storeBanner.fullscreenTitle}</h3>
              <p className="description">{pageData.storeBanner.fullscreenSubTitle}</p>
              <div className="banner__upload__wrapper">
                <FnbUploadBanner
                  value={bannersFullScreen}
                  onChange={(file) => onChangeBanner(BannerTypes.FullScreen, file)}
                  className={countImgFullScreen > 0 && "remove-background-border"}
                />
              </div>
            </div>
            <div className="banner__upload__leftSide">
              <h3 className="title">{pageData.storeBanner.leftSideTitle}</h3>
              <p className="description">{pageData.storeBanner.leftSideSubTitle}</p>
              <div className="banner__upload__wrapper">
                <FnbUploadBanner
                  value={bannersLeftSide}
                  onChange={(file) => onChangeBanner(BannerTypes.LeftSide, file)}
                  className={countImgLeftSide > 0 && "remove-background-border"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
