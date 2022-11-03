import React, { useEffect, useState } from "react";
import { Button } from "antd";
import SliderUploadFile from "./upload-file";
import i18n from "utils/i18n";
import createSliderAsync from "data-services/store/store-data.service";
import { fileNameNormalize, jsonToFormData } from "utils/helpers";
import { message } from "antd";
import moment from "moment";
function SliderLeft() {
    const { t } = i18n;
    const pageData = {
      addNew: t("button.add"),
    };
  
    const [dataImportSuccess, setDataImportSuccess] = useState(false);
    const [fileUpload, setFileUpload] = useState(false);
  
  
    const handleSelectFile = (fileInfo) => {
      console.log(fileInfo);
      setDataImportSuccess(true);
      setFileUpload(fileInfo.fileData);
    };
  
    const handleClickAddNew = async (e) => {
      let buildFileName = moment(new Date()).format("DDMMYYYYHHmmss");
      const requestData = {
        file: fileUpload,
        screenType: 1,
        fileName: fileNameNormalize(buildFileName),
      };
      const requestFormData = jsonToFormData(requestData);
  
      createSliderAsync.createSliderAsync(requestFormData).then((res) => {
        if (res.success === true) {
          setDataImportSuccess(false);
          message.success(t("messages.isCreatedSuccessfully"));
        }
      });
    };

  return (
    <div className="c-full-slider ">
      <div className="file-wraper u-spaceing">
        <SliderUploadFile
          t={t}
          handleSelectFile={handleSelectFile}
          isSuccess={dataImportSuccess}
        ></SliderUploadFile>

        <div className="action-wraper u-clearfix u-spaceing">
          <Button
            className="btn-add-file"
            type="primary"
            htmlType="submit"
            disabled={!dataImportSuccess}
            onClick={handleClickAddNew}
          >
            {pageData.addNew}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SliderLeft;
