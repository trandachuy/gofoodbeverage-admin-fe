import React, { useEffect, useState } from "react";
import { executeAfter } from "utils/helpers";
import materialDataService from "data-services/material/material-data.service";
import { useTranslation } from "react-i18next";
import { FnbTable } from "components/fnb-table/fnb-table";

export default function TableMaterialByCategoryComponent(props) {
  const [t] = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [materialCategoryId, setMaterialCategoryId] = useState(null);

  const pageData = {
    addNew: t("button.addNew"),
    title: t("materialCategory.title"),
    table: {
      searchPlaceholder: t("materialCategory.table.searchPlaceholder"),
      no: t("materialCategory.table.no"),
      name: t("table.name"),
      quantity: t("table.quantity"),
      unit: t("table.unit"),
      action: t("table.action"),
    },
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 10,
    columns: [
      {
        title: pageData.table.name,
        dataIndex: "name",
      },
      {
        title: pageData.table.quantity,
        dataIndex: "quantity",
      },
      {
        title: pageData.table.unit,
        dataIndex: "unitName",
      },
    ],
    onChangePage: async (pageNumber) => {
      await fetchDatableAsync(pageNumber, "");
    },
    onSearch: async (keySearch) => {
      executeAfter(500, async () => {
        await fetchDatableAsync(1, keySearch);
      });
    },
  };

  useEffect(() => {
    props.tableFuncs.current = setInitData;
  }, []);

  const setInitData = (data) => {
    const { dataMaterials, materialCategoryId } = data;
    const records = dataMaterials?.materials?.map((item) => mappingRecordToColumns(item));
    setDataSource(records);
    setTotalRecords(dataMaterials?.total);
    setCurrentPageNumber(dataMaterials?.pageNumber);
    setMaterialCategoryId(materialCategoryId);
  };

  const fetchDatableAsync = async (pageNumber, keySearch) => {
    let responseData = await materialDataService.getMaterialsByFilterAsync(
      pageNumber,
      tableSettings.pageSize,
      keySearch,
      "",
      "",
      materialCategoryId,
      ""
    );

    if (responseData) {
      const { materials, total, pageNumber } = responseData;
      const records = materials?.map((item) => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      id: item?.id,
      name: item?.name ?? "N/A",
      quantity: item?.quantity ?? 0,
      unitName: item?.unitName ?? "N/A",
    };
  };

  return (
    <>
      <FnbTable
        className="material-by-category-table mt-3"
        columns={tableSettings.columns}
        dataSource={dataSource}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        onChangePage={tableSettings.onChangePage}
        pageSize={tableSettings.pageSize}
        search={{
          placeholder: pageData.table.searchPlaceholder,
          onChange: tableSettings.onSearch,
        }}
      />
    </>
  );
}
