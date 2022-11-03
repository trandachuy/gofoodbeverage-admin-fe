import { Row, Tooltip } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { EmailCampaignStatus } from "constants/email-campaign.constants";
import { CloneIcon, EditFill, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import emailCampaignDataService from "data-services/email-campaign/email-campaign-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { convertUtcToLocalTime, hasPermission } from "utils/helpers";
import "../email-campaign.page.scss";

export default function TableEmailCampaign(props) {
  const [t] = useTranslation();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [keySearch, setKeySearch] = useState("");

  const translateData = {
    no: t("table.no", "No"),
    campaignName: t("marketing.emailCampaign.campaignName", "Campaign Name"),
    time: t("promotion.table.time", "Time"),
    status: t("promotion.table.status", "Status"),
    action: t("promotion.table.action", "Action"),
    search: t("promotion.search", "Search by name"),
  };

  const getColumns = () => {
    const columns = [
      {
        title: translateData.no.toUpperCase(),
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "5%",
      },
      {
        title: translateData.campaignName.toUpperCase(),
        dataIndex: "campaignName",
        key: "campaignName",
        align: "left",
        width: "45%",
        render: (_, record) => {
          return (
            <div className="text-line-clamp-2">
              <Tooltip title={record.campaignName}>
                <Link to={`/marketing/email-campaign/detail/${record?.id}`}>{record.campaignName}</Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: translateData.time.toUpperCase(),
        dataIndex: "sendingTime",
        key: "sendingTime",
        className: "grid-time-column",
        width: "20%",
        render: (_, record) => {
          return (
            <>
              <span className="hh-mm-format">
                {convertUtcToLocalTime(record?.sendingTime).format(DateFormat.HH_MM)}
              </span>{" "}
              {convertUtcToLocalTime(record?.sendingTime).format(DateFormat.DD_MM_YYYY)}
            </>
          );
        },
      },
      {
        title: translateData.status.toUpperCase(),
        dataIndex: "status",
        key: "status",
        className: "grid-status-column",
        width: "15%",
        render: (_, record) => {
          switch (record?.status) {
            case EmailCampaignStatus.Scheduled:
              return <div className="status-scheduled">{t("marketing.emailCampaign.status.scheduled")}</div>;
            default:
              return <div className="status-sent">{t("marketing.emailCampaign.status.sent")}</div>;
          }
        },
      },
    ];

    if (
      hasPermission(PermissionKeys.EDIT_EMAIL_CAMPAIGN) ||
      hasPermission(PermissionKeys.DELETE_EMAIL_CAMPAIGN) ||
      hasPermission(PermissionKeys.CREATE_EMAIL_CAMPAIGN)
    ) {
      const actionColumn = {
        title: translateData.action.toUpperCase(),
        dataIndex: "action",
        key: "action",
        width: "15%",
        align: "center",
        render: (_, emailCampaign) => {
          const { id, status } = emailCampaign;

          return (
            <div className="qr-action-column">
              {hasPermission(PermissionKeys.EDIT_EMAIL_CAMPAIGN) && status === EmailCampaignStatus.Scheduled && (
                <EditFill
                  className="icon-svg-hover pointer"
                  onClick={() => {
                    // TODO: Handle edit email campaign
                  }}
                />
              )}

              {hasPermission(PermissionKeys.DELETE_EMAIL_CAMPAIGN) && status === EmailCampaignStatus.Scheduled && (
                <TrashFill
                  className="icon-svg-hover pointer"
                  onClick={() => {
                    // TODO: Handle delete email campaign
                  }}
                />
              )}

              {hasPermission(PermissionKeys.CREATE_EMAIL_CAMPAIGN) && (
                <CloneIcon
                  className="icon-svg-hover pointer"
                  onClick={() => {
                    // TODO: Handle clone email campaign
                  }}
                />
              )}
            </div>
          );
        },
      };
      columns.push(actionColumn);
    }
    return columns;
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "");
  }, []);

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch) => {
    const response = await emailCampaignDataService.getAllEmailCampaignAsync(pageNumber, pageSize, keySearch);
    const data = response?.emailCampaigns.map((s, index) => mappingRecordToColumns(s, index));
    setDataSource(data);
    setTotalRecords(response.total);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
  };

  const mappingRecordToColumns = (emailCampaign, index) => {
    return {
      ...emailCampaign,
      no: index + 1,
      id: emailCampaign?.id,
      campaignName: emailCampaign?.name,
    };
  };

  const handleSearchByName = (keySearch) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        setKeySearch(keySearch);
        fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
      }, 500)
    );
  };

  const onChangePage = async (pageNumber, pageSize) => {
    setCurrentPageNumber(pageNumber);
    fetchDatableAsync(currentPageNumber, pageSize, keySearch);
  };

  return (
    <Row className="form-staff mt-4">
      <FnbTable
        className="mt-4 table-striped-rows qr-code-table"
        columns={getColumns()}
        pageSize={tableSettings.pageSize}
        dataSource={dataSource}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        onChangePage={onChangePage}
        search={{
          placeholder: translateData.search,
          onChange: handleSearchByName,
        }}
      />
    </Row>
  );
}
