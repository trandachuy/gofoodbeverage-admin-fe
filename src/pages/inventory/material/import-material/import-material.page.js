import { Button, Card, Col, message, Row, Space, Typography } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { ArrowLeftIcon, CouldUploadIcon, CvsFileIcon, WarningIcon } from "constants/icons.constants";
import React, { useState } from "react";
import { Prompt } from "react-router";

const { Text } = Typography;

export default function ImportMaterial(props) {
  const { t, history, languageService, materialDataService, storeId } = props;

  const inputRef = React.useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dataImport, setDataImport] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [linkImportFile, setLinkImportFile] = useState(null);
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [blockNavigation, setBlockNavigation] = useState(false);
  const [listDataImportError, setListDataImportError] = useState([]);
  const [listDataImportSuccess, setListDataImportSuccess] = useState([]);
  const [isSelectedFileImport, setIsSelectedFileImport] = useState(false);

  const pageData = {
    title: t("material.import.title"),
    backTitle: t("material.import.backTitle"),
    btnUpLoad: t("button.upload"),
    labelDownload: t("material.import.labelDownload"),
    here: t("material.import.here"),
    dragAndDropOrSelectFile: t("material.import.dragAndDropOrSelectFile"),
    leaveWarningMessage: t("messages.leaveWarningMessage"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    confirmation: t("leaveDialog.confirmation"),
    cancelText: t("button.cancel"),
    okText: t("button.confirmLeave"),
    formError: {
      messageFail: t("material.import.formError.messageFail"),
      row: t("material.import.formError.row"),
      cell: t("material.import.formError.cell"),
      error: t("material.import.formError.error"),
      sheet: t("material.import.formError.sheet"),
    },
    tableSuccess: {
      no: t("material.import.tableSuccess.no"),
      name: t("material.import.tableSuccess.name"),
      description: t("material.import.tableSuccess.description"),
      category: t("material.import.tableSuccess.category"),
      unit: t("material.import.tableSuccess.unit"),
      sku: t("material.import.tableSuccess.sku"),
      minQuantity: t("material.import.tableSuccess.minQuantity"),
      branch: t("material.import.tableSuccess.branch"),
    },
    importSuccess: t("messages.importMaterialSuccessfully"),
    noRecord: "There are no valid lines to import on material",
    infoDataFail: {
      codeMaterialNotExist: t("material.import.formError.infoDataFail.codeMaterialNotExist"),
      codeMaterial: t("material.import.formError.infoDataFail.codeMaterial"),
      nameMaterialExistedInList: t("material.import.formError.infoDataFail.nameMaterialExistedInList"),
      nameMaterialEmpty: t("material.import.formError.infoDataFail.nameMaterialEmpty"),
      maxLengthMaterial: t("material.import.formError.infoDataFail.maxLengthMaterial"),
      nameMaterialExisted: t("material.import.formError.infoDataFail.nameMaterialExisted"),
      maxLengthDescription: t("material.import.formError.infoDataFail.maxLengthDescription"),
      materialCategory: t("material.import.formError.infoDataFail.materialCategory"),
      baseUnit: t("material.import.formError.infoDataFail.baseUnit"),
      unitConversion: t("material.import.formError.infoDataFail.unitConversion"),
      pleaseInputCapacity: t("material.import.formError.infoDataFail.pleaseInputCapacity"),
      sku: t("material.import.formError.infoDataFail.sku"),
      maxLengthSku: t("material.import.formError.infoDataFail.maxLengthSku"),
      skuExisted: t("material.import.formError.infoDataFail.skuExisted"),
      minQuantity: t("material.import.formError.infoDataFail.minQuantity"),
      branch: t("material.import.formError.infoDataFail.branch"),
      categoryExisted: t("material.import.formError.infoDataFail.categoryExisted"),
      unitExisted: t("material.import.formError.infoDataFail.unitExisted"),
    },
    file: t("material.import.file"),
    maximumFileSize: t("material.import.maximumFileSize"),
    generalInformation: t("material.import.generalInformation"),
  };

  /**
   * This function is used to close the confirmation modal.
   */
  const onCancel = () => {
    setShowConfirm(false);
  };

  /**
   * This function is used to navigate to the Material Management page.
   */
  const onCompleted = () => {
    setTimeout(() => {
      history.push("/inventory/material");
    }, 100);
  };

  const handleDownloadTemplate = () => {
    let languageCode = languageService.getLang();
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API}material/download-template-material?languageCode=${languageCode}&&storeId=${storeId}`;
    link.click();
  };

  const handleImportMaterial = async () => {
    let res = await materialDataService.importMaterialsAsync(dataImport);
    if (res.success && res.infoImport.isImportSuccess) {
      message.success(pageData.importSuccess);
      setListDataImportSuccess(res.infoImport.listMaterialSuccess);
      setIsImportSuccess(true);
    } else {
      setIsImportSuccess(false);
      if (res.infoImport.numberRecordImport > 0 || res.infoImport.isInValidUnit || res.infoImport.isInValidCategory) {
        message.error(pageData.formError.messageFail);

        let errorList = [];

        res?.infoImport?.errors.forEach((item, index) => {
          let rowIndex = item.row;
          let itemList = item?.detailErrors?.map((de) => ({
            row: rowIndex,
            cell: de.cell,
            errorMessage: res.infoImport.isInValidCategory ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: t(pageData.infoDataFail.categoryExisted, { category_name: de.name }),
                }}
              ></div>
            ) : res.infoImport.isInValidUnit ? (
              <div
                dangerouslySetInnerHTML={{ __html: t(pageData.infoDataFail.unitExisted, { unit_name: de.name }) }}
              ></div>
            ) : (
              getErrorMessage(de.column)
            ),
            sheet: de.sheet,
          }));
          errorList.push(...itemList);
        });

        setListDataImportError(errorList);
      } else {
        message.error(pageData.noRecord);
        setListDataImportError([]);
      }
      setListDataImportSuccess([]);
    }
    setLinkImportFile(null);
    setIsSelectedFileImport(false);
  };

  const getErrorMessage = (col) => {
    const listError = [
      {
        col: 0,
        message: pageData.infoDataFail.nameMaterialExistedInList,
      },
      {
        col: 1,
        message: pageData.infoDataFail.codeMaterialNotExist,
      },
      {
        col: 2,
        message: pageData.infoDataFail.codeMaterial,
      },
      {
        col: 3,
        message: pageData.infoDataFail.nameMaterialExisted,
      },
      {
        col: 4,
        message: pageData.infoDataFail.nameMaterialEmpty,
      },
      {
        col: 5,
        message: pageData.infoDataFail.maxLengthMaterial,
      },
      {
        col: 6,
        message: pageData.infoDataFail.maxLengthDescription,
      },
      {
        col: 7,
        message: pageData.infoDataFail.materialCategory,
      },
      {
        col: 8,
        message: pageData.infoDataFail.unitConversion,
      },
      {
        col: 9,
        message: pageData.infoDataFail.pleaseInputCapacity,
      },
      {
        col: 10,
        message: pageData.infoDataFail.baseUnit,
      },
      {
        col: 11,
        message: pageData.infoDataFail.sku,
      },
      {
        col: 12,
        message: pageData.infoDataFail.maxLengthSku,
      },
      {
        col: 13,
        message: pageData.infoDataFail.skuExisted,
      },
      {
        col: 14,
        message: pageData.infoDataFail.minQuantity,
      },
      {
        col: 15,
        message: pageData.infoDataFail.branch,
      },
    ];

    let message = listError?.find((i) => i.col === col).message;
    return message;
  };

  const onSelectFile = (e) => {
    let file = e.target.files[0];
    setFileName(file?.name);

    // Get file info.
    let sizeInfo = getFileSizeInfo(file?.size);

    if (sizeInfo.valid) {
      setFileSize(sizeInfo.text);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("test", "StringValueTest");
      setDataImport(formData);
      setListDataImportError([]);
      setListDataImportSuccess([]);
      setIsImportSuccess(false);
      setIsSelectedFileImport(true);
      setLinkImportFile(e.target.value);
    } else {
      message.warn(pageData.maximumFileSize);
    }
  };

  const columnsImportError = [
    {
      title: pageData.formError.sheet,
      dataIndex: "sheet",
      key: "sheet",
      align: "left",
      width: "10%",
    },
    {
      title: pageData.formError.row,
      dataIndex: "row",
      key: "row",
      align: "left",
      width: "10%",
    },
    {
      title: `${pageData.formError.cell}`,
      dataIndex: "cell",
      key: "cell",
      align: "left",
      width: "10%",
    },
    {
      title: `${pageData.formError.error}`,
      dataIndex: "errorMessage",
      key: "errorMessage",
      width: "70%",
    },
  ];

  const columnsImportSuccess = [
    {
      title: pageData.tableSuccess.no,
      dataIndex: "no",
      key: "no",
      align: "center",
      width: "5%",
    },
    {
      title: pageData.tableSuccess.name,
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "15%",
    },
    {
      title: pageData.tableSuccess.description,
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: pageData.tableSuccess.category,
      dataIndex: "category",
      key: "category",
      width: "15%",
    },
    {
      title: pageData.tableSuccess.unit,
      dataIndex: "unit",
      key: "unit",
      width: "10%",
    },
    {
      title: pageData.tableSuccess.sku,
      dataIndex: "sku",
      key: "sku",
      width: "10%",
    },
    {
      title: pageData.tableSuccess.minQuantity,
      dataIndex: "minQuanity",
      key: "minQuanity",
      width: "10%",
    },
    {
      title: pageData.tableSuccess.branch,
      dataIndex: "branch",
      key: "branch",
      width: "15%",
    },
  ];

  /** This function is used to handle drag events when the user drags the file into the box.
   * @param  {event} e The react event.
   */
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  /** This function is used to handle the file when the file is dropped into the box.
   * @param  {event} e The react event.
   */
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile({
        target: {
          files: e.dataTransfer.files,
        },
      });
    }
  };

  /** This function is used to open the File Dialog when the box is clicked.
   */
  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  /** This function is used to calculate the file size.
   * @param  {long} size The file size.
   */
  const getFileSizeInfo = (size) => {
    var fileSize = { text: "", valid: true, sizeInMb: 0 };
    if (size < 1000000) {
      fileSize.sizeInMb = Math.floor(size / 1000);
      fileSize.text = fileSize.sizeInMb + "KB";
      fileSize.valid = true;
    } else {
      fileSize.sizeInMb = Math.floor(size / 1000000);
      fileSize.text = fileSize.sizeInMb + "MB";

      if (fileSize.sizeInMb > 20) {
        fileSize.valid = false;
      } else {
        fileSize.valid = true;
      }
    }
    return fileSize;
  };

  return (
    <>
      <Prompt when={blockNavigation} message={pageData.leaveWarningMessage} />
      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveWarningMessage}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onCancel}
        onOk={onCompleted}
      />
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <div className="import-material link-back-page link-back-page-staff">
            <button onClick={onCompleted} type="link">
              <span className="btn-back-icon">
                <ArrowLeftIcon />
              </span>
              {pageData.backTitle}
            </button>
          </div>
          <PageTitle content={pageData.title} />
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <Space className="float-right">
            <button className="second-button" onClick={() => setShowConfirm(true)}>
              {pageData.cancelText}
            </button>

            <Button type="primary" onClick={handleImportMaterial}>
              {pageData.btnUpLoad}
            </Button>
          </Space>
        </Col>
      </Row>

      <Card className="w-100 fnb-card-full general-information-box">
        <Row className="">
          <Col span={24}>
            <div className="general-information-text">{pageData.generalInformation}</div>
            <div className="link-download-box">
              {pageData.labelDownload}
              <a onClick={() => handleDownloadTemplate()}> {pageData.here}</a>
            </div>
          </Col>
        </Row>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className="drag-drop-box"
        >
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept=".xlsx"
            value={linkImportFile}
            onChange={(e) => onSelectFile(e)}
          />
          <div className="icon-box">
            {fileName && fileName?.length > 0 ? <CvsFileIcon /> : <CouldUploadIcon className="cloud-icon" />}
          </div>
          {fileName && fileName?.length > 0 ? (
            <>
              <div className="second-text">
                {pageData.file} {fileName}
              </div>
              <div className="third-text">{fileSize}</div>
            </>
          ) : (
            <>
              <div className="second-text">{pageData.dragAndDropOrSelectFile}</div>
              <div className="third-text">{pageData.maximumFileSize}</div>
            </>
          )}
        </div>

        {listDataImportError.length > 0 && (
          <>
            <div className="message-box-header">
              <WarningIcon className="message-box-header-warning-icon" />
              <Text type="danger">{pageData.formError.messageFail}</Text>
            </div>
            <Row>
              <FnbTable columns={columnsImportError} dataSource={listDataImportError} bordered className="w-100" />
            </Row>
          </>
        )}
        {isImportSuccess && (
          <>
            <div className="message-box-header">
              <Text type="success">{pageData.importSuccess}</Text>
            </div>
            <Row>
              <FnbTable columns={columnsImportSuccess} dataSource={listDataImportSuccess} bordered className="w-100" />
            </Row>
          </>
        )}
      </Card>
    </>
  );
}
