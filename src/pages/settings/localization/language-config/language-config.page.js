import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.scss";
import AddLanguage from "./components/add-language.component";
import TableLanguageConfig from "./components/table-language.component";

const { Title } = Typography;
export default function LanguageConfig(props) {
  const { t, languageDataService } = props;
  const [languageList, setLanguageList] = useState([]);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [listLanguageStore, setListLanguageStore] = useState([]);

  const pageData = {
    btnAddLanguage: t("languageConfig.addLanguage"),
    translatedLanguages: t("languageConfig.translatedLanguages"),
    translatedContent: t("languageConfig.translatedContent"),
  };

  useEffect(() => {
    initDataTable();
  }, []);

  const showLanguage = async value => {
    setShowAddLanguage(value);
    await loadLanguageList();
  };

  const loadLanguageList = async () => {
    let res = await languageDataService.getListLanguageNotContainStoreIdAsync();
    if (res) {
      setLanguageList(res.languages);
    }
  };

  const initDataTable = () => {
    languageDataService.getListLanguageStoreByStoreIdAsync().then(res => {
      let languageStore = mappingToDataTable(res.languageStore);
      setListLanguageStore(languageStore);
    });
  };

  const mappingToDataTable = languageStore => {
    return languageStore?.map((i, index) => {
      return {
        id: i.id,
        name: i.name,
        emoji: i.emoji,
        isDefault: i.isDefault,
        isPublish: i.isPublish?.id,
        isPublishName: i.isPublish?.name,
      };
    });
  };

  const onCancel = () => {
    setShowAddLanguage(false);
  };

  return (
    <>
      <Card className="fnb-card-full">
        <Button className="float-right" type="primary" icon={<PlusOutlined />} onClick={() => showLanguage(true)}>
          {pageData.btnAddLanguage}
        </Button>

        <div className="clearfix"></div>
        <div className="mt-4">
          <Row>
            <Col span={12}>
              <Title level={3}>{pageData.translatedLanguages}</Title>
              <p>{pageData.translatedContent}</p>
            </Col>
            <Col span={12}>
              <TableLanguageConfig
                dataSource={listLanguageStore}
                languageDataService={languageDataService}
                initDataTable={initDataTable}
              />
            </Col>
          </Row>
        </div>
      </Card>
      <AddLanguage
        languageList={languageList}
        isModalVisible={showAddLanguage}
        handleCancel={() => onCancel()}
        t={t}
        onLoadLanguage={loadLanguageList}
        initDataTable={initDataTable}
      />
    </>
  );
}
