import React, { useEffect, useState } from "react";
import {
  CouldUploadIcon,
  CvsFileIcon,
} from "constants/icons.constants";
import { message } from "antd";

function SliderUploadFile(props) {
  const { t, handleSelectFile  } = props;
 

  const inputRef = React.useRef(null);

  
  const [stateImport, setStateImport] = useState("");

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [linkImportFile, setLinkImportFile] = useState(null);

  const [listDataImportError, setListDataImportError] = useState([]);
  const [listDataImportSuccess, setListDataImportSuccess] = useState([]);
  const [isSelectedFileImport, setIsSelectedFileImport] = useState(false);

  const extensions = ["jpg", "png", "jpeg", "gif"];
  const pageData = {
    
  };




  

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

  const onSelectFile = (e) => {
    let file = e.target.files[0];

    var fileExtension = file.name.slice(
      (Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1
    );
    if (
      extensions
        .concat(extensions.map((ext) => ext.toUpperCase()))
        .join(",")
        .indexOf(fileExtension) < 0
    ) {
      return;
    }
    setFileName(file?.name);
    let sizeInfo = getFileSizeInfo(file?.size);
    if (sizeInfo.valid) {
      setFileSize(sizeInfo.text);
      setListDataImportError([]);
      setListDataImportSuccess([]);
      setIsSelectedFileImport(true);
      setLinkImportFile(e.target.value);

      if(handleSelectFile){
        var fileInfo = {
            fileData: file,
            linkImportFile,
            listDataImportSuccess,
            isSelectedFileImport,
            listDataImportError,
            
        }
        handleSelectFile(fileInfo);
      }
    } else {
      message.warn(pageData.maximumFileSize);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
      className="c-drag-drop-box"
    >
      <input
        ref={inputRef}
        id="file-upload"
        type="file"
        accept={extensions
          .map((ext) => `.${ext}`)
          .concat(extensions.map((ext) => ext.toUpperCase()))
          .concat((ext) => `.${ext},`)
          .join(",")}
        value={linkImportFile}
        onChange={(e) => onSelectFile(e)}
        className="drag-drop-box__input"
      />

      <div className="drag-drop-box__box">
        <div className="drag-drop-box__wrapper">
          {fileName && fileName?.length > 0 ? (
            <CvsFileIcon className="drag-drop-box__csv" />
          ) : (
            <CouldUploadIcon className="drag-drop-box__icon" />
          )}

          {fileName && fileName?.length > 0 ? (
            <>
              <div className="drag-drop-box__file-text">
                {pageData.file} {fileName}
              </div>
              <div className="drag-drop-box__file-text">{fileSize}</div>
            </>
          ) : (
            <>
              <div className="drag-drop-box__file-text">
                {pageData.dragAndDropOrSelectFile}
              </div>
              <div className="drag-drop-box__file-text">{pageData.maximumFileSize}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SliderUploadFile;
