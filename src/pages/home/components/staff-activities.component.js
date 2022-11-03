import { Card, Col, Image, Row, Table, Typography } from "antd";
import { Thumbnail } from "components/thumbnail/thumbnail";
import {
  ActivityApprovePurchaseOrderIcon,
  ActivityCompletePurchaseOrderIcon,
  ActivityCreateCustomerIcon,
  ActivityCreateCustomerSegmentIcon,
  ActivityCreateMaterialCategoryIcon,
  ActivityCreateMemberShipIcon,
  ActivityCreateOptionIcon,
  ActivityCreateOrderIcon,
  ActivityCreatePointConfigurationIcon,
  ActivityCreateProductCategoryIcon,
  ActivityCreatePurchaseOrderIcon,
  ActivityCreateSupplierIcon,
  ActivityDeleteCustomerIcon,
  ActivityDeleteCustomerSegmentIcon,
  ActivityDeleteMaterialCategoryIcon,
  ActivityDeleteMemberShipIcon,
  ActivityDeleteOptionIcon,
  ActivityDeleteOrderIcon,
  ActivityDeleteProductCategoryIcon,
  ActivityDeletePurchaseOrderIcon,
  ActivityDeleteSupplierIcon,
  ActivityEditCustomerIcon,
  ActivityEditCustomerSegmentIcon,
  ActivityEditMaterialCategoryIcon,
  ActivityEditMemberShipIcon,
  ActivityEditOptionIcon,
  ActivityEditOrderIcon,
  ActivityEditPointConfigurationIcon,
  ActivityEditPurchaseOrderIcon,
  ActivityEditSupplierIcon,
  ActivityUpdateProductCategoryIcon,
  TableNoDataDefaultIcon,
} from "constants/icons.constants";
import { images } from "constants/images.constants";
import { actionGroup, actionType } from "constants/staff-activities.constants";
import staffDataService from "data-services/staff/staff-data.service";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

const { Paragraph } = Typography;

