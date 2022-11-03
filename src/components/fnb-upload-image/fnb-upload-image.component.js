import { Col, message, Row } from "antd";
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from "constants/icons.constants";
import fileDataService from "data-services/file/file-data.service";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import Viewer from "react-viewer";
import { fileNameNormalize, jsonToFormData } from "utils/helpers";
import "./fnb-upload-image.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FnbUploadImageComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { onChange, maxNumber = 1, buttonText, className } = props;
  const [images, setImages] = React.useState([]);
  const [visibleViewer, setVisibleViewer] = useState(false);

  useImperativeHandle(ref, () => ({
    setImage(url) {
      var imageList = [
        {
          data_url: url,
        },
      ];
      setImages(imageList);
    },
  }));

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = (imageList) => {
    // data for submit
    let buildFileName = moment(new Date()).format("DDMMYYYYHHmmss");
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName),
      };
      const requestFormData = jsonToFormData(requestData);
      fileDataService.uploadFileAsync(requestFormData).then((res) => {
        if (res.success === true) {
          imageList[0].data_url = res.data;
          setImages(imageList);
          if (onChange) {
            onChange({
              fileName: buildFileName,
              url: res.data,
            });
          }
        }
      });
    } else {
      if (onChange) {
        setImages(imageList);
        onChange(null);
      }
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

  return (
    <>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onUploadImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        maxFileSize={5242880} // The unit is byte
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
                    <div key={index} className="image-item">
                      <img src={image["data_url"]} alt="" />
                    </div>
                    <div
                      key={`group-btn-${index}`}
                      className="group-btn-upload-image"
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
                    <>
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
                    </>
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
