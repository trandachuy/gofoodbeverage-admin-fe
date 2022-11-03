import React, { useEffect, useState } from "react";
import { Upload, Modal, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

export const UploadImage = props => {
  const { buttonText, className, onChange, initData, debug, fileSizeLimitMessage, fileTypeMessage } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState({
    name: "",
    previewTitle: "",
    url: "",
    preview: "",
  });

  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (initData) {
      setFile(initData);
    }
  }, []);

  /** Validate image upload
   * file types: image/jpeg || image/png
   * file size: <= 5mb
   * */
  const validateBeforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      const messageError = fileTypeMessage || "You can only upload JPG/PNG file!";
      message.error(messageError);
      return;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      const errorMessage = fileSizeLimitMessage || "Image must smaller than 5MB!";
      message.error(errorMessage);
      return;
    }
    return isJpgOrPng && isLt5M;
  };

  /** Convert image to base 64 */
  const getBase64Async = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        resolve(reader.result);
      });
      reader.readAsDataURL(file);
      reader.onerror = error => reject(error);
    });
  };

  /** Upload image to server */
  const handleUploadAsync = info => {
    setFileList([...info.fileList]);
    setSelectedFile(info.file);
    var fileName = getFileName(info.file);
    setPreviewTitle(info.file.name || info.file.url.substring(info.file.url.lastIndexOf("/") + 1));

    if (onChange) {
      onChange(info.file);
    }
  };

  const getFileName = selectedFile => {
    if (selectedFile) {
      var previewTitle = selectedFile.name || selectedFile.url.substring(selectedFile.url.lastIndexOf("/") + 1);
      return previewTitle;
    }
    return "";
  };

  /** Render upload button */
  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{buttonText || "Upload"}</div>
    </div>
  );

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Async(file.originFileObj);
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
    <>
      <Upload
        className={className}
        listType="picture-card"
        fileList={fileList}
        onChange={handleUploadAsync}
        beforeUpload={validateBeforeUpload}
        maxCount={1}
        onPreview={handlePreview}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