export default function StaffActivitiesComponent() {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [t] = useTranslation();
  const [staffActivitiesList, setStaffActivitiesList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalActivitiesItem, setTotalActivitiesItem] = useState(0);
  const pageData = {
    recentlyActivitiesText: t("homePage.recentlyActivitiesText"),
    noDataFound: t("table.noDataFound"),
  };

  useEffect(() => {
    getStaffActivitiesList();
  }, []);

  const getStaffActivitiesList = () => {
    let data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
    let skipValue = (pageIndex - 1) * pageSize;
    if (totalActivitiesItem === 0 || (totalActivitiesItem > 0 && skipValue < totalActivitiesItem)) {
      staffDataService
        .getStaffActivities(data)
        .then((response) => {
          setTotalActivitiesItem(response.totalItem);
          if (staffActivitiesList.length > 0) {
            setStaffActivitiesList((oldStaffActivities) => [...oldStaffActivities, response.staffActivities]);
          } else {
            setStaffActivitiesList(response.staffActivities);
          }
        })
        .catch((errors) => {});
    }
  };

  const getIconForStaffActivities = (activity) => {
    let iconActivity = null;
    switch (activity.actionGroup) {
      case actionGroup.Order:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateOrderIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditOrderIcon />;
            break;
          case actionType.UpdateStatus:
            iconActivity = <ActivityEditOrderIcon />;
            break;
          case actionType.Cancelled:
            iconActivity = <ActivityDeleteOrderIcon />;
            break;
          case actionType.PaymentStatus:
            iconActivity = <ActivityEditOrderIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.Product:
      case actionGroup.Material:
        iconActivity = <Thumbnail className="item-content-recently-activities-icon-image" src={null} />;
        break;
      case actionGroup.ProductCategory:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateProductCategoryIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityUpdateProductCategoryIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteProductCategoryIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.Option:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateOptionIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditOptionIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteOptionIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.Combo:
        iconActivity = (
          <Image
            preview={false}
            className="thumbnail"
            width={56}
            height={56}
            src={"error"}
            fallback={images.comboDefault}
          />
        );
        break;
      case actionGroup.MaterialCategory:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateMaterialCategoryIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditMaterialCategoryIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteMaterialCategoryIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.Supplier:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateSupplierIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditSupplierIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteSupplierIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.PurchaseOrder:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreatePurchaseOrderIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditPurchaseOrderIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeletePurchaseOrderIcon />;
            break;
          case actionType.Approved:
            iconActivity = <ActivityApprovePurchaseOrderIcon />;
            break;
          case actionType.Completed:
            iconActivity = <ActivityCompletePurchaseOrderIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.Customer:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateCustomerIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditCustomerIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteCustomerIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.CustomerSegment:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateCustomerSegmentIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditCustomerSegmentIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteCustomerSegmentIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.MemberShip:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreateMemberShipIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditMemberShipIcon />;
            break;
          case actionType.Deleted:
            iconActivity = <ActivityDeleteMemberShipIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      case actionGroup.PointConfiguration:
        switch (activity.actionType) {
          case actionType.Created:
            iconActivity = <ActivityCreatePointConfigurationIcon />;
            break;
          case actionType.Edited:
            iconActivity = <ActivityEditPointConfigurationIcon />;
            break;
          default:
            iconActivity = null;
            break;
        }
        break;
      default:
        break;
    }

    return iconActivity;
  };

  const onClickObjectName = (item) => {
    let hasDeleted = staffActivitiesList.filter(
      (a) => a.objectId === item.objectId && a.actionType === actionType.Deleted
    );
    switch (item.actionGroup) {
      case actionGroup.Product:
        if (hasDeleted.length <= 0) window.open(`/product/details/${item.objectId}`, "_blank");
        break;
      case actionGroup.Combo:
        if (hasDeleted.length <= 0) window.open(`/combo/detail/${item.objectId}`, "_blank");
        break;
      case actionGroup.Material:
        if (hasDeleted.length <= 0) window.open(`/inventory/material/detail/${item.objectId}`, "_blank");
        break;
      case actionGroup.Supplier:
        if (hasDeleted.length <= 0) window.open(`/inventory/supplier/${item.objectId}`, "_blank");
        break;
      case actionGroup.PurchaseOrder:
        if (hasDeleted.length <= 0) window.open(`/inventory/detail-purchase-order/${item.objectId}`, "_blank");
        break;
      case actionGroup.Customer:
        if (hasDeleted.length <= 0) window.open(`/customer/detail/${item.objectId}`, "_blank");
        break;
      case actionGroup.PointConfiguration:
        if (hasDeleted.length <= 0) window.open(`/customer/loyalty-point/configuration`, "_blank");
        break;
      case actionGroup.CustomerSegment:
        if (hasDeleted.length <= 0) window.open(`/customer/segment/edit/${item.objectId}`, "_blank");
        break;
      case actionGroup.MemberShip:
        if (hasDeleted.length <= 0) window.open(`/membership/edit/${item.objectId}`, "_blank");
        break;
      default:
        break;
    }
  };

  const calculatingPeriod = (dateTimeValue) => {
    let resultPeriod = null;
    let createdDateTime = moment.utc(dateTimeValue).local();
    let dateTimeNow = moment(new Date());
    const diffDuration = moment.duration(dateTimeNow.diff(createdDateTime));

    if (diffDuration.years() > 0) {
      resultPeriod = `${diffDuration.years()} ${t("activityPeriod.years")}`;
      return resultPeriod;
    }
    if (diffDuration.months() > 0) {
      resultPeriod = `${diffDuration.months()} ${t("activityPeriod.months")}`;
      return resultPeriod;
    }
    if (diffDuration.days() > 0) {
      resultPeriod = `${diffDuration.days()} ${t("activityPeriod.days")}`;
      return resultPeriod;
    }
    if (diffDuration.hours() > 0) {
      resultPeriod = `${diffDuration.hours()} ${t("activityPeriod.hours")}`;
      return resultPeriod;
    }
    if (diffDuration.minutes() > 0) {
      resultPeriod = `${diffDuration.minutes()} ${t("activityPeriod.minutes")}`;
      return resultPeriod;
    }
    if (diffDuration.seconds() > 0) {
      resultPeriod = `${diffDuration.seconds()} ${t("activityPeriod.seconds")}`;
      return resultPeriod;
    }
  };

  const onClickStaffName = (staffId) => {
    window.open(`/staff/edit/${staffId}`, `_blank`);
  };

  const contentScroll = (event) => {
    const controlScroll = document.getElementById("content-recently-activity");
    const { scrollHeight, scrollTop, clientHeight } = event.target;
    let positionLoadData = (controlScroll.offsetHeight * 2) / 100;
    const scroll = scrollHeight - scrollTop - clientHeight;
    if (scroll <= positionLoadData) {
      setPageIndex(pageIndex + 1);
      getStaffActivitiesList();
    }
  };

  return (
    <>
      <Card
        className={
          isTabletOrMobile
            ? "fnb-box custom-box card-selling-product-thumbnail recently-activities-card-width"
            : "fnb-box custom-box card-selling-product-thumbnail top-selling-product-card-width recently-activities-card-width"
        }
      >
        <Row style={{ height: "100%" }} className="group-recently-activities">
          <Col span={24} className="group-header-top-activities-box">
            <p style={{ color: "#2B2162" }}>{pageData.recentlyActivitiesText}</p>
          </Col>
          <Col
            span={24}
            className={isTabletOrMobile ? "content-recently-activity-tablet" : "content-recently-activity"}
            id="content-recently-activity"
            onScroll={contentScroll}
          >
            {staffActivitiesList.length > 0 ? (
              staffActivitiesList.map((item, index) => {
                return (
                  item.staffId && (
                    <Row
                      className={`${
                        index % 2 === 0
                          ? "item-content-recently-activities"
                          : "item-content-recently-activities item-content-recently-activities-background-white"
                      }`}
                      key={`recently-activities-${index}`}
                    >
                      <Col span={4}>
                        <div className="item-content-recently-activities-icon">
                          {item.objectThumbnail === undefined ||
                          item.objectThumbnail === "" ||
                          item.objectThumbnail === null ? (
                            getIconForStaffActivities(item)
                          ) : (
                            <Thumbnail
                              className="item-content-recently-activities-icon-image"
                              src={item.objectThumbnail}
                            />
                          )}
                        </div>
                      </Col>
                      <Col span={18} className="item-content-recently-activities-body">
                        <Paragraph
                          className="paragraph-item-content-recently-activities"
                          placement="top"
                          ellipsis={{
                            tooltip: `${item.staffName} ${t(item.actionTypeDescribe)} ${t(item.actionGroupDescribe)} ${
                              !isNaN(+`${item.objectName}`) ? `#${item.objectName}` : item.objectName
                            }`,
                            rows: 2,
                          }}
                          color="#50429B"
                        >
                          <span>
                            <b
                              className="item-content-recently-activities-user-name"
                              onClick={() => onClickStaffName(item.staffId)}
                            >{`${item.staffName} `}</b>
                            {`${t(item.actionTypeDescribe)} ${t(item.actionGroupDescribe)}`}
                            <b
                              className="item-content-recently-activities-code"
                              onClick={() => onClickObjectName(item)}
                            >
                              {" "}
                              {!isNaN(+`${item.objectName}`) ? `#${item.objectName}` : item.objectName}
                            </b>
                          </span>
                        </Paragraph>

                        <div className="item-content-period">{calculatingPeriod(item.executedTime)}</div>
                      </Col>
                    </Row>
                  )
                );
              })
            ) : (
              <div className="item-content-recently-activities-non-data">
                <span className="item-content-recently-activities-text-non-data">
                  <TableNoDataDefaultIcon />
                  <br />
                  {pageData.noDataFound}
                </span>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
}
