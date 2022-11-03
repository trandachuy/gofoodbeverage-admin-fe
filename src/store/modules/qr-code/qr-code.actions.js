export const actionType = {
  SET_QR_CODE_DATA: "SET_QR_CODE_DATA",
};

export function setQrCodeData(qrCodeData) {
  return { type: actionType.SET_QR_CODE_DATA, payload: qrCodeData };
}
