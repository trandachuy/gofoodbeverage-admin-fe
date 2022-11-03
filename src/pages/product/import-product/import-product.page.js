import { message, Typography } from "antd";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbImportResultTable } from "components/fnb-import-result-table/fnb-import-result-table.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import productDataService from "data-services/product/product-data.service";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import languageService from "services/language/language.service";
import { handleDownloadFile } from "utils/helpers";
import { FileUploadDragDropComponent } from "./components/file-upload-drag-drop.component";
import "./import-product.page.scss";
const { Text } = Typography;

export default function ImportProductPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [fileSelected, setFileSelected] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [isImportSuccess, setIsImportSuccess] = useState(null);
  const inputRef = React.useRef();

  const maximumFileSize = 20 * 1024 * 1024; // 20 MB => bytes
  const pageData = {
    btnCancel: t("button.cancel"),
    btnUpload: t("button.upload"),
    importProduct: t("title.importProduct"),
    generalInformation: t("title.generalInformation"),
    labelDownload: t("title.labelDownload"),
    here: t("title.here"),
    maximumFileSize: t("material.import.maximumFileSize"),
    importSuccess: t("messages.importSuccess"),
    rowColumnTitle: t("table.rowColumnTitle"),
    cellColumnTitle: t("table.cellColumnTitle"),
    errorColumnTitle: t("table.errorColumnTitle"),
    sheet: t("table.sheet"),
  };

  const onSelectFile = (file) => {
    const isValid = validateFileSize(file, maximumFileSize);
    if (isValid === true) {
      setFileSelected(file);
    }
  };

  const validateFileSize = (file, maxSize) => {
    const fileSize = file.size;
    if (fileSize <= maxSize) {
      return true;
    } else {
      message.warn(pageData.maximumFileSize);
    }
    return false;
  };

  const onUploadFileImportProduct = async () => {
    setDataTable([]); // reset data table
    const formData = new FormData();
    formData.append("file", fileSelected);

    const response = await productDataService.importProductAsync(formData);
    const { success, messages } = response;
    setIsImportSuccess(success);
    setDataTable(messages);
    if (success === true) {
      message.success(t("messages.importSuccess"));
    }
  };

  const getTableColumn = () => {
    const columns = [
      {
        title: pageData.rowColumnTitle,
        dataIndex: "row",
        key: "row",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.cellColumnTitle,
        dataIndex: "cell",
        key: "cell",
        align: "left",
        width: "10%",
      },
      {
        title: pageData.errorColumnTitle,
        dataIndex: "message",
        key: "message",
        width: "70%",
      },
    ];

    return columns;
  };

  const downloadImportProductTemplateUrlAsync = async () => {
    let languageCode = languageService.getLang();

    try {
      var response = await productDataService.downloadImportProductTemplateAsync(languageCode);
      handleDownloadFile(response);
    } catch (error) {
      const { statusText } = error;

      message.error(statusText);
    }
  };

  return (
    <>
      <FnbPageHeader
        actionDisabled={fileSelected ? false : true}
        title={pageData.importProduct}
        cancelText={pageData.btnCancel}
        onCancel={() => {
          history.goBack();
        }}
        actionText={<span className="text-first-capitalize">{pageData.btnUpload}</span>}
        onAction={onUploadFileImportProduct}
      />

      <FnbCard className="fnb-card-full">
        <div className="fnb-card-wrapper">
          <div className="mb-2">
            <h2>{pageData.generalInformation}</h2>
            <div>
              <span>{pageData.labelDownload}</span>
              <a href="javascript:void(0)" className="ml-2" onClick={downloadImportProductTemplateUrlAsync}>
                {pageData.here}
              </a>
            </div>
          </div>

          <FileUploadDragDropComponent ref={inputRef} onChange={onSelectFile} />

          {dataTable && dataTable?.length > 0 && (
            <FnbImportResultTable
              tableName={t("title.product")?.toLowerCase()}
              columns={getTableColumn()}
              dataSource={dataTable}
              isSuccess={isImportSuccess}
            />
          )}
        </div>
      </FnbCard>
    </>
  );
}
