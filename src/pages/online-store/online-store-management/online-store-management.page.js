import { Button, Card, Col, Image, Modal, Row, Space } from "antd";
import OnlineStoreBackground from "assets/images/online-store-background.png";
import PageTitle from "components/page-title";
import { BackIcon } from "constants/icons.constants";
import storeDataService from "data-services/store/store-data.service";
import "moment/locale/vi";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./online-store-management.scss";

export default function OnlineStoreManagement(props) {
  const { t } = props;

  const pageData = {
    title: t("onlineStore.title"),
    selectTheme: t("onlineStore.selectTheme"),
    notSelectTheme: t("onlineStore.notSelectTheme"),
    theme: t("onlineStore.theme"),
    themeStore: t("onlineStore.themeStore"),
    currentTheme: t("onlineStore.currentTheme"),
    themeDetail: t("onlineStore.themeDetail"),
    apply: t("onlineStore.apply"),
    preview: t("onlineStore.preview"),
    includesSupport: t("onlineStore.includesSupport"),
  };

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleDetail, setIsModalVisibleDetail] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectTheme, setSelectTheme] = useState({});

  const onShowThemes = async () => {
    setThemes([]);
    var data = await storeDataService.getThemesAsync();
    setThemes(data.themes);
    setIsModalVisible(true);
  };

  const onShowDetailTheme = async (id) => {
    var theme = themes.find((x) => x.id === id);
    setSelectTheme(theme);
    setIsModalVisibleDetail(true);
  };

  return (
    <>
      <div className="online-store-management">
        <Row className="fnb-row-page-header">
          <Col span={24}>
            <Space className="page-title">
              <PageTitle content={pageData.title} />
            </Space>
          </Col>
        </Row>
        {isTabletOrMobile ? (
          <Card className="online-store-card-mobile">
            <Col span={12}>
              <div className="title">{pageData.theme}</div>
            </Col>
          </Card>
        ) : (
          <Card className="online-store-card">
            <Col span={12}>
              <div className="title">{pageData.theme}</div>
            </Col>
          </Card>
        )}

        <Card className="online-store-card-main">
          {isTabletOrMobile ? (
            <>
              <Row>
                <Col span={24}>
                  <Image className="img-prop-mobile" src={OnlineStoreBackground} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="title-mobile">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: pageData.notSelectTheme,
                      }}
                    ></p>
                    <Button
                      type="primary"
                      className="btn-select-mobile"
                      htmlType="submit"
                      onClick={() => onShowThemes(true)}
                    >
                      {pageData.selectTheme}
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <Row>
              <Col span={12}>
                <div className="title">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: pageData.notSelectTheme,
                    }}
                  ></p>
                  <Button type="primary" className="btn-select" htmlType="submit" onClick={() => onShowThemes(true)}>
                    {pageData.selectTheme}
                  </Button>
                </div>
              </Col>
              <Col span={12} className="img-back-ground">
                <Image className="img-prop" src={OnlineStoreBackground} />
              </Col>
            </Row>
          )}
        </Card>
      </div>
      <Modal
        onCancel={() => setIsModalVisible(false)}
        className={isTabletOrMobile ? "online-store-modal-mobile" : "online-store-modal"}
        width={1416}
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row className="online-store-header">
          <h3>{pageData.themeStore}</h3>
        </Row>
        <hr />
        <div className="online-store-list">
          {
            <div className={isTabletOrMobile ? "online-store-wrapper-mobile" : "online-store-wrapper"}>
              {
                <>
                  {themes?.map((theme) => {
                    return (
                      <div className="order-content-card">
                        <div className="order-content-header">
                          <Image className="theme-card" src={theme?.thumbnail} />
                        </div>
                        <div className="order-content" onClick={() => onShowDetailTheme(theme?.id)}>
                          <Row>
                            <p className="title-theme">{theme?.name}</p>
                            {theme?.isDefault && <div className="default-theme">{pageData.currentTheme}</div>}
                          </Row>
                          <Row className="tag-margin">
                            {theme?.tags?.split(",").map((tag) => {
                              return <p className="material-view-branch-select material-view-text">{tag}</p>;
                            })}
                          </Row>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            </div>
          }
        </div>
      </Modal>

      <Modal
        onCancel={() => setIsModalVisibleDetail(false)}
        className={isTabletOrMobile ? "online-store-modal-mobile" : "online-store-modal"}
        width={1416}
        visible={isModalVisibleDetail}
        footer={(null, null)}
      >
        <Row className="online-store-header">
          <h3>
            {!isTabletOrMobile && <BackIcon className="back-icon" onClick={() => setIsModalVisibleDetail(false)} />}
            {pageData.themeDetail}
          </h3>
        </Row>
        <hr />
        <div className="online-store-list">
          {isTabletOrMobile ? (
            <div className="online-store-wrapper-mobile">
              {
                <>
                  <div className="content-theme-detail-padding">
                    <Row>
                      <Col sm={24} xs={24} lg={14}>
                        <Image width={350} height={213} src={selectTheme?.thumbnail} />
                      </Col>
                      <Col sm={24} xs={24} lg={10}>
                        <Row>
                          <div className="title-theme-detail">{selectTheme?.name}</div>
                        </Row>
                        <Row>
                          <Col span={24} className="content-theme-detail">
                            {selectTheme?.description}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="title-theme-tag">
                            {pageData.includesSupport}
                          </Col>
                        </Row>
                        {selectTheme?.tags?.split(",").map((tag) => {
                          return (
                            <Row>
                              <Col span={24} className="theme-tag">
                                {`. ${tag}`}
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <BackIcon className="back-icon" onClick={() => setIsModalVisibleDetail(false)} />
                        <Button
                          type="button"
                          className="btn-theme-detail-preview-theme"
                          onClick={() => setIsModalVisible(true)}
                        >
                          {pageData.preview}
                        </Button>
                        <Button
                          type="button"
                          className="btn-theme-detail-change-theme"
                          onClick={() => setIsModalVisible(true)}
                        >
                          {pageData.apply}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              }
            </div>
          ) : (
            <div className="online-store-wrapper">
              {
                <>
                  <div className="content-theme-detail-padding">
                    <Row>
                      <Col span={14}>
                        <Image width={771} height={470} src={selectTheme?.thumbnail} />
                      </Col>
                      <Col span={10} className="info-theme-detail">
                        <Row className="title-theme-detail">
                          <div>{selectTheme?.name}</div>
                        </Row>
                        <Row>
                          <Col span={24} className="content-theme-detail">
                            {selectTheme?.description}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24} className="title-theme-tag">
                            {pageData.includesSupport}
                          </Col>
                        </Row>
                        {selectTheme?.tags?.split(",").map((tag) => {
                          return (
                            <Row>
                              <Col span={24} className="theme-tag">
                                {`. ${tag}`}
                              </Col>
                            </Row>
                          );
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={14}>
                        <Button
                          type="button"
                          className="btn-theme-detail-preview-theme"
                          onClick={() => setIsModalVisible(true)}
                        >
                          {pageData.preview}
                        </Button>
                        <Button
                          type="button"
                          className="btn-theme-detail-change-theme"
                          onClick={() => setIsModalVisible(true)}
                        >
                          {pageData.apply}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              }
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
