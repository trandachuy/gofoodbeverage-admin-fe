import { Checkbox, Col, Collapse, Form, Input, Row, Tabs, Select, DatePicker, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbColorPicker } from "components/fnb-color-picker/fnb-color-picker.component";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { COLOR } from "constants/default.constants";
import { FacebookIcon, InstagramIcon, TiktokIcon, TwitterIcon, YoutubeIcon } from "constants/icons.constants";
import { EmailCampaignSocial, EmailCampaignType } from "constants/email-campaign.constants";
import { ArrowDown, CheckboxCheckedIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { emailCampaignDefaultTemplate } from "email-campaign-templates/email-campaign-default.template";
import React, { useEffect, useRef, useState } from "react";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ContentEmailCampaign from "../components/content-email-campaign.component";
import { EmailCampaignTemplate } from "../components/email-campaign-template.component";
import "./create-email-campaign.page.scss";
import { Editor } from "@tinymce/tinymce-react";
import { formatDate, isValidHttpUrl } from "utils/helpers";
import moment from "moment";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import FnbDateTimePickerComponent from "components/fnb-datetime-picker";
import { DateFormat } from "constants/string.constants";
import emailCampaignDataService from "data-services/email-campaign/email-campaign-data.service";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

const SocialNames = {
  Facebook: "facebook",
  Instagram: "instagram",
  Tiktok: "tiktok",
  Twitter: "twitter",
  Youtube: "youtube",
};

const DefaultSocialLinks = [
  {
    name: SocialNames.Facebook,
    icon: <FacebookIcon />,
    defaultUrl: "https://www.facebook.com/Gosell.vn",
  },
  {
    name: SocialNames.Instagram,
    icon: <InstagramIcon />,
    defaultUrl: "https://www.instagram.com/Gosell.vn",
  },
  {
    name: SocialNames.Tiktok,
    icon: <TiktokIcon />,
    defaultUrl: "https://www.tiktok.com/Gosell.vn",
  },
  {
    name: SocialNames.Twitter,
    icon: <TwitterIcon />,
    defaultUrl: "https://www.twitter.com/Gosell.vn",
  },
  {
    name: SocialNames.Youtube,
    icon: <YoutubeIcon />,
    defaultUrl: "https://www.youtube.com/Gosell.vn",
  },
];

export default function CreateEmailCampaignPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const emailTemplateRef = React.useRef();
  const logoRef = useRef();
  const titleEditRef = useRef();
  const mainArticleRef = useRef();
  const firstArticleRef = useRef();
  const secondArticleRef = useRef();
  const footerSectionRef = useRef();

  const tab = {
    general: "general",
    customize: "customize",
  };
  const templateObjective = {
    primaryColor: COLOR.PRIMARY,
    secondaryColor: COLOR.SECONDARY,
    emailTitle: "Title email",
    logo: "/images/default-email-template/logo.jpg",
    mainProductImage: "/images/default-email-template/main-product.jpg",
    mainProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    mainProductDescription: `
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. Senectus nullam quam viverra sit. Quis porta a.
    </p>
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. Senectus nullam quam viverra sit.     </p>
    </p>
    `,
    mainProductButton: "BOOK NOW",
    mainProductUrl: "https://www.yourstore.com",
    firstSubProductImage: "/images/default-email-template/first-sub-product.jpg",
    firstSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    firstSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    firstSubProductButton: "EXPLORE NOW",
    firstSubProductUrl: "https://www.yourstore.com",
    secondSubProductImage: "/images/default-email-template/second-sub-product.jpg",
    secondSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    secondSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    secondSubProductButton: "EXPLORE NOW",
    secondSubProductUrl: "/images/default-email-template/second-sub-product.jpg",
    facebook: {
      url: DefaultSocialLinks[0].defaultUrl,
      isActive: false,
      isDisable: false,
    },
    instagram: {
      url: DefaultSocialLinks[1].defaultUrl,
      isActive: false,
      isDisable: false,
    },
    tiktok: {
      url: DefaultSocialLinks[2].defaultUrl,
      isActive: false,
      isDisable: false,
    },
    twitter: {
      url: DefaultSocialLinks[3].defaultUrl,
      isActive: false,
      isDisable: false,
    },
    youtube: {
      url: DefaultSocialLinks[4].defaultUrl,
      isActive: false,
      isDisable: false,
    },
    footerContent: `
      <p style="text-align: center;">Copyright 2010-2022 StoreName, all rights reserved.</p>
      <p style="text-align: center;">60A Trường Sơn, Phường 2, Quận T&acirc;n B&igrave;nh, Hồ Ch&iacute; Minh, Việt Nam</p>
      <p style="text-align: center;">(+84) 989 38 74 94 | youremail@gmail.com</p>
      <p style="text-align: center;">Privacy Policy | Unsubscribe</p>
      <p style="text-align: center;">Bạn nhận được tin n&agrave;y v&igrave; bạn đ&atilde; đăng k&yacute; hoặc chấp nhận lời mời của ch&uacute;ng t&ocirc;i để nhận email từ SHEIN hoặc bạn đ&atilde; mua h&agrave;ng từ SHEIN.com.</p>
    `,
  };
  const [currentEmailTemplateData, setCurrentEmailTemplateData] = useState(templateObjective);
  const [currentTab, setCurrentTab] = useState(tab.general);
  const [formGeneralTab] = Form.useForm();
  const [customerSegmentInSore, setCustomerSegmentInStore] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);
  const [showCountCustomerSegment, setShowCountCustomerSegment] = useState(false);
  const [showSelectControlCustomerSegment, setShowSelectControlCustomerSegment] = useState(false);

  const [socialFacebook, setSocialFacebook] = useState({
    url: "",
    isActive: false,
  });
  const [socialInstagram, setSocialInstagram] = useState({
    url: "",
    isActive: false,
  });
  const [socialTiktok, setSocialTiktok] = useState({
    url: "",
    isActive: false,
  });
  const [socialTwitter, setSocialTwitter] = useState({
    url: "",
    isActive: false,
  });
  const [socialYoutube, setSocialYoutube] = useState({
    url: "",
    isActive: false,
  });
  const [socialContent, setSocialContent] = useState(templateObjective.footerContent);
  const [isVisibleSendingTimeDialog, setIsVisibleSendingTimeDialog] = useState(false);
  const [messageContentSendingTimeDialog, setMessageContentSendingTimeDialog] = useState(<></>);
  const [sendingTimeDefault, setSendingTimeDefault] = useState();
  const [formGeneralTabValue, setFormGeneralTabValue] = useState();
  const [titleDialog, setTitleDialog] = useState();

  const translateData = {
    addNew: t("button.addNew", "Add new"),
    color: t("emailCampaign.color", "Color"),
    primaryColor: t("emailCampaign.primaryColor", "Primary color"),
    secondaryColor: t("emailCampaign.secondaryColor", "Secondary color"),
    reset: t("emailCampaign.reset", "Reset"),
    createEmailCampaign: t("emailCampaign.createEmailCampaign", "Create Email campaign"),
    general: t("emailCampaign.general", "General"),
    customize: t("emailCampaign.customize", "Customize"),
    generalSetting: t("emailCampaign.generalSetting", "General setting"),
    header: t("emailCampaign.header", "Header"),
    title: t("emailCampaign.title", "Title"),
    logo: t("emailCampaign.logo", "Logo"),
    enterEmailTitle: t("emailCampaign.enterEmailTitle", "Enter email title"),
    footerSection: {
      footer: t("emailCampaign.footer", "Footer"),
      socialNetwork: t("emailCampaign.socialNetwork", "Social network"),
      pleaseEnterSocialNetworkLink: t("emailCampaign.pleaseEnterSocialNetworkLink", "Please enter social network link"),
      invalidSocialNetworkLink: t("emailCampaign.invalidSocialNetworkLink", "Invalid social network link"),
      content: t("emailCampaign.content", "Content"),
    },
    generalTab: {
      generalInformationTitle: t("marketing.emailCampaign.generalTab.generalInformationTitle"),
      emailInformationTitle: t("marketing.emailCampaign.generalTab.emailInformationTitle"),
      fieldName: t("marketing.emailCampaign.generalTab.fieldName"),
      campaignDescription: t("marketing.emailCampaign.generalTab.campaignDescription"),
      sendingTime: t("marketing.emailCampaign.generalTab.sendingTime"),
      subject: t("marketing.emailCampaign.generalTab.subject"),
      sendTo: t("marketing.emailCampaign.generalTab.sendTo"),
      emailAddress: t("marketing.emailCampaign.generalTab.emailAddress"),
      customerGroup: t("marketing.emailCampaign.generalTab.customerGroup"),
      nameRequiredMessage: t("marketing.emailCampaign.generalTab.nameRequiredMessage"),
      sendingTimeRequiredMessage: t("marketing.emailCampaign.generalTab.sendingTimeRequiredMessage"),
      subjectRequiredMessage: t("marketing.emailCampaign.generalTab.subjectRequiredMessage"),
      sendToRequiredMessage: t("marketing.emailCampaign.generalTab.sendToRequiredMessage"),
      emailAddressRequiredMessage: t("marketing.emailCampaign.generalTab.emailAddressRequiredMessage"),
      customerGroupRequiredMessage: t("marketing.emailCampaign.generalTab.customerGroupRequiredMessage"),
      namePlaceholder: t("marketing.emailCampaign.generalTab.namePlaceholder"),
      campaignDescriptionPlaceholder: t("marketing.emailCampaign.generalTab.campaignDescriptionPlaceholder"),
      sendingTimePlaceholder: t("marketing.emailCampaign.generalTab.sendingTimePlaceholder"),
      subjectPlaceholder: t("marketing.emailCampaign.generalTab.subjectPlaceholder"),
      sendToPlaceholder: t("marketing.emailCampaign.generalTab.sendToPlaceholder"),
      emailAddressPlaceholder: t("marketing.emailCampaign.generalTab.emailAddressPlaceholder"),
      customerGroupPlaceholder: t("marketing.emailCampaign.generalTab.customerGroupPlaceholder"),
      invalidEmailAddress: t("marketing.emailCampaign.generalTab.invalidEmailAddress"),
      btnIGotIt: t("marketing.emailCampaign.generalTab.btnIGotIt"),
      titleDialogSendingTime: t("marketing.emailCampaign.generalTab.titleDialogSendingTime"),
      createSuccessfullyMessage: t("marketing.emailCampaign.generalTab.createSuccessfullyMessage"),
      createIsNotSuccessfullyMessage: t("marketing.emailCampaign.generalTab.createIsNotSuccessfullyMessage"),
      tabRequiredMessage: t("marketing.emailCampaign.generalTab.tabRequiredMessage"),
    },
  };

  const emailCampaignType = [
    {
      id: EmailCampaignType.SendToEmailAddress,
      name: t("marketing.emailCampaign.sendToEmailAddress"),
    },
    {
      id: EmailCampaignType.SendToCustomerGroup,
      name: t("marketing.emailCampaign.sendToCustomerGroup"),
    },
  ];

  useEffect(() => {
    updateTemplate(templateObjective);
    initialDataForGeneralTab();
  }, []);

  const onClickCreateEmailCampaign = () => {
    if (currentTab !== tab.general) {
      if (
        formGeneralTabValue?.emailCampaignType &&
        formGeneralTabValue?.name &&
        formGeneralTabValue?.sendingTime &&
        formGeneralTabValue?.emailSubject
      ) {
        if (
          (formGeneralTabValue?.emailCampaignType === EmailCampaignType.SendToEmailAddress &&
            formGeneralTabValue?.emailAddress) ||
          (formGeneralTabValue?.emailCampaignType === EmailCampaignType.SendToEmailAddress &&
            formGeneralTabValue?.customerSegmentIds?.length > 0)
        ) {
          saveEmailCampaign();
        } else {
          showWarningDialog();
        }
      } else {
        showWarningDialog();
      }
    } else {
      saveEmailCampaign();
    }
  };

  const saveEmailCampaign = () => {
    const emailTemplateHtmlCode = emailTemplateRef.current.getTemplate();
    formGeneralTab.validateFields().then(async (values) => {
      let dateTimeNow = formatDate(new Date(), DateFormat.YYYY_MM_DD_HH_MM_SS);
      let sendingTimeValue = formatDate(values?.sendingTime, DateFormat.YYYY_MM_DD_HH_MM_SS);
      let compareDateTime = dateTimeNow > sendingTimeValue;
      if (compareDateTime) {
        let messageSendingTimeDialog = t("marketing.emailCampaign.generalTab.sendingTimeMessageDialog", {
          dateTimeValue: moment(dateTimeNow).format(DateFormat.DD_MM_YYYY_HH_MM_SS),
        });
        setTitleDialog(translateData.generalTab.titleDialogSendingTime);
        setMessageContentSendingTimeDialog(messageSendingTimeDialog);
        setIsVisibleSendingTimeDialog(true);
      } else {
        let socialList = getEmailCampaignSocials();
        let emailCampaignDetails = getEmailCampaignDetails();
        let dataSubmit = {
          ...formGeneralTabValue,
          footerContent: currentEmailTemplateData?.footerContent,
          primaryColor: currentEmailTemplateData?.primaryColor,
          secondaryColor: currentEmailTemplateData?.secondaryColor,
          logoUrl: currentEmailTemplateData?.logo,
          title: currentEmailTemplateData?.emailTitle,
          emailCampaignSocials: socialList,
          emailCampaignDetails: emailCampaignDetails,
          sendingTime: sendingTimeValue,
          template: emailTemplateHtmlCode,
        };

        const emailCampaignResult = await emailCampaignDataService.createEmailCampaignAsync(dataSubmit);
        if (emailCampaignResult?.isSuccess) {
          message.success(translateData.generalTab.createSuccessfullyMessage);
          history.push("/marketing/email-campaign");
        } else {
          message.error(translateData.generalTab.createIsNotSuccessfullyMessage);
        }
      }
    });
  };

  const onClickSession = (sessionId) => {
    const scrollViewOption = { behavior: "smooth", block: "start", inline: "center" };
    switch (sessionId) {
      case emailCampaignDefaultTemplate.border.logo:
        logoRef.current?.scrollIntoView(scrollViewOption);
        break;
      case emailCampaignDefaultTemplate.border.title:
        titleEditRef.current?.scrollIntoView(scrollViewOption);
        break;
      case emailCampaignDefaultTemplate.border.mainProduct:
        mainArticleRef.current?.scrollIntoView(scrollViewOption);
        break;
      case emailCampaignDefaultTemplate.border.firstSubProduct:
        firstArticleRef.current?.scrollIntoView(scrollViewOption);
        break;
      case emailCampaignDefaultTemplate.border.secondSubProduct:
        secondArticleRef.current?.scrollIntoView(scrollViewOption);
        break;
      case emailCampaignDefaultTemplate.border.footer:
        footerSectionRef.current?.scrollIntoView(scrollViewOption);
        break;
      default:
        break;
    }
  };

  const onChangePrimaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      primaryColor: color.hex,
    };
    updateTemplate(newData);
  };

  const onChangeSecondaryColor = (color) => {
    const newData = {
      ...currentEmailTemplateData,
      secondaryColor: color.hex,
    };
    updateTemplate(newData);
  };

  const onChangeEmailTitle = (e) => {
    const text = e.target.value;
    updateTemplate({
      ...currentEmailTemplateData,
      emailTitle: text ?? templateObjective?.emailTitle,
    });
  };

  //#region Footer Section
  const editorRef = useRef(null);

  const onChangeFooterContent = () => {
    const content = editorRef.current.getContent();
    setSocialContent(content);
    const newData = {
      ...currentEmailTemplateData,
      footerContent: content,
    };
    updateTemplate(newData);
  };

  const onCheckSocialLink = (socialName, isActive) => {
    switch (socialName) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({ ...prev, isActive }));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({ ...prev, isActive }));
        break;
      default:
        break;
    }
    // update to Preview
    const currentSocialValue = currentEmailTemplateData?.[socialName];
    const isValidLink = isValidHttpUrl(currentSocialValue.url);
    const newData = {
      ...currentEmailTemplateData,
      [socialName]: {
        url: currentSocialValue.url,
        isActive: isActive,
        isDisable: !isValidLink,
      },
    };
    updateTemplate(newData);
  };

  const onChangeSocialUrl = (socialName, url) => {
    switch (socialName) {
      case SocialNames.Facebook:
        setSocialFacebook((prev) => ({ ...prev, url }));
        break;
      case SocialNames.Instagram:
        setSocialInstagram((prev) => ({ ...prev, url }));
        break;
      case SocialNames.Tiktok:
        setSocialTiktok((prev) => ({ ...prev, url }));
        break;
      case SocialNames.Twitter:
        setSocialTwitter((prev) => ({ ...prev, url }));
        break;
      case SocialNames.Youtube:
        setSocialYoutube((prev) => ({ ...prev, url }));
        break;
      default:
        break;
    }

    // update to Preview
    const currentSocialValue = currentEmailTemplateData?.[socialName];
    const isValidLink = isValidHttpUrl(url);
    const newData = {
      ...currentEmailTemplateData,
      [socialName]: {
        url: url,
        isActive: currentSocialValue.isActive,
        isDisable: !isValidLink,
      },
    };
    updateTemplate(newData);
  };

  const getSocialNetworkByName = (name) => {
    switch (name) {
      case SocialNames.Facebook:
        return socialFacebook;
      case SocialNames.Instagram:
        return socialInstagram;
      case SocialNames.Tiktok:
        return socialTiktok;
      case SocialNames.Twitter:
        return socialTwitter;
      case SocialNames.Youtube:
        return socialYoutube;
      default:
        break;
    }
  };

  const renderFooter = () => {
    return (
      <Collapse defaultActiveKey={"1"} className="fnb-collapse email-campaign__footer">
        <Collapse.Panel key="1" header={<div>{translateData.footerSection.footer}</div>}>
          {/* Socials */}
          <div className="footer__social__title" ref={footerSectionRef}>
            <span>{translateData.footerSection.socialNetwork}</span>
          </div>
          <div className="footer__social__links">
            {DefaultSocialLinks?.map((social, index) => {
              const mappedSocialNetwork = getSocialNetworkByName(social.name);
              return (
                <div className="social__link" key={index}>
                  {/* Social Icon */}
                  <div className="link__icon">{social.icon}</div>

                  {/* Input URL */}
                  <Form.Item
                    name={["social", social.name, "url"]}
                    rules={[
                      {
                        required: mappedSocialNetwork.isActive,
                        message: translateData.footerSection.pleaseEnterSocialNetworkLink,
                      },
                      {
                        validator: (_, value) => {
                          if (value.length > 0 && !isValidHttpUrl(value)) {
                            return Promise.reject(new Error(translateData.footerSection.invalidSocialNetworkLink));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    className="flex-1"
                  >
                    <FnbInput
                      placeholder={social.defaultUrl}
                      className="social__link__textInput"
                      onChange={(value) => onChangeSocialUrl(social.name, value.target.value)}
                      maxLength={2000}
                    />
                  </Form.Item>

                  {/* Checkbox */}
                  <Form.Item name={["social", social.name, "isActive"]} className="flex-0">
                    <Checkbox
                      defaultChecked={social.isActive}
                      checked={mappedSocialNetwork.isActive}
                      onChange={(value) => onCheckSocialLink(social.name, value.target.checked)}
                    ></Checkbox>
                  </Form.Item>
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div className="footer__content">
            <h3>{translateData.footerSection.content}</h3>
            <div className="footer__content_editor">
              <Editor
                apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={socialContent}
                onEditorChange={() => onChangeFooterContent()}
                init={{
                  height: 300,
                  menubar: false,
                  formats: {
                    underline: { inline: "span", styles: { "text-decoration": "underline" }, exact: true },
                  },
                  plugins: [
                    "a11ychecker",
                    "advlist",
                    "advcode",
                    "advtable",
                    "autolink",
                    "checklist",
                    "export",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "powerpaste",
                    "fullscreen",
                    "formatpainter",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | casechange blocks | alignleft aligncenter alignright alignjustify | " +
                    "bold italic underline | " +
                    "image link",
                  block_formats: "Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  };
  //#endregion

  const updateTemplate = (data) => {
    if (emailTemplateRef && emailTemplateRef.current) {
      emailTemplateRef.current.setTemplate(data);
    }

    setCurrentEmailTemplateData(data);
    form.setFieldsValue(data);
  };

  const renderGeneralSetting = () => {
    return (
      <Collapse className="fnb-collapse" defaultActiveKey={["1"]}>
        <Collapse.Panel key={"1"} header={<div>{translateData.generalSetting}</div>}>
          <div>
            <span className="setting-title">{translateData.color}</span>
          </div>
          <Row className="mt-4">
            <Col span={12} className="m-auto">
              <p className="setting-detail">{translateData.primaryColor}</p>
            </Col>
            <Col span={12} className="d-flex select-color">
              <FnbColorPicker
                className="w-100"
                onChange={onChangePrimaryColor}
                hexColor={currentEmailTemplateData?.primaryColor}
              />
              <p
                className="setting-detail reset m-auto pointer"
                onClick={() => {
                  onChangePrimaryColor({ hex: COLOR.PRIMARY });
                }}
              >
                {translateData.reset}
              </p>
            </Col>
          </Row>
          <Row className="mt-4 mb-4">
            <Col span={12} className="m-auto">
              <p className="setting-detail">{translateData.secondaryColor}</p>
            </Col>
            <Col span={12} className="d-flex select-color">
              <FnbColorPicker
                className="w-100"
                onChange={onChangeSecondaryColor}
                hexColor={currentEmailTemplateData?.secondaryColor}
              />
              <p
                className="setting-detail reset m-auto pointer"
                onClick={() => {
                  onChangeSecondaryColor({ hex: COLOR.SECONDARY });
                }}
              >
                {translateData.reset}
              </p>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  };

  const onChangeImage = (fileUrl) => {
    updateTemplate({
      ...currentEmailTemplateData,
      logo: fileUrl ?? templateObjective?.logo,
    });
  };

  const renderHeader = () => {
    return (
      <Collapse className="fnb-collapse" defaultActiveKey={["1"]}>
        <Collapse.Panel key={"1"} header={<div>{translateData.header}</div>}>
          <Row id={`_${emailCampaignDefaultTemplate.border.logo}`} className="mt-2" ref={logoRef}>
            <Col span={24} className="mb-2">
              <span className="setting-title">{translateData.logo}</span>
            </Col>
            <Col span={24}>
              <Form.Item name="logo">
                <FnbImageSelectComponent className="w-100" onChange={onChangeImage} />
              </Form.Item>
            </Col>
          </Row>

          <Row ref={titleEditRef} className="mt-3">
            <Col span={24} className="mb-2">
              <span className="setting-title">{translateData.title}</span>
            </Col>
            <Col span={24} className="m-auto">
              <Form.Item name="emailTitle">
                <FnbInput
                  showCount
                  placeholder={translateData.enterEmailTitle}
                  maxLength={255}
                  onChange={onChangeEmailTitle}
                />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    );
  };

  const initialDataForGeneralTab = async () => {
    // Get customer segment list
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    setCustomerSegmentInStore(customerSegmentListResult);
    let currentDatetime = moment().add(15, "m");
    if (formGeneralTabValue?.sendingTime) {
      currentDatetime = formGeneralTabValue?.sendingTime;
    }

    // Set form value
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      emailCampaignType: EmailCampaignType.SendToEmailAddress,
      sendingTime: currentDatetime,
      customerSegmentIds: [],
    });
    setSendingTimeDefault(currentDatetime);
    setTotalCustomer(0);
    setTotalEmail(0);
    setTotalSegment(0);
    setShowSelectControlCustomerSegment(false);
  };

  const onChangeEmailCampaignType = (value) => {
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      emailAddress: null,
      customerSegmentIds: [],
    });
    if (value === EmailCampaignType.SendToEmailAddress) {
      setTotalCustomer(0);
      setTotalEmail(0);
      setTotalSegment(0);
      setShowCountCustomerSegment(false);
      setShowSelectControlCustomerSegment(false);
    } else {
      setShowSelectControlCustomerSegment(true);
    }
  };

  const onUpdateCustomerSegment = (values) => {
    values?.forEach((value) => {
      let customerSegment = customerSegmentInSore?.find((a) => a.id === value);
      let emailSumAmountValue = totalEmail + customerSegment?.totalEmail;
      let customerSumAmountValue = totalCustomer + customerSegment?.totalCustomer;
      setTotalCustomer(customerSumAmountValue);
      setTotalEmail(emailSumAmountValue);
    });
    setTotalSegment(values?.length);
    setShowCountCustomerSegment(values?.length > 0 ? true : false);
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldsValue(),
      customerSegmentIds: values,
    });
  };

  const getEmailCampaignSocials = () => {
    let socials = [];
    let socialItem = {};
    if (currentEmailTemplateData.facebook.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Facebook,
        isActive: true,
        url: currentEmailTemplateData.facebook.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.instagram.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Instagram,
        isActive: true,
        url: currentEmailTemplateData.instagram.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.tiktok.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Tiktok,
        isActive: true,
        url: currentEmailTemplateData.tiktok.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.twitter.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Twiter,
        isActive: true,
        url: currentEmailTemplateData.twitter.url,
      };
      socials.push(socialItem);
    }
    if (currentEmailTemplateData.youtube.isActive) {
      socialItem = {
        enumEmailCampaignSocialId: EmailCampaignSocial.Youtube,
        isActive: true,
        url: currentEmailTemplateData.youtube.url,
      };
      socials.push(socialItem);
    }

    return socials;
  };

  const getEmailCampaignDetails = () => {
    let emailCampaignDetails = [];
    let mainProductInformation = {
      title: currentEmailTemplateData.mainProductTitle,
      description: currentEmailTemplateData.mainProductDescription,
      imageUrl: currentEmailTemplateData.mainProductImage,
      buttonUrl: currentEmailTemplateData.mainProductUrl,
      position: 1,
      isMain: true,
      buttonName: currentEmailTemplateData.mainProductButton,
    };
    emailCampaignDetails.push(mainProductInformation);

    let firstSubProductInformation = {
      title: currentEmailTemplateData.firstSubProductTitle,
      description: currentEmailTemplateData.firstSubProductDescription,
      imageUrl: currentEmailTemplateData.firstSubProductImage,
      buttonUrl: currentEmailTemplateData.firstSubProductUrl,
      position: 2,
      buttonName: currentEmailTemplateData.firstSubProductButton,
    };
    emailCampaignDetails.push(firstSubProductInformation);

    let secondSubProductInformation = {
      title: currentEmailTemplateData.secondSubProductTitle,
      description: currentEmailTemplateData.secondSubProductDescription,
      imageUrl: currentEmailTemplateData.secondSubProductImage,
      buttonUrl: currentEmailTemplateData.secondSubProductUrl,
      position: 3,
      buttonName: currentEmailTemplateData.secondSubProductButton,
    };
    emailCampaignDetails.push(secondSubProductInformation);

    return emailCampaignDetails;
  };

  const handleOkSendingTimeDialog = () => {
    setIsVisibleSendingTimeDialog(false);
  };

  const renderContentSendingTimeDialog = () => {
    return <div dangerouslySetInnerHTML={{ __html: `${messageContentSendingTimeDialog}` }}></div>;
  };

  const onChangeSendingTime = (values) => {
    let dateTimeValue = moment(values);
    formGeneralTab.setFieldsValue({
      ...formGeneralTab.getFieldValue(),
      sendingTime: dateTimeValue,
    });
    setSendingTimeDefault(dateTimeValue);
  };

  const onOkSendingTime = (values) => {
    // TODO: Handle save email campaign template
  };

  const onChangeFormGeneralTab = (values) => {
    setFormGeneralTabValue({
      ...formGeneralTab.getFieldsValue(),
    });
  };

  const showWarningDialog = () => {
    document.getElementById("create-email-campaign-tabs-tab-general")?.click();
    setTimeout(() => {
      document.getElementById("btn-create-email-campaign")?.click();
    }, 100);
    setTitleDialog(translateData.generalTab.titleDialogSendingTime);
    setMessageContentSendingTimeDialog(translateData.generalTab.tabRequiredMessage);
    setIsVisibleSendingTimeDialog(true);
  };

  return (
    <>
      <div className="create-email-campaign-template">
        <FnbPageHeader
          title={translateData.createEmailCampaign}
          actionButtons={[
            {
              action: (
                <FnbAddNewButton
                  idControl="btn-create-email-campaign"
                  onClick={onClickCreateEmailCampaign}
                  text={translateData.addNew}
                />
              ),
              permission: PermissionKeys.CREATE_QR_CODE,
            },
            {
              action: <CancelButton onOk={history.goBack} />,
            },
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Tabs
              defaultActiveKey={currentTab}
              className="fnb-tabs"
              onChange={(key) => {
                setCurrentTab(key);
              }}
              id="create-email-campaign-tabs"
            >
              <TabPane id="general-tab" tab={translateData.general} key={tab.general}></TabPane>
              <TabPane id="customize-tab" tab={translateData.customize} key={tab.customize}></TabPane>
            </Tabs>

            {/* General tab */}
            {currentTab === tab.general && (
              <Form
                form={formGeneralTab}
                className="general-campaign-email-form"
                layout="vertical"
                autoComplete="off"
                onChange={onChangeFormGeneralTab}
              >
                <FnbCard title={translateData.generalTab.generalInformationTitle} className="pt-3">
                  {/* email name */}
                  <h4 className="fnb-form-label mt-32">
                    {translateData.generalTab.fieldName}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.nameRequiredMessage,
                      },
                      {
                        type: "string",
                        max: 100,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={100}
                      placeholder={translateData.generalTab.namePlaceholder}
                    />
                  </Form.Item>

                  <h4 className="fnb-form-label">{translateData.generalTab.campaignDescription}</h4>
                  <Form.Item name="description">
                    <TextArea
                      showCount
                      className="fnb-text-area-with-count no-resize email-campaign-description-box"
                      placeholder={translateData.generalTab.campaignDescriptionPlaceholder}
                      maxLength={1000}
                    />
                  </Form.Item>

                  <h4 className="fnb-form-label">
                    {translateData.generalTab.sendingTime}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="sendingTime"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.sendToRequiredMessage,
                      },
                    ]}
                  >
                    <FnbDateTimePickerComponent
                      placeholder={translateData.generalTab.sendingTimePlaceholder}
                      onChangeDateTime={onChangeSendingTime}
                      onOk={onOkSendingTime}
                      defaultDateTimeValue={sendingTimeDefault}
                    />
                  </Form.Item>
                </FnbCard>

                {/* Card email information */}
                <FnbCard title={translateData.generalTab.emailInformationTitle} className="pt-3 margin-top-24">
                  {/* email subject */}
                  <h4 className="fnb-form-label mt-32">
                    {translateData.generalTab.subject}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name="emailSubject"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.subjectRequiredMessage,
                      },
                      {
                        type: "string",
                        max: 255,
                      },
                    ]}
                  >
                    <Input
                      className="fnb-input-with-count"
                      showCount
                      maxLength={255}
                      placeholder={translateData.generalTab.subjectPlaceholder}
                    />
                  </Form.Item>

                  {/* option send to of email */}
                  <h4 className="fnb-form-label">{translateData.generalTab.sendTo}</h4>
                  <Form.Item
                    name="emailCampaignType"
                    rules={[
                      {
                        required: true,
                        message: translateData.generalTab.emailCa,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      placeholder={translateData.generalTab.sendToPlaceholder}
                      option={emailCampaignType?.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      showSearch
                      onChange={onChangeEmailCampaignType}
                    />
                  </Form.Item>

                  {showSelectControlCustomerSegment ? (
                    <>
                      {/* Customer segment */}
                      <h4 className="fnb-form-label">
                        {translateData.generalTab.customerGroup}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        className="select-control"
                        name={"customerSegmentIds"}
                        rules={[
                          {
                            required: showSelectControlCustomerSegment,
                            message: translateData.generalTab.customerGroupRequiredMessage,
                          },
                        ]}
                      >
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          mode="multiple"
                          onChange={onUpdateCustomerSegment}
                          className={`fnb-select-multiple-customer-segment dont-show-item`}
                          dropdownClassName="fnb-select-multiple-dropdown"
                          suffixIcon={<ArrowDown />}
                          menuItemSelectedIcon={<CheckboxCheckedIcon />}
                          placeholder={translateData.generalTab.customerGroupPlaceholder}
                          optionFilterProp="children"
                          showArrow
                          showSearch={true}
                          allowClear={true}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          id="fnb-select-multiple-customer-segment"
                        >
                          {customerSegmentInSore?.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                        {showCountCustomerSegment && (
                          <div
                            className="selected-customer-segment"
                            dangerouslySetInnerHTML={{
                              __html: `${t("marketing.emailCampaign.generalTab.customerSegmentSelected", {
                                totalSegment: totalSegment,
                                totalCustomer: totalCustomer,
                                totalEmail: totalEmail,
                              })}`,
                            }}
                          ></div>
                        )}
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      {/* Email address of customer */}
                      <h4 className="fnb-form-label">
                        {translateData.generalTab.emailAddress}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name="emailAddress"
                        rules={[
                          {
                            required: !showSelectControlCustomerSegment && true,
                            message: translateData.generalTab.emailAddressRequiredMessage,
                          },
                          {
                            type: "email",
                            message: translateData.generalTab.invalidEmailAddress,
                          },
                        ]}
                      >
                        <Input className="fnb-input" placeholder={translateData.generalTab.emailAddressPlaceholder} />
                      </Form.Item>
                    </>
                  )}
                </FnbCard>
              </Form>
            )}

            {currentTab === tab.customize && (
              <Form form={form} className="customize-email-template">
                <Row gutter={[24, 24]} className="mt-2">
                  <Col span={24}>{renderGeneralSetting()}</Col>
                  <Col span={24}>{renderHeader()}</Col>
                  <Col span={24}>
                    {
                      <ContentEmailCampaign
                        currentEmailTemplateData={currentEmailTemplateData}
                        onChange={(data) => updateTemplate(data)}
                        defaultData={templateObjective}
                        mainArticleRef={mainArticleRef}
                        firstArticleRef={firstArticleRef}
                        secondArticleRef={secondArticleRef}
                      />
                    }
                  </Col>
                  <Col span={24}>{renderFooter()}</Col>
                </Row>
              </Form>
            )}
          </Col>

          <Col span={12}>
            <EmailCampaignTemplate onClickSession={onClickSession} ref={emailTemplateRef} />
          </Col>
        </Row>
      </div>

      <FnbModal
        width={"500px"}
        title={titleDialog}
        visible={isVisibleSendingTimeDialog}
        okText={translateData.generalTab.btnIGotIt}
        onOk={handleOkSendingTimeDialog}
        content={renderContentSendingTimeDialog()}
        className="sending-time-dialog"
        cancelButtonProps={{ style: { display: "none" } }}
        centered={true}
      />
    </>
  );
}
