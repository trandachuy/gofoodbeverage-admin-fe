import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Input, Pagination, Popover, Row, Table } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import {
  CalendarNewIcon,
  CloseFill,
  FilterAltFillIcon,
  FolderIcon,
  SearchLightIcon,
  SortUpIcon,
} from "constants/icons.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { hasPermission } from "utils/helpers";
import "./fnb-table.scss";

export function FnbTable(props) {
  const [t] = useTranslation();
  const {
    columns, // define columns
    dataSource, // define dataSource
    currentPageNumber, // number of current page
    pageSize, // number of record per page
    total, // total number of record
    onChangePage,
    hideTableRowSelection,
    rowSelection,
    className,
    editPermission,
    deletePermission,
    tableId,
    bordered,
    search,
    filter,
    filterComponent,
    sort,
    scrollY,
    footerMessage,
    calendarFilter,
    loading,
    calendarComponent,
  } = props;

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [visible, setVisible] = useState(false);

  const pageData = {
    noDataFound: t("table.noDataFound"),
    filterButtonTitle: t("button.filter"),
    selectedItems: t("messages.selectedItems"),
  };

  useEffect(() => {}, []);

  const getTableColumns = () => {
    // If not define permission to edit or delete, return default column
    if (!editPermission || !deletePermission) {
      return columns;
    }

    // If user has permission to edit or delete, return default column
    if (hasPermission(editPermission) || hasPermission(deletePermission)) {
      return columns;
    } else {
      // If user has no permission to edit or delete, then remove action column
      return columns.filter((c) => c.key !== "action");
    }
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const renderPagination = () => {
    const hasPagination = total > pageSize;
    const currentView = dataSource?.length;

    if (hasPagination) {
      let showingMessage = t("table.showingRecordMessage", {
        showingRecords: currentView,
        totalRecords: total,
      });
      if (footerMessage) {
        showingMessage = t(footerMessage, {
          showingRecords: currentView,
          totalRecords: total,
        });
      }
      return (
        <div className="fnb-tbl-pagination">
          <div className="info-pagination">
            <div className="table-text-footer" dangerouslySetInnerHTML={{ __html: showingMessage }}></div>
          </div>
          <div className="fnb-pagination">
            <Pagination current={currentPageNumber} total={total} defaultPageSize={pageSize} onChange={onChangePage} />
          </div>
        </div>
      );
    }
  };

  const formatMessage = (selectedRowKeys) => {
    let mess = t(pageData.selectedItems, { selectedRowKeys: selectedRowKeys });
    return mess;
  };

  const renderSelectRows = () => {
    if (rowSelection && !hideTableRowSelection) {
      const { selectedRowKeys } = rowSelection;
      return (
        <FnbSelectSingle
          className="selected-row-control"
          placeholder={formatMessage(`${selectedRowKeys?.length ?? 0}`)}
          disabled
        />
      );
    }

    return <></>;
  };

  const renderSearch = () => {
    if (search) {
      const { placeholder, onChange, maxLength } = search;
      return (
        <>
          <div className="search-bar">
            <Input
              maxLength={maxLength}
              onChange={(e) => onChange(encodeURIComponent(e.target.value))}
              className="fnb-search-input w-100"
              allowClear
              size="large"
              placeholder={placeholder}
              prefix={<SearchLightIcon />}
            />
          </div>
        </>
      );
    }

    return <></>;
  };

  const renderSortButton = () => {
    if (sort) {
      const { buttonTitle, onClick } = sort;
      return (
        <Button className="action-button" type="primary" icon={<SortUpIcon />} onClick={onClick}>
          <span className="button-title">{buttonTitle}</span>
        </Button>
      );
    }

    return <></>;
  };

  const renderCalendarButton = () => {
    if (calendarFilter) {
      const { buttonTitle, onClick } = calendarFilter;
      return (
        <Button
          className="action-button action-button-calendar"
          type="primary"
          icon={<CalendarNewIcon />}
          onClick={onClick}
        >
          <span className="button-title-calendar">{buttonTitle}</span>
        </Button>
      );
    }

    return <></>;
  };

  const renderFilterButton = () => {
    if (filterComponent) {
      return <>{filterComponent}</>;
    }
    if (filter) {
      const { buttonTitle, component, allowClear, onClearFilter, totalFilterSelected, onClickFilterButton } = filter;
      const filterTitle = buttonTitle ? buttonTitle : pageData.filterButtonTitle;
      const numberTotalFilterSelected = parseInt(totalFilterSelected);
      const btnTitle = numberTotalFilterSelected > 0 ? `${filterTitle} (${totalFilterSelected})` : filterTitle;

      return (
        <>
          <Popover
            placement="bottomRight"
            content={component}
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
            getPopupContainer={(trigger) => trigger.parentElement}
            overlayClassName="filter-component"
          >
            <Button
              className="action-button"
              type="primary"
              icon={<FilterAltFillIcon className="fnb-icon" />}
              onClick={(e) => onClickFilterButton(e)}
            >
              <span className="button-title">{btnTitle}</span>

              {numberTotalFilterSelected > 0 && (
                <div className="eclipse-filter">
                  <span>{numberTotalFilterSelected}</span>
                </div>
              )}

              {allowClear === false || !totalFilterSelected || numberTotalFilterSelected <= 0 || (
                <CloseFill
                  className="btn-clear-filter"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClearFilter) onClearFilter(e);
                  }}
                />
              )}
            </Button>
          </Popover>
        </>
      );
    }
    return <></>;
  };

  const renderTableControlAction = () => {
    if (isTabletOrMobile) {
      return (
        <div className="default-mode">
          {renderSearch()}
          <div className="select-bar-action-group">
            {rowSelection && <div className="select-bar">{renderSelectRows()}</div>}
            <div className="action-group">
              {renderFilterButton()}
              {renderSortButton()}
              {renderCalendarButton()}
              {renderCalendarFilterButton()}
            </div>
          </div>
        </div>
      );
    }

    const selectRows = hideTableRowSelection ? (
      <div className="select-bar">{renderSelectRows()}</div>
    ) : (
      <div className="select-bar mr-3">{renderSelectRows()}</div>
    );
    return (
      <div className="desktop-mode">
        {rowSelection && selectRows}
        <div className="search-bar">{renderSearch()}</div>
        <div className="action-group">
          {renderFilterButton()}
          {renderSortButton()}
          {renderCalendarButton()}
          {renderCalendarFilterButton()}
        </div>
      </div>
    );
  };

  const renderCalendarFilterButton = () => {
    if (calendarComponent) {
      const { selectedDate, onSelectedDatePicker, onConditionCompare } = calendarComponent;
      return (
        <div className="action-button action-button-calendar-component">
          <FnbDatePicker
            selectedDate={selectedDate}
            setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
            setConditionCompare={onConditionCompare}
          />
        </div>
      );
    }

    return <></>;
  };

  return (
    <>
      <div className="fnb-table-wrapper hide-pagination-options">
        {renderTableControlAction()}
        <Row>
          <Col span={24}>
            <Table
              showSorterTooltip={false}
              loading={{
                spinning: loading || loading === true,
                indicator: <LoadingOutlined />,
              }}
              locale={{
                emptyText: (
                  <>
                    <p className="text-center" style={{ marginBottom: "12px", marginTop: "105px" }}>
                      <FolderIcon />
                    </p>
                    <p className="text-center body-2" style={{ marginBottom: "181px", color: "#858585" }}>
                      {pageData.noDataFound}
                    </p>
                  </>
                ),
              }}
              scroll={{ x: 900, y: scrollY }}
              className={`fnb-table form-table ${className}`}
              columns={getTableColumns()}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={false}
              bordered={bordered}
              id={tableId}
            />
            {renderPagination()}
          </Col>
        </Row>
      </div>
    </>
  );
}
