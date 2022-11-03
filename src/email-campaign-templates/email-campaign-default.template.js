export const emailCampaignDefaultTemplate = {
  primaryColor: ".primary-color",
  secondaryColor: ".secondary-color",
  border: {
    title: "#title",
    logo: "#sLogo",
    mainProduct: "#sMainProduct",
    firstSubProduct: "#sFirstSubProduct",
    secondSubProduct: "#sSecondSubProduct",
    footer: "#footer",
  },
  session: {
    header: "#header",
    logo: "#logo",
    title: "#title",
    body: "#body",
    imageMain: "#imageMain",
    mainProductImage: "#mainProductImage",
    mainProductTitle: "#mainProductTitle",
    mainProductDescription: "#mainProductDescription",
    mainProductButton: "#mainProductButton",
    mainProductUrl: "#mainProductUrl",
    firstSubProductImage: "#firstSubProductImage",
    firstSubProductTitle: "#firstSubProductTitle",
    firstSubProductDescription: "#firstSubProductDescription",
    firstSubProductButton: "#firstSubProductButton",
    firstSubProductUrl: "#firstSubProductUrl",
    secondSubProductImage: "#secondSubProductImage",
    secondSubProductTitle: "#secondSubProductTitle",
    secondSubProductDescription: "#secondSubProductDescription",
    secondSubProductButton: "#secondSubProductButton",
    secondSubProductUrl: "#secondSubProductUrl",
    footer: "#footer",
    facebook: "#facebook",
    instagram: "#instagram",
    tiktok: "#tiktok",
    twitter: "#twitter",
    youtube: "#youtube",
    footerContent: "#footerContent",
  },
  template: `
    <div style="font-family: arial">
  <table class="secondary-color" id="header" style="width: 700px; height: 200px; display: flex" align="center">
    <tbody style="width: 100%; display: inline-table">
      <tr id="sLogo" style="height: 120px;">
        <td>
          <img
            id="logo"
            src="https://aeobxc.stripocdn.email/content/guids/CABINET_0978cfcb224e3f32c01b08a2bfdad002/images/frame_8770.png"
            style="display: block; margin: auto; border-radius: 12px;"
            width="248"
            height="56"
          />
        </td>
      </tr>
      <tr style="height: 80px;">
        <td>
          <div
            style="
              font-style: normal;
              font-weight: 700;
              font-size: 32px;
              text-align: center;
              color: #50429B;
            "
          >
           <div id="title" 
            style="
            padding-top: 10px;
            padding-bottom: 10px;
            " 
            > Email Title</div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <table id="body" style="background-color: #FFFFFF; width: 700px; display: flex" align="center">
    <tbody style="width: 100%; display: inline-table">
      <tr id="sMainProduct">
        <td>
            <div style="padding-top: 20px">
                <img
                    id="mainProductImage"
                    src="https://aeobxc.stripocdn.email/content/guids/CABINET_0978cfcb224e3f32c01b08a2bfdad002/images/frame_8771.png"
                    style="display: block; margin: auto"
                    width="600"
                    height="320"
                />
            </div>
          <div style="padding-left: 50px; padding-right: 50px">
            <h2
              id="mainProductTitle"
              style="
                padding: 0;
                margin: 0;
                margin-top: 15px;
                font-style: normal;
                font-weight: 700;
                font-size: 24px;
                line-height: 21px;
                letter-spacing: 0.3px;
                color: #282828;
              "
            >
              Euismod purus sem ullamcorper nunc neque.
            </h2>
            <div
              id="mainProductDescription"
              style="
                margin: 0;
                padding-top: 10px;
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                letter-spacing: 0.3px;
                color: #282828;
              "
            >
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum convallis
              vitae hac nibh non. Senectus nullam quam viverra sit. Quis porta a.
              </p>
            </div>
          </div>

          <div style="padding-top: 20px; padding-bottom: 10px;">
          <div
            class="primary-color"
            style="background: #50429b; border-radius: 16px; width: 233px; height: 60px; display: flex; margin: auto; "
          >
            <a
              id="mainProductUrl"
              href=""
              target="_blank"
              style="
                margin: auto;
                color: #ffffff;
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 21px;
                letter-spacing: 0.3px;
                text-decoration: none;
              "
              ><span id="mainProductButton">BOOK NOW</span></a
            >
          </div>
        </div>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px; padding-bottom: 10px; padding-left: 30px; padding-right: 30px; display: flex">
        <div id="sFirstSubProduct" style="
        border: 4px solid transparent;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px; 
        padding-right: 10px;
        margin: auto; 
        "
        >
            <div  style="
            width: 288px;
            ">
            <div>
            <img
                id="firstSubProductImage"
                src="https://aeobxc.stripocdn.email/content/guids/CABINET_a4de511e085fc699b9cccdbe805f5474/images/71321558707152161.jpeg"
                alt
                style="display: block; border: 0; outline: none; text-decoration: none"
                width="288"
                height="288"
            />
            </div>
            <div style="padding-bottom: 5px; padding-top: 10px">
            <h2
                id="firstSubProductTitle"
                class="name"
                style="
                margin: 0;
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 21px;
                letter-spacing: 0.3px;
                color: #282828;
                "
            >
                Cafe Culture in Kabul Shows How Afghanistan Is Transforming
            </h2>
            </div>
            <div style="padding-top: 5px; padding-right: 5px; padding-bottom: 20px">
            <div
                id="firstSubProductDescription"
                style="
                margin: 0;
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 21px;
                letter-spacing: 0.3px;
                color: #282828;
                "
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum
                convallis vitae hac nibh non.
            </div>
            </div>

            <a
            id="firstSubProductUrl"
            target="_blank"
            style="margin: auto; text-decoration: none; display: inline-block"
            href="https://viewstripo.email/"
            >
            <div
                class="primary-color"
                style="
                margin: 0;
                color: #333333;
                font-size: 16px;
                height: 48px;
                width: 177px;
                background: #50429b;
                border-radius: 16px;
                color: #ffffff;
                display: flex;
                "
            >
                <span
                  id="firstSubProductButton"
                  style="
                    font-style: normal;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 21px;
                    align-items: center;
                    letter-spacing: 0.3px;
                    color: #ffffff;
                    margin: auto;
                "
                >EXPLORE NOW</span
                >
            </div>
            </a>
        </div>
        </div>
        <div id="sSecondSubProduct" style="
        border: 4px solid transparent;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        margin: auto; 
        "
        >
          <div style="width: 288px;">
            <div>
              <img
                  id="secondSubProductImage"
                  src="https://aeobxc.stripocdn.email/content/guids/CABINET_a4de511e085fc699b9cccdbe805f5474/images/71321558707152161.jpeg"
                  alt
                  style="display: block; border: 0; outline: none; text-decoration: none"
                  width="288"
                  height="288"
              />
            </div>
            <div style="padding-bottom: 5px; padding-top: 10px">
              <h2
                id="secondSubProductTitle"
                class="name"
                style="
                  margin: 0;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  color: #282828;
                "
              >
                Cafe Culture in Kabul Shows How Afghanistan Is Transforming
              </h2>
            </div>
            <div style="padding-top: 5px; padding-right: 5px; padding-bottom: 20px">
              <div
                id="secondSubProductDescription"
                style="
                  margin: 0;
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 21px;
                  letter-spacing: 0.3px;
                  color: #282828;
                "
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor consectetur turpis fermentum
                convallis vitae hac nibh non.
              </div>
            </div>

            <div>
              <a
                id="secondSubProductUrl"
                target="_blank"
                style="margin: auto; text-decoration: none; display: inline-block"
                href="https://viewstripo.email/"
              >
                <div
                  class="primary-color"
                  style="
                    margin: 0;
                    color: #333333;
                    font-size: 16px;
                    height: 48px;
                    width: 177px;
                    background: #50429b;
                    border-radius: 16px;
                    color: #ffffff;
                    display: flex;
                  "
                >
                  <span
                    id="secondSubProductButton"
                    style="
                      font-style: normal;
                      font-weight: 400;
                      font-size: 16px;
                      line-height: 21px;
                      align-items: center;
                      letter-spacing: 0.3px;
                      color: #ffffff;
                      margin: auto;
                    "
                    >EXPLORE NOW</span
                  >
                </div>
              </a>
            </div>
          </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <table id="footer" style="width: 700px; background: #EBE8FE" align="center">
    <tbody style="width: 100%">
      <tr style="display: flex; margin-top: 25px; margin-bottom: 20px; margin-left: 50px; margin-right: 50px">
        <td style="display: flex; justify-content: center; align-items: center; gap: 24px; margin: auto">
          <a id="facebook">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="svg-path"
                d="M23.9746 0H8C3.60635 0 0 3.60635 0 8.0254V24C0 28.3937 3.60635 32 8 32H23.9746C28.3937 32 32 28.3937 32 23.9746V8.0254C32 3.60635 28.3937 0 23.9746 0ZM20.2921 16H17.2698V25.9048H13.4603V16H11.4286V11.9365H13.2064V10.2095C13.2064 8.58413 14.019 6.01905 17.4476 6.01905H20.5714V9.39683H18.3619C18.0064 9.39683 17.5238 9.6254 17.5238 10.4127V11.9365H20.6476L20.2921 16Z"
                fill="#50429B"
              />
            </svg>
          </a>
          <a id="instagram">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2316_184423)">
                <path class="svg-path"
                  d="M18.8125 16C18.8125 17.5532 17.5532 18.8125 16 18.8125C14.4468 18.8125 13.1875 17.5532 13.1875 16C13.1875 14.4468 14.4468 13.1875 16 13.1875C17.5532 13.1875 18.8125 14.4468 18.8125 16Z"
                  fill="#50429B"
                />
                <path class="svg-path"
                  d="M20.75 7.5H11.25C9.18213 7.5 7.5 9.18213 7.5 11.25V20.75C7.5 22.8179 9.18213 24.5 11.25 24.5H20.75C22.8179 24.5 24.5 22.8179 24.5 20.75V11.25C24.5 9.18213 22.8179 7.5 20.75 7.5ZM16 20.6875C13.4153 20.6875 11.3125 18.5847 11.3125 16C11.3125 13.4153 13.4153 11.3125 16 11.3125C18.5847 11.3125 20.6875 13.4153 20.6875 16C20.6875 18.5847 18.5847 20.6875 16 20.6875ZM21.375 11.5625C20.8572 11.5625 20.4375 11.1428 20.4375 10.625C20.4375 10.1072 20.8572 9.6875 21.375 9.6875C21.8928 9.6875 22.3125 10.1072 22.3125 10.625C22.3125 11.1428 21.8928 11.5625 21.375 11.5625Z"
                  fill="#50429B"
                />
                <path class="svg-path"
                  d="M23.5625 0H8.4375C3.78516 0 0 3.78516 0 8.4375V23.5625C0 28.2148 3.78516 32 8.4375 32H23.5625C28.2148 32 32 28.2148 32 23.5625V8.4375C32 3.78516 28.2148 0 23.5625 0ZM26.375 20.75C26.375 23.8516 23.8516 26.375 20.75 26.375H11.25C8.14844 26.375 5.625 23.8516 5.625 20.75V11.25C5.625 8.14844 8.14844 5.625 11.25 5.625H20.75C23.8516 5.625 26.375 8.14844 26.375 11.25V20.75Z"
                  fill="#50429B"
                />
              </g>
              <defs>
                <clipPath id="clip0_2316_184423">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a id="tiktok">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2316_184427)">
                <path class="svg-path"
                  d="M26.2764 31.4545C19.4473 32.1831 12.56 32.1831 5.73091 31.4545C4.40476 31.3145 3.16668 30.7241 2.22308 29.7818C1.27947 28.8396 0.687362 27.6023 0.545458 26.2764C-0.183121 19.4473 -0.183121 12.56 0.545458 5.73091C0.685501 4.40476 1.27588 3.16668 2.21816 2.22308C3.16044 1.27947 4.39769 0.687362 5.72364 0.545458C12.5527 -0.183121 19.44 -0.183121 26.2691 0.545458C27.5952 0.685501 28.8333 1.27588 29.7769 2.21816C30.7205 3.16044 31.3126 4.39769 31.4545 5.72364C32.1831 12.5527 32.1831 19.44 31.4545 26.2691C31.3145 27.5952 30.7241 28.8333 29.7818 29.7769C28.8396 30.7205 27.6023 31.3126 26.2764 31.4545Z"
                  fill="#50429B"
                />
                <path
                  d="M13.5874 26C11.8948 26 10.2716 25.3276 9.07476 24.1308C7.87793 22.934 7.20557 21.3107 7.20557 19.6182C7.20557 17.9256 7.87793 16.3024 9.07476 15.1056C10.2716 13.9087 11.8948 13.2364 13.5874 13.2364H15.1456V16.3509H13.5874C12.9401 16.3509 12.3074 16.5429 11.7692 16.9025C11.231 17.2621 10.8115 17.7732 10.5638 18.3712C10.3161 18.9692 10.2513 19.6273 10.3775 20.2621C10.5038 20.897 10.8155 21.4801 11.2732 21.9378C11.7309 22.3955 12.3141 22.7072 12.9489 22.8335C13.5838 22.9598 14.2418 22.8949 14.8398 22.6472C15.4378 22.3995 15.9489 21.9801 16.3086 21.4419C16.6682 20.9037 16.8601 20.2709 16.8601 19.6236V6H19.9747V7.55636C19.9747 8.42435 20.3195 9.25678 20.9332 9.87053C21.547 10.4843 22.3794 10.8291 23.2474 10.8291H24.8056V13.9382H23.2365C22.083 13.9398 20.9511 13.6254 19.9637 13.0291V19.6182C19.9623 21.3094 19.2902 22.9309 18.0949 24.1273C16.8996 25.3236 15.2786 25.9971 13.5874 26Z"
                  fill="#EBE8FE"
                />
              </g>
              <defs>
                <clipPath id="clip0_2316_184427">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a id="twitter">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2759_235130)">
              <path class="svg-path" d="M26.6667 10.0417C25.8889 10.3889 25.0486 10.625 24.1458 10.75C25.0903 10.1944 25.7361 9.38194 26.0833 8.3125C25.1806 8.84028 24.25 9.19444 23.2917 9.375C22.4444 8.45833 21.3819 8 20.1042 8C18.8958 8 17.8646 8.42708 17.0104 9.28125C16.1562 10.1354 15.7292 11.1667 15.7292 12.375C15.7292 12.7778 15.7639 13.1111 15.8333 13.375C14.0417 13.2778 12.3611 12.8264 10.7917 12.0208C9.22222 11.2153 7.88889 10.1389 6.79167 8.79167C6.38889 9.48611 6.1875 10.2222 6.1875 11C6.1875 12.5833 6.81944 13.7986 8.08333 14.6458C7.43056 14.6319 6.73611 14.4514 6 14.1042V14.1458C6 15.1875 6.34722 16.1146 7.04167 16.9271C7.73611 17.7396 8.59028 18.2431 9.60417 18.4375C9.20139 18.5486 8.84722 18.6042 8.54167 18.6042C8.36111 18.6042 8.09028 18.5764 7.72917 18.5208C8.02083 19.3958 8.53819 20.1181 9.28125 20.6875C10.0243 21.2569 10.8681 21.5486 11.8125 21.5625C10.2014 22.8125 8.38889 23.4375 6.375 23.4375C6.01389 23.4375 5.66667 23.4167 5.33333 23.375C7.38889 24.6806 9.625 25.3333 12.0417 25.3333C13.5972 25.3333 15.0556 25.0868 16.4167 24.5938C17.7778 24.1007 18.9444 23.441 19.9167 22.6146C20.8889 21.7882 21.7257 20.8368 22.4271 19.7604C23.1285 18.684 23.6493 17.559 23.9896 16.3854C24.3299 15.2118 24.5 14.0417 24.5 12.875C24.5 12.625 24.4931 12.4375 24.4792 12.3125C25.3542 11.6875 26.0833 10.9306 26.6667 10.0417ZM32 6V26C32 27.6528 31.4132 29.066 30.2396 30.2396C29.066 31.4132 27.6528 32 26 32H6C4.34722 32 2.93403 31.4132 1.76042 30.2396C0.586806 29.066 0 27.6528 0 26V6C0 4.34722 0.586806 2.93403 1.76042 1.76042C2.93403 0.586806 4.34722 0 6 0H26C27.6528 0 29.066 0.586806 30.2396 1.76042C31.4132 2.93403 32 4.34722 32 6Z" fill="#50429B"/>
            </g>
            <defs>
              <clipPath id="clip0_2759_235130">
                <rect width="32" height="32" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          </a>
          <a id="youtube">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2759_235137)">
                <path class="svg-path" d="M13.3429 12.15L20.1429 16.0143L13.3429 19.8786V12.15ZM32 3.42857V28.5714C32 30.4643 30.4643 32 28.5714 32H3.42857C1.53571 32 0 30.4643 0 28.5714V3.42857C0 1.53571 1.53571 0 3.42857 0H28.5714C30.4643 0 32 1.53571 32 3.42857ZM29 16.0214C29 16.0214 29 11.7643 28.4571 9.72143C28.1571 8.59286 27.2786 7.70714 26.1571 7.40714C24.1357 6.85714 16 6.85714 16 6.85714C16 6.85714 7.86429 6.85714 5.84286 7.40714C4.72143 7.70714 3.84286 8.59286 3.54286 9.72143C3 11.7571 3 16.0214 3 16.0214C3 16.0214 3 20.2786 3.54286 22.3214C3.84286 23.45 4.72143 24.3 5.84286 24.6C7.86429 25.1429 16 25.1429 16 25.1429C16 25.1429 24.1357 25.1429 26.1571 24.5929C27.2786 24.2929 28.1571 23.4429 28.4571 22.3143C29 20.2786 29 16.0214 29 16.0214Z" fill="#50429B"/>
              </g>
              <defs>
                <clipPath id="clip0_2759_235137">
                  <rect width="32" height="32" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </a>
        </td>
      </tr>
      <tr>
        <td style="display: flex">
            <div style="height: 1px; width: 600px; margin: auto; background:#CDC6FF"></div>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 20px; color: #282828">
          <div id="footerContent" style="width: 90%; margin: auto; text-align: center">
            <p>Copyright 2010-2022 StoreName, all rights reserved.</p>
            <p>60A Trường Sơn, Phường 2, Quận Tân Bình, Hồ Chí Minh, Việt Nam</p>
            <p>(+84) 989 38 74 94 | youremail@gmail.com</p>
            <p>Privacy Policy | Unsubscribe</p>
            <p>
              Bạn nhận được tin này vì bạn đã đăng ký hoặc chấp nhận lời mời của chúng tôi để nhận email từ SHEIN hoặc
              bạn đã mua hàng từ ﻿S﻿H﻿E﻿I﻿N﻿.﻿c﻿o﻿m﻿.﻿
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 25px"></td>
      </tr>
    </tbody>
  </table>
</div>
    `,
};
