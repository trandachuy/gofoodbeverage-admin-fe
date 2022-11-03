import React, { useEffect, useState } from "react";
import { Form, Row, Space, message } from "antd";
import { executeAfter } from "utils/helpers";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import TooltipParagraph from "components/fnb-tooltip-paragraph/fnb-tooltip-paragraph";
import { FnbViewMoreComponent } from "components/fnb-view-more/fnb-view-more";
import FilterStaff from "./filter-staff.component";
import { useTranslation } from "react-i18next";
import staffDataService from "data-services/staff/staff-data.service";
import branchDataService from "data-services/branch/branch-data.service";
import permissionDataService from "data-services/permission/permission-data.service";

export default function TableStaff(props) {
  const { onEditStaff, screenKey } = props;
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [branches, setBranches] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [countFilter, setCountFilter] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [keySearch, setKeySearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopover, setShowPopover] = useState(true);
  const clearFilterFunc = React.useRef(null);

  const pageData = {
    searchPlaceholder: t("staffManagement.searchPlaceholder"),
    btnFilter: t("button.filter"),
    table: {
      no: t("staffManagement.table.no"),
      name: t("staffManagement.table.name"),
      phone: t("staffManagement.table.phone"),
      branch: t("staffManagement.table.branch"),
      group: t("staffManagement.table.group"),
      action: t("staffManagement.table.action"),
    },
    btnDelete: t("button.delete"),
    btnIgnore: t("button.ignore"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    staffDeleteSuccess: t("staffManagement.staffDeleteSuccess"),
    staffDeleteFail: t("staffManagement.staffDeleteFail"),
  };
  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "index",
        key: "index",
        width: "138px",
        align: "left",
      },
      {
        title: pageData.table.name,
        dataIndex: "name",
        key: "name",
        width: "238px",
        render: (_, record) => {
          return (
            <div className="width-name text-overflow">
              <TooltipParagraph>{record.name}</TooltipParagraph>
            </div>
          );
        },
      },
      {
        title: pageData.table.phone,
        dataIndex: "phone",
        key: "phone",
        width: "185px",
        render: (_, record) => {
          return (
            <div className="width-phone text-overflow">
              <TooltipParagraph>{record.phone}</TooltipParagraph>
            </div>
          );
        },
      },
      {
        title: pageData.table.branch,
        dataIndex: "branchesName",
        key: "branchesName",
        width: "409px",
        render: (values, record) => {
          const renderBranches = values?.map((branch, index) => {
            if (index < 4) {
              return (
                <div key={index} className="width-phone text-overflow">
                  <TooltipParagraph>{branch}</TooltipParagraph>
                </div>
              );
            }
            if (index === 5) {
              return (
                <div key={index} className="view-phone">
                  <FnbViewMoreComponent
                    isLink={false}
                    title={`Branch (${values?.length})`}
                    content={record?.branches}
                  />
                </div>
              );
            }
          });
          return renderBranches;
        },
      },
      {
        title: pageData.table.group,
        dataIndex: "groupsName",
        key: "groupsName",
        width: "375px",
        render: (values, record) => {
          const maxLine = 5;
          const renderGroups = values?.map((groupName, index) => {
            const group = record.groups.find((item) => item.name === groupName);
            if (index < maxLine - 1) {
              return (
                <Link
                  key={index}
                  className="row-link"
                  target="_blank"
                  to={`/settings/permission-group/${group?.id}/detail`}
                >
                  <div key={index} className="width-group text-overflow">
                    <TooltipParagraph>
                      <a>{groupName}</a>
                    </TooltipParagraph>
                  </div>
                </Link>
              );
            }
            if (index === maxLine) {
              return (
                <div key={index} className="view-more">
                  <FnbViewMoreComponent isLink={true} title={`Group (${values?.length})`} content={record?.groups} />
                </div>
              );
            }
          });
          return renderGroups;
        },
      },

      {
        title: pageData.table.action,
        key: "action",
        width: "99px",
        align: "center",
        render: (_, record) => {
          if (record.isInitialStoreAccount === true) {
            return <></>;
          }

          return (
            <>
              <Space size="middle">
                {<EditButtonComponent className="mr-3" onClick={() => onEditStaff(record.id)} />}
                {
                  <DeleteConfirmComponent
                    title={pageData.confirmDelete}
                    content={formatDeleteMessage(record?.name)}
                    okText={pageData.btnDelete}
                    cancelText={pageData.btnIgnore}
                    onOk={() => handleDeleteItem(record.id)}
                  />
                }
              </Space>
            </>
          );
        },
      },
    ],

    onChangePage: async (page, pageSize) => {
      await fetchDatableAsync(page, pageSize, "");
    },
    onSearch: async (serchKey) => {
      setKeySearch(serchKey);
      executeAfter(500, async () => {
        await fetchDatableAsync(1, tableSettings.pageSize, serchKey);
      });
    },
  };

  useEffect(() => {
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, keySearch);
  }, []);

  const handleDeleteItem = async (id) => {
    let res = await staffDataService.deleteStaffByIdAsync(id);
    if (res) {
      message.success(pageData.staffDeleteSuccess);

      // Recount selected items after delete
      const newSelectedRowKeys = selectedRowKeys?.filter((x) => x !== id);
      if (newSelectedRowKeys) {
        setSelectedRowKeys(newSelectedRowKeys);
      }
    } else {
      message.error(pageData.staffDeleteFail);
    }
    await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const fetchDatableAsync = async (pageNumber, pageSize, keySearch, branchId = null, permissionId = null) => {
    if (!pageNumber || !pageSize) {
      return;
    }

    let dataRequest = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      keySearch: keySearch,
      screenKey: screenKey,
    };

    if (branchId) {
      dataRequest = {
        ...dataRequest,
        branchId: branchId,
      };
    }

    if (permissionId) {
      dataRequest = {
        ...dataRequest,
        groupPermissionId: permissionId,
      };
    }

    const response = await staffDataService.getDataStaffManagementAsync(dataRequest);
    const data = response?.staffs.map((s) => mappingRecordToColumns(s));
    setDataSource(data);
    setTotalRecords(response.total);
    setCurrentPageNumber(response.pageNumber);
    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > response.total) {
      numberRecordCurrent = response.total;
    }
    setNumberRecordCurrent(numberRecordCurrent);
  };

  const mappingRecordToColumns = (staff) => {
    return {
      key: staff?.id,
      index: staff?.no,
      id: staff?.id,
      name: staff?.fullName,
      phone: staff?.phoneNumber,
      branches: staff?.storeBranches,
      branchesName: staff?.storeBranches?.map((b) => b.name),
      groups: mappingGroups(staff?.groupPermissions),
      groupsName: staff?.groupPermissions?.map((g) => g.name || ""),
      isInitialStoreAccount: staff?.isInitialStoreAccount,
    };
  };

  const onClickFilterButton = async (event) => {
    if (!event?.defaultPrevented) {
      setShowPopover(true);
    }

    var resBranch = await branchDataService.getAllBranchsAsync();
    if (resBranch) {
      const allBranchOption = {
        id: "",
        name: t("productManagement.filter.branch.all"),
      };
      const branchOptions = [allBranchOption, ...resBranch.branchs];
      setBranches(branchOptions);
    }

    var resPermission = await permissionDataService.getGroupPermissionManagementAsync();
    if (resPermission) {
      const allPermissionOption = {
        id: "",
        name: t("staffManagement.permission.filter.all"),
      };
      const PermissionOptions = [allPermissionOption, ...resPermission.groupPermissions];
      setPermissions(PermissionOptions);
    }
  };

  const handleFilterProduct = async (data) => {
    setSelectedBranchId(data?.branchId);
    setSelectedPermissionId(data?.permissionId);
    fetchDatableAsync(currentPageNumber, tableSettings.pageSize, "", data?.branchId, data?.permissionId);
    setCountFilter(data?.count);
  };

  const onSelectItemFilter = (key) => {
    if (countFilter > 0 && key === "") {
      setCountFilter(countFilter - 1);
    } else {
      setCountFilter(countFilter + 1);
    }
  };

  const onResetFilter = async () => {
    setCountFilter(0);
    setSelectedBranchId("");
    setSelectedPermissionId("");
    await fetchDatableAsync(1, tableSettings.pageSize, keySearch);
  };
  const mappingGroups = (groups) => {
    let listGroup = [];
    groups?.map((item) => {
      let group = {
        id: item?.id,
        name: item?.name,
        link: `/settings/permission-group/${item?.id}/detail`,
      };
      listGroup.push(group);
    });

    return listGroup;
  };

  const filterComponent = () => {
    return (
      showPopover && (
        <FilterStaff
          onShowFilter={setShowFilter}
          fetchDataProducts={handleFilterProduct}
          groupPermissions={permissions}
          branches={branches}
          onSelectItemFilter={onSelectItemFilter}
          onResetFilter={onResetFilter}
          selectedBranchId={selectedBranchId}
          selectedPermissionId={selectedPermissionId}
          tableFuncs={clearFilterFunc}
        />
      )
    );
  };

  const onClearFilter = (e) => {
    clearFilterFunc.current();
    setShowPopover(false);
  };

  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  return (
    <Form className="form-staff">
      <Row className="mt-4">
        <FnbTable
          className="mt-4"
          columns={tableSettings.columns}
          pageSize={tableSettings.pageSize}
          dataSource={dataSource}
          currentPageNumber={currentPageNumber}
          total={totalRecords}
          onChangePage={tableSettings.onChangePage}
          search={{
            placeholder: pageData.searchPlaceholder,
            onChange: tableSettings.onSearch,
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            columnWidth: 40,
          }}
          filter={{
            onClickFilterButton: onClickFilterButton,
            totalFilterSelected: countFilter,
            onClearFilter: onClearFilter,
            buttonTitle: pageData.btnFilter,
            component: filterComponent(),
          }}
        />
      </Row>
    </Form>
  );
}
