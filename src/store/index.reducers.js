import { combineReducers } from "redux";
import processingReducer from "./modules/processing/processing.reducers";
import qrCodeReducer from "./modules/qr-code/qr-code.reducer";
import sessionReducer from "./modules/session/session.reducers";

const rootReducer = combineReducers({
  session: sessionReducer,
  processing: processingReducer,
  qrCode: qrCodeReducer,
});

export default rootReducer;
