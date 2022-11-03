import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-image-select.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FnbImageSelectComponent = forwardRef((props, ref) => {
  const { className, onChange, value } = props;
  const [t] = useTranslation();
  const fnbUploadRef = React.useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  useImperativeHandle(ref, () => ({
    setImageUrl(url) {
      setImageUrl(url);
    },
    getImageUrl() {
      return selectedImage ?? "";
    },
  }));

  const pageData = {
    addFromUrl: t("material.addFromUrl"),
    uploadImage: t("material.addFile"),
    textNonImage: t("media.textNonImage"),
  };

  useEffect(() => {
    setImageUrl(value);
  }, []);

  const setImageUrl = (url) => {
    if (fnbUploadRef && fnbUploadRef.current && url) {
      fnbUploadRef.current.setImage(url);
      setSelectedImage(url);
    }
  };

  const onClickUploadImage = (file) => {
    if (onChange) {
      onChange(file?.url);
    }
    setSelectedImage(file != null ? file?.url : null);
  };

  return (
    <div className="fnb-image-select">
      <Row className={`non-image ${selectedImage !== null ? "have-image" : ""}`}>
        <Col span={24} className={`image-product ${selectedImage !== null ? "justify-left" : ""}`}>
          <div style={{ display: "flex" }}>
            <FnbUploadImageComponent
              ref={fnbUploadRef}
              buttonText={pageData.uploadImage}
              onChange={onClickUploadImage}
            />
            <a className="upload-image-url" hidden={selectedImage !== null ? true : false}>
              {pageData.addFromUrl}
            </a>
          </div>
        </Col>
        <Col span={24} className="text-non-image" hidden={selectedImage !== null ? true : false}>
          <Text disabled>{pageData.textNonImage}</Text>
        </Col>
      </Row>
    </div>
  );
});
