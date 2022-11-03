import React, { useEffect } from "react";
import { StampType } from "constants/stamp-type.constants";
import { BarcodeType } from "constants/barcode-type.constants";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

export default function BarcodeConfigComponent(props) {
  const { barcodeType, stampType, showName, showPrice, showCode, nameValue, priceValue, codeValue } = props;

  useEffect(() => {}, [barcodeType, stampType, showName, showPrice, showCode]);

  const templateStamp = (
    fontSizeBarcode,
    widthBarcode,
    heightBarcode,
    sizeQR
  ) => {
    return (
      <>
        {showName === true ? (
          <tr className="text-center">
            <td>
              <strong>{nameValue}</strong>
            </td>
          </tr>
        ) : (
          <></>
        )}
        {showCode === true ? (
          <tr className="text-center">
            {barcodeType === BarcodeType.barcode ? (
              <td>
                <Barcode
                  value={codeValue}
                  width={widthBarcode}
                  height={heightBarcode}
                  fontSize={fontSizeBarcode}
                />
              </td>
            ) : (
              <td>
                <QRCode value={codeValue} size={sizeQR} />
              </td>
            )}
          </tr>
        ) : (
          <></>
        )}
        {showPrice === true ? (
          <tr className="text-center">
            <td>
              <strong>{priceValue}</strong>
            </td>
          </tr>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      {stampType === StampType.mm40x25 ? (
        <table className="template-stamp mm40x25">
          {templateStamp(12, 1, 13, 50)}
        </table>
      ) : stampType === StampType.mm50x30 ? (
        <table className="template-stamp mm50x30">
          {templateStamp(14, 1.3, 30, 60)}
        </table>
      ) : (
        <table className="template-stamp mm50x40">
          {templateStamp(14, 1.3, 40, 90)}
        </table>
      )}
    </>
  );
}
