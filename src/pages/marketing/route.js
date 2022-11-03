import { MarketingMenuIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import i18n from "utils/i18n";
import CreateEmailCampaignPage from "./email-campaign/create-email-campaign/create-email-campaign.page";
import { EmailCampaign } from "./email-campaign/email-campaign.page";
import CloneQrCodePage from "./qr-code/clone-qr-code/clone-qr-code.page";
import CreateQrCodePage from "./qr-code/create-qr-code/create-qr-code.page";
import QrCodeDetailPage from "./qr-code/detail-qr-code/detail-qr-code.page";
import EditQrCodePage from "./qr-code/edit-qr-code/edit-qr-code.page";
import { QRCode } from "./qr-code/qr-code.page";
const { t } = i18n;

const route = {
  key: "app.marketing",
  position: 6,
  path: "#",
  icon: <MarketingMenuIcon />,
  name: t("menu.marketing"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.marketing.qrcode",
      position: 6,
      path: "/marketing/qrcode",
      name: t("menu.marketingManagement.qrCode"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_QR_CODE,
      component: QRCode,
      child: [],
    },
    {
      key: "app.marketing.create-qrcode",
      position: 6,
      path: "/qrcode/create-new",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_QR_CODE,
      component: CreateQrCodePage,
      child: [],
    },
    {
      key: "app.marketing.qrcode.detail",
      position: 3,
      path: "/marketing/qrcode/detail/:qrCodeId",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_QR_CODE,
      component: QrCodeDetailPage,
      child: [],
    },
    {
      key: "app.marketing.clone-qrcode",
      position: 6,
      path: "/qrcode/clone",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_QR_CODE,
      component: CloneQrCodePage,
      child: [],
    },
    {
      key: "app.marketing.edit-qrcode",
      position: 6,
      path: "/qrcode/edit/:id",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_QR_CODE,
      component: EditQrCodePage,
      child: [],
    },
    {
      key: "app.marketing.emailCampaign",
      position: 6,
      path: "/marketing/email-campaign",
      name: t("menu.marketingManagement.emailCampaign"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_EMAIL_CAMPAIGN,
      component: EmailCampaign,
      child: [],
    },
    {
      key: "app.marketing.email-campaign.new",
      position: 6,
      path: "/email-campaign/create-new",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_EMAIL_CAMPAIGN,
      component: CreateEmailCampaignPage,
      child: [],
    },
  ],
};

export default route;
