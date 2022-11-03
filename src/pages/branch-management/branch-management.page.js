import { Col, message, Row } from "antd";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import PageTitle from "components/page-title";
import { tableSettings } from "constants/default.constants";
import branchDataService from "data-services/branch/branch-data.service";
import storeDataService from "data-services/store/store-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { NotificationComponent } from "./components/notification/notification.component";
import "./index.scss";
import TableBranchManagement from "./table-branch-management";

export function BranchManagement(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    btnAddNew: t("button.addNew"),
  };

  const notificationRef = React.useRef();

  const [listBranchManagement, setListBranchManagement] = useState([]);
  const [totalBranchManagement, setTotalBranchManagement] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();

  useEffect(() => {
    initDataTableBranchManagement(tableSettings.page, tableSettings.pageSize, keySearch);

    let state = location?.state;
    if (state?.savedSuccessfully) {
      message.success(state?.message);
    }
  }, []);

  const initDataTableBranchManagement = async (pageNumber, pageSize, keySearch) => {
    setPageNumber(pageNumber);
    //get list group-permission
    let res = await branchDataService.getBranchManagementsAsync(pageNumber, pageSize, keySearch);
    let branchManagements = mappingToDataTableBranchManagements(res.branchManagements);
    setListBranchManagement(branchManagements);
    setTotalBranchManagement(res.total);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > res.total) {
      numberRecordCurrent = res.total;
    }
    setNumberRecordCurrent(numberRecordCurrent);
  };

  const mappingToDataTableBranchManagements = (branchManagements) => {
    return branchManagements?.map((i, index) => {
      return {
        id: i.id,
        no: index + 1,
        name: i.name,
        addressInfo: i.addressInfo,
        phoneNumber: i.phoneNumber,
        statusId: i?.statusId,
      };
    });
  };

  const onChangePage = async (pageNumber, pageSize) => {
    //get list branch management by pageNumber, pageSize
    initDataTableBranchManagement(pageNumber, pageSize, keySearch);
  };

  const onSearchBranchManagement = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        initDataTableBranchManagement(
          tableSettings.page,
          tableSettings.pageSize,
          keySearch
        );
      }, 500)
    );
  };

  const onCancel = () => {
    initDataTableBranchManagement(tableSettings.page, tableSettings.pageSize, keySearch);
  };

  const onCreateNewBranch = () => {
    storeDataService.getAvailableBranchQuantityAsync().then((res) => {
      const { availableBranchQuantity } = res;
      if (availableBranchQuantity > 0) {
        history.push("/branch/create-new");
      } else {
        /// show notification
        if (notificationRef && notificationRef.current) {
          notificationRef.current.showNotification();
        }
      }
    });
  };

  return (
    <>
      <NotificationComponent
        ref={notificationRef}
        onClick={() => {
          history.push("/branch/branch-purchase");
        }}
      />
      <Row className="fnb-row-page-header">
        <Col span={12}>
          <PageTitle content={t("settings.tabBranchManagement")} />
        </Col>
        <Col span={12}>
          <FnbAddNewButton
            className="float-right"
            onClick={onCreateNewBranch}
            text={pageData.btnAddNew}
          />
        </Col>
      </Row>
      <TableBranchManagement
        dataSource={listBranchManagement}
        total={totalBranchManagement}
        pageSize={tableSettings.pageSize}
        pageNumber={pageNumber}
        onChangePage={onChangePage}
        onSearch={onSearchBranchManagement}
        onCancel={onCancel}
        branchDataService={branchDataService}
        numberRecordCurrent={numberRecordCurrent}
      />
    </>
  );
}
