import { actionType } from "./qr-code.actions";

const initialState = {};

const qrCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_QR_CODE_DATA:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default qrCodeReducer;
