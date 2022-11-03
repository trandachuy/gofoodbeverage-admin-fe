import React, { useState, useEffect } from "react";
import { Row, Col, Form, Select, Radio } from "antd";
import PageTitle from "components/page-title";
import { Content } from "antd/lib/layout/layout";
import AreaManagement from "./components/list-area.component";
import TableManagement from "./components/list-table.component";
import { useTranslation } from "react-i18next";
import branchDataService from "data-services/branch/branch-data.service";
import "./area-table.page.scss";

const { Option } = Select;

export default function AreaTableManagement(props) {
  const [t] = useTranslation();

  const pageData = {
    areaAndTableManagement: t("area.areaAndTableManagement"),
    area: t("area.area"),
    areaManagement: t("area.title"),
    selectBranch: t("material.inventory.branchSelectPlaceholder"),
    areaTable: t("areaTable.table"),
    areaTableManagement: t("areaTable.title"),
  };

  const [listBranch, setListBranch] = useState([]);
  const [getStoreBranchId, setGetStoreBranchId] = useState(null);

  let screens = {
    area: {
      key: 1,
      component: <AreaManagement storeBranchId={getStoreBranchId} />,
    },
    table: {
      key: 2,
      component: <TableManagement storeBranchId={getStoreBranchId} />,
    },
  };
  const [activeScreen, setActiveScreen] = useState(screens.area.key);

  useEffect(() => {
    getInitDataAsync();
  }, []);

  const getInitDataAsync = async () => {
    await branchDataService.getAllBranchsAsync().then((res) => {
      setListBranch(res.branchs);
      setGetStoreBranchId(res?.branchs[0]?.id);
    });
  };

  const renderScreenContent = () => {
    switch (activeScreen) {
      case screens.area.key:
        return screens.area.component;
      case screens.table.key:
        return screens.table.component;
      default:
        return screens.area.component;
    }
  };

  if (!getStoreBranchId) return <></>;

  return (
    <>
      <div>
        <Row>
          <Col span={18}>
            <PageTitle content={pageData.areaAndTableManagement} />
          </Col>
          <Col span={6}>
            <Form initialValues={{ storeBranchId: getStoreBranchId }}>
              <Form.Item name="storeBranchId">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  size="large"
                  onChange={(value) => setGetStoreBranchId(value)}
                  placeholder={pageData.selectBranch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  defaultValue={getStoreBranchId}
                >
                  {listBranch?.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                  ;
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <div>
        <Content style={{ overflow: "initial" }}>
          <Radio.Group value={activeScreen} onChange={(e) => setActiveScreen(e.target.value)}>
            <Radio.Button value={screens.area.key} className="mr-2">
              {pageData.area}
            </Radio.Button>
            <Radio.Button value={screens.table.key} className="mr-2">
              {pageData.areaTable}
            </Radio.Button>
          </Radio.Group>

          <div>{renderScreenContent()}</div>
        </Content>
      </div>
    </>
  );
}
