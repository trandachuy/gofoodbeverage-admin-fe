import { DownloadToStorageDriveIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import "./fnb-qr-code.component.scss";

export function FnbQrCode({ showDownloadButton, value, size, fileName }) {
  const [t] = useTranslation();

  const downloadQrCodeImage = (e) => {
    const file = `${fileName ?? "download"}.png`;
    const svg = document.querySelector("#qrCode");
    const canvas = document.createElement("canvas");
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const svgWidth = parseInt(svg.getAttribute("width"));
    const svgHeight = parseInt(svg.getAttribute("height"));
    const image = document.createElement("img");
    image.src = "data:image/svg+xml;base64," + base64doc;
    image.onload = function () {
      canvas.setAttribute("width", svgWidth);
      canvas.setAttribute("height", svgHeight);
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, svgWidth, svgHeight);
      context.drawImage(image, 0, 0, svgWidth, svgHeight);
      const dataURL = canvas.toDataURL("image/png");
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), file);
        e.preventDefault();
      } else {
        const a = document.createElement("a");
        const event = new MouseEvent("click");
        a.download = file;
        a.href = dataURL;
        a.dispatchEvent(event);
      }
    };
  };

  return (
    <div className="fnb-qr-code">
      <div className="qr-code-wrapper">
        <QRCode id="qrCode" className="qr-code" value={value} size={size} />
      </div>
      {showDownloadButton && (
        <div className="w-100 d-flex mt-4">
          <button onClick={(e) => downloadQrCodeImage(e)} type="button" className="m-auto btn-download-qr-code">
            <DownloadToStorageDriveIcon className="m-auto" />
            <div className="download-text">{t("downloadImage")}</div>
          </button>
        </div>
      )}
    </div>
  );
}
