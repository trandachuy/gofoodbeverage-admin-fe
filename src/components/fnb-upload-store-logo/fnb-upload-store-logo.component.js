import moment from "moment";
import { Col, message, Row } from "antd";
import Viewer from "react-viewer";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-upload-store-logo.component.scss";
import ImageUploading from "react-images-uploading";
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from "constants/icons.constants";
import { AllowedNumberOfPhotosDefault, DateFormat, ImageSizeDefault } from "constants/string.constants";
import { fileNameNormalize, jsonToFormData } from "utils/helpers";
import storeDataService from "data-services/store/store-data.service";
import { useDispatch } from "react-redux";
import { setStoreLogo } from "store/modules/session/session.actions";

const { forwardRef, useImperativeHandle } = React;
export const FnbUploadStoreLogoComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { onChange, buttonText, className } = props;
  const [images, setImages] = React.useState([]);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    setImage(url) {
      var imageList = [
        {
          data_url: url,
        },
      ];
      if (url?.length > 0) {
        setImages(imageList);
      } else {
        setImages([]);
      }
    },
  }));

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = async (imageList) => {
    // data for submit
    let buildFileName = moment(new Date()).format(DateFormat.DDMMYYYYHHmmss);
    const requestData = {
      file: imageList.length > 0 ? imageList[0].file : null,
      fileName: fileNameNormalize(buildFileName),
      fileSizeLimit: ImageSizeDefault,
    };

    const requestFormData = jsonToFormData(requestData);
    const updateStoreLogoResponse = await storeDataService.updateStoreLogoAsync(requestFormData);
    dispatch(setStoreLogo(updateStoreLogoResponse));
    setImages(imageList);
    onChange(imageList.length > 0);
  };

  /**
   *
   * @param {Position of image item} index
   */
  const onViewImage = () => {
    setVisibleViewer(true);
  };

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize === true) {
      message.error(t("messages.imageSizeTooBig"));
    }
  };

  /**
   * When hover into image. It will show action include: edit, view and delete
   * @param {Position of image item} index
   */
  const hoverEnterImage = (index) => {
    let groupControlBtn = document.getElementById(`group-btn-upload-image-${index}`);
    if (groupControlBtn) {
      groupControlBtn.classList.add("group-btn-upload-image-display");
    }
  };

  /**
   *
   * @param {Position of image item} index
   */
  const hoverLeaveImage = (index) => {
    let groupControlBtn = document.getElementById(`group-btn-upload-image-${index}`);
    if (groupControlBtn) {
      groupControlBtn.classList.remove("group-btn-upload-image-display");
    }
  };

  return (
    <>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onUploadImage}
        maxNumber={AllowedNumberOfPhotosDefault}
        dataURLKey="data_url"
        maxFileSize={ImageSizeDefault} // The unit is byte
        onError={uploadImageError}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          return (
            // write your building UI
            <div className="upload__image-wrapper">
              {
                <button
                  style={isDragging ? { color: "red" } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                  type="button"
                  className={`btn-upload-image ${className} ${imageList.length > 0 ? "btn-hidden" : ""}`}
                >
                  {buttonText}
                </button>
              }
              {imageList?.map((image, index) => (
                <>
                  <div onMouseEnter={() => hoverEnterImage(index)} onMouseLeave={() => hoverLeaveImage(index)}>
                    <div key={index} className="image-store-item">
                      {image.data_url && <img src={image["data_url"]} alt="" />}
                    </div>
                    <div
                      key={`group-btn-${index}`}
                      className="group-btn-store-logo"
                      id={`group-btn-upload-image-${index}`}
                    >
                      <Row className="group-btn-upload-image-row">
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageUpdate(index)}>
                          <EditFillImage className="edit-fill-icon" />
                        </Col>
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onViewImage(index)}>
                          <EyeOpenImageIcon className="eye-open-icon" />
                        </Col>
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageRemove(index)}>
                          <TrashFillImage className="trash-fill-icon" />
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {
                    <Viewer
                      visible={visibleViewer}
                      onClose={() => {
                        setVisibleViewer(false);
                      }}
                      images={[
                        {
                          src: image["data_url"],
                        },
                      ]}
                      noFooter={true}
                    />
                  }
                </>
              ))}
            </div>
          );
        }}
      </ImageUploading>
    </>
  );
});
