import { COLOR } from "constants/default.constants";
import { emailCampaignDefaultTemplate } from "email-campaign-templates/email-campaign-default.template";
import React, { useEffect } from "react";
import { getElement, getElements, getTemplateEdited } from "utils/email-campaign.helpers";

const { forwardRef, useImperativeHandle } = React;
export const EmailCampaignTemplate = forwardRef(({ onClickSession }, ref) => {
  useImperativeHandle(ref, () => ({
    setTemplate(data) {
      setTemplateValue(data);
    },
    getTemplate() {
      const template = getTemplateEdited("#template");
      return template;
    },
  }));

  // data mockup
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
    firstSubProductUrl: "/images/default-email-template/first-sub-product.jpg",
    secondSubProductImage: "/images/default-email-template/second-sub-product.jpg",
    secondSubProductTitle: "Euismod purus sem ullamcorper nunc neque.",
    secondSubProductDescription: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis vitae hac nibh non. </p>`,
    secondSubProductButton: "EXPLORE NOW",
    secondSubProductUrl: "/images/default-email-template/second-sub-product.jpg",
    footerContent: `
      <p>Copyright 2010-2022 StoreName, all rights reserved.</p>
      <p>60A Trường Sơn, Phường 2, Quận Tân Bình, Hồ Chí Minh, Việt Nam</p>
      <p>(+84) 989 38 74 94 | youremail@gmail.com</p>
      <p>Privacy Policy | Unsubscribe</p>
      <p>
        Bạn nhận được tin này vì bạn đã đăng ký hoặc chấp nhận lời mời của chúng tôi để nhận email từ SHEIN hoặc
        bạn đã mua hàng từ ﻿S﻿H﻿E﻿I﻿N﻿.﻿c﻿o﻿m﻿.﻿
      </p>
    `,
  };

  useEffect(() => {
    initTemplateEvents();
    setTemplateValue(templateObjective);
  }, []);

  const setTemplateValue = (values) => {
    const {
      primaryColor,
      secondaryColor,
      emailTitle,
      logo,
      mainProductImage,
      mainProductTitle,
      mainProductDescription,
      mainProductButton,
      mainProductUrl,
      firstSubProductImage,
      firstSubProductTitle,
      firstSubProductDescription,
      firstSubProductButton,
      firstSubProductUrl,
      secondSubProductImage,
      secondSubProductTitle,
      secondSubProductDescription,
      secondSubProductButton,
      secondSubProductUrl,
      facebook,
      instagram,
      tiktok,
      twitter,
      youtube,
      footerContent,
    } = values;

    onChangeTemplateContent(emailCampaignDefaultTemplate.primaryColor, primaryColor);
    onChangeTemplateContent(emailCampaignDefaultTemplate.secondaryColor, secondaryColor);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.title, emailTitle);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.logo, logo);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.mainProductImage, mainProductImage);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.mainProductTitle, mainProductTitle);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.mainProductDescription, mainProductDescription);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.mainProductButton, mainProductButton);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.mainProductUrl, mainProductUrl);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.firstSubProductImage, firstSubProductImage);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.firstSubProductTitle, firstSubProductTitle);
    onChangeTemplateContent(
      emailCampaignDefaultTemplate.session.firstSubProductDescription,
      firstSubProductDescription
    );
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.firstSubProductButton, firstSubProductButton);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.firstSubProductUrl, firstSubProductUrl);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.secondSubProductImage, secondSubProductImage);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.secondSubProductTitle, secondSubProductTitle);
    onChangeTemplateContent(
      emailCampaignDefaultTemplate.session.secondSubProductDescription,
      secondSubProductDescription
    );
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.secondSubProductButton, secondSubProductButton);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.secondSubProductUrl, secondSubProductUrl);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.facebook, facebook);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.instagram, instagram);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.tiktok, tiktok);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.twitter, twitter);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.youtube, youtube);
    onChangeTemplateContent(emailCampaignDefaultTemplate.session.footerContent, footerContent);
  };

  const initTemplateEvents = () => {
    onAddSelectBorder();
  };

  const onAddSelectBorder = () => {
    const sessions = [
      emailCampaignDefaultTemplate.border.title,
      emailCampaignDefaultTemplate.border.logo,
      emailCampaignDefaultTemplate.border.mainProduct,
      emailCampaignDefaultTemplate.border.firstSubProduct,
      emailCampaignDefaultTemplate.border.secondSubProduct,
      emailCampaignDefaultTemplate.border.footer,
    ];

    // onclick event for sessions
    sessions.forEach((sessionId) => {
      const element = getElement(sessionId);
      if (element) {
        element.style.cursor = "pointer";
        element.onclick = function () {
          sessions.forEach((e) => {
            const resetElement = getElement(e);
            if (resetElement) {
              resetElement.style.border = "4px solid transparent";
            }
          });
          element.style.border = "4px solid #50429B";
          if (onClickSession) {
            onClickSession(sessionId);
          }
        };
      }
    });
  };

  const onChangeTemplateContent = (target, value) => {
    let element = null;
    switch (target) {
      case emailCampaignDefaultTemplate.session.title:
        const emailTitle = getElement(target);
        emailTitle.textContent = value === "" ? "Email title" : value;
        break;

      case emailCampaignDefaultTemplate.primaryColor:
        const primaryElements = getElements(target);
        if (primaryElements && primaryElements?.length > 0) {
          primaryElements.forEach((element) => {
            element.style.background = value;
          });
        }

        const svgPaths = getElements(".svg-path");
        if (svgPaths && svgPaths?.length > 0) {
          svgPaths.forEach((element) => {
            element.style.fill = value;
          });
        }

        break;
      case emailCampaignDefaultTemplate.secondaryColor:
        const secondaryElements = getElements(target);
        if (secondaryElements && secondaryElements?.length > 0) {
          secondaryElements.forEach((element) => {
            element.style.background = value;
          });
        }
        break;

      case emailCampaignDefaultTemplate.session.logo:
      case emailCampaignDefaultTemplate.session.mainProductImage:
      case emailCampaignDefaultTemplate.session.firstSubProductImage:
      case emailCampaignDefaultTemplate.session.secondSubProductImage:
        element = getElement(target);
        element.src = value;
        break;

      case emailCampaignDefaultTemplate.session.mainProductTitle:
      case emailCampaignDefaultTemplate.session.firstSubProductTitle:
      case emailCampaignDefaultTemplate.session.secondSubProductTitle:
      case emailCampaignDefaultTemplate.session.mainProductButton:
      case emailCampaignDefaultTemplate.session.firstSubProductButton:
      case emailCampaignDefaultTemplate.session.secondSubProductButton:
        element = getElement(target);
        element.textContent = value;
        break;

      case emailCampaignDefaultTemplate.session.mainProductDescription:
      case emailCampaignDefaultTemplate.session.firstSubProductDescription:
      case emailCampaignDefaultTemplate.session.secondSubProductDescription:
      case emailCampaignDefaultTemplate.session.footerContent:
        element = getElement(target);
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        element.innerHTML = value;
        break;

      case emailCampaignDefaultTemplate.session.mainProductUrl:
      case emailCampaignDefaultTemplate.session.firstSubProductUrl:
      case emailCampaignDefaultTemplate.session.secondSubProductUrl:
        element = getElement(target);
        element.href = value;
        break;
      case emailCampaignDefaultTemplate.session.facebook:
      case emailCampaignDefaultTemplate.session.instagram:
      case emailCampaignDefaultTemplate.session.tiktok:
      case emailCampaignDefaultTemplate.session.twitter:
      case emailCampaignDefaultTemplate.session.youtube:
        element = getElement(target);
        element.style.display = value?.isActive ? "initial" : "none";
        if (value?.isDisable) {
          element.setAttribute("disabled", "");
          element.removeAttribute("href");
          element.removeAttribute("target");
        } else {
          element.removeAttribute("disabled");
          element.target = "_blank";
          element.href = value?.url;
        }
        break;
      default:
        break;
    }
  };

  return <div id="template" dangerouslySetInnerHTML={{ __html: emailCampaignDefaultTemplate.template }}></div>;
});
