import { Col, Row } from "antd";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import comboDataService from "data-services/combo/combo-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ListCompoComponent from "./components/list-combo.component";
import "./index.scss";

export default function CompoPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [listCombo, setListCombo] = useState([]);
  const [totalCombos, setTotalCombos] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const createNewPage = "/combo/create-new";
  const pageData = {
    btnAddNew: t("button.addNew"),
    title: t("combo.title"),
  };

  useEffect(async () => {
    //get list combos
    initDataTableCombos(tableSettings.page, tableSettings.pageSize);
  }, []);

  const initDataTableCombos = async (pageNumber, pageSize) => {
    //get list combos
    await comboDataService.getCombosAsync(pageNumber, pageSize).then((res) => {
      let combos = mappingToDataTableCombos(res.combos);
      setTotalCombos(res.total);
      setListCombo(combos);
    });
  };

  const mappingToDataTableCombos = (combos) => {
    return combos?.map((i, index) => {
      return {
        id: i.id,
        no: index + 1,
        name: i.name,
        totalBranch: i.isShowAllBranches ? i.branch?.length : i.comboStoreBranches?.length,
        comboTypeId: i.comboTypeId,
        price: i.sellingPrice,
        product: i.comboProductPrices,
        comboPricings: i.comboPricings,
        startDate: i.startDate,
        endDate: i.endDate,
        statusId: i.statusId,
        isStopped: i.isStopped,
        thumbnail: i.thumbnail,
      };
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    //get list combo management by pageNumber, pageSize
    initDataTableCombos(pageNumber, pageSize);
    setCurrentPageNumber(pageNumber);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            permission={PermissionKeys.CREATE_COMBO}
            onClick={() => history.push(createNewPage)}
            text={pageData.btnAddNew}
            className="float-right"
          />
        </Col>
      </Row>
      <Row>
        <ListCompoComponent
          listCombo={listCombo}
          totalCombos={totalCombos}
          pageSize={tableSettings.pageSize}
          onChangePage={onChangePage}
          comboDataService={comboDataService}
          currentPageNumber={currentPageNumber}
        />
      </Row>
    </>
  );
}
