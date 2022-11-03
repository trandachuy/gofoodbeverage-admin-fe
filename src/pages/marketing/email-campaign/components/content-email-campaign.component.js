import { Col, Collapse, Form, Row, Tooltip } from "antd";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { TargetEmailCampaignIcon } from "constants/icons.constants";
import { contentArticleEmailCampaign } from "constants/string.constants";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function ContentEmailCampaign({
  currentEmailTemplateData,
  onChange,
  defaultData,
  mainArticleRef,
  firstArticleRef,
  secondArticleRef,
}) {
  const [t] = useTranslation();
  const [form] = Form.useForm();
  const fnbImageSelectRef = useRef();
  const fnbImageSelectRefFirst = useRef();
  const fnbImageSelectRefSecond = useRef();

  const translateData = {
    content: t("emailCampaign.content", "Content"),
    mainArticle: t("emailCampaign.mainArticle", "Main article"),
    thumbnail: t("emailCampaign.thumbnail", "Thumbnail"),
    uploadImage: t("productManagement.generalInformation.addFile"),
    addFromUrl: t("upload.addFromUrl"),
    textNonImage: t("media.textNonImage"),
    title: t("emailCampaign.title", "Title"),
    placeholderTitle: t("emailCampaign.enterTitle", "Enter title"),
    description: t("form.description", "Description"),
    placeholderDescription: t("emailCampaign.enterDescription", "Enter description"),
    button: t("emailCampaign.button", "Button"),
    placeholderButton: t("emailCampaign.bookNow", "Book now"),
    target: t("marketing.qrCode.target", "Target"),
    placeholderTarget: t("emailCampaign.enterTargetURL", "Enter target URL"),
    targetTooltip: t("emailCampaign.targetTooltip", "User will be navigated to the URL when click on the button"),
    subArticles: t("emailCampaign.subArticles", "Sub-articles"),
    article1: t("emailCampaign.article1", "Article 1"),
    article2: t("emailCampaign.article2", "Article 2"),
  };

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = () => {
    let formValue = {
      mainProductImage:
        currentEmailTemplateData?.mainProductImage !== defaultData?.mainProductImage
          ? fnbImageSelectRef.current.setImageUrl(currentEmailTemplateData?.mainProductImage)
          : "",
      firstSubProductImage:
        currentEmailTemplateData?.firstSubProductImage !== defaultData?.firstSubProductImage
          ? fnbImageSelectRefFirst.current.setImageUrl(currentEmailTemplateData?.firstSubProductImage)
          : "",
      secondSubProductImage:
        currentEmailTemplateData?.secondSubProductImage !== defaultData?.secondSubProductImage
          ? fnbImageSelectRefSecond.current.setImageUrl(currentEmailTemplateData?.secondSubProductImage)
          : "",
      mainProductTitle:
        currentEmailTemplateData?.mainProductTitle !== defaultData?.mainProductTitle
          ? currentEmailTemplateData?.mainProductTitle
          : "",
      firstSubProductTitle:
        currentEmailTemplateData?.firstSubProductTitle !== defaultData?.firstSubProductTitle
          ? currentEmailTemplateData?.firstSubProductTitle
          : "",
      secondSubProductTitle:
        currentEmailTemplateData?.secondSubProductTitle !== defaultData?.secondSubProductTitle
          ? currentEmailTemplateData?.secondSubProductTitle
          : "",
      mainProductDescription:
        currentEmailTemplateData?.mainProductDescription !== defaultData?.mainProductDescription
          ? currentEmailTemplateData?.mainProductDescription
          : "",
      firstSubProductDescription:
        currentEmailTemplateData?.firstSubProductDescription !== defaultData?.firstSubProductDescription
          ? currentEmailTemplateData?.firstSubProductDescription
          : "",
      secondSubProductDescription:
        currentEmailTemplateData?.secondSubProductDescription !== defaultData?.secondSubProductDescription
          ? currentEmailTemplateData?.secondSubProductDescription
          : "",
      mainProductButton:
        currentEmailTemplateData?.mainProductButton !== defaultData?.mainProductButton
          ? currentEmailTemplateData?.mainProductButton
          : "",
      firstSubProductButton:
        currentEmailTemplateData?.firstSubProductButton !== defaultData?.firstSubProductButton
          ? currentEmailTemplateData?.firstSubProductButton
          : "",
      secondSubProductButton:
        currentEmailTemplateData?.secondSubProductButton !== defaultData?.secondSubProductButton
          ? currentEmailTemplateData?.secondSubProductButton
          : "",
      mainProductUrl:
        currentEmailTemplateData?.mainProductUrl !== defaultData?.mainProductUrl
          ? currentEmailTemplateData?.mainProductUrl
          : "",
      firstSubProductUrl:
        currentEmailTemplateData?.firstSubProductUrl !== defaultData?.firstSubProductUrl
          ? currentEmailTemplateData?.firstSubProductUrl
          : "",
      secondSubProductUrl:
        currentEmailTemplateData?.secondSubProductUrl !== defaultData?.secondSubProductUrl
          ? currentEmailTemplateData?.secondSubProductUrl
          : "",
    };

    form.setFieldsValue(formValue);
  };

  const onChangeImage = (file, number) => {
    switch (number) {
      case contentArticleEmailCampaign.firstSubArticle:
        if (file) {
          onChange({ ...currentEmailTemplateData, firstSubProductImage: file });
        } else {
          onChange({ ...currentEmailTemplateData, firstSubProductImage: defaultData?.firstSubProductImage });
        }
        fnbImageSelectRefFirst.current.setImageUrl(file);
        break;
      case contentArticleEmailCampaign.secondSubArticle:
        if (file) {
          onChange({ ...currentEmailTemplateData, secondSubProductImage: file });
        } else {
          onChange({ ...currentEmailTemplateData, secondSubProductImage: defaultData?.secondSubProductImage });
        }
        fnbImageSelectRefSecond.current.setImageUrl(file);
        break;
      default:
        if (file) {
          onChange({ ...currentEmailTemplateData, mainProductImage: file });
        } else {
          onChange({ ...currentEmailTemplateData, mainProductImage: defaultData?.mainProductImage });
        }
        fnbImageSelectRef.current.setImageUrl(file);
        break;
    }
  };

  const onChangePageTitle = (e, number) => {
    const value = e.target.value;
    switch (number) {
      case contentArticleEmailCampaign.firstSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, firstSubProductTitle: value });
        } else {
          onChange({ ...currentEmailTemplateData, firstSubProductTitle: defaultData?.firstSubProductTitle });
        }
        break;
      case contentArticleEmailCampaign.secondSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, secondSubProductTitle: value });
        } else {
          onChange({ ...currentEmailTemplateData, secondSubProductTitle: defaultData?.secondSubProductTitle });
        }
        break;
      default:
        if (value) {
          onChange({ ...currentEmailTemplateData, mainProductTitle: value });
        } else {
          onChange({ ...currentEmailTemplateData, mainProductTitle: defaultData?.mainProductTitle });
        }
        break;
    }
  };

  const onChangeDescription = (e, number) => {
    const value = e.target.value;
    switch (number) {
      case contentArticleEmailCampaign.firstSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, firstSubProductDescription: value });
        } else {
          onChange({
            ...currentEmailTemplateData,
            firstSubProductDescription: defaultData?.firstSubProductDescription,
          });
        }
        break;
      case contentArticleEmailCampaign.secondSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, secondSubProductDescription: value });
        } else {
          onChange({
            ...currentEmailTemplateData,
            secondSubProductDescription: defaultData?.secondSubProductDescription,
          });
        }
        break;
      default:
        if (value) {
          onChange({ ...currentEmailTemplateData, mainProductDescription: value });
        } else {
          onChange({ ...currentEmailTemplateData, mainProductDescription: defaultData?.mainProductDescription });
        }
        break;
    }
  };

  const onChangeButton = (e, number) => {
    const value = e.target.value;
    switch (number) {
      case contentArticleEmailCampaign.firstSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, firstSubProductButton: value });
        } else {
          onChange({ ...currentEmailTemplateData, firstSubProductButton: defaultData?.firstSubProductButton });
        }
        break;
      case contentArticleEmailCampaign.secondSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, secondSubProductButton: value });
        } else {
          onChange({ ...currentEmailTemplateData, secondSubProductButton: defaultData?.secondSubProductButton });
        }
        break;
      default:
        if (value) {
          onChange({ ...currentEmailTemplateData, mainProductButton: value });
        } else {
          onChange({ ...currentEmailTemplateData, mainProductButton: defaultData?.mainProductButton });
        }
        break;
    }
  };

  const onChangeTarget = (e, number) => {
    const value = e.target.value;
    switch (number) {
      case contentArticleEmailCampaign.firstSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, firstSubProductUrl: value });
        } else {
          onChange({ ...currentEmailTemplateData, firstSubProductUrl: defaultData?.firstSubProductUrl });
        }
        break;
      case contentArticleEmailCampaign.secondSubArticle:
        if (value) {
          onChange({ ...currentEmailTemplateData, secondSubProductUrl: value });
        } else {
          onChange({ ...currentEmailTemplateData, secondSubProductUrl: defaultData?.secondSubProductUrl });
        }
        break;
      default:
        if (value) {
          onChange({ ...currentEmailTemplateData, mainProductUrl: value });
        } else {
          onChange({ ...currentEmailTemplateData, mainProductUrl: defaultData?.mainProductUrl });
        }
        break;
    }
  };

  return (
    <>
      <Form form={form} name="basic" autoComplete="off">
        <Collapse defaultActiveKey="3" className="fnb-collapse content-email-campaign">
          <Collapse.Panel key={3} header={<div>{translateData.content}</div>}>
            <Collapse defaultActiveKey="3.1" className="fnb-collapse content-article content-main-article">
              <Collapse.Panel key={3.1} header={translateData.mainArticle}>
                <Row ref={mainArticleRef} className="main-article">
                  <Col span={24} className="thumbnail">
                    <h3>{translateData.thumbnail}</h3>
                    <Form.Item name="mainProductImage">
                      <FnbImageSelectComponent
                        ref={fnbImageSelectRef}
                        onChange={(e) => onChangeImage(e, contentArticleEmailCampaign.mainArticle)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-12">
                    <h3>{translateData.title}</h3>
                    <Form.Item name="mainProductTitle">
                      <FnbInput
                        onChange={(e) => onChangePageTitle(e, contentArticleEmailCampaign.mainArticle)}
                        placeholder={translateData.placeholderTitle}
                        showCount
                        maxLength={255}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.description}</h3>
                    <Form.Item name="mainProductDescription">
                      <FnbTextArea
                        showCount
                        maxLength={1000}
                        rows={4}
                        placeholder={translateData.placeholderDescription}
                        onChange={(e) => onChangeDescription(e, contentArticleEmailCampaign.mainArticle)}
                      ></FnbTextArea>
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.button}</h3>
                    <Form.Item name="mainProductButton">
                      <FnbInput
                        placeholder={translateData.placeholderButton}
                        onChange={(e) => onChangeButton(e, contentArticleEmailCampaign.mainArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3 className="target-title">
                      {translateData.target}
                      <Tooltip placement="right" title={translateData.targetTooltip} color="#50429B">
                        <TargetEmailCampaignIcon />
                      </Tooltip>
                    </h3>
                    <Form.Item name="mainProductUrl">
                      <FnbInput
                        placeholder={translateData.placeholderTarget}
                        onChange={(e) => onChangeTarget(e, contentArticleEmailCampaign.mainArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
            <Collapse defaultActiveKey="3.2" className="fnb-collapse content-article content-sub-article">
              <Collapse.Panel key={3.2} header={translateData.subArticles}>
                <Row ref={firstArticleRef} className="sub-article">
                  <Col span={24} className="article-title">
                    <h3>{translateData.article1}</h3>
                    <hr />
                  </Col>
                  <Col span={24} className="thumbnail">
                    <h3>{translateData.thumbnail}</h3>
                    <Form.Item name="firstSubProductImage">
                      <FnbImageSelectComponent
                        ref={fnbImageSelectRefFirst}
                        onChange={(e) => onChangeImage(e, contentArticleEmailCampaign.firstSubArticle)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-12">
                    <h3>{translateData.title}</h3>
                    <Form.Item name="firstSubProductTitle">
                      <FnbInput
                        onChange={(e) => onChangePageTitle(e, contentArticleEmailCampaign.firstSubArticle)}
                        placeholder={translateData.placeholderTitle}
                        showCount
                        maxLength={255}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.description}</h3>
                    <Form.Item name="firstSubProductDescription">
                      <FnbTextArea
                        showCount
                        maxLength={1000}
                        rows={4}
                        placeholder={translateData.placeholderDescription}
                        onChange={(e) => onChangeDescription(e, contentArticleEmailCampaign.firstSubArticle)}
                      ></FnbTextArea>
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.button}</h3>
                    <Form.Item name="firstSubProductButton">
                      <FnbInput
                        placeholder={translateData.placeholderButton}
                        onChange={(e) => onChangeButton(e, contentArticleEmailCampaign.firstSubArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3 className="target-title">
                      {translateData.target}
                      <Tooltip placement="right" title={translateData.targetTooltip} color="#50429B">
                        <TargetEmailCampaignIcon />
                      </Tooltip>
                    </h3>
                    <Form.Item name="firstSubProductUrl">
                      <FnbInput
                        placeholder={translateData.placeholderTarget}
                        onChange={(e) => onChangeTarget(e, contentArticleEmailCampaign.firstSubArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row ref={secondArticleRef} className="sub-article">
                  <Col span={24} className="article-title">
                    <h3>{translateData.article2}</h3>
                    <hr />
                  </Col>
                  <Col span={24} className="thumbnail">
                    <h3>{translateData.thumbnail}</h3>
                    <Form.Item name="secondSubProductImage">
                      <FnbImageSelectComponent
                        ref={fnbImageSelectRefSecond}
                        onChange={(e) => onChangeImage(e, contentArticleEmailCampaign.secondSubArticle)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-12">
                    <h3>{translateData.title}</h3>
                    <Form.Item name="secondSubProductTitle">
                      <FnbInput
                        onChange={(e) => onChangePageTitle(e, contentArticleEmailCampaign.secondSubArticle)}
                        placeholder={translateData.placeholderTitle}
                        showCount
                        maxLength={255}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.description}</h3>
                    <Form.Item name="secondSubProductDescription">
                      <FnbTextArea
                        showCount
                        maxLength={1000}
                        rows={4}
                        placeholder={translateData.placeholderDescription}
                        onChange={(e) => onChangeDescription(e, contentArticleEmailCampaign.secondSubArticle)}
                      ></FnbTextArea>
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3>{translateData.button}</h3>
                    <Form.Item name="secondSubProductButton">
                      <FnbInput
                        placeholder={translateData.placeholderButton}
                        onChange={(e) => onChangeButton(e, contentArticleEmailCampaign.secondSubArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-30">
                    <h3 className="target-title">
                      {translateData.target}
                      <Tooltip placement="right" title={translateData.targetTooltip} color="#50429B">
                        <TargetEmailCampaignIcon />
                      </Tooltip>
                    </h3>
                    <Form.Item name="secondSubProductUrl">
                      <FnbInput
                        placeholder={translateData.placeholderTarget}
                        onChange={(e) => onChangeTarget(e, contentArticleEmailCampaign.secondSubArticle)}
                        showCount
                        maxLength={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  );
}
