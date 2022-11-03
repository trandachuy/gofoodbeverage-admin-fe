import { EllipsisOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, message, Popover, Row, Tag } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { tableSettings } from "constants/default.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import optionDataService from "data-services/option/option-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { executeAfter } from "utils/helpers";

export const TableOption = React.forwardRef((props, ref) => {
  const { onEditItem } = props;
  const [t] = useTranslation();
  const [keySearch, setKeySearch] = useState("");
  const [listOption, setListOption] = useState([]);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [totalOptionManagement, setTotalOptionManagement] = useState(0);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();

  const pageData = {
    optionManagement: t("option.optionManagement"),
    addNew: t("button.addNew"),
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteContent: t("option.confirmDeleteContent"),
    optionDeleteSuccess: t("option.optionDeleteSuccess"),
    optionDeleteFail: t("option.optionDeleteFail"),
    searchName: t("form.searchName"),
    no: t("table.no"),
    name: t("table.name"),
    options: t("table.options"),
    action: t("table.action"),
    percent: "%",
    btnFilter: t("button.filter"),
    btnSort: t("button.sort"),
  };

  React.useImperativeHandle(ref, () => ({
    refresh() {
      initDataTableOptions(tableSettings.page, tableSettings.pageSize, keySearch);
    },
  }));

  useEffect(async () => {
    //get list options
    initDataTableOptions(tableSettings.page, tableSettings.pageSize, keySearch);
  }, []);

  const initDataTableOptions = async (pageNumber, pageSize, keySearch) => {
    setPageNumber(pageNumber);
    //get list options
    let res = await optionDataService.getOptionsByStoreIdAsync(pageNumber, pageSize, keySearch);
    let options = mappingToDataTableOptions(res.options);
    setListOption(options);
    setTotalOptionManagement(res.total);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > res.total) {
      numberRecordCurrent = res.total;
    }
    setNumberRecordCurrent(numberRecordCurrent);
  };

  const mappingToDataTableOptions = (options) => {
    return options?.map((i, index) => {
      return {
        key: i.id,
        id: i.id,
        no: index + 1,
        name: i.name,
        options: i.optionLevel.sort((a, b) => b.isSetDefault - a.isSetDefault),
      };
    });
  };

  const getColumns = () => {
    const columns = [
      {
        title: pageData.no,
        dataIndex: "no",
        width: "10%",
        align: "center",
      },
      {
        title: pageData.name,
        dataIndex: "name",
        width: "40%",
        render: (name) => (
          <>
            <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: name }} color="#50429B">
              <span>{name}</span>
            </Paragraph>
          </>
        ),
      },
      {
        title: pageData.options,
        dataIndex: "options",
        width: "40%",
        render: (optionLevels, index) => {
          let rowDisplay = 0;
          let itemOption = 1;
          let widthItemOption = 0;
          let showIcon = true;
          return (
            <div id={"container-options-" + index.id}>
              {optionLevels.map((optionLevel) => {
                let containerOption = document.getElementById("container-options-" + index.id);
                let widthContainer = 0;
                if (containerOption) widthContainer = containerOption.offsetWidth;
                let text = optionLevel.name + (optionLevel.quota ? "-" + optionLevel.quota + pageData.percent : "");
                let textWidth = displayTextWidth(text);
                let classHidden = "";

                let itemOptionControl = null;
                if (containerOption) {
                  itemOptionControl = containerOption.querySelector("#item-option-" + (itemOption - 1));
                }
                if (itemOptionControl) widthItemOption += itemOptionControl.offsetWidth;

                if (rowDisplay >= 4) {
                  classHidden = "hidden";
                } else classHidden = "";

                let iconHtml = null;
                if (rowDisplay === 4 && showIcon) {
                  iconHtml = (
                    <Row className="group-icon-show-more">
                      <Col span={24}>
                        <span className="icon-show-more left-12" id={`icon-show-more-${index.id}`}>
                          <Popover
                            trigger="click"
                            content={() => showFullOptionsItem(optionLevels)}
                            title={"Option (" + optionLevels.length + ")"}
                            placement="top"
                            id={"popover-" + index.id}
                            onVisibleChange={(newVisible) => popoverOnClick(index.id, newVisible)}
                          >
                            <EllipsisOutlined
                              id={"icon-" + index.id}
                              style={{
                                fontSize: "21px",
                                textAlign: "center",
                              }}
                            />
                          </Popover>
                        </span>
                      </Col>
                    </Row>
                  );
                  showIcon = false;
                }

                let htmlResult = (
                  <>
                    <Tag
                      color="#EBEDFD"
                      key={optionLevel.id}
                      className={
                        optionLevel.isSetDefault === true
                          ? `item-option item-option-default left-12`
                          : `item-option ${classHidden} ${itemOption >= 2 ? "left-12" : ""}`
                      }
                      id={"item-option-" + itemOption}
                    >
                      <Paragraph
                        id={optionLevel.id}
                        ellipsis={{
                          tooltip:
                            optionLevel.name + (optionLevel.quota ? "-" + optionLevel.quota + pageData.percent : ""),
                        }}
                      >
                        {optionLevel.isSetDefault && <Badge status="success" color="#50429B" size="large" />}
                        {text}
                      </Paragraph>
                    </Tag>
                    {iconHtml}
                  </>
                );

                if (widthItemOption + textWidth >= 250) {
                  rowDisplay += 1;
                  widthItemOption = 0;
                }
                itemOption += 1;
                return htmlResult;
              })}
            </div>
          );
        },
      },
      {
        title: pageData.action,
        dataIndex: "action",
        align: "center",
        render: (_, record) => {
          return (
            <div className="action-column">
              <EditButtonComponent
                className="action-button-space"
                onClick={() => onEditItem(record?.id)}
                permission={PermissionKeys.EDIT_OPTION}
              />
              <DeleteConfirmComponent
                title={pageData.confirmDelete}
                content={formatDeleteMessage(record?.name)}
                okText={pageData.btnDelete}
                cancelText={pageData.btnIgnore}
                permission={PermissionKeys.DELETE_OPTION}
                onOk={() => onRemoveItem(record?.id)}
              />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteContent, { optionName: name });
    return mess;
  };

  const onSearch = (keySearch) => {
    executeAfter(500, async () => {
      setKeySearch(keySearch);
      initDataTableOptions(tableSettings.page, tableSettings.pageSize, keySearch);
    });
  };

  const onRemoveItem = async (id) => {
    var res = await optionDataService.deleteOptionByIdAsync(id);
    if (res) {
      message.success(pageData.optionDeleteSuccess);
    } else {
      message.error(pageData.optionDeleteFail);
    }

    await initDataTableOptions(tableSettings.page, tableSettings.pageSize, keySearch);
  };

  const showFullOptionsItem = (optionLevels) => {
    let content = optionLevels.map((optionLevel) => {
      return (
        <Tag
          color="#EBEDFD"
          key={optionLevel.id}
          className={
            optionLevel.isSetDefault === true
              ? "item-option item-option-full item-option-default"
              : "item-option item-option-full"
          }
        >
          <span id={optionLevel.id} style={{ display: "inline-flex" }}>
            {optionLevel.isSetDefault && <Badge status="success" color="#50429B" size="large" />}
            {optionLevel.name}
            {optionLevel.quota ? "-" + optionLevel.quota + pageData.percent : ""}
          </span>
        </Tag>
      );
    });
    return content;
  };

  const displayTextWidth = (text) => {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    let metrics = context.measureText(text);
    return metrics.width;
  };

  const onChangePage = async (pageNumber, pageSize) => {
    initDataTableOptions(pageNumber, pageSize, keySearch);
  };

  const popoverOnClick = (id, newVisible) => {
    if (newVisible) {
      executeAfter(5, async () => {
        if (id) {
          let popoverControl = document.getElementById("popover-" + id);
          if (popoverControl) {
            let contentPopup = popoverControl.querySelector(".ant-popover-inner-content");
            let titleContentPopup = popoverControl.querySelector(".ant-popover-title");
            if (contentPopup) {
              contentPopup.classList.add("content-options-popover");
            }
            if (titleContentPopup) {
              titleContentPopup.classList.add("title-content-options-popover");
            }
          }
          let iconShowMoreControl = document.getElementById(`icon-show-more-${id}`);
          if (iconShowMoreControl) {
            iconShowMoreControl.classList.add("icon-show-more-click");
          }
        }
      });
    } else {
      let iconShowMoreControl = document.getElementById(`icon-show-more-${id}`);
      if (iconShowMoreControl) {
        iconShowMoreControl.classList.remove("icon-show-more-click");
      }
    }
  };

  const filterComponent = () => {
    return (
      <div className="filter-component">
        <Button>Filter</Button>
      </div>
    );
  };
  return (
    <>
      <Card className="fnb-card">
        <FnbTable
          className="mt-4"
          columns={getColumns()}
          pageSize={tableSettings.pageSize}
          dataSource={listOption}
          currentPageNumber={pageNumber}
          total={totalOptionManagement}
          onChangePage={onChangePage}
          editPermission={PermissionKeys.EDIT_OPTION}
          deletePermission={PermissionKeys.DELETE_OPTION}
          search={{
            placeholder: pageData.searchName,
            onChange: onSearch,
          }}
          filter={{ buttonTitle: pageData.btnFilter, component: filterComponent() }}
          sort={{ buttonTitle: pageData.btnSort, onClick: () => {} }}
        />
      </Card>
    </>
  );
});
