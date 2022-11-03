import { message } from "antd";
import { FnbUploadBannerConstants } from "constants/fnt-upload-banner.contants";
import { TrashFillImage } from "constants/icons.constants";
import fileDataService from "data-services/file/file-data.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import { getUniqueId, jsonToFormData } from "utils/helpers";
import ImgBoxFill from "../../assets/icons/Img_box_fill.png";
import "./fnb-upload-banner.component.scss";

const { forwardRef, useImperativeHandle } = React;

export const FnbUploadBanner = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const {
    onChange,
    maxNumber = FnbUploadBannerConstants.MAX_FILES_NUMBER,
    maxFileSize = FnbUploadBannerConstants.MAX_FILE_SIZE,
    acceptTypes = FnbUploadBannerConstants.ACCEPT_TYPES,
    className,
    value,
  } = props;
  const [showNewImageButton, setShowNewImageButton] = useState(value > 0);

  const pageData = {
    btnAddNew: t("button.addNew"),
  };

  useEffect(() => {
    setShowNewImageButton(value?.length > 0);
  }, [value]);

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize) {
      let megabyteConvertNumber = maxFileSize / 1048576;
      message.error(t("messages.imageSizeMustLessThan", { value: `${megabyteConvertNumber}` }));
    }
    if (errors.maxNumber) {
      let maxNumberStr = String(maxNumber);
      message.error(t("messages.maxImgsUploadAllow", { value: maxNumberStr }));
    }
    if (errors.acceptType) {
      let fileTypes = FnbUploadBannerConstants.ACCEPT_TYPES.join(", ");
      console.log(fileTypes);
      message.error(t("messages.acceptFileTypes", { value: `${fileTypes.toUpperCase()}` }));
    }
  };

  // Upload Image to Azure blob then return image url from blob to parent component
  const onUploadImage = async (imageList, addUpdateIndex) => {
    if (imageList.length === 0) {
      setShowNewImageButton(false);
    }
    //Case Remove Image
    if (value !== undefined && imageList.length < value.length) {
      setShowNewImageButton(true);
      onChange(imageList);
    }
    //Case Add new Image
    else {
      let allThumbs = [...value];
      console.log(addUpdateIndex);
      for (let i = 0; i < addUpdateIndex.length; i++) {
        let id = getUniqueId();
        const requestData = {
          file: imageList[addUpdateIndex[i]].file,
          fileName: id,
          fileSizeLimit: maxFileSize,
        };
        const requestFormData = jsonToFormData(requestData);
        const res = await fileDataService.uploadFileAsync(requestFormData);
        if (res.success === true) {
          imageList[addUpdateIndex[i]].data_url = res.data;
          allThumbs.push({ data_url: res.data });
        }
      }
      onChange(allThumbs);
    }
  };

  const btnAddNewImgClass = () => (showNewImageButton === false ? "hidden" : "btn-add-new-image");
  const disableOldAddNewImgClass = () => (showNewImageButton === true ? "hidden" : "upload__image__buttons");
  const changeJustifyContentClass = () =>
    showNewImageButton === true ? "upload__image--wrapper flex-start" : "upload__image--wrapper flex-center";

  return (
    <ImageUploading
      multiple={true}
      value={value}
      maxFileSize={maxFileSize}
      maxNumber={maxNumber}
      onError={uploadImageError}
      acceptType={acceptTypes}
      onChange={onUploadImage}
      dataURLKey="data_url"
    >
      {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
        <>
          <div
            className={
              showNewImageButton === true
                ? `upload__image--wrapper ${className} flex-start`
                : `upload__image--wrapper ${className} flex-center`
            }
          >
            <div className={showNewImageButton === true ? "hidden" : "upload__image__buttons"}>
              <div className="upload__image--content">
                <button
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                  className="btn-add-file"
                >
                  Add file
                </button>
                <h3 style={{ marginTop: "10px" }}>Accepts images: {acceptTypes.join(", ").toUpperCase()}</h3>
              </div>
            </div>
            <div className="upload__image__thumbnails">
              <div className="upload__image__thumbnails__container">
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.data_url} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <TrashFillImage
                        className="trash-fill-icon"
                        onClick={function () {
                          onImageRemove(index);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={showNewImageButton === false ? "hidden" : "btn-add-new-image"}
              onClick={onImageUpload}
              {...dragProps}
              style={isDragging ? { color: "red" } : undefined}
            >
              <img id="logo-img" src={ImgBoxFill} />
              <span>{pageData.btnAddNew}</span>
            </div>
          </div>
        </>
      )}
    </ImageUploading>
  );
});
